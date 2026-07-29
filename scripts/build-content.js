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

const OUT_DIR = path.join(REPO_ROOT, config.paths.cardsOutDir);
const STATS_FILE = path.join(REPO_ROOT, config.paths.statsFile);
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
    topics: manifest.topics.map((t) => ({
      slug: t.topic,
      label: t.label,
      questionCount: t.cardCount,
      pageCount: t.pages.length,
      // Deep-link to the topic's first page.
      firstDocId: t.pages[0] ? t.pages[0].url.replace(/^\//, '') : t.topic,
    })),
  };

  fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
  fs.writeFileSync(STATS_FILE, `${JSON.stringify(stats, null, 2)}\n`);
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
  }
}

main();
