/**
 * Minimal YAML list parser for card blocks.
 *
 * Handles the subset of YAML we need:
 * - Top-level list items (- key: value)
 * - String values (plain and quoted)
 * - Array values in flow style: [tag1, tag2]
 * - Nested list items under a parent key (sources:)
 * - Multi-line strings are NOT supported (keep answers short)
 *
 * This avoids adding a js-yaml dependency for a simple build script.
 */

function parseList(text) {
  const items = [];
  let current = null;
  let nestedKey = null;
  let nestedItem = null;

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Calculate indentation
    const indent = rawLine.match(/^(\s*)/)[1].length;

    // New top-level list item: starts at indent 0 with "- "
    if (indent === 0 && trimmed.startsWith('- ')) {
      // Flush any pending nested item
      if (nestedKey && nestedItem && current) {
        if (!current[nestedKey]) current[nestedKey] = [];
        current[nestedKey].push(nestedItem);
        nestedItem = null;
      }
      nestedKey = null;

      // Flush previous top-level item
      if (current) {
        items.push(current);
      }

      current = {};
      const kvPart = trimmed.slice(2);
      const parsed = parseKeyValue(kvPart);
      if (parsed) {
        current[parsed.key] = parsed.value;
      }
      continue;
    }

    // We must be inside a top-level item (indent > 0)
    if (!current) continue;

    // Nested list item: "    - title: Foo" (indent >= 4, starts with "- ")
    if (indent >= 4 && trimmed.startsWith('- ')) {
      // Flush previous nested item
      if (nestedKey && nestedItem) {
        if (!current[nestedKey]) current[nestedKey] = [];
        current[nestedKey].push(nestedItem);
      }
      nestedItem = {};
      const kvPart = trimmed.slice(2);
      const parsed = parseKeyValue(kvPart);
      if (parsed) {
        nestedItem[parsed.key] = parsed.value;
      }
      continue;
    }

    // Continuation of nested item: "      url: https://..."  (indent >= 6)
    if (indent >= 6 && nestedItem) {
      const parsed = parseKeyValue(trimmed);
      if (parsed) {
        nestedItem[parsed.key] = parsed.value;
      }
      continue;
    }

    // Regular field on the current item: "  key: value" (indent 2)
    if (indent >= 2 && !trimmed.startsWith('- ')) {
      // Flush nested item if we drop back to regular indent
      if (nestedKey && nestedItem && indent < 4) {
        if (!current[nestedKey]) current[nestedKey] = [];
        current[nestedKey].push(nestedItem);
        nestedItem = null;
        nestedKey = null;
      }

      // Check if this is a key with no value (signals nested list follows)
      if (trimmed.endsWith(':') && !trimmed.includes(': ')) {
        const key = trimmed.slice(0, -1);
        nestedKey = key;
        if (!current[key]) current[key] = [];
        continue;
      }

      const parsed = parseKeyValue(trimmed);
      if (parsed) {
        current[parsed.key] = parsed.value;
      }
      continue;
    }
  }

  // Flush last nested item and last top-level item
  if (nestedKey && nestedItem && current) {
    if (!current[nestedKey]) current[nestedKey] = [];
    current[nestedKey].push(nestedItem);
  }
  if (current) {
    items.push(current);
  }

  return items;
}

function parseKeyValue(str) {
  // Find the first colon that's followed by a space or is at end
  const colonIdx = str.indexOf(': ');
  const colonEndIdx = str.endsWith(':') ? str.length - 1 : -1;

  const idx = colonIdx !== -1 ? colonIdx : colonEndIdx;
  if (idx === -1) return null;

  const key = str.slice(0, idx).trim();
  let value = str.slice(idx + 1).trim();

  // Empty value (key with no value)
  if (!value) return { key, value: null };

  // Array in flow style: [item1, item2]
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1);
    const items = inner.split(',').map((s) => s.trim()).filter(Boolean);
    return { key, value: items };
  }

  // Quoted string
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
    return { key, value };
  }

  // Boolean
  if (value === 'true') return { key, value: true };
  if (value === 'false') return { key, value: false };

  // Plain string (don't convert numbers — dates like 2026-07-29 should stay strings)
  return { key, value };
}

module.exports = { parseList };
