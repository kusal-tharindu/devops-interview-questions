/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak.
 * Used by Anki and many other SRS tools.
 *
 * Grades:
 *   0 = Again (complete failure)
 *   1 = Hard (significant difficulty)
 *   2 = Good (correct with some effort)
 *   3 = Easy (effortless recall)
 */

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

/**
 * Creates initial card state for a new card.
 */
export function createCardState(cardId) {
  return {
    id: cardId,
    ease: DEFAULT_EASE,
    interval: 0, // days
    reps: 0,
    lapses: 0,
    due: new Date().toISOString().slice(0, 10), // today
    lastGrade: null,
  };
}

/**
 * Calculates the next state after a review.
 *
 * @param {object} state - Current card state
 * @param {number} grade - 0=Again, 1=Hard, 2=Good, 3=Easy
 * @returns {object} Updated card state
 */
export function reviewCard(state, grade) {
  const now = new Date().toISOString().slice(0, 10);
  let { ease, interval, reps, lapses } = state;

  if (grade === 0) {
    // Again — reset to learning
    lapses += 1;
    reps = 0;
    interval = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else {
    // Successful review
    if (reps === 0) {
      // First successful review — 1 day
      interval = 1;
    } else if (reps === 1) {
      // Second successful review — 6 days
      interval = 6;
    } else {
      // Subsequent reviews — multiply by ease
      interval = Math.round(interval * ease);
    }

    // Adjust ease based on grade
    if (grade === 1) {
      // Hard — shorter interval, decrease ease
      interval = Math.max(1, Math.round(interval * 0.8));
      ease = Math.max(MIN_EASE, ease - 0.15);
    } else if (grade === 3) {
      // Easy — longer interval, increase ease
      interval = Math.round(interval * 1.3);
      ease += 0.15;
    }
    // grade === 2 (Good) — no ease adjustment

    reps += 1;
  }

  // Calculate next due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  const due = dueDate.toISOString().slice(0, 10);

  return {
    id: state.id,
    ease,
    interval,
    reps,
    lapses,
    due,
    lastGrade: grade,
  };
}

/**
 * Checks if a card is due for review today or earlier.
 */
export function isDue(state) {
  const today = new Date().toISOString().slice(0, 10);
  return state.due <= today;
}

/**
 * Sorts cards so most overdue cards come first.
 */
export function sortByUrgency(states) {
  const today = new Date().toISOString().slice(0, 10);
  return [...states].sort((a, b) => {
    if (a.due < b.due) return -1;
    if (a.due > b.due) return 1;
    // Same due date — higher lapse count first
    return b.lapses - a.lapses;
  });
}
