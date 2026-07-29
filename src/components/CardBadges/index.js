import React from 'react';
import config from '@site/site.config';
import styles from './styles.module.css';

/**
 * Tier and type badges for a card.
 *
 * Labels come from site.config so renaming a tier updates every surface at
 * once. An unrecognised value still renders (as its raw slug) rather than
 * disappearing, which makes bad data visible instead of silent.
 */

const TIER_LABELS = Object.fromEntries(
  config.cards.tiers.map((tier) => [tier.id, tier.label])
);
const TYPE_LABELS = Object.fromEntries(
  config.cards.types.map((type) => [type.id, type.label])
);

/**
 * @param {object} props
 * @param {string} [props.tier] Tier id.
 * @param {string} [props.type] Card type id.
 * @param {string[]} [props.tags] Tags to show.
 * @param {number} [props.maxTags] Cap on rendered tags.
 */
export default function CardBadges({ tier, type, tags = [], maxTags = 0 }) {
  const shownTags = maxTags > 0 ? tags.slice(0, maxTags) : [];

  return (
    <div className={styles.badges}>
      {tier && (
        <span className={`${styles.badge} ${styles[`tier_${tier}`] || ''}`}>
          {TIER_LABELS[tier] || tier}
        </span>
      )}
      {type && (
        <span className={`${styles.badge} ${styles.type}`}>
          {TYPE_LABELS[type] || type}
        </span>
      )}
      {shownTags.map((tag) => (
        <span key={tag} className={`${styles.badge} ${styles.tag}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}
