import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';

import config from '@site/site.config';
import styles from './styles.module.css';

/**
 * Interactive landing-page card.
 *
 * The questions and answers are generated from the validated card decks (see
 * scripts/build-content.js), so this is always a real question from the bank —
 * not marketing copy that can drift from the content. Grading here is a demo:
 * it advances the preview and deliberately never writes to the review schedule.
 */

const TIER_LABELS = Object.fromEntries(
  config.cards.tiers.map((tier) => [tier.id, tier.label])
);
const TYPE_LABELS = Object.fromEntries(
  config.cards.types.map((type) => [type.id, type.label])
);

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Fixed-format date so server and browser render identical markup.
 *
 * @param {string} iso YYYY-MM-DD
 * @returns {string}
 */
function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export default function StudyCardPreview({ cards = [] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef(null);
  const firstGradeRef = useRef(null);
  const hasInteracted = useRef(false);

  // The reveal button is replaced by the grade controls, and grading replaces
  // them with a new reveal button. Move focus deliberately so keyboard users
  // are never dropped back to the top of the document. After a reveal, the
  // answer is announced by the live region below and focus lands on Again —
  // the next action — rather than on a link that leaves the page.
  useEffect(() => {
    if (!hasInteracted.current) return;
    const target = revealed ? firstGradeRef.current : revealRef.current;
    target?.focus({ preventScroll: true });
  }, [revealed, index]);

  if (cards.length === 0) return null;

  const card = cards[Math.min(index, cards.length - 1)];
  const total = cards.length;
  const position = String(index + 1).padStart(2, '0');
  const theoryHref = card.pageUrl
    ? `${card.pageUrl}${card.ref || ''}`
    : null;

  const showNext = () => {
    hasInteracted.current = true;
    setIndex((current) => (current + 1) % total);
    setRevealed(false);
  };

  const revealAnswer = () => {
    hasInteracted.current = true;
    setRevealed(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.deck}>
        <div className={styles.stackBack} aria-hidden="true" />
        <div className={styles.stackMid} aria-hidden="true" />

        <article className={styles.card} aria-label="Question preview">
          <div className={styles.progress} aria-hidden="true">
            {cards.map((item, itemIndex) => (
              <span
                key={item.id}
                className={
                  itemIndex === index
                    ? `${styles.progressSegment} ${styles.progressActive}`
                    : styles.progressSegment
                }
              />
            ))}
          </div>

          <header className={styles.cardHeader}>
            <span className={styles.context}>
              <span className={styles.topic}>{card.label}</span>
              <span className={styles.slash}>/</span>
              {card.pageTitle}
            </span>
            <span className={styles.position}>
              {position}
              <span className={styles.positionTotal}>
                /{String(total).padStart(2, '0')}
              </span>
            </span>
          </header>

          <div className={styles.body} key={card.id}>
            <div className={styles.badges}>
              <span
                className={`${styles.badge} ${styles[`tier_${card.tier}`] || ''}`}
              >
                {TIER_LABELS[card.tier] || card.tier}
              </span>
              <span className={`${styles.badge} ${styles.typeBadge}`}>
                {TYPE_LABELS[card.type] || card.type}
              </span>
            </div>

            <p className={styles.question}>{card.q}</p>

            <div
              className={styles.revealArea}
              data-revealed={revealed ? 'true' : 'false'}
            >
              {!revealed ? (
                <p className={styles.recallHint}>
                  Answer it in your head first.
                </p>
              ) : (
                <div className={styles.answer}>
                  <span className={styles.answerLabel}>Answer</span>
                  <p className={styles.answerText}>{card.a}</p>

                  {card.why && (
                    <p className={styles.why}>
                      <span className={styles.whyLabel}>Why it matters</span>
                      {card.why}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className={styles.controls}>
              {!revealed ? (
                <button
                  type="button"
                  className={styles.reveal}
                  ref={revealRef}
                  onClick={revealAnswer}
                >
                  <span>Show answer</span>
                </button>
              ) : (
                <div
                  className={styles.grades}
                  role="group"
                  aria-label="Grade your recall"
                >
                  {config.grades.map((grade, gradeIndex) => (
                    <button
                      key={grade.grade}
                      type="button"
                      className={styles.grade}
                      ref={gradeIndex === 0 ? firstGradeRef : undefined}
                      style={{ '--grade-color': grade.color }}
                      onClick={showNext}
                      aria-label={`${grade.label} — ${grade.hint}`}
                    >
                      <span className={styles.gradeDot} aria-hidden="true" />
                      <span>{grade.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <footer className={styles.footer}>
            <span>
              {card.verified
                ? `Verified ${formatDate(card.verified)}`
                : 'From the question bank'}
            </span>
            {revealed && theoryHref ? (
              <Link className={styles.footerLink} to={theoryHref}>
                Read the full page
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className={styles.previewTag}>Preview</span>
            )}
          </footer>

          <p className={styles.srOnly} aria-live="polite">
            Card {index + 1} of {total}: {card.q}
            {revealed ? ` Answer: ${card.a}` : ''}
          </p>
        </article>
      </div>

      <p className={styles.caption}>
        <span className={styles.captionDot} aria-hidden="true" />
        {revealed
          ? 'Grade to see the next question. Nothing here is saved.'
          : 'One of the real questions in the bank.'}
      </p>
    </div>
  );
}
