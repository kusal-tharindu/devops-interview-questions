import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import config from '@site/site.config';
import { loadAllCards } from '@site/src/lib/cardStore';
import CardBadges from '@site/src/components/CardBadges';
import CardAnswer from '@site/src/components/CardAnswer';
import TopicIcon from '@site/src/components/TopicIcon';
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

/** Plain-language hints for the three self-grades. */
const OUTCOME_HINTS = {
  wrong: 'No recall',
  unsure: 'Partial',
  correct: 'Clean',
};

/** Short labels for the session-length choices. */
const SIZE_NOTES = {
  10: 'Quick check',
  20: 'Standard set',
  30: 'Deep run',
  50: 'Marathon',
};

const TIER_COLORS = {
  core: 'var(--ifm-color-primary)',
  deep: '#6fa8dc',
  trivia: '#8b95a8',
};

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

/**
 * @param {number} seconds
 * @returns {string}
 */
function formatPace(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

/**
 * Readable topic name. Falls back to a title-cased slug so a new topic still
 * works without touching the drill page.
 *
 * @param {string} slug
 * @returns {string}
 */
function topicLabel(slug) {
  return (
    config.topics.labels[slug] ||
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  );
}

/**
 * @param {number} accuracy
 * @returns {string}
 */
function accuracyColor(accuracy) {
  if (accuracy >= 80) return '#4fd1a5';
  if (accuracy >= 50) return '#ffbd2e';
  return '#ff5f56';
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
  const [topicTally, setTopicTally] = useState({});
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

  const topicCounts = useMemo(() => {
    const counts = new Map();
    for (const card of eligibleCards) {
      counts.set(card.topic, (counts.get(card.topic) || 0) + 1);
    }
    const order = new Map(config.topics.order.map((slug, index) => [slug, index]));
    return [...counts.entries()].sort(
      (a, b) => (order.get(a[0]) ?? 999) - (order.get(b[0]) ?? 999)
    );
  }, [eligibleCards]);

  const tierCounts = useMemo(() => {
    const counts = {};
    for (const card of eligibleCards) {
      counts[card.tier] = (counts[card.tier] || 0) + 1;
    }
    return counts;
  }, [eligibleCards]);

  const startDrill = useCallback(() => {
    const selected = shuffle(eligibleCards).slice(0, size);
    setQueue(selected);
    setTotalCards(selected.length);
    setTally({});
    setTopicTally({});
    setElapsed(0);
    setRevealed(false);
    setPhase(selected.length > 0 ? Phase.RUNNING : Phase.SETUP);
  }, [eligibleCards, size]);

  const endDrill = useCallback(() => {
    setPhase(Phase.SETUP);
    setQueue([]);
    setRevealed(false);
    setElapsed(0);
    setTally({});
    setTopicTally({});
  }, []);

  const recordOutcome = useCallback(
    (outcomeId) => {
      const current = queue[0];

      if (current) {
        setTopicTally((previous) => {
          const existing = previous[current.topic] || {
            total: 0,
            wrong: 0,
            unsure: 0,
            correct: 0,
          };
          return {
            ...previous,
            [current.topic]: {
              ...existing,
              total: existing.total + 1,
              [outcomeId]: (existing[outcomeId] || 0) + 1,
            },
          };
        });
      }

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

      const tag = event.target?.tagName;
      // Let form fields keep their native keys.
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

      if (!revealed && event.code === config.keys.revealCode) {
        // Space should activate a focused button/link natively, not reveal.
        if (event.target instanceof Element && event.target.closest('button, a')) {
          return;
        }
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
    wrapperClassName: styles.page,
  };

  if (status === Status.LOADING) {
    return (
      <Layout {...pageMeta}>
        <main className={styles.shell}>
          <DrillMessage
            kicker="Interview drill"
            title="Loading the question bank"
          >
            <span className={styles.loadingDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </DrillMessage>
        </main>
      </Layout>
    );
  }

  if (status === Status.ERROR) {
    return (
      <Layout {...pageMeta}>
        <main className={styles.shell}>
          <DrillMessage
            kicker="Interview drill"
            title="The question bank did not load"
          >
            <p className={styles.messageText}>
              Something went wrong loading the questions. Refresh the page
              to try again.
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </DrillMessage>
        </main>
      </Layout>
    );
  }

  if (phase === Phase.SETUP) {
    return (
      <Layout {...pageMeta}>
        <main className={styles.shell}>
          <DrillSetup
            availableCount={eligibleCards.length}
            topicCounts={topicCounts}
            tierCounts={tierCounts}
            size={size}
            onSizeChange={setSize}
            includeAllTiers={includeAllTiers}
            onIncludeAllTiersChange={setIncludeAllTiers}
            showExplainBox={showExplainBox}
            onShowExplainBoxChange={setShowExplainBox}
            onStart={startDrill}
          />
        </main>
      </Layout>
    );
  }

  if (phase === Phase.RESULTS) {
    return (
      <Layout {...pageMeta}>
        <main className={styles.shell}>
          <DrillResults
            tally={tally}
            topicTally={topicTally}
            total={totalCards}
            elapsed={elapsed}
            onRestart={() => setPhase(Phase.SETUP)}
          />
        </main>
      </Layout>
    );
  }

  const answered = totalCards - queue.length;

  return (
    <Layout {...pageMeta}>
      <main className={styles.shell}>
        <h1 className={styles.srOnly}>Interview drill</h1>

        <SessionBar
          answered={answered}
          total={totalCards}
          elapsed={elapsed}
          onEnd={endDrill}
        />

        <DrillCard
          card={queue[0]}
          revealed={revealed}
          showExplainBox={showExplainBox}
          onReveal={() => setRevealed(true)}
          onOutcome={recordOutcome}
        />

        <p className={styles.hint}>
          {revealed ? (
            <>
              <kbd>1</kbd>
              <kbd>2</kbd>
              <kbd>3</kbd> grade this card
            </>
          ) : (
            <>
              <kbd>Space</kbd> to reveal the answer
            </>
          )}
        </p>
      </main>
    </Layout>
  );
}

/* -------------------------------------------------------------------------- */
/* Setup                                                                      */
/* -------------------------------------------------------------------------- */

function DrillSetup({
  availableCount,
  topicCounts,
  tierCounts,
  size,
  onSizeChange,
  includeAllTiers,
  onIncludeAllTiersChange,
  showExplainBox,
  onShowExplainBoxChange,
  onStart,
}) {
  const tiers = config.cards.tiers.filter((tier) => (tierCounts[tier.id] || 0) > 0);

  return (
    <section className={styles.setup}>
      <header className={styles.masthead}>
        <h1 className={styles.title}>Interview drill</h1>
        <p className={styles.lede}>
          A timed, shuffled set across every topic, closer to how a real
          interview jumps around. Grade yourself, then see where you stand.
        </p>
      </header>

      <div className={styles.setupGrid}>
        <aside className={styles.brief}>
          <p className={styles.panelLabel}>The brief</p>

          <ol className={styles.briefList}>
            <li>
              <span className={styles.briefNumber} aria-hidden="true">
                01
              </span>
              <div>
                <h2>Mixed</h2>
                <p>
                  Questions jump between topics, the way a real interview does.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.briefNumber} aria-hidden="true">
                02
              </span>
              <div>
                <h2>Timed</h2>
                <p>
                  The clock starts with the first card. Think it through, then
                  grade yourself.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.briefNumber} aria-hidden="true">
                03
              </span>
              <div>
                <h2>No schedule</h2>
                <p>
                  Drill results never touch Revise. Cramming should not distort
                  your spacing.
                </p>
              </div>
            </li>
          </ol>

          <div className={styles.pool}>
            <div className={styles.poolHead}>
              <span className={styles.panelLabel}>In the pool</span>
              <span className={styles.poolTotal}>{availableCount}</span>
            </div>

            <div className={styles.topicChips}>
              {topicCounts.map(([slug, count]) => (
                <span className={styles.topicChipSmall} key={slug}>
                  <TopicIcon slug={slug} />
                  {topicLabel(slug)}
                  <b>{count}</b>
                </span>
              ))}
            </div>

            {tiers.length > 0 && (
              <div
                className={styles.tierBar}
                role="img"
                aria-label={tiers
                  .map((tier) => `${tierCounts[tier.id]} ${tier.label.toLowerCase()}`)
                  .join(', ')}
              >
                {tiers.map((tier) => (
                  <span
                    key={tier.id}
                    className={styles.tierSegment}
                    style={{
                      width: `${(tierCounts[tier.id] / availableCount) * 100}%`,
                      background: TIER_COLORS[tier.id] || 'rgba(230,237,246,.3)',
                    }}
                  />
                ))}
              </div>
            )}

            <p className={styles.poolNote}>
              {tiers.map((tier) => `${tierCounts[tier.id]} ${tier.label.toLowerCase()}`).join(' · ')}
            </p>
          </div>
        </aside>

        <div className={styles.configPanel}>
          <div className={styles.configHead}>
            <div>
              <p className={styles.panelLabel}>Session setup</p>
              <h2>Set the length</h2>
            </div>
          </div>

          <div className={styles.field}>
            <p className={styles.fieldLabel} id="drill-length-label">
              Questions
            </p>
            <div
              className={styles.sizeGrid}
              role="group"
              aria-labelledby="drill-length-label"
            >
              {config.drill.sizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    size === option.value
                      ? `${styles.sizeOption} ${styles.sizeOptionActive}`
                      : styles.sizeOption
                  }
                  aria-pressed={size === option.value}
                  onClick={() => onSizeChange(option.value)}
                >
                  <span className={styles.sizeValue}>{option.value}</span>
                  <span className={styles.sizeLabel}>
                    {SIZE_NOTES[option.value] || 'Questions'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.switchList}>
            <Toggle
              id="drill-all-tiers"
              title="Include trivia"
              description="The obscure stuff. Off by default."
              checked={includeAllTiers}
              onChange={onIncludeAllTiersChange}
            />
            <Toggle
              id="drill-explain-box"
              title="Explain-it-back box"
              description="Write the idea first on concept cards, then reveal."
              checked={showExplainBox}
              onChange={onShowExplainBoxChange}
            />
          </div>

          <div className={styles.configFoot}>
            <p className={styles.poolCount}>
              {availableCount} question{availableCount === 1 ? '' : 's'} available
              {!includeAllTiers && <span> · core + deep</span>}
            </p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={onStart}
              disabled={availableCount === 0}
            >
              Start {size}-question drill
              <span aria-hidden="true">→</span>
            </button>

            {availableCount === 0 && (
              <p className={styles.emptyNote}>
                No questions at this tier yet. Include trivia or add content.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Toggle({ id, title, description, checked, onChange }) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <span className={styles.toggleCopy}>
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.toggleTrack} aria-hidden="true">
        <span className={styles.toggleThumb} />
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Running                                                                    */
/* -------------------------------------------------------------------------- */

function SessionBar({ answered, total, elapsed, onEnd }) {
  const position = Math.min(answered + 1, total);
  const progress = total > 0 ? (position / total) * 100 : 0;

  return (
    <div className={styles.sessionBar}>
      <div className={styles.sessionTop}>
        <div className={styles.sessionProgress}>
          <span className={styles.sessionLabel}>Question</span>
          <span className={styles.sessionCount}>
            {String(position).padStart(2, '0')}
            <span> / {String(total).padStart(2, '0')}</span>
          </span>
        </div>

        <div className={styles.sessionRight}>
          <span
            className={styles.timer}
            aria-label={`Elapsed ${formatDuration(elapsed)}`}
          >
            <ClockIcon />
            {formatDuration(elapsed)}
          </span>
          <button type="button" className={styles.endButton} onClick={onEnd}>
            End drill
          </button>
        </div>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Drill progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={position}
      >
        <span className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function DrillCard({ card, revealed, showExplainBox, onReveal, onOutcome }) {
  const [explanation, setExplanation] = useState('');
  const cardId = card?.id;

  // Clear the draft when the question changes.
  useEffect(() => {
    setExplanation('');
  }, [cardId]);

  if (!card) return null;

  const wantsExplanation =
    showExplainBox && (card.type === 'concept' || card.type === 'elaborative');

  return (
    <article className={styles.card}>
      <div className={styles.cardMeta}>
        <span className={styles.topicChip}>
          <TopicIcon slug={card.topic} />
          {topicLabel(card.topic)}
        </span>
        <CardBadges tier={card.tier} type={card.type} tags={card.tags} maxTags={2} />
      </div>

      <div className={styles.questionBlock}>
        <span className={styles.questionKicker}>Question</span>
        <p className={styles.question}>{card.q}</p>
      </div>

      {!revealed && wantsExplanation && (
        <div className={styles.explainBox}>
          <label className={styles.explainLabel} htmlFor={`explain-${card.id}`}>
            Explain it back, in your own words
            <span className={styles.optional}>optional</span>
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
                <strong>What you wrote</strong>
                <span>{explanation}</span>
              </div>
            )}
          </CardAnswer>

          <div className={styles.outcomeSection}>
            <p className={styles.outcomePrompt}>How did that go?</p>
            <div className={styles.outcomes}>
              {config.drill.outcomes.map((outcome, index) => (
                <button
                  key={outcome.id}
                  type="button"
                  className={styles.outcomeButton}
                  style={{ '--outcome-color': outcome.color }}
                  onClick={() => onOutcome(outcome.id)}
                  aria-label={`${outcome.label} — ${OUTCOME_HINTS[outcome.id] || ''} (press ${index + 1})`}
                >
                  <span className={styles.outcomeKey}>{index + 1}</span>
                  <span className={styles.outcomeLabel}>{outcome.label}</span>
                  <span className={styles.outcomeHint}>
                    {OUTCOME_HINTS[outcome.id] || 'Grade'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className={styles.revealButton} onClick={onReveal}>
          <span>Show answer</span>
          <kbd className={styles.kbd}>Space</kbd>
        </button>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Results                                                                    */
/* -------------------------------------------------------------------------- */

function DrillResults({ tally, topicTally, total, elapsed, onRestart }) {
  const correct = tally.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perQuestion = total > 0 ? Math.max(1, Math.round(elapsed / total)) : 0;
  const ringColor = accuracyColor(accuracy);

  const topicRows = Object.entries(topicTally)
    .map(([slug, counts]) => ({
      slug,
      label: topicLabel(slug),
      ...counts,
      accuracy:
        counts.total > 0 ? Math.round((counts.correct / counts.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <section className={styles.results}>
      <header className={styles.resultsHead}>
        <p className={styles.kicker}>Interview drill</p>
        <h1 className={styles.title}>Drill complete</h1>
        <p className={styles.lede}>
          Nothing was written to your review schedule. Use this as a snapshot of
          where you are today, not a scorecard.
        </p>
      </header>

      <div className={styles.summaryGrid}>
        <div className={styles.ringCard}>
          <div
            className={styles.ring}
            style={{ '--ring-color': ringColor, '--ring-value': `${accuracy}%` }}
            role="img"
            aria-label={`${accuracy} percent accuracy`}
          >
            <div className={styles.ringInner}>
              <strong>
                {accuracy}
                <span>%</span>
              </strong>
              <span className={styles.ringLabel}>accuracy</span>
            </div>
          </div>
          <p className={styles.ringNote}>
            {correct} of {total} correct
          </p>
        </div>

        <div className={styles.statGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Time</span>
            <strong>{formatDuration(elapsed)}</strong>
            <small>total</small>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Pace</span>
            <strong>{formatPace(perQuestion)}</strong>
            <small>per question</small>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Questions</span>
            <strong>{total}</strong>
            <small>answered</small>
          </div>
        </div>
      </div>

      <div className={styles.breakdownGrid}>
        <section className={styles.breakdownCard}>
          <div className={styles.breakdownHead}>
            <p className={styles.panelLabel}>Outcomes</p>
            <span className={styles.breakdownMeta}>{total} graded</span>
          </div>
          {config.drill.outcomes.map((outcome) => {
            const count = tally[outcome.id] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div className={styles.outcomeRow} key={outcome.id}>
                <span
                  className={styles.outcomeDot}
                  style={{ background: outcome.color }}
                  aria-hidden="true"
                />
                <span className={styles.outcomeName}>{outcome.label}</span>
                <span className={styles.outcomeCount}>{count}</span>
                <div className={styles.outcomeTrack}>
                  <span
                    style={{ width: `${percent}%`, background: outcome.color }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {topicRows.length > 0 && (
          <section className={styles.breakdownCard}>
            <div className={styles.breakdownHead}>
              <p className={styles.panelLabel}>By topic</p>
              <span className={styles.breakdownMeta}>weakest first</span>
            </div>
            {topicRows.map((row) => (
              <div className={styles.topicRow} key={row.slug}>
                <span className={styles.topicName}>
                  <TopicIcon slug={row.slug} />
                  {row.label}
                </span>
                <span className={styles.topicScore}>
                  {row.correct}/{row.total}
                </span>
                <div className={styles.topicTrack}>
                  <span
                    style={{
                      width: `${row.accuracy}%`,
                      background: accuracyColor(row.accuracy),
                    }}
                  />
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className={styles.resultsActions}>
        <button type="button" className={styles.primaryButton} onClick={onRestart}>
          Run another drill
          <span aria-hidden="true">→</span>
        </button>
        <Link className={styles.secondaryButton} to="/revise">
          Review due cards
        </Link>
        <Link className={styles.textLink} to="/">
          Back to the library
        </Link>
      </div>

      <p className={styles.resultsNote}>
        Drill never writes to your SM-2 schedule.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Small shared pieces                                                        */
/* -------------------------------------------------------------------------- */

function DrillMessage({ kicker, title, children }) {
  return (
    <section className={styles.message}>
      <p className={styles.kicker}>{kicker}</p>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.messageBody}>{children}</div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.6V8l2.2 1.3" />
    </svg>
  );
}
