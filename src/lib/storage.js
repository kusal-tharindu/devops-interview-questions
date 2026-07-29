/**
 * localStorage persistence layer for card review state.
 *
 * All progress stays on the user's machine. No accounts, no tracking.
 * Versioned so we can migrate data format in the future.
 */

const STORAGE_KEY = 'devops-recall-v1';

/**
 * Load all card states from localStorage.
 * @returns {Object.<string, object>} Map of cardId → state
 */
export function loadProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data.cards || {};
  } catch {
    return {};
  }
}

/**
 * Save all card states to localStorage.
 * @param {Object.<string, object>} cards - Map of cardId → state
 */
export function saveProgress(cards) {
  if (typeof window === 'undefined') return;
  try {
    const data = {
      version: 1,
      updatedAt: new Date().toISOString(),
      cards,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save progress:', e.message);
  }
}

/**
 * Export progress as a downloadable JSON file.
 */
export function exportProgress() {
  const cards = loadProgress();
  const blob = new Blob(
    [JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), cards }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devops-recall-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import progress from a JSON file.
 * @param {string} jsonString - The file contents
 * @returns {number} Number of cards imported
 */
export function importProgress(jsonString) {
  const data = JSON.parse(jsonString);
  if (!data.cards) throw new Error('Invalid backup file: missing cards');
  saveProgress(data.cards);
  return Object.keys(data.cards).length;
}

/**
 * Get stats about current progress.
 */
export function getStats() {
  const cards = loadProgress();
  const entries = Object.values(cards);
  const today = new Date().toISOString().slice(0, 10);

  return {
    totalReviewed: entries.length,
    dueToday: entries.filter((c) => c.due <= today).length,
    mature: entries.filter((c) => c.interval >= 21).length,
    learning: entries.filter((c) => c.interval < 21).length,
  };
}
