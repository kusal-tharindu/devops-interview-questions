import React from 'react';
import Link from '@docusaurus/Link';
import { theoryLink } from '@site/src/lib/cardStore';
import styles from './styles.module.css';

/**
 * The revealed side of a card: answer, elaboration, theory backlink, sources.
 *
 * Shared by Learn, Revise, and Drill so the three modes cannot drift in how
 * they present an answer.
 *
 * The theory backlink is the important part. A card a learner keeps failing
 * usually means the underlying explanation never landed, and the useful
 * response is to reread the source material rather than grind the card. This
 * gives them a one-click route back to the section it came from.
 */

/**
 * @param {object} props
 * @param {object} props.card Card record.
 * @param {boolean} [props.showTheoryLink] Hide on the page the card came from.
 * @param {React.ReactNode} [props.children] Extra content above the sources.
 */
export default function CardAnswer({ card, showTheoryLink = true, children }) {
  const href = showTheoryLink ? theoryLink(card) : null;
  const hasSources = Array.isArray(card.sources) && card.sources.length > 0;

  return (
    <div className={styles.answer}>
      <p className={styles.answerText}>
        <span className={styles.label}>A:</span> {card.a}
      </p>

      {card.why && <p className={styles.why}>{card.why}</p>}

      {children}

      <div className={styles.meta}>
        {href && (
          <Link to={href} className={styles.theoryLink}>
            Read the theory →
          </Link>
        )}
        {card.version && <span className={styles.stamp}>v{card.version}</span>}
        {card.verified && (
          <span className={styles.stamp}>verified {card.verified}</span>
        )}
      </div>

      {hasSources && (
        <ul className={styles.sources}>
          {card.sources.map((source) => (
            <li key={source.url}>
              {/* External docs open in a new tab; Docusaurus adds rel attrs. */}
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
