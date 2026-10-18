import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import config from '@site/site.config';
import TopicIcon from '@site/src/components/TopicIcon';
import {
  loadManifest,
  loadTopicCards,
  loadTopicsCards,
  theoryLink,
} from '@site/src/lib/cardStore';
import {
  Grade,
  createCardState,
  isDue,
  isMature,
  reviewCard,
  sortByUrgency,
  summarise,
} from '@site/src/lib/sm2';
import {
  loadProgress,
  saveProgress,
  exportProgress,
  shouldSuggestBackup,
} from '@site/src/lib/storage';

import styles from './revise.module.css';

/**
 * Revise — a focused study desk.
 *
 * Three screens in one route:
 *
 *   1. Pick a topic (and see the state of the local schedule).
 *   2. Work through a due-first queue, revealing and grading one card at a time.
 *   3. Finish with a summary of what moved forward.
 *
 * All scheduling is handled by SM-2 in src/lib/sm2.js. This page only presents
 * the queue and sends grades into it; progress stays in this browser.
 */

const ALL_TOPICS = '__all__';

const Status = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
});

const KEY_TO_GRADE = new Map(
  config.grades.map((entry, index) => [String(index + 1), entry.grade])
);

const TIER_LABELS = Object.fromEntries(
  config.cards.tiers.map((tier) => [tier.id, tier.label])
);
const TYPE_LABELS = Object.fromEntries(
  config.cards.types.map((type) => [type.id, type.label])
);

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatVerified(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function pageLabel(page) {
  if (!page) return 'Theory';
  return page
    .split('/')
    .map((segment) =>
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(' / ');
}

/** Short label for the interval a grade would schedule. */
function formatInterval(days) {
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day';
  if (days < 60) return `${days} days`;
  return `${Math.round(days / 30)} mo`;
}

function topicLabelFor(topics, topicId) {
  if (topicId === ALL_TOPICS) return 'All topics';
  return topics.find((entry) => entry.topic === topicId)?.label || topicId;
}

export default function RevisePage() {
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState(Status.LOADING);
  const [progress, setProgress] = useState({});
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);

  const [topic, setTopic] = useState(null);
  const [queue, setQueue] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [queueLoading, setQueueLoading] = useState(false);

  const revealRef = useRef(null);
  const gradeFocusRef = useRef(null);
  const summaryRef = useRef(null);
  const pickerHeadingRef = useRef(null);
  const hasInteracted = useRef(false);

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

  useEffect(() => {
    setShowBackupPrompt(shouldSuggestBackup());
  }, [progress]);

  // The picker can be tall; bring the study card into view when a session
  // starts instead of leaving the viewport where the topic card was.
  useEffect(() => {
    if (topic !== null) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [topic]);

  const topicSummaries = useMemo(() => {
    if (!manifest) return [];

    return manifest.topics.map((entry) => {
      const states = Object.values(progress).filter(
        (state) => state.topic === entry.topic
      );
      const seen = states.length;
      const seenDue = states.filter(isDue).length;
      const unseen = Math.max(0, entry.cardCount - seen);
      const mature = states.filter(isMature).length;

      return {
        topic: entry.topic,
        label: entry.label,
        total: entry.cardCount,
        pageCount: entry.pages.length,
        seen,
        mature,
        review: seenDue,
        fresh: unseen,
        due: unseen + seenDue,
        seenPercent: entry.cardCount
          ? Math.round((seen / entry.cardCount) * 100)
          : 0,
      };
    });
  }, [manifest, progress]);

  const stats = useMemo(() => summarise(Object.values(progress)), [progress]);

  const totals = useMemo(
    () =>
      topicSummaries.reduce(
        (sum, entry) => ({
          due: sum.due + entry.due,
          review: sum.review + entry.review,
          fresh: sum.fresh + entry.fresh,
        }),
        { due: 0, review: 0, fresh: 0 }
      ),
    [topicSummaries]
  );
  const totalDue = totals.due;

  const totalQuestions = manifest?.totalCards ?? 0;

  const buildQueue = useCallback(
    async (topicId) => {
      const pool =
        topicId === ALL_TOPICS
          ? await loadTopicsCards(manifest.topics.map((entry) => entry.topic))
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
      hasInteracted.current = true;

      try {
        const nextQueue = await buildQueue(topicId);
        setQueue(nextQueue);
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

  // Deep link from a theory page: /revise?topic=docker opens that queue.
  // Only a slug present in the manifest is accepted; the query is then
  // dropped so "Topics" and a reload land on the picker as usual.
  const deepLinkHandled = useRef(false);
  useEffect(() => {
    if (status !== Status.READY || !manifest || deepLinkHandled.current) return;
    deepLinkHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('topic');
    if (!requested) return;

    params.delete('topic');
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );

    if (manifest.topics.some((entry) => entry.topic === requested)) {
      startTopic(requested);
    }
  }, [status, manifest, startTopic]);

  const endSession = useCallback(() => {
    setTopic(null);
    setQueue([]);
    setRevealed(false);
    setReviewedCount(0);
    setSessionActive(false);
    setQueueLoading(false);
  }, []);

  const revealAnswer = useCallback(() => {
    hasInteracted.current = true;
    setRevealed(true);
  }, []);

  const handleGrade = useCallback(
    (grade) => {
      const card = queue[0];
      if (!card) return;

      hasInteracted.current = true;

      const current = progress[card.id] || createCardState(card.id);
      const next = reviewCard(current, grade);
      const updated = {
        ...progress,
        [card.id]: { ...next, topic: card.topic },
      };

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

  const currentCard = queue[0] || null;
  const currentCardId = currentCard?.id;
  const sessionTotal = reviewedCount + queue.length;
  const activeTopicDue =
    topic === ALL_TOPICS
      ? totalDue
      : topicSummaries.find((entry) => entry.topic === topic)?.due ?? 0;
  const canContinue = activeTopicDue > 0;

  // Keyboard-first: reveal, then grade, without leaving the page.
  useEffect(() => {
    if (!sessionActive || queue.length === 0) return undefined;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (!revealed && event.code === config.keys.revealCode) {
        // Let a focused button (back, end session, reveal) handle its own
        // Space press. The page-level shortcut is for when focus is on the
        // card or the document rather than an interactive control.
        const target = event.target;
        if (
          target instanceof HTMLElement &&
          target.closest('button, a, input, textarea, select')
        ) {
          return;
        }
        event.preventDefault();
        revealAnswer();
        return;
      }
      if (revealed && KEY_TO_GRADE.has(event.key)) {
        event.preventDefault();
        handleGrade(KEY_TO_GRADE.get(event.key));
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [revealed, sessionActive, queue.length, handleGrade, revealAnswer]);

  // Keep focus on the next useful control as the card changes.
  useEffect(() => {
    if (!hasInteracted.current) return;
    const target = revealed ? gradeFocusRef.current : revealRef.current;
    target?.focus({ preventScroll: true });
  }, [revealed, currentCardId]);

  // Move focus to the summary when a session ends, and to the picker heading
  // when the learner deliberately leaves a session.
  useEffect(() => {
    if (topic === null) {
      if (hasInteracted.current) {
        pickerHeadingRef.current?.focus();
      }
      return;
    }
    if (!sessionActive && !queueLoading && status === Status.READY) {
      summaryRef.current?.focus();
    }
  }, [topic, sessionActive, queueLoading, status]);

  if (status === Status.LOADING) {
    return (
      <ReviseShell>
        <LoadingState />
      </ReviseShell>
    );
  }

  if (status === Status.ERROR) {
    return (
      <ReviseShell>
        <ErrorState />
      </ReviseShell>
    );
  }

  if (topic === null) {
    return (
      <ReviseShell>
        <TopicPicker
          topics={topicSummaries}
          stats={stats}
          totals={totals}
          onSelect={startTopic}
          showBackupPrompt={showBackupPrompt}
          onExport={exportProgress}
          headingRef={pickerHeadingRef}
        />
      </ReviseShell>
    );
  }

  if (queueLoading) {
    return (
      <ReviseShell>
        <QueueLoading topicLabel={topicLabelFor(topicSummaries, topic)} />
      </ReviseShell>
    );
  }

  if (!sessionActive || !currentCard) {
    return (
      <ReviseShell>
        <SessionSummary
          topicLabel={topicLabelFor(topicSummaries, topic)}
          reviewedCount={reviewedCount}
          stats={stats}
          nothingWasDue={reviewedCount === 0}
          canContinue={canContinue}
          panelRef={summaryRef}
          onContinue={() => startTopic(topic)}
          onPickAnother={endSession}
          onExport={exportProgress}
        />
      </ReviseShell>
    );
  }

  return (
    <ReviseShell>
      <SessionView
        topic={topic}
        topicLabel={topicLabelFor(topicSummaries, topic)}
        cardTopicLabel={topicLabelFor(topicSummaries, currentCard.topic)}
        currentCard={currentCard}
        currentState={progress[currentCard.id] || createCardState(currentCard.id)}
        reviewedCount={reviewedCount}
        sessionTotal={sessionTotal}
        revealed={revealed}
        stats={stats}
        revealRef={revealRef}
        gradeFocusRef={gradeFocusRef}
        onReveal={revealAnswer}
        onGrade={handleGrade}
        onEnd={endSession}
      />
    </ReviseShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell + states                                                             */
/* -------------------------------------------------------------------------- */

function ReviseShell({ children }) {
  return (
    <Layout
      wrapperClassName={styles.page}
      title="Revise — spaced review"
      description="Pick a DevOps topic, test yourself, and let a spaced review schedule decide what comes back."
    >
      <div className={styles.shell}>{children}</div>
    </Layout>
  );
}

function LoadingState() {
  return (
    <div className={styles.centerState} role="status">
      <span className={styles.loader} aria-hidden="true" />
      <p className={styles.kicker}>Loading</p>
      <h1 className={styles.centerTitle}>Loading your deck…</h1>
      <p className={styles.centerCopy}>
        Fetching the topics and your local review state.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className={styles.centerState}>
      <p className={styles.kicker}>Something went wrong</p>
      <h1 className={styles.centerTitle}>The question bank didn&apos;t load.</h1>
      <p className={styles.centerCopy}>
        Refresh to try again. If you&apos;re developing locally, run{' '}
        <code>npm run build</code> first.
      </p>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  );
}

function QueueLoading({ topicLabel }) {
  return (
    <div className={styles.centerState} role="status">
      <span className={styles.loader} aria-hidden="true" />
      <p className={styles.kicker}>{topicLabel}</p>
      <h1 className={styles.centerTitle}>Building your session…</h1>
      <p className={styles.centerCopy}>
        Sorting the questions that are due by urgency.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Picker                                                                     */
/* -------------------------------------------------------------------------- */

function TopicPicker({
  topics,
  stats,
  totals,
  onSelect,
  showBackupPrompt,
  onExport,
  headingRef,
}) {
  return (
    <>
      <PageHeader headingRef={headingRef} />
      <StatsStrip totals={totals} stats={stats} />

      <section className={styles.pickerSection} aria-labelledby="revise-topics">
        <header className={styles.sectionHeader}>
          <div>
            <h2 id="revise-topics" className={styles.sectionTitle}>
              Pick a topic
            </h2>
            <p className={styles.sectionIntro}>
              Overdue questions come first, then new ones, up to{' '}
              {config.srs.sessionSize} per session.
            </p>
          </div>
        </header>

        <div className={styles.topicGrid}>
          {topics.map((entry) => (
            <TopicCard key={entry.topic} entry={entry} onSelect={onSelect} />
          ))}
        </div>

        <MixedSessionCard
          totalDue={totals.due}
          topicCount={topics.length}
          onSelect={onSelect}
        />

        {showBackupPrompt && <BackupNote onExport={onExport} />}
      </section>
    </>
  );
}

function PageHeader({ headingRef }) {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
        Revise
      </h1>
      <p className={styles.lede}>
        Answer from memory, then grade yourself. Your grade decides when each
        question comes back. Progress is saved in this browser.
      </p>
    </header>
  );
}

function StatsStrip({ totals, stats }) {
  const items = [
    { value: totals.review, label: 'Due for review', accent: totals.review > 0 },
    { value: totals.fresh, label: 'New' },
    { value: stats.learning, label: 'Learning' },
    { value: stats.mature, label: 'Mature' },
  ];

  return (
    <div className={styles.statsStrip}>
      {items.map((item) => (
        <div
          className={
            item.accent
              ? `${styles.statCell} ${styles.statCellAccent}`
              : styles.statCell
          }
          key={item.label}
        >
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function dueLabel({ review, fresh }) {
  const parts = [];
  if (review > 0) parts.push(`${review} due`);
  if (fresh > 0) parts.push(`${fresh} new`);
  return parts.length ? parts.join(' · ') : 'Caught up';
}

function TopicCard({ entry, onSelect }) {
  const caughtUp = entry.due === 0;
  const label = dueLabel(entry);

  return (
    <button
      type="button"
      className={styles.topicCard}
      onClick={() => onSelect(entry.topic)}
      aria-label={`Review ${entry.label}: ${
        caughtUp ? 'no questions due' : label
      }`}
    >
      <span className={styles.topicTop}>
        <span className={styles.topicIcon} aria-hidden="true">
          <TopicIcon slug={entry.topic} />
        </span>
        <span
          className={
            caughtUp
              ? `${styles.dueBadge} ${styles.dueBadgeMuted}`
              : styles.dueBadge
          }
        >
          {label}
        </span>
      </span>

      <span className={styles.topicName}>{entry.label}</span>
      <span className={styles.topicMeta}>
        {entry.total} questions · {entry.pageCount}{' '}
        {entry.pageCount === 1 ? 'page' : 'pages'}
      </span>

      <span
        className={styles.topicProgress}
        role="img"
        aria-label={`${entry.seen} of ${entry.total} questions seen`}
      >
        <span
          className={styles.topicProgressFill}
          style={{ width: `${entry.seenPercent}%` }}
        />
      </span>
      <span className={styles.topicProgressLabel}>
        <span>
          {entry.seen} of {entry.total} seen
        </span>
        <span>{entry.mature} mature</span>
      </span>

      <span className={styles.topicAction}>
        <span>{caughtUp ? 'Open session' : 'Start session'}</span>
        <span className={styles.topicArrow} aria-hidden="true">
          →
        </span>
      </span>
    </button>
  );
}

function MixedSessionCard({ totalDue, topicCount, onSelect }) {
  const caughtUp = totalDue === 0;

  return (
    <button
      type="button"
      className={styles.mixedCard}
      onClick={() => onSelect(ALL_TOPICS)}
      aria-label={`Start a mixed review session: ${
        caughtUp ? 'nothing due' : `${totalDue} due`
      }`}
    >
      <span className={styles.mixedIcon} aria-hidden="true">
        <LayersIcon />
      </span>
      <span className={styles.mixedCopy}>
        <span className={styles.mixedKicker}>Mixed session</span>
        <span className={styles.mixedTitle}>All topics in one queue</span>
        <span className={styles.mixedMeta}>
          {caughtUp
            ? 'Nothing due across your topics right now.'
            : `${totalDue} questions ready across ${topicCount} topics.`}
        </span>
      </span>
      <span className={styles.mixedAction}>
        {caughtUp ? 'Open session' : 'Start mixed session'}
        <span aria-hidden="true">→</span>
      </span>
    </button>
  );
}

function BackupNote({ onExport }) {
  return (
    <div className={styles.backupNote}>
      <span>Progress lives in this browser only.</span>
      <button type="button" className={styles.inlineButton} onClick={onExport}>
        Export a backup
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Session                                                                    */
/* -------------------------------------------------------------------------- */

function SessionView({
  topic,
  topicLabel,
  cardTopicLabel,
  currentCard,
  currentState,
  reviewedCount,
  sessionTotal,
  revealed,
  stats,
  revealRef,
  gradeFocusRef,
  onReveal,
  onGrade,
  onEnd,
}) {
  const position = reviewedCount + 1;
  const percent = sessionTotal
    ? Math.round((reviewedCount / sessionTotal) * 100)
    : 0;

  return (
    <>
      <h1 className={styles.srOnly}>Revise {topicLabel}</h1>

      <div className={styles.sessionBar}>
        <button type="button" className={styles.backButton} onClick={onEnd}>
          <span aria-hidden="true">←</span> Topics
        </button>

        <span className={styles.sessionTopic}>
          <span className={styles.sessionTopicIcon} aria-hidden="true">
            {topic === ALL_TOPICS ? (
              <LayersIcon />
            ) : (
              <TopicIcon slug={topic} />
            )}
          </span>
          {topicLabel}
        </span>

        <span className={styles.sessionPosition}>
          Question {position} <span aria-hidden="true">/</span>{' '}
          {sessionTotal}
        </span>

        <span className={styles.sessionProgressTrack} aria-hidden="true">
          <span
            className={styles.sessionProgressFill}
            style={{ width: `${percent}%` }}
          />
        </span>
      </div>

      <div className={styles.sessionGrid}>
        <article
          className={styles.studyCard}
          data-revealed={revealed ? 'true' : 'false'}
          aria-label="Review question"
        >
          <header className={styles.studyTop}>
            <span className={styles.context}>
              <span className={styles.contextTopic}>{cardTopicLabel}</span>
              <span className={styles.contextSep} aria-hidden="true">
                /
              </span>
              {pageLabel(currentCard.page)}
            </span>
            <ReviseBadges tier={currentCard.tier} type={currentCard.type} />
          </header>

          <div className={styles.questionArea}>
            <p className={styles.question}>{currentCard.q}</p>
          </div>

          <div
            className={styles.revealArea}
            data-revealed={revealed ? 'true' : 'false'}
          >
            {revealed ? (
              <ReviseAnswer card={currentCard} />
            ) : (
              <p className={styles.recallHint}>
                Answer it in your head first.
              </p>
            )}
          </div>

          <div className={styles.controls}>
            {!revealed ? (
              <button
                type="button"
                className={styles.revealButton}
                ref={revealRef}
                onClick={onReveal}
              >
                <span>Show answer</span>
                <kbd className={styles.kbd}>Space</kbd>
              </button>
            ) : (
              <Grades
                state={currentState}
                onGrade={onGrade}
                gradeFocusRef={gradeFocusRef}
              />
            )}
          </div>

          <footer className={styles.cardFooter}>
            <span>
              {currentCard.verified
                ? `Verified ${formatVerified(currentCard.verified)}`
                : 'From the question bank'}
            </span>
          </footer>

          <p className={styles.srOnly} aria-live="polite">
            {revealed
              ? `Answer: ${currentCard.a}`
              : `Question ${position} of ${sessionTotal}: ${currentCard.q}`}
          </p>
        </article>

        <SessionAside
          reviewedCount={reviewedCount}
          left={sessionTotal - reviewedCount}
          stats={stats}
          onEnd={onEnd}
        />
      </div>

      <p className={styles.mobileHint}>
        <kbd className={styles.kbd}>Space</kbd> to reveal ·{' '}
        <kbd className={styles.kbd}>1</kbd>–<kbd className={styles.kbd}>4</kbd>{' '}
        to grade
      </p>
    </>
  );
}

function ReviseBadges({ tier, type }) {
  return (
    <span className={styles.badges}>
      <span className={`${styles.badge} ${styles[`tier_${tier}`] || ''}`}>
        {TIER_LABELS[tier] || tier}
      </span>
      <span className={`${styles.badge} ${styles.badgeType}`}>
        {TYPE_LABELS[type] || type}
      </span>
    </span>
  );
}

function ReviseAnswer({ card }) {
  const href = theoryLink(card);
  const sources = Array.isArray(card.sources) ? card.sources : [];

  return (
    <div className={styles.answer}>
      <span className={styles.answerLabel}>Answer</span>
      <p className={styles.answerText}>{card.a}</p>

      {card.why && (
        <p className={styles.why}>
          <span className={styles.whyLabel}>Why it matters</span>
          {card.why}
        </p>
      )}

      {href && (
        <Link className={styles.theoryLink} to={href}>
          Read the theory
          <span aria-hidden="true">→</span>
        </Link>
      )}

      {sources.length > 0 && (
        <ul className={styles.sources}>
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Grades({ state, onGrade, gradeFocusRef }) {
  return (
    <div className={styles.gradeBlock}>
      <p className={styles.gradePrompt}>How well did you recall it?</p>
      <div className={styles.grades} role="group" aria-label="Grade your recall">
        {config.grades.map((entry, index) => {
          const next = formatInterval(reviewCard(state, entry.grade).interval);
          return (
            <button
              key={entry.grade}
              type="button"
              className={styles.gradeButton}
              style={{ '--grade-color': entry.color }}
              // Focus lands on Good, the honest default, not on Again.
              ref={entry.grade === Grade.GOOD ? gradeFocusRef : undefined}
              onClick={() => onGrade(entry.grade)}
              title={entry.hint}
              aria-label={`${entry.label}: ${entry.hint}, next review ${next.toLowerCase()} (press ${index + 1})`}
            >
              <span className={styles.gradeDot} aria-hidden="true" />
              <span className={styles.gradeText}>
                <span>{entry.label}</span>
                <span className={styles.gradeNext}>{next}</span>
              </span>
              <kbd className={styles.gradeKey}>{index + 1}</kbd>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SessionAside({ reviewedCount, left, stats, onEnd }) {
  const total = reviewedCount + left;
  const percent = total ? Math.round((reviewedCount / total) * 100) : 0;

  return (
    <aside className={styles.sessionAside} aria-label="Session progress">
      <div className={styles.sidePanel}>
        <span className={styles.panelLabel}>This session</span>
        <p className={styles.progressNumber}>
          <strong>{reviewedCount}</strong>
          <span>of {total} reviewed</span>
        </p>
        <div
          className={styles.progressBar}
          role="img"
          aria-label={`${reviewedCount} of ${total} reviewed`}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className={styles.progressRows}>
          <div className={styles.progressRow}>
            <span>Left in queue</span>
            <strong>{left}</strong>
          </div>
          <div className={styles.progressRow}>
            <span>Mature overall</span>
            <strong>{stats.mature}</strong>
          </div>
        </div>
      </div>

      <div className={styles.sidePanel}>
        <span className={styles.panelLabel}>Keyboard</span>
        <div className={styles.shortcutList}>
          <div className={styles.shortcutRow}>
            <span>Reveal answer</span>
            <kbd className={styles.kbd}>Space</kbd>
          </div>
          <div className={styles.shortcutRow}>
            <span>Grade</span>
            <span className={styles.keyGroup}>
              <kbd className={styles.kbd}>1</kbd>
              <span aria-hidden="true">–</span>
              <kbd className={styles.kbd}>4</kbd>
            </span>
          </div>
        </div>
      </div>

      <button type="button" className={styles.endButton} onClick={onEnd}>
        End session
      </button>
      <p className={styles.localNote}>
        Every grade is saved in this browser. No account needed.
      </p>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

function SessionSummary({
  topicLabel,
  reviewedCount,
  stats,
  nothingWasDue,
  canContinue,
  panelRef,
  onContinue,
  onPickAnother,
  onExport,
}) {
  return (
    <section
      className={styles.summary}
      ref={panelRef}
      tabIndex={-1}
      aria-labelledby="revise-summary-title"
    >
      <span className={styles.summaryMark} aria-hidden="true">
        <CheckIcon />
      </span>

      <p className={styles.kicker}>{topicLabel}</p>

      <h1 id="revise-summary-title" className={styles.summaryTitle}>
        {nothingWasDue ? 'You’re caught up' : 'Session complete'}
      </h1>

      <p className={styles.summaryCopy}>
        {nothingWasDue
          ? `Nothing in ${topicLabel} is due right now. The schedule will bring questions back when they're ready.`
          : `${reviewedCount} question${
              reviewedCount === 1 ? '' : 's'
            } reviewed in ${topicLabel}. The schedule has already moved them forward.`}
      </p>

      <div className={styles.summaryStats}>
        <SummaryStat value={reviewedCount} label="Reviewed" />
        <SummaryStat value={stats.tracked} label="In rotation" />
        <SummaryStat value={stats.mature} label="Mature" />
        <SummaryStat value={stats.learning} label="Still learning" />
      </div>

      <div className={styles.summaryActions}>
        {!nothingWasDue && canContinue && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onContinue}
          >
            Keep going
            <span aria-hidden="true">→</span>
          </button>
        )}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onPickAnother}
        >
          Pick another topic
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onExport}
        >
          Export progress
        </button>
        {!canContinue && (
          <Link className={styles.secondaryLink} to="/drill">
            Run a drill
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <p className={styles.summaryNote}>
        Progress is stored locally. Export a backup before switching devices.
      </p>
    </section>
  );
}

function SummaryStat({ value, label }) {
  return (
    <div className={styles.summaryStat}>
      <span className={styles.summaryStatValue}>{value}</span>
      <span className={styles.summaryStatLabel}>{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />
    </svg>
  );
}
