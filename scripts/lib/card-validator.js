/**
 * Card schema validation.
 *
 * Every rule is driven by site.config.js, so adding a tier or card type never
 * requires touching this file. Validation is intentionally strict and fails the
 * build: a malformed card that reaches production is worse than a red CI run,
 * because a wrong answer actively teaches the wrong thing.
 */

const config = require('../../site.config');

const TIER_IDS = config.cards.tiers.map((t) => t.id);
const TYPE_IDS = config.cards.types.map((t) => t.id);
const ALL_AUTHORED_FIELDS = [
  ...config.cards.requiredFields,
  ...config.cards.optionalFields,
];

/**
 * @typedef {object} ValidationIssue
 * @property {string} file  Repo-relative source path.
 * @property {string} cardId Card id, or a placeholder when absent.
 * @property {string} message Human-readable problem description.
 */

/**
 * Validate a single card.
 *
 * @param {Record<string, unknown>} card Parsed card object.
 * @param {string} sourcePath Repo-relative path, used in error messages.
 * @returns {ValidationIssue[]} Empty when the card is valid.
 */
function validateCard(card, sourcePath) {
  const issues = [];
  const cardId = typeof card.id === 'string' ? card.id : '(no id)';
  const fail = (message) => issues.push({ file: sourcePath, cardId, message });

  for (const field of config.cards.requiredFields) {
    if (!(field in card) || card[field] === null || card[field] === '') {
      fail(`missing required field: ${field}`);
    }
  }

  for (const key of Object.keys(card)) {
    if (!ALL_AUTHORED_FIELDS.includes(key)) {
      if (config.cards.derivedFields.includes(key)) {
        fail(`"${key}" is derived by the build — remove it from the source file`);
      } else {
        fail(`unknown field: ${key}`);
      }
    }
  }

  if (typeof card.id === 'string' && !config.cards.idPattern.test(card.id)) {
    fail(`invalid id format. Expected ${config.cards.idPatternHint}`);
  }

  if (card.tier && !TIER_IDS.includes(card.tier)) {
    fail(`invalid tier "${card.tier}". Valid: ${TIER_IDS.join(', ')}`);
  }

  if (card.type && !TYPE_IDS.includes(card.type)) {
    fail(`invalid type "${card.type}". Valid: ${TYPE_IDS.join(', ')}`);
  }

  if (card.tags && !Array.isArray(card.tags)) {
    fail('tags must be an array, e.g. [docker, images]');
  }

  if (card.verified && !config.cards.datePattern.test(String(card.verified))) {
    fail('verified must be an ISO date (YYYY-MM-DD)');
  }

  if (card.sources && !Array.isArray(card.sources)) {
    fail('sources must be a list of { title, url } entries');
  } else if (Array.isArray(card.sources)) {
    card.sources.forEach((source, i) => {
      if (!source || !source.title || !source.url) {
        fail(`sources[${i}] needs both a title and a url`);
      }
    });
  }

  if (card.ref !== undefined && typeof card.ref !== 'string') {
    fail('ref must be a string anchor, e.g. "#image-layers"');
  } else if (typeof card.ref === 'string' && !card.ref.startsWith('#')) {
    fail(`ref must start with "#" (got "${card.ref}")`);
  }

  return issues;
}

/**
 * Find ids used by more than one card.
 *
 * Ids are the primary key for a learner's saved review schedule, so a
 * collision silently merges two cards' progress. Always a hard error.
 *
 * @param {Array<{id: string, sourcePath: string}>} cards
 * @returns {ValidationIssue[]}
 */
function findDuplicateIds(cards) {
  const seen = new Map();
  const issues = [];

  for (const card of cards) {
    const existing = seen.get(card.id);
    if (existing) {
      issues.push({
        file: card.sourcePath,
        cardId: card.id,
        message:
          `duplicate id, also defined in ${existing.sourcePath}. ` +
          'Ids are permanent keys for saved progress and must be unique.',
      });
    } else {
      seen.set(card.id, card);
    }
  }

  return issues;
}

/**
 * Non-fatal content-health warnings.
 *
 * @param {Array<object>} cards All cards, post-validation.
 * @returns {string[]} Warning lines.
 */
function collectWarnings(cards) {
  const warnings = [];
  const now = Date.now();
  const maxAgeMs = config.cards.stalenessWarnDays * 24 * 60 * 60 * 1000;

  const stale = cards.filter((card) => {
    const verifiedAt = Date.parse(card.verified);
    return Number.isFinite(verifiedAt) && now - verifiedAt > maxAgeMs;
  });

  if (stale.length > 0) {
    warnings.push(
      `${stale.length} card(s) not verified in over ${config.cards.stalenessWarnDays} days:`
    );
    for (const card of stale.slice(0, 10)) {
      warnings.push(`    ${card.id} (verified ${card.verified})`);
    }
    if (stale.length > 10) warnings.push(`    ...and ${stale.length - 10} more`);
  }

  // Cards sitting alone on a page are poorly connected in memory and tend to
  // be failed repeatedly. See plan.md on orphan cards.
  const perPage = new Map();
  for (const card of cards) {
    const key = `${card.topic}/${card.page}`;
    perPage.set(key, (perPage.get(key) || 0) + 1);
  }
  for (const [page, count] of perPage) {
    if (count < config.contentTargets.minCardsPerPage) {
      warnings.push(
        `${page} has only ${count} card(s); aim for at least ` +
          `${config.contentTargets.minCardsPerPage} so they are not orphans.`
      );
    }
  }

  return warnings;
}

module.exports = { validateCard, findDuplicateIds, collectWarnings };
