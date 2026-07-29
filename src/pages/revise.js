import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './revise.module.css';
import { createCardState, reviewCard, isDue, sortByUrgency } from '../lib/sm2';
import { loadProgress, saveProgress, exportProgress } from '../lib/storage';

const GRADES = [
  { key: '1', grade: 0, label: 'Again', color: '#ff5f56' },
  { key: '2', grade: 1, label: 'Hard', color: '#ffbd2e' },
  { key: '3', grade: 2, label: 'Good', color: '#4fd1a5' },
  { key: '4', grade: 3, label: 'Easy', color: '#6fa8dc' },
];

// Topic tag → display label. Falls back to the raw tag.
const TOPIC_LABELS = {
  linux: 'Linux',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  terraform: 'Terraform',
  bash: 'Bash',
  python: 'Python',
  networking: 'Networking',
  git: 'Git',
  cicd: 'CI/CD',
};

const TOPIC_ORDER = Object.keys(TOPIC_LABELS);

function label(tag) {
  return TOPIC_LABELS[tag] || tag;
}

/** Topic picker — the entry screen. */
function TopicPicker({ topics, onSelect }) {
  return (
    <div className={styles.picker}>
      <h1>Revise</h1>
      <p className={styles.pickerDesc}>
        Pick a topic and test yourself. Your grades quietly build a review
        schedule, so cards you struggle with come back sooner.
      </p>

      <div className={styles.topicGrid}>
        {topics.map((t) => (
          <button
            key={t.tag}
            type="button"
            className={styles.topicCard}
            onClick={() => onSelect(t.tag)}
          >
            <span className={styles.topicName}>{label(t.tag)}</span>
            <span className={styles.topicMeta}>
              {t.total} cards
              {t.due > 0 && <span className={styles.dueBadge}>{t.due} due</span>}
            </span>
          </button>
        ))}
      </div>

      <button type="button" className={styles.allTopicsBtn} onClick={() => onSelect('__all__')}>
        Revise all topics
      </button>
    </div>
  );
}

/** Single card with recall-before-reveal. */
function ReviseCard({ card, revealed, onReveal, onGrade }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardMeta}>
        <span className={styles[`tier_${card.tier}`]}>{card.tier}</span>
        <span className={styles.type}>{card.type}</span>
      </div>

      <div className={styles.question}>
        <span className={styles.qLabel}>Q:</span> {card.q}
      </div>

      {!revealed ? (
        <button type="button" className={styles.revealBtn} onClick={onReveal}>
          Show Answer
        </button>
      ) : (
        <div className={styles.answerSection}>
          <div className={styles.answer}>
            <span className={styles.aLabel}>A:</span> {card.a}
          </div>

          {card.why && <div className={styles.why}>{card.why}</div>}

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

          <p className={styles.gradePrompt}>How well did you recall this?</p>
          <div className={styles.grades}>
            {GRADES.map((g) => (
              <button
                key={g.grade}
                type="button"
                className={styles.gradeBtn}
                style={{ borderColor: g.color, color: g.color }}
                onClick={() => onGrade(g.grade)}
                aria-label={`${g.label} (press ${g.key})`}
              >
                <span className={styles.gradeKey}>{g.key}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** End-of-session summary. */
function SessionComplete({ topic, reviewed, stats, onBack, onMore, hasMore }) {
  return (
    <div className={styles.complete}>
      <h2>Session Complete</h2>
      <p className={styles.completeSub}>
        {reviewed} card{reviewed === 1 ? '' : 's'} reviewed
        {topic !== '__all__' && ` in ${label(topic)}`}.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.tracked}</span>
          <span className={styles.statLabel}>Cards in rotation</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.mature}</span>
          <span className={styles.statLabel}>Mature (21d+)</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.learning}</span>
          <span className={styles.statLabel}>Still learning</span>
        </div>
      </div>

      <div className={styles.completeActions}>
        {hasMore && (
          <button type="button" className={styles.actionBtn} onClick={onMore}>
            Keep Going
          </button>
        )}
        <button type="button" className={styles.actionBtnSecondary} onClick={onBack}>
          Pick Another Topic
        </button>
        <button type="button" className={styles.actionBtnSecondary} onClick={exportProgress}>
          Export Progress
        </button>
      </div>
    </div>
  );
}

export default function RevisePage() {
  const cardsUrl = useBaseUrl('/cards.json');
  const [allCards, setAllCards] = useState([]);
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState('loading');

  const [topic, setTopic] = useState(null);
  const [queue, setQueue] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  // Load cards + saved progress
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const resp = await fetch(cardsUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (cancelled) return;
        setAllCards((data.cards || []).filter((c) => !c.deprecated));
        setProgress(loadProgress());
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [cardsUrl]);

  // Available topics with total + due counts.
  // Grouped by card.topic (folder-derived), not tags — tags are cross-cutting
  // and would double-count cards across topics.
  const topics = useMemo(() => {
    const counts = new Map();
    for (const card of allCards) {
      const tag = card.topic;
      if (!tag) continue;
      if (!counts.has(tag)) counts.set(tag, { tag, total: 0, due: 0 });
      const entry = counts.get(tag);
      entry.total += 1;
      const state = progress[card.id];
      if (!state || isDue(state)) entry.due += 1;
    }
    return [...counts.values()].sort((a, b) => {
      const ai = TOPIC_ORDER.indexOf(a.tag);
      const bi = TOPIC_ORDER.indexOf(b.tag);
      // Unknown topics sort last, alphabetically
      if (ai === -1 && bi === -1) return a.tag.localeCompare(b.tag);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [allCards, progress]);

  const stats = useMemo(() => {
    const tracked = Object.values(progress).filter((s) => s.reps > 0);
    return {
      tracked: tracked.length,
      mature: tracked.filter((s) => s.interval >= 21).length,
      learning: tracked.filter((s) => s.interval < 21).length,
    };
  }, [progress]);

  /** Build a queue for a topic: due cards first (most overdue), then new. */
  const buildQueue = useCallback(
    (topicTag, limit = 20) => {
      const pool =
        topicTag === '__all__'
          ? allCards
          : allCards.filter((c) => c.topic === topicTag);

      const byId = new Map(pool.map((c) => [c.id, c]));
      const states = pool.map((c) => progress[c.id] || createCardState(c.id));

      const due = sortByUrgency(states.filter(isDue));
      return due
        .map((s) => byId.get(s.id))
        .filter(Boolean)
        .slice(0, limit);
    },
    [allCards, progress]
  );

  function startTopic(topicTag) {
    const q = buildQueue(topicTag);
    setTopic(topicTag);
    setQueue(q);
    setReviewed(0);
    setRevealed(false);
    setSessionDone(q.length === 0);
  }

  const handleGrade = useCallback(
    (grade) => {
      const card = queue[0];
      if (!card) return;

      const current = progress[card.id] || createCardState(card.id);
      const next = reviewCard(current, grade);
      const updated = { ...progress, [card.id]: next };

      setProgress(updated);
      saveProgress(updated);
      setReviewed((n) => n + 1);
      setRevealed(false);

      const remaining = queue.slice(1);
      setQueue(remaining);
      if (remaining.length === 0) setSessionDone(true);
    },
    [queue, progress]
  );

  // Keyboard: Space to reveal, 1-4 to grade
  useEffect(() => {
    function onKeyDown(e) {
      if (topic === null || sessionDone || queue.length === 0) return;

      if (!revealed && e.code === 'Space') {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        const map = { 1: 0, 2: 1, 3: 2, 4: 3 };
        if (e.key in map) {
          e.preventDefault();
          handleGrade(map[e.key]);
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [revealed, queue, sessionDone, topic, handleGrade]);

  const pageTitle = 'Revise';
  const pageDesc = 'Self-test one DevOps topic. Grades build a spaced review schedule.';

  if (status === 'loading') {
    return (
      <Layout title={pageTitle} description={pageDesc}>
        <div className={styles.container}>
          <p className={styles.muted}>Loading cards…</p>
        </div>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout title={pageTitle} description={pageDesc}>
        <div className={styles.container}>
          <p className={styles.muted}>
            Could not load cards. Try a refresh, or run <code>npm run build</code> if
            you are developing locally.
          </p>
        </div>
      </Layout>
    );
  }

  // Entry screen
  if (topic === null) {
    return (
      <Layout title={pageTitle} description={pageDesc}>
        <div className={styles.container}>
          <TopicPicker topics={topics} onSelect={startTopic} />
        </div>
      </Layout>
    );
  }

  // Session finished
  if (sessionDone) {
    const remainingDue = buildQueue(topic).length;
    return (
      <Layout title={pageTitle} description={pageDesc}>
        <div className={styles.container}>
          {reviewed === 0 ? (
            <div className={styles.complete}>
              <h2>Nothing due right now</h2>
              <p className={styles.completeSub}>
                You have reviewed everything in{' '}
                {topic === '__all__' ? 'all topics' : label(topic)} for now. Come back
                later, or drill instead.
              </p>
              <div className={styles.completeActions}>
                <button
                  type="button"
                  className={styles.actionBtnSecondary}
                  onClick={() => setTopic(null)}
                >
                  Pick Another Topic
                </button>
              </div>
            </div>
          ) : (
            <SessionComplete
              topic={topic}
              reviewed={reviewed}
              stats={stats}
              hasMore={remainingDue > 0}
              onMore={() => startTopic(topic)}
              onBack={() => setTopic(null)}
            />
          )}
        </div>
      </Layout>
    );
  }

  // Active session
  return (
    <Layout title={pageTitle} description={pageDesc}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setTopic(null)}
          >
            ← Topics
          </button>
          <span className={styles.headerTopic}>
            {topic === '__all__' ? 'All topics' : label(topic)}
          </span>
          <span className={styles.headerCount}>
            {queue.length} left
          </span>
        </div>

        <ReviseCard
          card={queue[0]}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onGrade={handleGrade}
        />

        <p className={styles.hint}>Space to reveal · 1–4 to grade</p>
      </div>
    </Layout>
  );
}
