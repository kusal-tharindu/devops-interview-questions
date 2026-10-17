#!/usr/bin/env node
/**
 * Content pipeline. Parses every *.cards.yaml under docs/, validates it, and
 * emits the data the site consumes at runtime.
 *
 * Output shape (static/cards/):
 *
 *   index.json          Manifest: topics, pages, counts. No card bodies.
 *   <topic>.json        Every card for one topic.
 *
 * Why split by topic rather than one big file: pages grow without bound (a
 * topic can have dozens), but topics stay in the low tens. Splitting on the
 * bounded axis means a Docker page fetches only Docker cards, and the payload
 * never grows with unrelated content. The manifest lets the UI render topic
 * pickers and counts without downloading any cards at all.
 *
 * Exits non-zero on any validation error so CI fails loudly.
 *
 * Usage: node scripts/build-content.js [--quiet]
 */

const fs = require('fs');
const path = require('path');

const config = require('../site.config');
const yaml = require('./lib/yaml-lite');
const {
  REPO_ROOT,
  findCardFiles,
  identifyCardFile,
  topicLabel,
  compareTopics,
} = require('./lib/content-paths');
const {
  validateCard,
  findDuplicateIds,
  collectWarnings,
} = require('./lib/card-validator');
const { generateQaPages } = require('./lib/qa-pages');
const { findTopicPages } = require('./topics');

const OUT_DIR = path.join(REPO_ROOT, config.paths.cardsOutDir);
const STATS_FILE = path.join(REPO_ROOT, config.paths.statsFile);
const PREVIEW_FILE = path.join(REPO_ROOT, config.paths.previewFile);
const QUIET = process.argv.includes('--quiet');

/**
 * Read and validate every card deck.
 *
 * @returns {{cards: object[], issues: import('./lib/card-validator').ValidationIssue[]}}
 */
function loadAllCards() {
  const cards = [];
  const issues = [];

  for (const filePath of findCardFiles()) {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) continue;

    const identity = identifyCardFile(filePath);

    let parsed;
    try {
      parsed = yaml.parseList(raw);
    } catch (err) {
      issues.push({
        file: identity.sourcePath,
        cardId: '(file)',
        message: `YAML parse error: ${err.message}`,
      });
      continue;
    }

    for (const item of parsed) {
      issues.push(...validateCard(item, identity.sourcePath));

      cards.push({
        ...item,
        topic: identity.topic,
        page: identity.page,
        pageUrl: identity.pageUrl,
        // Kept out of the published payload; used for error messages only.
        sourcePath: identity.sourcePath,
      });
    }
  }

  issues.push(...findDuplicateIds(cards));
  return { cards, issues };
}

/**
 * Strip build-only fields before publishing.
 *
 * @param {object} card
 * @returns {object}
 */
function toPublicCard(card) {
  const { sourcePath, ...publicFields } = card;
  return publicFields;
}

/**
 * Group cards by topic, preserving configured topic order.
 *
 * @param {object[]} cards
 * @returns {Map<string, object[]>}
 */
function groupByTopic(cards) {
  const grouped = new Map();
  for (const card of cards) {
    if (!grouped.has(card.topic)) grouped.set(card.topic, []);
    grouped.get(card.topic).push(card);
  }

  return new Map(
    [...grouped.entries()].sort(([a], [b]) => compareTopics(a, b))
  );
}

/**
 * Build the manifest describing what exists, without card bodies.
 *
 * @param {Map<string, object[]>} byTopic
 * @returns {object}
 */
function buildManifest(byTopic) {
  const tierIds = config.cards.tiers.map((t) => t.id);

  const topics = [...byTopic.entries()].map(([topic, cards]) => {
    const pages = new Map();
    for (const card of cards) {
      if (!pages.has(card.page)) {
        pages.set(card.page, { page: card.page, url: card.pageUrl, cardCount: 0 });
      }
      pages.get(card.page).cardCount += 1;
    }

    const tierCounts = {};
    for (const tier of tierIds) {
      const count = cards.filter((c) => c.tier === tier).length;
      if (count > 0) tierCounts[tier] = count;
    }

    return {
      topic,
      label: topicLabel(topic),
      cardCount: cards.length,
      tierCounts,
      pages: [...pages.values()].sort((a, b) => a.page.localeCompare(b.page)),
      /** Relative to paths.cardsPublicDir. */
      dataFile: `${topic}.json`,
    };
  });

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    totalTopics: topics.length,
    totalCards: topics.reduce((sum, t) => sum + t.cardCount, 0),
    topics,
  };
}

/**
 * Read a topic's _category_.json. Missing or malformed files are not fatal:
 * the landing page falls back to a plain description.
 *
 * @param {string} topic
 * @returns {object|null}
 */
function readCategoryMeta(topic) {
  const file = path.join(REPO_ROOT, config.paths.docsDir, topic, '_category_.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Short, human topic description for the homepage library.
 *
 * Category descriptions are written for the generated index pages and start
 * with a boilerplate phrase. Strip it so the landing page can use the same
 * copy without an awkward prefix.
 *
 * @param {string} topic
 * @returns {string}
 */
function readTopicDescription(topic) {
  const meta = readCategoryMeta(topic);
  const raw = meta?.link?.description || meta?.description || '';
  const summary = raw
    .replace(/^Interview questions and answers covering\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!summary) return '';
  return summary.charAt(0).toUpperCase() + summary.slice(1);
}

/**
 * Read the front matter values the UI needs from a theory page.
 *
 * `title` is the page heading and document title. `sidebar_label` is optional
 * and keeps a short rail label when the heading is more descriptive (e.g.
 * "Docker Architecture" in the page, "Architecture" in the rail). Both are
 * plain YAML strings in this project's docs.
 *
 * @param {string} topic
 * @param {string} page Page path within the topic, e.g. "networking/drivers".
 * @returns {{title: string|null, sidebarLabel: string|null, readingMinutes: number|null}}
 */
function readDocMeta(topic, page) {
  const file = path.join(REPO_ROOT, config.paths.docsDir, topic, `${page}.md`);
  if (!fs.existsSync(file)) {
    return { title: null, sidebarLabel: null, readingMinutes: null };
  }

  const raw = fs.readFileSync(file, 'utf8');
  const head = raw.slice(0, 1200);
  const readValue = (key) => {
    const match = head.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!match) return null;
    return match[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  };

  // Rough prose reading time. Code and diagrams count as words; the number is
  // a reading aid, not a promise, so 220 wpm is close enough.
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 220));

  return {
    title: readValue('title'),
    sidebarLabel: readValue('sidebar_label'),
    readingMinutes,
  };
}

/**
 * Short rail label for a theory page. Falls back to the page title.
 *
 * @param {string} topic
 * @param {string} page
 * @returns {string|null}
 */
function readDocLabel(topic, page) {
  const meta = readDocMeta(topic, page);
  return meta.sidebarLabel || meta.title;
}

/**
 * Best-effort human title when a page has no front matter title.
 *
 * @param {string} page
 * @returns {string}
 */
function titleFromSlug(page) {
  const last = page.split('/').pop() || page;
  return last.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Homepage stats. Kept as its own file so the landing page can render counts
 * without a network request.
 *
 * @param {object} manifest
 */
function writeStats(manifest) {
  const stats = {
    totalTopics: manifest.totalTopics,
    totalQuestions: manifest.totalCards,
    generatedAt: manifest.generatedAt,
    topics: manifest.topics.map((t) => {
      // The docs sidebar is the canonical reading order, so the landing page
      // lists pages in the same order the sidebar does (Dockerfile before
      // Architecture, for example) instead of alphabetically.
      const docOrder = new Map(
        findTopicPages(t.topic).map((page, index) => [page.docId, index])
      );
      const orderedPages = [...t.pages].sort((a, b) => {
        const aIndex =
          docOrder.get(`${t.topic}/${a.page}`) ?? Number.MAX_SAFE_INTEGER;
        const bIndex =
          docOrder.get(`${t.topic}/${b.page}`) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex || a.page.localeCompare(b.page);
      });
      const pages = orderedPages.map((page) => {
        const meta = readDocMeta(t.topic, page.page);
        const title = meta.title || titleFromSlug(page.page);
        return {
          slug: page.page,
          title,
          sidebarLabel: meta.sidebarLabel || title,
          readingMinutes: meta.readingMinutes,
          url: page.url,
          questionCount: page.cardCount,
        };
      });

      return {
        slug: t.topic,
        label: t.label,
        description: readTopicDescription(t.topic),
        questionCount: t.cardCount,
        pageCount: t.pages.length,
        tierCounts: t.tierCounts,
        // Deep-link to the topic's first page in sidebar order.
        firstDocId: pages[0] ? pages[0].url.replace(/^\//, '') : t.topic,
        pages,
      };
    }),
  };

  fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
  fs.writeFileSync(STATS_FILE, `${JSON.stringify(stats, null, 2)}\n`);
}

/**
 * A small, curated slice of real cards for the interactive hero preview.
 *
 * Landing-page copy has a nasty habit of drifting from the content it
 * advertises. Generating this file from the validated cards keeps the preview
 * honest: if a question is edited, the homepage follows.
 *
 * @param {object[]} cards
 */
function writeHomePreview(cards) {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const selected = [];
  const missing = [];

  for (const id of config.home.previewCardIds) {
    const card = byId.get(id);
    if (card && !card.deprecated) selected.push(card);
    else missing.push(id);
  }

  if (missing.length > 0 && !QUIET) {
    console.warn(
      `⚠ Homepage preview: card id(s) not found — ${missing.join(', ')}`
    );
  }

  // Never leave the landing page without a preview just because a card was
  // renamed. Fall back to the first few cards, and say so.
  if (selected.length === 0) {
    selected.push(...cards.filter((card) => !card.deprecated).slice(0, 5));
    if (!QUIET) {
      console.warn('⚠ Homepage preview: using the first cards as a fallback');
    }
  }
  if (selected.length === 0) return;

  const preview = {
    generatedAt: new Date().toISOString(),
    cards: selected.map((card) => ({
      id: card.id,
      topic: card.topic,
      label: topicLabel(card.topic),
      pageTitle:
        readDocLabel(card.topic, card.page) || titleFromSlug(card.page),
      tier: card.tier,
      type: card.type,
      q: card.q,
      a: card.a,
      why: card.why || '',
      verified: card.verified || '',
      pageUrl: card.pageUrl,
      ref: card.ref || '',
    })),
  };

  fs.mkdirSync(path.dirname(PREVIEW_FILE), { recursive: true });
  fs.writeFileSync(PREVIEW_FILE, `${JSON.stringify(preview, null, 2)}\n`);
}

/** Remove stale per-topic files so a renamed/deleted topic cannot linger. */
function resetOutputDir() {
  if (fs.existsSync(OUT_DIR)) {
    for (const file of fs.readdirSync(OUT_DIR)) {
      if (file.endsWith('.json')) fs.unlinkSync(path.join(OUT_DIR, file));
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

/**
 * @param {import('./lib/card-validator').ValidationIssue[]} issues
 */
function reportIssuesAndExit(issues) {
  console.error('\n✖ Card validation failed\n');

  const byFile = new Map();
  for (const issue of issues) {
    if (!byFile.has(issue.file)) byFile.set(issue.file, []);
    byFile.get(issue.file).push(issue);
  }

  for (const [file, fileIssues] of byFile) {
    console.error(`  ${file}`);
    for (const issue of fileIssues) {
      console.error(`    [${issue.cardId}] ${issue.message}`);
    }
    console.error('');
  }

  console.error(
    `${issues.length} error(s). See CONTRIBUTING.md for the card schema.\n`
  );
  process.exit(1);
}

function main() {
  const { cards, issues } = loadAllCards();

  if (issues.length > 0) reportIssuesAndExit(issues);

  const byTopic = groupByTopic(cards);
  const manifest = buildManifest(byTopic);

  resetOutputDir();

  fs.writeFileSync(
    path.join(OUT_DIR, config.paths.manifestFile),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  for (const [topic, topicCards] of byTopic) {
    fs.writeFileSync(
      path.join(OUT_DIR, `${topic}.json`),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          topic,
          label: topicLabel(topic),
          cards: topicCards.map(toPublicCard),
        },
        null,
        2
      )}\n`
    );
  }

  writeStats(manifest);
  writeHomePreview(cards);

  const qaPagesWritten = generateQaPages(byTopic);

  const warnings = collectWarnings(cards);
  if (warnings.length > 0 && !QUIET) {
    console.warn('\n⚠ Content warnings (not blocking):');
    for (const line of warnings) console.warn(`  ${line}`);
    console.warn('');
  }

  if (!QUIET) {
    const pageCount = manifest.topics.reduce((n, t) => n + t.pages.length, 0);
    console.log(
      `✓ ${manifest.totalCards} cards · ${manifest.totalTopics} topics · ` +
        `${pageCount} pages → ${config.paths.cardsOutDir}/`
    );
    console.log(`✓ ${qaPagesWritten} Q&A pages generated`);
  }
}

main();
