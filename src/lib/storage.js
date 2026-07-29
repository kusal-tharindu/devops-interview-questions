/**
 * Review progress persistence.
 *
 * Progress lives in the learner's own browser. No accounts, no server, no
 * analytics on study behaviour. That is a deliberate product choice, and it is
 * also what keeps the site deployable as pure static files.
 *
 * The tradeoff is real: clearing site data loses the schedule. Export/import
 * exists so it is recoverable, and the UI nags for a backup after a while.
 *
 * All reads are defensive — a corrupt or foreign value must never throw into
 * the render path.
 */

import config from '@site/site.config';

const { storageKey, backupNagAfterDays } = config.srs;
const SCHEMA_VERSION = 1;

/**
 * SSR-safe storage handle.
 *
 * Docusaurus prerenders pages in Node, where localStorage does not exist.
 * Private-mode Safari also throws on access rather than returning null.
 *
 * @returns {Storage|null}
 */
function getStorage() {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Read the full persisted payload.
 *
 * @returns {{version: number, cards: Record<string, object>, firstUsedAt: string|null, updatedAt: string|null}}
 */
function readPayload() {
  const empty = { version: SCHEMA_VERSION, cards: {}, firstUsedAt: null, updatedAt: null };

  const storage = getStorage();
  if (!storage) return empty;

  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return empty;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.cards !== 'object') {
      return empty;
    }
    return { ...empty, ...parsed };
  } catch {
    // Corrupt payload: start clean rather than breaking the page.
    return empty;
  }
}

/**
 * All card states, keyed by card id.
 *
 * @returns {Record<string, object>}
 */
export function loadProgress() {
  return readPayload().cards;
}

/**
 * Persist card states.
 *
 * @param {Record<string, object>} cards Map of card id to state.
 * @returns {boolean} False when persistence was unavailable (quota, private mode).
 */
export function saveProgress(cards) {
  const storage = getStorage();
  if (!storage) return false;

  const existing = readPayload();
  const now = new Date().toISOString();

  try {
    storage.setItem(
      storageKey,
      JSON.stringify({
        version: SCHEMA_VERSION,
        firstUsedAt: existing.firstUsedAt || now,
        updatedAt: now,
        cards,
      })
    );
    return true;
  } catch (error) {
    console.warn('Could not save review progress:', error?.message);
    return false;
  }
}

/**
 * Whether to prompt for a backup, based on how long this browser has been used.
 *
 * @returns {boolean}
 */
export function shouldSuggestBackup() {
  const { firstUsedAt, cards } = readPayload();
  if (!firstUsedAt || Object.keys(cards).length === 0) return false;

  const startedAt = Date.parse(firstUsedAt);
  if (!Number.isFinite(startedAt)) return false;

  const daysUsed = (Date.now() - startedAt) / 86_400_000;
  return daysUsed >= backupNagAfterDays;
}

/**
 * Download progress as a JSON file.
 *
 * @returns {boolean} False if there was nothing to export.
 */
export function exportProgress() {
  const payload = readPayload();
  if (Object.keys(payload.cards).length === 0) return false;

  const blob = new Blob(
    [
      JSON.stringify(
        { ...payload, version: SCHEMA_VERSION, exportedAt: new Date().toISOString() },
        null,
        2
      ),
    ],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `devops-recall-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
  return true;
}

/**
 * Restore progress from an exported file.
 *
 * Replaces rather than merges: a backup represents a coherent point in time,
 * and silently merging two schedules would produce states the learner cannot
 * reason about.
 *
 * @param {string} jsonString Contents of a previously exported file.
 * @returns {number} Number of card states imported.
 * @throws {Error} When the file is not a recognisable backup.
 */
export function importProgress(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('That file is not valid JSON.');
  }

  if (!parsed || typeof parsed.cards !== 'object' || parsed.cards === null) {
    throw new Error('That does not look like a DevOps Recall backup.');
  }

  saveProgress(parsed.cards);
  return Object.keys(parsed.cards).length;
}

/**
 * Delete all stored progress.
 *
 * @returns {boolean} Whether the key was removed.
 */
export function resetProgress() {
  const storage = getStorage();
  if (!storage) return false;
  storage.removeItem(storageKey);
  return true;
}
