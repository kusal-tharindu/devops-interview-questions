import React, { useEffect, useMemo, useState } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import config from '@site/site.config';
import { loadPageCards } from '@site/src/lib/cardStore';
import CardBadges from '@site/src/components/CardBadges';
import CardAnswer from '@site/src/components/CardAnswer';
import styles from './styles.module.css';

/**
 * Learn mode: the questions for the current documentation page, as a
 * collapsible self-test list.
 *
 * Usage in any topic page, with no props:
 *
 *   import TopicQA from '@site/src/components/TopicQA';
 *   <TopicQA />
 *
 * The component resolves its own content from the Docusaurus doc id, which is
 * identical to the card deck's `topic/page` identity by construction
 * (docs/docker/images.md <-> docs/docker/images.cards.yaml). That means a page
 * can never drift out of sync with its cards, and renaming a file needs no
 * corresponding edit here.
 *
 * Props exist only as an escape hatch for pages that need to show another
 * page's cards.
 */

const TIER_ORDER = new Map(config.cards.tiers.map((tier, i) => [tier.id, i]));
const TIER_LABELS = new Map(config.cards.tiers.map((tier) => [tier.id, tier.label]));

const Status = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  EMPTY: 'empty',
  ERROR: 'error',
});

/**
 * Split a Docusaurus doc id into topic and page.
 * "docker/networking/bridge" -> { topic: "docker", page: "networking/bridge" }
 *
 * @param {string} docId
 * @returns {{topic: string, page: string}}
 */
function splitDocId(docId) {
  const slash = docId.indexOf('/');
  if (slash === -1) return { topic: docId, page: '' };
  return { topic: docId.slice(0, slash), page: docId.slice(slash + 1) };
}

/**
 * @param {object} props
 * @param {string} [props.topic] Override the resolved topic.
 * @param {string} [props.page] Override the resolved page.
 */
export default function TopicQA({ topic: topicProp, page: pageProp }) {
  const doc = useDoc();
  const resolved = splitDocId(doc?.metadata?.id || '');
  const topic = topicProp ?? resolved.topic;
  const page = pageProp ?? resolved.page;

  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(Status.LOADING);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    setStatus(Status.LOADING);

    loadPageCards(topic, page)
      .then((loaded) => {
        if (cancelled) return;
        setCards(loaded);
        setStatus(loaded.length > 0 ? Status.READY : Status.EMPTY);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('TopicQA could not load cards:', error?.message);
        setStatus(Status.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [topic, page]);

  const tierCounts = useMemo(() => {
    const counts = new Map();
    for (const card of cards) {
      counts.set(card.tier, (counts.get(card.tier) || 0) + 1);
    }
    return counts;
  }, [cards]);

  const visibleCards = useMemo(() => {
    const filtered =
      tierFilter === 'all' ? cards : cards.filter((c) => c.tier === tierFilter);

    return [...filtered].sort((a, b) => {
      const tierDiff =
        (TIER_ORDER.get(a.tier) ?? 99) - (TIER_ORDER.get(b.tier) ?? 99);
      return tierDiff !== 0 ? tierDiff : 0;
    });
  }, [cards, tierFilter]);

  const allExpanded =
    visibleCards.length > 0 &&
    visibleCards.every((card) => openIds.has(card.id));

  const toggleCard = (id) => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenIds(allExpanded ? new Set() : new Set(visibleCards.map((c) => c.id)));
  };

  if (status === Status.LOADING) {
    return <p className={styles.muted}>Loading questions…</p>;
  }

  if (status === Status.ERROR) {
    return (
      <p className={styles.muted}>
        Could not load questions for this page. Refresh to retry, or run{' '}
        <code>npm run build</code> if you are developing locally.
      </p>
    );
  }

  if (status === Status.EMPTY) {
    return (
      <p className={styles.muted}>
        No questions for this page yet.{' '}
        <a href={config.links.contributing} target="_blank" rel="noopener noreferrer">
          Add some
        </a>
        .
      </p>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.tierTabs} role="group" aria-label="Filter questions by tier">
          <TierTab
            active={tierFilter === 'all'}
            count={cards.length}
            label="All"
            onClick={() => setTierFilter('all')}
          />
          {config.cards.tiers.map((tier) =>
            tierCounts.has(tier.id) ? (
              <TierTab
                key={tier.id}
                active={tierFilter === tier.id}
                count={tierCounts.get(tier.id)}
                label={TIER_LABELS.get(tier.id)}
                title={tier.description}
                onClick={() => setTierFilter(tier.id)}
              />
            ) : null
          )}
        </div>

        <button type="button" className={styles.toggleAll} onClick={toggleAll}>
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <p className={styles.hint}>
        Read the question, answer it in your head, then expand to check yourself.
      </p>

      <ul className={styles.list}>
        {visibleCards.map((card) => {
          const isOpen = openIds.has(card.id);
          return (
            <li key={card.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                onClick={() => toggleCard(card.id)}
                aria-expanded={isOpen}
                aria-controls={`qa-${card.id}`}
              >
                <span className={styles.marker} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
                <span className={styles.questionText}>{card.q}</span>
                <CardBadges tier={card.tier} />
              </button>

              {isOpen && (
                <div className={styles.answerPanel} id={`qa-${card.id}`}>
                  {/* Already on the card's own page, so the backlink is noise. */}
                  <CardAnswer card={card} showTheoryLink={false} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.active
 * @param {number} props.count
 * @param {string} props.label
 * @param {string} [props.title]
 * @param {() => void} props.onClick
 */
function TierTab({ active, count, label, title, onClick }) {
  return (
    <button
      type="button"
      className={active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
      onClick={onClick}
      aria-pressed={active}
      title={title}
    >
      {label} <span className={styles.tabCount}>{count}</span>
    </button>
  );
}
