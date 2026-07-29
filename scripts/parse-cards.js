#!/usr/bin/env node
/**
 * Parses card blocks from docs/**\/*.md files and outputs static/cards.json.
 *
 * Card blocks are delimited by <!-- cards:start --> and <!-- cards:end -->
 * comments in Markdown files. Inside those delimiters, cards are written
 * in YAML list format.
 *
 * This script also validates:
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
const OPTIONAL_FIELDS = ['why', 'version', 'sources', 'deprecated'];
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

const VALID_TIERS = ['core', 'deep', 'trivia'];
const VALID_TYPES = ['recall', 'concept', 'elaborative', 'scenario', 'cloze', 'command'];

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+){2,}$/;

// --- Parsing ---

function findMarkdownFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractCardBlocks(content) {
  const blocks = [];
  const startTag = '<!-- cards:start -->';
  const endTag = '<!-- cards:end -->';

  let searchFrom = 0;
  while (true) {
    const startIdx = content.indexOf(startTag, searchFrom);
    if (startIdx === -1) break;

    const endIdx = content.indexOf(endTag, startIdx);
    if (endIdx === -1) break;

    const blockContent = content.slice(startIdx + startTag.length, endIdx).trim();
    // Find the line number of the start tag
    const lineNumber = content.slice(0, startIdx).split('\n').length;
    blocks.push({ content: blockContent, startLine: lineNumber });
    searchFrom = endIdx + endTag.length;
  }

  return blocks;
}

function parseCards(yamlContent, filePath, startLine) {
  const cards = [];
  const errors = [];

  let parsed;
  try {
    parsed = yaml.parseList(yamlContent);
  } catch (err) {
    errors.push({
      file: filePath,
      line: startLine,
      message: `YAML parse error: ${err.message}`,
    });
    return { cards, errors };
  }

  for (const item of parsed) {
    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in item)) {
        errors.push({
          file: filePath,
          line: startLine,
          message: `Card "${item.id || '(no id)'}" missing required field: ${field}`,
        });
      }
    }

    // Validate no unknown fields
    for (const key of Object.keys(item)) {
      if (!ALL_FIELDS.includes(key)) {
        errors.push({
          file: filePath,
          line: startLine,
          message: `Card "${item.id || '(no id)'}" has unknown field: ${key}`,
        });
      }
    }

    if (!item.id) continue;

    // Validate ID format
    if (!ID_PATTERN.test(item.id)) {
      errors.push({
        file: filePath,
        line: startLine,
        message: `Card "${item.id}" has invalid ID format. Expected: {topic}-{subtopic}-{slug} (lowercase, hyphens, 3+ segments)`,
      });
    }

    // Validate tier
    if (item.tier && !VALID_TIERS.includes(item.tier)) {
      errors.push({
        file: filePath,
        line: startLine,
        message: `Card "${item.id}" has invalid tier: "${item.tier}". Valid: ${VALID_TIERS.join(', ')}`,
      });
    }

    // Validate type
    if (item.type && !VALID_TYPES.includes(item.type)) {
      errors.push({
        file: filePath,
        line: startLine,
        message: `Card "${item.id}" has invalid type: "${item.type}". Valid: ${VALID_TYPES.join(', ')}`,
      });
    }

    // Validate tags is an array
    if (item.tags && !Array.isArray(item.tags)) {
      errors.push({
        file: filePath,
        line: startLine,
        message: `Card "${item.id}" tags must be an array`,
      });
    }

    // Validate verified date format
    if (item.verified && !/^\d{4}-\d{2}-\d{2}$/.test(item.verified)) {
      errors.push({
        file: filePath,
        line: startLine,
        message: `Card "${item.id}" verified must be YYYY-MM-DD format`,
      });
    }

    cards.push({
      ...item,
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

  const mdFiles = findMarkdownFiles(DOCS_DIR);
  const allCards = [];
  const allErrors = [];

  for (const filePath of mdFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const blocks = extractCardBlocks(content);

    for (const block of blocks) {
      const { cards, errors } = parseCards(block.content, filePath, block.startLine);
      allCards.push(...cards);
      allErrors.push(...errors);
    }
  }

  // Check for duplicate IDs
  const idMap = new Map();
  for (const card of allCards) {
    if (idMap.has(card.id)) {
      const existing = idMap.get(card.id);
      allErrors.push({
        file: card._source,
        line: 0,
        message: `Duplicate card ID "${card.id}" found in:\n   - ${existing._source}\n   - ${card._source}`,
      });
    } else {
      idMap.set(card.id, card);
    }
  }

  // Report errors
  if (allErrors.length > 0) {
    console.error('\n❌ Card validation failed:\n');
    for (const err of allErrors) {
      const location = err.line ? `${err.file}:${err.line}` : err.file;
      console.error(`  ${location}`);
      console.error(`    ${err.message}\n`);
    }
    console.error(`${allErrors.length} error(s) found. Build aborted.`);
    process.exit(1);
  }

  // Strip internal _source field for output
  const outputCards = allCards.map(({ _source, ...card }) => card);

  // Write output
  const output = {
    cards: outputCards,
    totalCards: outputCards.length,
    topics: [...new Set(outputCards.flatMap((c) => c.tags))].sort(),
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');

  console.log(`✓ Parsed ${outputCards.length} cards from ${mdFiles.length} files → ${OUTPUT_FILE}`);
}

main();
