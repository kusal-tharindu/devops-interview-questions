import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import config from '@site/site.config';
import { loadManifest, loadTopicCards, loadTopicsCards } from '@site/src/lib/cardStore';
import {
  createCardState,
  reviewCard,
  isDue,
  sortByUrgency,
  summarise,
} from '@site/src/lib/sm2';
import {
  loadProgress,
  saveProgress,
  exportProgress,
  shouldSuggestBackup,
} from '@site/src/lib/storage';
import CardBadges from '@site/src/components/CardBadges';
import CardAnswer from '@site/src/components/CardAnswer';
import styles from './revise.module.css';

/**
 * Revise: pick one topic, self-test, and let the schedule build itself.
 *
 * To the learner this is a topic quiz. Underneath, every grade feeds SM-2, so
 * spacing accumulates without anyone having to opt into a daily habit. That
 * framing is deliberate — see .kiro-guide/plan.md section 4a.
 */

const ALL_TOPICS = '__all__';

const Status = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
});

/** Map keyboard digits to grades, derived so config stays authoritative. */
const KEY_TO_GRADE = new Map(
  config.grades.map((entry, index) => [String(index + 1), entry.grade])
);

export default function RevisePage() {
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState(Status.LOADING);
  const [progress, setProgress] = useState({});

  const [topic, setTopic] = useState(null);
  const [queue, setQueue] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  // Distinct from sessionActive: the queue is fetched asynchronously, so there
  // is a window with a chosen topic but no cards yet. Without this the
  // "nothing due" screen would flash before the queue arrives.
  const [queueLoading, setQueueLoading] = useState(false);

  // Manifest is small and card-free, so the topic picker renders immediately
  // without downloading any card bodies.
  useEffect(() => {
    let cancelled = false;

    loadManifest()
      .then((data) => {
        if (cancelled) return;
        setManifest(data);
        setProgress(loadProgress());
        setStatus(Status.READY);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('Revise could not load the card manifest:', error?.message);
        setStatus(Status.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const topicSummaries = useMemo(() => {
    if (!manifest) return [];

    return manifest.topics.map((entry) => {
      // Without per-card state we cannot know exactly which cards are due, but
      // an unseen card is always due, so total minus seen is a safe lower bound
      // that never over-promises work.
      const seenInTopic = Object.values(progress).filter(
        (state) => state.topic === entry.topic
      );
      const seenDue = seenInTopic.filter(isDue).length;
      const unseen = entry.cardCount - seenInTopic.length;

      return {
        topic: entry.topic,
        label: entry.label,
        total: entry.cardCount,
        pageCount: entry.pages.length,
        due: Math.max(0, unseen) + seenDue,
      };
    });
  }, [manifest, progress]);

  const stats = useMemo(() => summarise(Object.values(progress)), [progress]);

  /**
   * Build a due-first session queue for a topic.
   *
   * @param {string} topicId Topic slug, or ALL_TOPICS.
   * @returns {Promise<object[]>}
   */
  const buildQueue = useCallback(
    async (topicId) => {
      const pool =
        topicId === ALL_TOPICS
          ? await loadTopicsCards(manifest.topics.map((t) => t.topic))
          : await loadTopicCards(topicId);

      const byId = new Map(pool.map((card) => [card.id, card]));
      const states = pool.map(
        (card) => progress[card.id] || createCardState(card.id)
      );

      return sortByUrgency(states.filter(isDue))
        .map((state) => byId.get(state.id))
        .filter(Boolean)
        .slice(0, config.srs.sessionSize);
    },
    [manifest, progress]
  );

  const startTopic = useCallback(
    async (topicId) => {
      setTopic(topicId);
      setRevealed(false);
      setReviewedCount(0);
      setQueue([]);
      setQueueLoading(true);

      try {
        const nextQueue = await buildQueue(topicId);
        setQueue(nextQueue);
        // Activate only once cards are in hand, so the card renderer is never
        // asked to draw an empty queue.
        setSessionActive(nextQueue.length > 0);
      } catch (error) {
        console.warn('Could not build the review queue:', error?.message);
        setSessionActive(false);
      } finally {
        setQueueLoading(false);
      }
    },
    [buildQueue]
  );

  const handleGrade = useCallback(
    (grade) => {
      const card = queue[0];
      if (!card) return;

      const current = progress[card.id] || createCardState(card.id);
      const next = reviewCard(current, grade);

      // Denormalise topic onto the saved state so due counts can be computed
      // from progress alone, without loading every topic's cards.
      const updated = { ...progress, [card.id]: { ...next, topic: card.topic } };

      setProgress(updated);
      saveProgress(updated);
      setReviewedCount((count) => count + 1);
      setRevealed(false);

      const remaining = queue.slice(1);
      setQueue(remaining);
      if (remaining.length === 0) setSessionActive(false);
    },
    [queue, progress]
  );

  // Keyboard-first: reveal, then grade, without leaving the keyboard.
  useEffect(() => {
    if (!sessionActive || queue.length === 0) return undefined;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (!revealed && event.code === config.keys.revealCode) {
        event.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && KEY_TO_GRADE.has(event.key)) {
        event.preventDefault();
        handleGrade(KEY_TO_GRADE.get(event.key));
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [revealed, sessionActive, queue.length, handleGrade]);

  const pageMeta = {
    title: 'Revise',
    description:
      'Self-test one DevOps topic. Grades quietly build a spaced review schedule.',
  };

  if (status === Status.LOADING) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <p className={styles.muted}>Loading…</p>
        </div>
      </Layout>
    );
  }

  if (status === Status.ERROR) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <p className={styles.muted}>
            Could not load cards. Refresh to retry, or run{' '}
            <code>npm run build</code> if you are developing locally.
          </p>
        </div>
      </Layout>
    );
  }

  if (topic === null) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <TopicPicker
            topics={topicSummaries}
            onSelect={startTopic}
            showBackupPrompt={shouldSuggestBackup()}
          />
        </div>
      </Layout>
    );
  }

  if (queueLoading) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <p className={styles.muted}>Loading questions…</p>
        </div>
      </Layout>
    );
  }

  const currentCard = queue[0];

  // Session is over when there is nothing left to show. Checking the card
  // rather than only the flag keeps this safe against any future state race.
  if (!sessionActive || !currentCard) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <SessionSummary
            topicLabel={topicLabelFor(topicSummaries, topic)}
            reviewedCount={reviewedCount}
            stats={stats}
            onPickAnother={() => setTopic(null)}
            onContinue={() => startTopic(topic)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout {...pageMeta}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setTopic(null)}
          >
            ← Topics
          </button>
          <span className={styles.headerTopic}>
            {topicLabelFor(topicSummaries, topic)}
          </span>
          <span className={styles.headerCount}>{queue.length} left</span>
        </header>

        <article className={styles.card}>
          <CardBadges tier={currentCard.tier} type={currentCard.type} />

          <p className={styles.question}>
            <span className={styles.questionLabel}>Q:</span> {currentCard.q}
          </p>

          {revealed ? (
            <div className={styles.answerPanel}>
              <CardAnswer card={currentCard} />

              <p className={styles.gradePrompt}>How well did you recall this?</p>
              <div className={styles.grades}>
                {config.grades.map((entry, index) => (
                  <button
                    key={entry.grade}
                    type="button"
                    className={styles.gradeButton}
                    style={{ borderColor: entry.color, color: entry.color }}
                    onClick={() => handleGrade(entry.grade)}
                    title={entry.hint}
                    aria-label={`${entry.label} — ${entry.hint} (press ${index + 1})`}
                  >
                    <span className={styles.gradeKey}>{index + 1}</span>
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.revealButton}
              onClick={() => setRevealed(true)}
            >
              Show Answer
            </button>
          )}
        </article>

        <p className={styles.hint}>
          {config.keys.reveal} to reveal · {config.keys.gradeHint}
        </p>
      </div>
    </Layout>
  );
}

/**
 * @param {Array<{topic: string, label: string}>} topics
 * @param {string} topicId
 * @returns {string}
 */
function topicLabelFor(topics, topicId) {
  if (topicId === ALL_TOPICS) return 'All topics';
  return topics.find((t) => t.topic === topicId)?.label || topicId;
}

/**
 * Entry screen: choose what to revise.
 *
 * @param {object} props
 * @param {Array<object>} props.topics
 * @param {(topic: string) => void} props.onSelect
 * @param {boolean} props.showBackupPrompt
 */
function TopicPicker({ topics, onSelect, showBackupPrompt }) {
  const totalDue = topics.reduce((sum, t) => sum + t.due, 0);

  return (
    <section className={styles.picker}>
      <h1>Revise</h1>
      <p className={styles.pickerDescription}>
        Pick a topic and test yourself. Your grades quietly build a review
        schedule, so questions you struggle with come back sooner.
      </p>

      {totalDue > 0 && (
        <p className={styles.dueSummary}>
          <strong>{totalDue}</strong> question{totalDue === 1 ? '' : 's'} ready to review
        </p>
      )}

      <div className={styles.topicGrid}>
        {topics.map((entry) => (
          <button
            key={entry.topic}
            type="button"
            className={styles.topicCard}
            onClick={() => onSelect(entry.topic)}
          >
            <span className={styles.topicName}>{entry.label}</span>
            <span className={styles.topicMeta}>
              {entry.total} cards
              {entry.due > 0 && <span className={styles.dueBadge}>{entry.due} due</span>}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={() => onSelect(ALL_TOPICS)}
      >
        Revise all topics
      </button>

      {showBackupPrompt && (
        <p className={styles.backupPrompt}>
          You have been revising for a while. Progress lives only in this browser —{' '}
          <button type="button" className={styles.inlineButton} onClick={exportProgress}>
            export a backup
          </button>
          .
        </p>
      )}
    </section>
  );
}

/**
 * End-of-session screen.
 *
 * @param {object} props
 * @param {string} props.topicLabel
 * @param {number} props.reviewedCount
 * @param {{tracked: number, mature: number, learning: number}} props.stats
 * @param {() => void} props.onPickAnother
 * @param {() => void} props.onContinue
 */
function SessionSummary({
  topicLabel,
  reviewedCount,
  stats,
  onPickAnother,
  onContinue,
}) {
  const nothingWasDue = reviewedCount === 0;

  return (
    <section className={styles.complete}>
      <h2>{nothingWasDue ? 'Nothing due right now' : 'Session complete'}</h2>

      <p className={styles.completeSub}>
        {nothingWasDue
          ? `You are up to date on ${topicLabel}. Come back later, or try a drill instead.`
          : `${reviewedCount} question${reviewedCount === 1 ? '' : 's'} reviewed in ${topicLabel}.`}
      </p>

      {!nothingWasDue && (
        <div className={styles.statsGrid}>
          <Stat value={stats.tracked} label="In rotation" />
          <Stat
            value={stats.mature}
            label={`Mature (${config.srs.matureIntervalDays}d+)`}
          />
          <Stat value={stats.learning} label="Still learning" />
        </div>
      )}

      <div className={styles.completeActions}>
        {!nothingWasDue && (
          <button type="button" className={styles.primaryButton} onClick={onContinue}>
            Keep going
          </button>
        )}
        <button type="button" className={styles.secondaryButton} onClick={onPickAnother}>
          Pick another topic
        </button>
        {!nothingWasDue && (
          <button type="button" className={styles.secondaryButton} onClick={exportProgress}>
            Export progress
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * @param {object} props
 * @param {number} props.value
 * @param {string} props.label
 */
function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
