/**
 * Card data access layer.
 *
 * The only module that knows how card data is transported. Components ask for
 * "the cards for this topic" and never see a URL, a filename, or the fact that
 * data is split per topic at all.
 *
 * That indirection is the point: changing the on-disk layout (splitting
 * further, adding compression, moving to an API) touches this file only.
 *
 * Caching is per page-load and in-memory. The browser HTTP cache handles
 * repeat visits, and card data is immutable for a given deploy.
 */

import config from '@site/site.config';

/** @type {Map<string, Promise<object>>} In-flight and resolved fetches, by key. */
const requestCache = new Map();

/** Manifest cache key; cannot collide with a topic slug because of the slash. */
const MANIFEST_KEY = '__manifest__';

/**
 * Build an absolute URL for a generated data file.
 *
 * baseUrl is prepended manually rather than via useBaseUrl() so this module
 * stays usable outside React (tests, future scripts).
 *
 * @param {string} file Filename within the cards output directory.
 * @returns {string}
 */
function dataUrl(file) {
  const base = config.site.baseUrl.replace(/\/$/, '');
  return `${base}${config.paths.cardsPublicDir}/${file}`;
}

/**
 * Fetch and cache JSON, de-duplicating concurrent requests for the same key.
 *
 * @param {string} key Cache key.
 * @param {string} file Filename to fetch.
 * @returns {Promise<object>}
 */
function fetchJson(key, file) {
  if (requestCache.has(key)) return requestCache.get(key);

  const promise = fetch(dataUrl(file))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: HTTP ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      // Don't cache failures — a transient network error should be retryable.
      requestCache.delete(key);
      throw error;
    });

  requestCache.set(key, promise);
  return promise;
}

/**
 * Load the manifest: which topics and pages exist, and how many cards each has.
 * Contains no card bodies, so it stays small as content grows.
 *
 * @returns {Promise<object>} Manifest.
 */
export function loadManifest() {
  return fetchJson(MANIFEST_KEY, config.paths.manifestFile);
}

/**
 * Load every card for one topic.
 *
 * @param {string} topic Topic slug.
 * @returns {Promise<object[]>} Cards, excluding deprecated ones.
 */
export async function loadTopicCards(topic) {
  if (!topic) return [];
  const data = await fetchJson(topic, `${topic}.json`);
  return (data.cards || []).filter((card) => !card.deprecated);
}

/**
 * Load the cards belonging to a single documentation page.
 *
 * Fetches only the page's own topic, so a Docker page never downloads
 * Kubernetes cards.
 *
 * @param {string} topic Topic slug.
 * @param {string} page Page path within the topic (e.g. "networking/bridge").
 * @returns {Promise<object[]>}
 */
export async function loadPageCards(topic, page) {
  const cards = await loadTopicCards(topic);
  return cards.filter((card) => card.page === page);
}

/**
 * Load cards for several topics at once.
 *
 * Used by mixed-topic drills. Requests run in parallel; a topic that fails to
 * load is skipped rather than failing the whole set, so one bad file cannot
 * break a drill session.
 *
 * @param {string[]} topics Topic slugs.
 * @returns {Promise<object[]>} Flattened cards.
 */
export async function loadTopicsCards(topics) {
  const results = await Promise.allSettled(topics.map(loadTopicCards));

  return results.flatMap((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    console.warn(`Skipping topic "${topics[i]}":`, result.reason?.message);
    return [];
  });
}

/**
 * Load every card across every topic.
 *
 * Reads the manifest first so it only requests topics that actually exist.
 *
 * @returns {Promise<object[]>}
 */
export async function loadAllCards() {
  const manifest = await loadManifest();
  return loadTopicsCards(manifest.topics.map((t) => t.topic));
}

/**
 * Resolve a card's "read the theory" destination.
 *
 * @param {object} card
 * @returns {string|null} Route with anchor, or null when the card has no ref.
 */
export function theoryLink(card) {
  if (!card?.pageUrl) return null;
  return card.ref ? `${card.pageUrl}${card.ref}` : card.pageUrl;
}

/** Clear the in-memory cache. Exposed for tests. */
export function clearCache() {
  requestCache.clear();
}
