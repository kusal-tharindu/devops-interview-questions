const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function isTopicDir(name) {
  return !name.startsWith('_') && !name.startsWith('.');
}

function readCategoryMeta(topicPath) {
  const categoryFile = path.join(topicPath, '_category_.json');
  if (!fs.existsSync(categoryFile)) return null;
  try {
    return JSON.parse(fs.readFileSync(categoryFile, 'utf8'));
  } catch (err) {
    console.warn(`Warning: could not parse ${categoryFile}: ${err.message}`);
    return null;
  }
}

/**
 * Returns topic folder names found under docs/ (excluding _templates etc.),
 * used by sidebars.js to build one sidebar per topic.
 */
function getTopicDirs() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isTopicDir(entry.name))
    .map((entry) => entry.name);
}

/**
 * Returns topic metadata (slug, label, position, firstDocId) sorted by
 * position, used by docusaurus.config.js to build the navbar dropdown.
 * firstDocId points at the first doc file in the topic (by sidebar_position
 * order, falling back to alphabetical), so the dropdown links straight to
 * content instead of an intermediate index page.
 */
function getTopicsForNavbar() {
  const topics = getTopicDirs().map((slug) => {
    const topicPath = path.join(DOCS_DIR, slug);
    const meta = readCategoryMeta(topicPath);

    const mdFiles = fs
      .readdirSync(topicPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name)
      .sort();

    const firstFile = mdFiles[0];
    const firstDocId = firstFile
      ? `${slug}/${firstFile.replace(/\.md$/, '')}`
      : slug;

    return {
      slug,
      label: meta?.label ?? slug,
      position: meta?.position ?? 999,
      firstDocId,
    };
  });

  topics.sort((a, b) => a.position - b.position);
  return topics;
}

module.exports = { getTopicDirs, getTopicsForNavbar };
