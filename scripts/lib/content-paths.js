/**
 * Filesystem discovery and path/identity derivation for content.
 *
 * The identity rules live here and nowhere else:
 *
 *   docs/docker/images.cards.yaml            -> topic "docker", page "images"
 *   docs/docker/networking/dns.cards.yaml    -> topic "docker", page "networking/dns"
 *
 * Topic is always the FIRST folder under docs/, so grouping pages into
 * subfolders never fragments a topic. Page is the remaining path without the
 * card-file suffix, which matches the Docusaurus doc id for the sibling .md —
 * that correspondence is what lets <TopicQA /> resolve its own cards with no
 * props.
 */

const fs = require('fs');
const path = require('path');
const config = require('../../site.config');

const REPO_ROOT = path.join(__dirname, '..', '..');
const DOCS_DIR = path.join(REPO_ROOT, config.paths.docsDir);

/** Folders and files starting with these are private to the repo. */
const IGNORED_PREFIXES = ['_', '.'];

/**
 * @param {string} name
 * @returns {boolean}
 */
function isIgnored(name) {
  return IGNORED_PREFIXES.some((prefix) => name.startsWith(prefix));
}

/**
 * Recursively collect every card deck under docs/.
 *
 * @param {string} [dir] Directory to walk. Defaults to the docs root.
 * @returns {string[]} Absolute file paths.
 */
function findCardFiles(dir = DOCS_DIR) {
  if (!fs.existsSync(dir)) return [];

  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (isIgnored(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCardFiles(fullPath));
    } else if (entry.name.endsWith(config.cards.fileSuffix)) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

/**
 * First-level folders under docs/ — the canonical topic list.
 *
 * @returns {string[]} Topic slugs, alphabetical.
 */
function findTopicDirs() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !isIgnored(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Derive content identity from a card deck's location.
 *
 * @param {string} cardFilePath Absolute path to a *.cards.yaml file.
 * @returns {{topic: string, page: string, pageUrl: string, sourcePath: string}}
 */
function identifyCardFile(cardFilePath) {
  const relative = path.relative(DOCS_DIR, cardFilePath);
  const segments = relative.split(path.sep);

  const topic = segments[0];
  const withoutSuffix = relative.slice(0, -config.cards.fileSuffix.length);

  // POSIX separators: this becomes a URL and a Docusaurus doc id.
  const docId = withoutSuffix.split(path.sep).join('/');
  const page = docId.slice(topic.length + 1);

  return {
    topic,
    page,
    // routeBasePath is '/', so the doc id is the route.
    pageUrl: `/${docId}`,
    sourcePath: path.relative(REPO_ROOT, cardFilePath),
  };
}

/**
 * Human-readable topic label. Falls back to a title-cased slug so an
 * unregistered topic still renders sensibly.
 *
 * @param {string} topic
 * @returns {string}
 */
function topicLabel(topic) {
  return (
    config.topics.labels[topic] ||
    topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')
  );
}

/**
 * Sort position for a topic. Unregistered topics sort after registered ones.
 *
 * @param {string} topic
 * @returns {number}
 */
function topicPosition(topic) {
  const idx = config.topics.order.indexOf(topic);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/**
 * Compare topics by configured order, then alphabetically.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareTopics(a, b) {
  const diff = topicPosition(a) - topicPosition(b);
  return diff !== 0 ? diff : a.localeCompare(b);
}

module.exports = {
  REPO_ROOT,
  DOCS_DIR,
  findCardFiles,
  findTopicDirs,
  identifyCardFile,
  topicLabel,
  topicPosition,
  compareTopics,
};
