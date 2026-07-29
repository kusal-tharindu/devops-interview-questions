/**
 * Minimal YAML list parser for card decks.
 *
 * Deliberately not a full YAML implementation. It supports exactly the subset
 * the card schema uses, which keeps the build dependency-free and makes the
 * failure modes obvious:
 *
 *   - Top-level list items:      `- key: value`
 *   - Continuation fields:       `  key: value`
 *   - Flow arrays:               `tags: [a, b]`
 *   - Nested object lists:       `sources:` then `  - title: x` / `    url: y`
 *   - Quoted strings, booleans
 *
 * Not supported (by design): block scalars (`|`, `>`), anchors, multi-line
 * strings, nested mappings beyond one level. Card answers should be short
 * enough that none of these are needed.
 */

const INDENT_FIELD = 2;
const INDENT_NESTED_ITEM = 4;
const INDENT_NESTED_FIELD = 6;

/**
 * Parse a YAML document containing a single top-level list of objects.
 *
 * @param {string} text Raw YAML.
 * @returns {Array<Record<string, unknown>>} One object per list item.
 */
function parseList(text) {
  const items = [];

  let current = null;
  let nestedKey = null;
  let nestedItem = null;

  const flushNested = () => {
    if (nestedKey && nestedItem && current) {
      if (!Array.isArray(current[nestedKey])) current[nestedKey] = [];
      current[nestedKey].push(nestedItem);
    }
    nestedItem = null;
  };

  for (const rawLine of text.split('\n')) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = rawLine.match(/^(\s*)/)[1].length;
    const isListItem = trimmed.startsWith('- ');

    // New top-level card
    if (indent === 0 && isListItem) {
      flushNested();
      nestedKey = null;
      if (current) items.push(current);

      current = {};
      assign(current, parseKeyValue(trimmed.slice(2)));
      continue;
    }

    if (!current) continue;

    // Nested object in a list (e.g. an entry under `sources:`)
    if (indent >= INDENT_NESTED_ITEM && isListItem) {
      flushNested();
      nestedItem = {};
      assign(nestedItem, parseKeyValue(trimmed.slice(2)));
      continue;
    }

    // Continuation field of the nested object
    if (indent >= INDENT_NESTED_FIELD && nestedItem) {
      assign(nestedItem, parseKeyValue(trimmed));
      continue;
    }

    // Field on the current card
    if (indent >= INDENT_FIELD && !isListItem) {
      if (indent < INDENT_NESTED_ITEM) {
        flushNested();
        nestedKey = null;
      }

      // `key:` with no value opens a nested list
      if (trimmed.endsWith(':') && !trimmed.includes(': ')) {
        nestedKey = trimmed.slice(0, -1);
        if (!Array.isArray(current[nestedKey])) current[nestedKey] = [];
        continue;
      }

      assign(current, parseKeyValue(trimmed));
    }
  }

  flushNested();
  if (current) items.push(current);

  return items;
}

/**
 * @param {Record<string, unknown>} target
 * @param {{key: string, value: unknown}|null} pair
 */
function assign(target, pair) {
  if (pair) target[pair.key] = pair.value;
}

/**
 * Split a `key: value` line into its parts and coerce simple scalar types.
 *
 * @param {string} str
 * @returns {{key: string, value: unknown}|null} Null when there is no colon.
 */
function parseKeyValue(str) {
  const sepIdx = str.indexOf(': ');
  const bareKeyIdx = str.endsWith(':') ? str.length - 1 : -1;
  const idx = sepIdx !== -1 ? sepIdx : bareKeyIdx;
  if (idx === -1) return null;

  const key = str.slice(0, idx).trim();
  const raw = str.slice(idx + 1).trim();

  if (!raw) return { key, value: null };

  // Flow array: [a, b, c]
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const value = raw
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return { key, value };
  }

  // Quoted string
  const isQuoted =
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"));
  if (isQuoted) return { key, value: raw.slice(1, -1) };

  if (raw === 'true') return { key, value: true };
  if (raw === 'false') return { key, value: false };

  // Everything else stays a string. Notably dates like 2026-07-29 must NOT
  // be coerced to numbers or Date objects.
  return { key, value: raw };
}

module.exports = { parseList };
