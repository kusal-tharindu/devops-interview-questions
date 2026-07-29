import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@theme/Layout';
import styles from './drill.module.css';

const GRADES = [
  { key: '1', label: 'Wrong', color: '#ff5f56' },
  { key: '2', label: 'Unsure', color: '#ffbd2e' },
  { key: '3', label: 'Correct', color: '#4fd1a5' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DrillCard({ card, revealed, onReveal, onNext, showExplain }) {
  const [explanation, setExplanation] = useState('');

  return (
    <div className={styles.card}>
      <div className={styles.cardMeta}>
        {card.tags && card.tags.slice(0, 3).map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      <div className={styles.question}>
        <span className={styles.qLabel}>Q:</span> {card.q}
      </div>

      {!revealed && showExplain && (card.type === 'concept' || card.type === 'elaborative') && (
        <div className={styles.explainBox}>
          <label className={styles.explainLabel}>Explain it back (optional):</label>
          <textarea
            className={styles.explainInput}
            placeholder="Write your explanation in plain language..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
          />
        </div>
      )}

      {!revealed ? (
        <button className={styles.revealBtn} onClick={onReveal}>
          Show Answer
        </button>
      ) : (
        <div className={styles.answerSection}>
          <div className={styles.answer}>
            <span className={styles.aLabel}>A:</span> {card.a}
          </div>
          {card.why && (
            <div className={styles.why}>{card.why}</div>
          )}
          {explanation && (
            <div className={styles.yourExplain}>
              <strong>Your explanation:</strong> {explanation}
            </div>
          )}
          <div className={styles.gradeButtons}>
            {GRADES.map((g) => (
              <button
                key={g.key}
                className={styles.gradeBtn}
                style={{ borderColor: g.color, color: g.color }}
                onClick={() => { setExplanation(''); onNext(g.key); }}
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

export default function DrillPage() {
  const [allCards, setAllCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, unsure: 0, wrong: 0 });
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const [cardCount, setCardCount] = useState(20);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const resp = await fetch('/devops-interview-questions/cards.json');
        const data = await resp.json();
        setAllCards(data.cards.filter((c) => !c.deprecated));
      } catch (err) {
        console.error('Failed to load cards:', err);
      }
      setLoading(false);
    }
    init();
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!started || queue.length === 0) return;
    if (!revealed && e.code === 'Space') {
      e.preventDefault();
      setRevealed(true);
      return;
    }
    if (revealed && ['1', '2', '3'].includes(e.key)) {
      e.preventDefault();
      handleNext(e.key);
    }
  }, [revealed, queue, started]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function startDrill() {
    const shuffled = shuffle(allCards).slice(0, cardCount);
    setQueue(shuffled);
    setTotal(shuffled.length);
    setScore({ correct: 0, unsure: 0, wrong: 0 });
    setTimer(0);
    setRunning(true);
    setStarted(true);
    setRevealed(false);
  }

  function handleNext(grade) {
    if (grade === '3') setScore((s) => ({ ...s, correct: s.correct + 1 }));
    else if (grade === '2') setScore((s) => ({ ...s, unsure: s.unsure + 1 }));
    else setScore((s) => ({ ...s, wrong: s.wrong + 1 }));

    setRevealed(false);
    setQueue((q) => q.slice(1));

    if (queue.length <= 1) {
      setRunning(false);
    }
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <Layout title="Interview Drill" description="Timed interview simulation drill">
        <div className={styles.container}><p>Loading...</p></div>
      </Layout>
    );
  }

  // Setup screen
  if (!started) {
    return (
      <Layout title="Interview Drill" description="Timed interview simulation drill">
        <div className={styles.container}>
          <div className={styles.setup}>
            <h1>Interview Drill</h1>
            <p className={styles.setupDesc}>
              Timed, mixed-topic drill that simulates a real interview. No scheduling side effects — purely for practice.
            </p>
            <div className={styles.setupOptions}>
              <label className={styles.optLabel}>
                Cards:
                <select
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  className={styles.select}
                >
                  <option value={10}>10 (Quick)</option>
                  <option value={20}>20 (Standard)</option>
                  <option value={30}>30 (Deep)</option>
                  <option value={50}>50 (Marathon)</option>
                </select>
              </label>
              <label className={styles.optLabel}>
                <input
                  type="checkbox"
                  checked={showExplain}
                  onChange={(e) => setShowExplain(e.target.checked)}
                  className={styles.checkbox}
                />
                Show "explain it back" box
              </label>
            </div>
            <button className={styles.startBtn} onClick={startDrill}>
              Start Drill
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Results screen
  if (queue.length === 0 && started) {
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <Layout title="Drill Results" description="Interview drill results">
        <div className={styles.container}>
          <div className={styles.results}>
            <h2>Drill Complete</h2>
            <div className={styles.resultTime}>{formatTime(timer)}</div>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultNum} style={{ color: '#4fd1a5' }}>{score.correct}</span>
                <span>Correct</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultNum} style={{ color: '#ffbd2e' }}>{score.unsure}</span>
                <span>Unsure</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultNum} style={{ color: '#ff5f56' }}>{score.wrong}</span>
                <span>Wrong</span>
              </div>
            </div>
            <div className={styles.resultPct}>{pct}% accuracy</div>
            <button className={styles.startBtn} onClick={() => { setStarted(false); }}>
              New Drill
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Active drill
  return (
    <Layout title="Interview Drill" description="Timed interview simulation">
      <div className={styles.container}>
        <div className={styles.drillHeader}>
          <span className={styles.progress}>
            {total - queue.length + 1} / {total}
          </span>
          <span className={styles.timer}>{formatTime(timer)}</span>
        </div>
        <DrillCard
          card={queue[0]}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onNext={handleNext}
          showExplain={showExplain}
        />
        <p className={styles.hint}>Space to reveal · 1-3 to grade</p>
      </div>
    </Layout>
  );
}
