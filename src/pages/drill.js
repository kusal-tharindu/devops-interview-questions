import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import config from '@site/site.config';
import { loadAllCards } from '@site/src/lib/cardStore';
import CardBadges from '@site/src/components/CardBadges';
import CardAnswer from '@site/src/components/CardAnswer';
import styles from './drill.module.css';

/**
 * Drill: timed, mixed-topic cramming.
 *
 * Interleaved by design — a real interview jumps between Terraform, Linux and
 * troubleshooting, and blocked practice produces worse transfer than mixed.
 *
 * Deliberately does NOT write to the SM-2 schedule (config.drill.affectsSchedule).
 * Cram-session grades are low-quality signal and would distort long-term
 * intervals built up in Revise.
 */

const Status = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
});

const Phase = Object.freeze({
  SETUP: 'setup',
  RUNNING: 'running',
  RESULTS: 'results',
});

/** Tiers that appear in a drill unless the learner opts in to the rest. */
const DEFAULT_DRILL_TIERS = config.cards.tiers
  .filter((tier) => tier.defaultInDrill)
  .map((tier) => tier.id);

const OUTCOME_BY_KEY = new Map(
  config.drill.outcomes.map((outcome, index) => [String(index + 1), outcome.id])
);

/**
 * Fisher-Yates shuffle.
 *
 * @template T
 * @param {T[]} items
 * @returns {T[]} New shuffled array.
 */
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * @param {number} totalSeconds
 * @returns {string} m:ss
 */
function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function DrillPage() {
  const [allCards, setAllCards] = useState([]);
  const [status, setStatus] = useState(Status.LOADING);

  const [phase, setPhase] = useState(Phase.SETUP);
  const [size, setSize] = useState(config.drill.defaultSize);
  const [includeAllTiers, setIncludeAllTiers] = useState(false);
  const [showExplainBox, setShowExplainBox] = useState(true);

  const [queue, setQueue] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState({});
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loadAllCards()
      .then((cards) => {
        if (cancelled) return;
        setAllCards(cards);
        setStatus(Status.READY);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('Drill could not load cards:', error?.message);
        setStatus(Status.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Timer runs only while questions remain.
  useEffect(() => {
    if (phase !== Phase.RUNNING) return undefined;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const eligibleCards = useMemo(() => {
    if (includeAllTiers) return allCards;
    return allCards.filter((card) => DEFAULT_DRILL_TIERS.includes(card.tier));
  }, [allCards, includeAllTiers]);

  const startDrill = useCallback(() => {
    const selected = shuffle(eligibleCards).slice(0, size);
    setQueue(selected);
    setTotalCards(selected.length);
    setTally({});
    setElapsed(0);
    setRevealed(false);
    setPhase(selected.length > 0 ? Phase.RUNNING : Phase.SETUP);
  }, [eligibleCards, size]);

  const recordOutcome = useCallback(
    (outcomeId) => {
      setTally((previous) => ({
        ...previous,
        [outcomeId]: (previous[outcomeId] || 0) + 1,
      }));
      setRevealed(false);

      const remaining = queue.slice(1);
      setQueue(remaining);
      if (remaining.length === 0) setPhase(Phase.RESULTS);
    },
    [queue]
  );

  useEffect(() => {
    if (phase !== Phase.RUNNING) return undefined;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Let the explain-it-back textarea take the spacebar.
      if (event.target instanceof HTMLTextAreaElement) return;

      if (!revealed && event.code === config.keys.revealCode) {
        event.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && OUTCOME_BY_KEY.has(event.key)) {
        event.preventDefault();
        recordOutcome(OUTCOME_BY_KEY.get(event.key));
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [phase, revealed, recordOutcome]);

  const pageMeta = {
    title: 'Interview Drill',
    description:
      'Timed, mixed-topic DevOps drill. Simulates the jump between topics in a real interview.',
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

  if (phase === Phase.SETUP) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <DrillSetup
            availableCount={eligibleCards.length}
            size={size}
            onSizeChange={setSize}
            includeAllTiers={includeAllTiers}
            onIncludeAllTiersChange={setIncludeAllTiers}
            showExplainBox={showExplainBox}
            onShowExplainBoxChange={setShowExplainBox}
            onStart={startDrill}
          />
        </div>
      </Layout>
    );
  }

  if (phase === Phase.RESULTS) {
    return (
      <Layout {...pageMeta}>
        <div className={styles.container}>
          <DrillResults
            tally={tally}
            total={totalCards}
            elapsed={elapsed}
            onRestart={() => setPhase(Phase.SETUP)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout {...pageMeta}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.progress}>
            {totalCards - queue.length + 1} / {totalCards}
          </span>
          <span className={styles.timer}>{formatDuration(elapsed)}</span>
        </header>

        <DrillCard
          card={queue[0]}
          revealed={revealed}
          showExplainBox={showExplainBox}
          onReveal={() => setRevealed(true)}
          onOutcome={recordOutcome}
        />

        <p className={styles.hint}>
          {config.keys.reveal} to reveal · {config.keys.drillGradeHint}
        </p>
      </div>
    </Layout>
  );
}

/**
 * @param {object} props
 * @param {number} props.availableCount
 * @param {number} props.size
 * @param {(size: number) => void} props.onSizeChange
 * @param {boolean} props.includeAllTiers
 * @param {(value: boolean) => void} props.onIncludeAllTiersChange
 * @param {boolean} props.showExplainBox
 * @param {(value: boolean) => void} props.onShowExplainBoxChange
 * @param {() => void} props.onStart
 */
function DrillSetup({
  availableCount,
  size,
  onSizeChange,
  includeAllTiers,
  onIncludeAllTiersChange,
  showExplainBox,
  onShowExplainBoxChange,
  onStart,
}) {
  return (
    <section className={styles.setup}>
      <h1>Interview Drill</h1>
      <p className={styles.setupDescription}>
        Timed, all topics mixed, random order — the way a real interview moves.
        Nothing here affects your Revise schedule.
      </p>

      <div className={styles.options}>
        <label className={styles.option} htmlFor="drill-size">
          Questions
          <select
            id="drill-size"
            className={styles.select}
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
          >
            {config.drill.sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={includeAllTiers}
            onChange={(event) => onIncludeAllTiersChange(event.target.checked)}
          />
          Include trivia-tier questions
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={showExplainBox}
            onChange={(event) => onShowExplainBoxChange(event.target.checked)}
          />
          Show &ldquo;explain it back&rdquo; box
        </label>
      </div>

      <p className={styles.poolNote}>{availableCount} questions in the pool</p>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={onStart}
        disabled={availableCount === 0}
      >
        Start drill
      </button>
    </section>
  );
}

/**
 * A single drill question.
 *
 * The explain-it-back box is the Feynman step: writing an explanation in your
 * own words before revealing turns a passive reveal into active generation.
 * Nothing is graded or stored — it exists to surface your own vagueness.
 *
 * @param {object} props
 * @param {object} props.card
 * @param {boolean} props.revealed
 * @param {boolean} props.showExplainBox
 * @param {() => void} props.onReveal
 * @param {(outcomeId: string) => void} props.onOutcome
 */
function DrillCard({ card, revealed, showExplainBox, onReveal, onOutcome }) {
  const [explanation, setExplanation] = useState('');

  // Clear the draft when the question changes.
  useEffect(() => {
    setExplanation('');
  }, [card.id]);

  const wantsExplanation =
    showExplainBox && (card.type === 'concept' || card.type === 'elaborative');

  return (
    <article className={styles.card}>
      <CardBadges tier={card.tier} type={card.type} tags={card.tags} maxTags={2} />

      <p className={styles.question}>
        <span className={styles.questionLabel}>Q:</span> {card.q}
      </p>

      {!revealed && wantsExplanation && (
        <div className={styles.explainBox}>
          <label className={styles.explainLabel} htmlFor={`explain-${card.id}`}>
            Explain it back, in your own words (optional)
          </label>
          <textarea
            id={`explain-${card.id}`}
            className={styles.explainInput}
            rows={3}
            value={explanation}
            placeholder="If you cannot say it simply, you do not know it well enough yet."
            onChange={(event) => setExplanation(event.target.value)}
          />
        </div>
      )}

      {revealed ? (
        <div className={styles.answerPanel}>
          <CardAnswer card={card}>
            {explanation.trim() && (
              <div className={styles.yourExplanation}>
                <strong>What you wrote:</strong> {explanation}
              </div>
            )}
          </CardAnswer>

          <div className={styles.outcomes}>
            {config.drill.outcomes.map((outcome, index) => (
              <button
                key={outcome.id}
                type="button"
                className={styles.outcomeButton}
                style={{ borderColor: outcome.color, color: outcome.color }}
                onClick={() => onOutcome(outcome.id)}
                aria-label={`${outcome.label} (press ${index + 1})`}
              >
                <span className={styles.outcomeKey}>{index + 1}</span>
                {outcome.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button type="button" className={styles.revealButton} onClick={onReveal}>
          Show Answer
        </button>
      )}
    </article>
  );
}

/**
 * @param {object} props
 * @param {Record<string, number>} props.tally
 * @param {number} props.total
 * @param {number} props.elapsed
 * @param {() => void} props.onRestart
 */
function DrillResults({ tally, total, elapsed, onRestart }) {
  const correct = tally.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perQuestion = total > 0 ? Math.round(elapsed / total) : 0;

  return (
    <section className={styles.results}>
      <h2>Drill complete</h2>
      <p className={styles.resultsTime}>{formatDuration(elapsed)}</p>
      <p className={styles.resultsPace}>
        about {perQuestion}s per question
      </p>

      <div className={styles.resultsGrid}>
        {config.drill.outcomes.map((outcome) => (
          <div key={outcome.id} className={styles.resultItem}>
            <span className={styles.resultValue} style={{ color: outcome.color }}>
              {tally[outcome.id] || 0}
            </span>
            <span className={styles.resultLabel}>{outcome.label}</span>
          </div>
        ))}
      </div>

      <p className={styles.accuracy}>{accuracy}% accuracy</p>

      <button type="button" className={styles.primaryButton} onClick={onRestart}>
        New drill
      </button>
    </section>
  );
}
