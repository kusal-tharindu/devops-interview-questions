/**
 * SM-2 spaced repetition scheduling.
 *
 * Based on the SuperMemo SM-2 algorithm, the same family Anki uses. All tuning
 * constants come from site.config.js `srs` — no magic numbers here.
 *
 * A caveat worth keeping honest about: the precise interval curve is not
 * settled science. The literature establishes that expanding intervals beat
 * massed practice, but not the exact multipliers. SM-2 is a well-understood
 * default, not an optimum.
 *
 * Grades (see config.grades): 0 Again · 1 Hard · 2 Good · 3 Easy
 */

import config from '@site/site.config';

const { srs } = config;

/** Grade constants, so callers never pass bare integers. */
export const Grade = Object.freeze({
  AGAIN: 0,
  HARD: 1,
  GOOD: 2,
  EASY: 3,
});

/**
 * @typedef {object} CardState
 * @property {string} id Card id this state belongs to.
 * @property {number} ease Ease factor; higher means longer intervals.
 * @property {number} interval Days until the next review.
 * @property {number} reps Consecutive successful reviews.
 * @property {number} lapses Lifetime count of failed reviews.
 * @property {string} due ISO date (YYYY-MM-DD) when the card is next due.
 * @property {number|null} lastGrade Most recent grade, or null if never reviewed.
 */

/**
 * Today as an ISO date string, local time.
 *
 * Local rather than UTC on purpose: "due today" should mean the learner's
 * today, not a date that flips mid-evening in western timezones.
 *
 * @param {Date} [from]
 * @returns {string} YYYY-MM-DD
 */
export function today(from = new Date()) {
  const year = from.getFullYear();
  const month = String(from.getMonth() + 1).padStart(2, '0');
  const day = String(from.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @param {number} days
 * @param {Date} [from]
 * @returns {string} ISO date `days` in the future.
 */
function dateAfter(days, from = new Date()) {
  const target = new Date(from);
  target.setDate(target.getDate() + days);
  return today(target);
}

/**
 * Fresh state for a card that has never been reviewed. Due immediately.
 *
 * @param {string} cardId
 * @returns {CardState}
 */
export function createCardState(cardId) {
  return {
    id: cardId,
    ease: srs.defaultEase,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: today(),
    lastGrade: null,
  };
}

/**
 * Next interval after a successful review, before grade adjustment.
 *
 * @param {CardState} state
 * @returns {number} Days.
 */
function baseInterval(state) {
  if (state.reps === 0) return srs.firstInterval;
  if (state.reps === 1) return srs.secondInterval;
  return Math.round(state.interval * state.ease);
}

/**
 * Apply a review grade and produce the next scheduling state.
 *
 * Pure: returns new state, never mutates the input.
 *
 * @param {CardState} state Current state.
 * @param {number} grade One of {@link Grade}.
 * @returns {CardState} Updated state.
 */
export function reviewCard(state, grade) {
  const clampEase = (value) => Math.max(srs.minEase, value);

  if (grade === Grade.AGAIN) {
    return {
      ...state,
      ease: clampEase(state.ease - srs.easePenaltyAgain),
      interval: 0,
      reps: 0,
      lapses: state.lapses + 1,
      due: today(),
      lastGrade: grade,
    };
  }

  let interval = baseInterval(state);
  let ease = state.ease;

  if (grade === Grade.HARD) {
    interval = Math.max(1, Math.round(interval * srs.intervalFactorHard));
    ease = clampEase(ease - srs.easePenaltyHard);
  } else if (grade === Grade.EASY) {
    interval = Math.round(interval * srs.intervalFactorEasy);
    ease = ease + srs.easeBonusEasy;
  }
  // Grade.GOOD leaves ease unchanged — that is the calibrated baseline.

  return {
    ...state,
    ease,
    interval,
    reps: state.reps + 1,
    lapses: state.lapses,
    due: dateAfter(interval),
    lastGrade: grade,
  };
}

/**
 * @param {CardState} state
 * @returns {boolean} True when the card is due today or overdue.
 */
export function isDue(state) {
  return !state || state.due <= today();
}

/**
 * @param {CardState} state
 * @returns {boolean} True once the card is well established in memory.
 */
export function isMature(state) {
  return Boolean(state) && state.interval >= srs.matureIntervalDays;
}

/**
 * Order states most-urgent-first: oldest due date, then most-lapsed.
 *
 * Lapses break the tie so cards a learner keeps failing surface early, while
 * attention is freshest.
 *
 * @param {CardState[]} states
 * @returns {CardState[]} New sorted array.
 */
export function sortByUrgency(states) {
  return [...states].sort((a, b) => {
    if (a.due !== b.due) return a.due < b.due ? -1 : 1;
    return b.lapses - a.lapses;
  });
}

/**
 * Summarise a collection of card states.
 *
 * @param {CardState[]} states
 * @returns {{tracked: number, mature: number, learning: number, dueNow: number}}
 */
export function summarise(states) {
  const tracked = states.filter((s) => s.reps > 0 || s.lapses > 0);
  return {
    tracked: tracked.length,
    mature: tracked.filter(isMature).length,
    learning: tracked.filter((s) => !isMature(s)).length,
    dueNow: states.filter(isDue).length,
  };
}
