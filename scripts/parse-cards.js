#!/usr/bin/env node
/**
 * Parses *.cards.yaml files from docs/ and outputs static/cards.json.
 *
 * Cards are written in YAML list format in .cards.yaml files alongside
 * the topic Markdown. This keeps card content separate from Docusaurus
 * MDX rendering (which chokes on ${}, <>, and {} in content).
 *
 * Validates:
 * - Required fields are present
 * - IDs are globally unique
 * - IDs follow the naming convention
 * - No unknown fields
 *
 * Exit code 1 on validation failure (fails CI).
 *
 * Run manually: node scripts/parse-cards.js
 * Runs automatically via "prebuild" / "prestart" npm scripts.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('./yaml-lite');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_FILE = path.join(__dirname, '..', 'static', 'cards.json');

// --- Schema ---

const REQUIRED_FIELDS = ['id', 'tier', 'type', 'q', 'a', 'tags', 'verified'];
// `topic` is injected by the parser from the folder name, so it is allowed in
// output but authors should not set it by hand.
const OPTIONAL_FIELDS = ['why', 'version', 'sources', 'deprecated', 'topic'];
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

const VALID_TIERS = ['core', 'deep', 'trivia'];
const VALID_TYPES = ['recall', 'concept', 'elaborative', 'scenario', 'cloze', 'command'];

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+){2,}$/;

// --- File discovery ---

function findCardFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCardFiles(fullPath));
    } else if (entry.name.endsWith('.cards.yaml')) {
      results.push(fullPath);
    }
  }
  return results;
}

// --- Validation ---

function parseAndValidate(yamlContent, filePath, topic) {
  const cards = [];
  const errors = [];

  let parsed;
  try {
    parsed = yaml.parseList(yamlContent);
  } catch (err) {
    errors.push({ file: filePath, message: `YAML parse error: ${err.message}` });
    return { cards, errors };
  }

  for (const item of parsed) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in item)) {
        errors.push({
          file: filePath,
          message: `Card "${item.id || '(no id)'}" missing required field: ${field}`,
        });
      }
    }

    for (const key of Object.keys(item)) {
      if (!ALL_FIELDS.includes(key)) {
        errors.push({
          file: filePath,
          message: `Card "${item.id || '(no id)'}" has unknown field: ${key}`,
        });
      }
    }

    if (!item.id) continue;

    if (!ID_PATTERN.test(item.id)) {
      errors.push({
        file: filePath,
        message: `Card "${item.id}" has invalid ID format. Expected: {topic}-{subtopic}-{slug} (lowercase, hyphens, 3+ segments)`,
      });
    }

    if (item.tier && !VALID_TIERS.includes(item.tier)) {
      errors.push({ file: filePath, message: `Card "${item.id}" has invalid tier: "${item.tier}"` });
    }

    if (item.type && !VALID_TYPES.includes(item.type)) {
      errors.push({ file: filePath, message: `Card "${item.id}" has invalid type: "${item.type}"` });
    }

    if (item.tags && !Array.isArray(item.tags)) {
      errors.push({ file: filePath, message: `Card "${item.id}" tags must be an array` });
    }

    if (item.verified && !/^\d{4}-\d{2}-\d{2}$/.test(item.verified)) {
      errors.push({ file: filePath, message: `Card "${item.id}" verified must be YYYY-MM-DD format` });
    }

    // `topic` is derived from the containing folder, never from tags.
    // Tags are free-form and cross-cutting (a Kubernetes card may be tagged
    // `networking`), so using them for topic membership double-counts cards
    // and leaks them onto the wrong topic page.
    cards.push({
      ...item,
      topic,
      _source: path.relative(path.join(__dirname, '..'), filePath),
    });
  }

  return { cards, errors };
}

// --- Main ---

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`ERROR: docs/ directory not found at ${DOCS_DIR}`);
    process.exit(1);
  }

  const cardFiles = findCardFiles(DOCS_DIR);
  const allCards = [];
  const allErrors = [];

  for (const filePath of cardFiles) {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) continue;
    const topic = path.basename(path.dirname(filePath));
    const { cards, errors } = parseAndValidate(content, filePath, topic);
    allCards.push(...cards);
    allErrors.push(...errors);
  }

  // Duplicate ID check
  const idMap = new Map();
  for (const card of allCards) {
    if (idMap.has(card.id)) {
      const existing = idMap.get(card.id);
      allErrors.push({
        file: card._source,
        message: `Duplicate card ID "${card.id}" found in:\n   - ${existing._source}\n   - ${card._source}`,
      });
    } else {
      idMap.set(card.id, card);
    }
  }

  if (allErrors.length > 0) {
    console.error('\n❌ Card validation failed:\n');
    for (const err of allErrors) {
      console.error(`  ${err.file}`);
      console.error(`    ${err.message}\n`);
    }
    console.error(`${allErrors.length} error(s) found. Build aborted.`);
    process.exit(1);
  }

  const outputCards = allCards.map(({ _source, ...card }) => card);

  // Per-topic counts, keyed by the folder-derived topic. Sums to totalCards.
  const byTopic = {};
  for (const card of outputCards) {
    byTopic[card.topic] = (byTopic[card.topic] || 0) + 1;
  }

  const output = {
    cards: outputCards,
    totalCards: outputCards.length,
    topics: Object.keys(byTopic).sort(),
    cardsPerTopic: byTopic,
    tags: [...new Set(outputCards.flatMap((c) => c.tags))].sort(),
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');

  console.log(`✓ Parsed ${outputCards.length} cards from ${cardFiles.length} files → ${OUTPUT_FILE}`);
}

main();
