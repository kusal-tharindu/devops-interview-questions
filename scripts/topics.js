/**
 * Topic discovery for navbar and sidebar generation.
 *
 * Reads the docs/ tree at build time so adding a topic folder or a page never
 * requires editing docusaurus.config.js or sidebars.js.
 *
 * Identity and ordering rules live in lib/content-paths.js — this module only
 * shapes them for Docusaurus config consumption.
 */

const fs = require('fs');
const path = require('path');

const config = require('../site.config');
const {
  DOCS_DIR,
  findTopicDirs,
  topicLabel,
  compareTopics,
} = require('./lib/content-paths');

/** Markdown files that are pages, not partials. */
function isPageFile(name) {
  return name.endsWith('.md') && !name.startsWith('_');
}

/**
 * Read a topic's _category_.json, if present.
 *
 * @param {string} topicPath
 * @returns {object|null}
 */
function readCategoryMeta(topicPath) {
  const file = path.join(topicPath, '_category_.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`Warning: could not parse ${file}: ${err.message}`);
    return null;
  }
}

/**
 * Front matter `sidebar_position`, used to pick a topic's landing page.
 *
 * @param {string} filePath
 * @returns {number} Large fallback so unpositioned pages sort last.
 */
function readSidebarPosition(filePath) {
  try {
    const head = fs.readFileSync(filePath, 'utf8').slice(0, 600);
    const match = head.match(/^sidebar_position:\s*(\d+)/m);
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

/**
 * Every page in a topic, recursively, as Docusaurus doc ids.
 *
 * @param {string} topic
 * @returns {Array<{docId: string, position: number, depth: number}>}
 */
function findTopicPages(topic) {
  const topicRoot = path.join(DOCS_DIR, topic);
  if (!fs.existsSync(topicRoot)) return [];

  const pages = [];

  const walk = (dir, depth) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith('_')) continue;
        walk(fullPath, depth + 1);
      } else if (isPageFile(entry.name)) {
        const relative = path.relative(DOCS_DIR, fullPath).replace(/\.md$/, '');
        pages.push({
          docId: relative.split(path.sep).join('/'),
          position: readSidebarPosition(fullPath),
          depth,
        });
      }
    }
  };

  walk(topicRoot, 0);

  // Shallowest first, then by declared position, then alphabetically. This makes
  // a topic's top-level intro page its landing page even once subfolders exist.
  return pages.sort(
    (a, b) =>
      a.depth - b.depth ||
      a.position - b.position ||
      a.docId.localeCompare(b.docId)
  );
}

/**
 * Topic folder names, in display order.
 *
 * @returns {string[]}
 */
function getTopicDirs() {
  return findTopicDirs().sort(compareTopics);
}

/**
 * Topic metadata for the navbar dropdown.
 *
 * @returns {Array<{slug: string, label: string, firstDocId: string, pageCount: number}>}
 */
function getTopicsForNavbar() {
  return getTopicDirs()
    .map((slug) => {
      const pages = findTopicPages(slug);
      const meta = readCategoryMeta(path.join(DOCS_DIR, slug));

      return {
        slug,
        label: meta?.label || topicLabel(slug),
        firstDocId: pages[0] ? pages[0].docId : slug,
        pageCount: pages.length,
      };
    })
    .filter((topic) => topic.pageCount > 0);
}

/**
 * Whether a topic has enough pages to be worth grouping into subfolders.
 * Surfaced so the sidebar can collapse large topics by default.
 *
 * @param {string} topic
 * @returns {boolean}
 */
function shouldCollapseTopic(topic) {
  return findTopicPages(topic).length > config.contentTargets.groupPagesAfter;
}

module.exports = {
  getTopicDirs,
  getTopicsForNavbar,
  findTopicPages,
  shouldCollapseTopic,
};
