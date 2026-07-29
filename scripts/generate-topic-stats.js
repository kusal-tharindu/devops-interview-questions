#!/usr/bin/env node
/**
 * Scans docs/<topic>/ folders and generates src/data/topics.json with
 * per-topic metadata (label, description, question count) plus a total
 * question count for the homepage.
 *
 * This runs at build/dev time only (Node, not browser) and only reads
 * files inside this repo - no network access, no external input.
 *
 * Run manually: node scripts/generate-topic-stats.js
 * Runs automatically via the "prestart"/"prebuild" npm scripts.
 */

const fs = require('fs');
const path = require('path');
const { getTopicsForNavbar } = require('./topics');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'topics.json');

function isTopicDir(name) {
  return !name.startsWith('_') && !name.startsWith('.');
}

function readCategoryMeta(topicPath) {
  const categoryFile = path.join(topicPath, '_category_.json');
  if (!fs.existsSync(categoryFile)) return null;
  try {
    const raw = fs.readFileSync(categoryFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Warning: could not parse ${categoryFile}: ${err.message}`);
    return null;
  }
}

function countQuestionsInTopic(topicPath) {
  let count = 0;
  const entries = fs.readdirSync(topicPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.cards.yaml')) {
      const content = fs.readFileSync(path.join(topicPath, entry.name), 'utf8');
      // Count top-level list items (lines starting with "- id:")
      const matches = content.match(/^- id:/gm);
      count += matches ? matches.length : 0;
    }
  }
  return count;
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    throw new Error(`docs/ directory not found at ${DOCS_DIR}`);
  }

  const topicDirs = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isTopicDir(entry.name));

  // firstDocId per topic, kept consistent with the navbar dropdown links
  // (scripts/topics.js is the single source of truth for that mapping).
  const navTopics = getTopicsForNavbar();
  const firstDocIdBySlug = Object.fromEntries(
    navTopics.map((t) => [t.slug, t.firstDocId])
  );

  const topics = [];

  for (const dir of topicDirs) {
    const topicPath = path.join(DOCS_DIR, dir.name);
    const meta = readCategoryMeta(topicPath);
    const questionCount = countQuestionsInTopic(topicPath);

    topics.push({
      slug: dir.name,
      label: meta?.label ?? dir.name,
      description: meta?.link?.description ?? '',
      position: meta?.position ?? 999,
      questionCount,
      firstDocId: firstDocIdBySlug[dir.name] ?? dir.name,
    });
  }

  topics.sort((a, b) => a.position - b.position);

  const totalQuestions = topics.reduce((sum, t) => sum + t.questionCount, 0);

  const output = {
    topics,
    totalTopics: topics.length,
    totalQuestions,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');

  console.log(
    `Generated ${OUTPUT_FILE}: ${topics.length} topics, ${totalQuestions} questions.`
  );
}

main();
