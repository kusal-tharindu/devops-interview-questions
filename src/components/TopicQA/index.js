import React, { useState, useEffect, useMemo } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const TIER_ORDER = { core: 0, deep: 1, trivia: 2 };
const TIERS = ['core', 'deep', 'trivia'];

/**
 * Learn mode: renders every card for a topic as a collapsible Q&A list.
 *
 * Used at the bottom of each topic's concept page. Reads the generated
 * cards.json and filters by the `topic` tag, so adding a card to the
 * topic's .cards.yaml makes it appear here with no further work.
 *
 * Nothing here is graded or persisted — this is the first-exposure
 * surface. Grading lives in /revise.
 */
export default function TopicQA({ topic }) {
  const cardsUrl = useBaseUrl('/cards.json');
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('loading');
  const [openIds, setOpenIds] = useState(() => new Set());
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const resp = await fetch(cardsUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (cancelled) return;
        const forTopic = (data.cards || []).filter(
          (c) => !c.deprecated && c.topic === topic
        );
        setCards(forTopic);
        setStatus(forTopic.length > 0 ? 'ready' : 'empty');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cardsUrl, topic]);

  const sorted = useMemo(() => {
    const filtered =
      tierFilter === 'all' ? cards : cards.filter((c) => c.tier === tierFilter);
    return [...filtered].sort(
      (a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)
    );
  }, [cards, tierFilter]);

  const tierCounts = useMemo(() => {
    return cards.reduce((acc, c) => {
      acc[c.tier] = (acc[c.tier] || 0) + 1;
      return acc;
    }, {});
  }, [cards]);

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setAll(open) {
    setOpenIds(open ? new Set(sorted.map((c) => c.id)) : new Set());
  }

  if (status === 'loading') {
    return <p className={styles.muted}>Loading questions…</p>;
  }

  if (status === 'error') {
    return (
      <p className={styles.muted}>
        Could not load questions. Try a refresh, or run <code>npm run build</code> if
        you are developing locally.
      </p>
    );
  }

  if (status === 'empty') {
    return (
      <p className={styles.muted}>
        No questions for this topic yet.{' '}
        <a href="https://github.com/kusal-tharindu/devops-interview-questions/blob/main/CONTRIBUTING.md">
          Contribute some
        </a>
        .
      </p>
    );
  }

  const allOpen = sorted.length > 0 && openIds.size >= sorted.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.tierTabs} role="group" aria-label="Filter by tier">
          <button
            type="button"
            className={tabClass(tierFilter === 'all')}
            onClick={() => setTierFilter('all')}
            aria-pressed={tierFilter === 'all'}
          >
            All <span className={styles.tabCount}>{cards.length}</span>
          </button>
          {TIERS.map((tier) =>
            tierCounts[tier] ? (
              <button
                key={tier}
                type="button"
                className={tabClass(tierFilter === tier)}
                onClick={() => setTierFilter(tier)}
                aria-pressed={tierFilter === tier}
              >
                {tier} <span className={styles.tabCount}>{tierCounts[tier]}</span>
              </button>
            ) : null
          )}
        </div>

        <button
          type="button"
          className={styles.expandAll}
          onClick={() => setAll(!allOpen)}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <p className={styles.hint}>
        Read the question, answer it in your head, then expand to check yourself.
      </p>

      <ol className={styles.list}>
        {sorted.map((card) => {
          const isOpen = openIds.has(card.id);
          return (
            <li key={card.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                onClick={() => toggle(card.id)}
                aria-expanded={isOpen}
                aria-controls={`answer-${card.id}`}
              >
                <span className={styles.chevron} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
                <span className={styles.questionText}>{card.q}</span>
                <span className={styles.badges}>
                  <span className={styles[`tier_${card.tier}`]}>{card.tier}</span>
                </span>
              </button>

              {isOpen && (
                <div className={styles.answer} id={`answer-${card.id}`}>
                  <p className={styles.answerText}>{card.a}</p>

                  {card.why && <p className={styles.why}>{card.why}</p>}

                  <div className={styles.meta}>
                    <span className={styles.type}>{card.type}</span>
                    {card.version && (
                      <span className={styles.version}>v{card.version}</span>
                    )}
                    {card.verified && (
                      <span className={styles.verified}>
                        verified {card.verified}
                      </span>
                    )}
                  </div>

                  {Array.isArray(card.sources) && card.sources.length > 0 && (
                    <ul className={styles.sources}>
                      {card.sources.map((s) => (
                        <li key={s.url}>
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function tabClass(active) {
  return active ? `${styles.tab} ${styles.tabActive}` : styles.tab;
}
