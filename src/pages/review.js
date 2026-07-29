import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@theme/Layout';
import styles from './review.module.css';
import { createCardState, reviewCard, isDue, sortByUrgency } from '../lib/sm2';
import { loadProgress, saveProgress, exportProgress } from '../lib/storage';

// Grade labels and keyboard shortcuts
const GRADES = [
  { key: '1', grade: 0, label: 'Again', color: '#ff5f56' },
  { key: '2', grade: 1, label: 'Hard', color: '#ffbd2e' },
  { key: '3', grade: 2, label: 'Good', color: '#4fd1a5' },
  { key: '4', grade: 3, label: 'Easy', color: '#6fa8dc' },
];

function ReviewCard({ card, onGrade, revealed, onReveal }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardMeta}>
        <span className={styles.tier}>{card.tier}</span>
        <span className={styles.type}>{card.type}</span>
        {card.tags && card.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      <div className={styles.question}>
        <span className={styles.qLabel}>Q:</span> {card.q}
      </div>

      {!revealed ? (
        <button
          className={styles.revealBtn}
          onClick={onReveal}
          aria-label="Show answer (press Space)"
        >
          Show Answer
        </button>
      ) : (
        <div className={styles.answerSection}>
          <div className={styles.answer}>
            <span className={styles.aLabel}>A:</span> {card.a}
          </div>
          {card.why && (
            <div className={styles.why}>
              <strong>Why:</strong> {card.why}
            </div>
          )}
          <div className={styles.gradeButtons}>
            <p className={styles.gradePrompt}>How well did you recall this?</p>
            <div className={styles.grades}>
              {GRADES.map((g) => (
                <button
                  key={g.grade}
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
        </div>
      )}
    </div>
  );
}

function SessionComplete({ stats, onRestart }) {
  return (
    <div className={styles.complete}>
      <h2>Session Complete</h2>
      <p>No more cards due for review today.</p>
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.totalReviewed}</span>
          <span className={styles.statLabel}>Cards reviewed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.mature}</span>
          <span className={styles.statLabel}>Mature (21+ days)</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{stats.learning}</span>
          <span className={styles.statLabel}>Learning</span>
        </div>
      </div>
      <div className={styles.completeActions}>
        <button className={styles.actionBtn} onClick={onRestart}>
          Review New Cards
        </button>
        <button className={styles.actionBtnSecondary} onClick={exportProgress}>
          Export Progress
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const [allCards, setAllCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState(0);

  // Load cards and progress on mount
  useEffect(() => {
    async function init() {
      try {
        const resp = await fetch('/devops-interview-questions/cards.json');
        const data = await resp.json();
        setAllCards(data.cards.filter((c) => !c.deprecated));
      } catch (err) {
        console.error('Failed to load cards:', err);
      }
      setProgress(loadProgress());
      setLoading(false);
    }
    init();
  }, []);

  // Build review queue when cards/progress change
  useEffect(() => {
    if (allCards.length === 0) return;

    const states = allCards.map((card) => {
      return progress[card.id] || createCardState(card.id);
    });

    const dueCards = states.filter(isDue);
    const sorted = sortByUrgency(dueCards);

    // Map back to full card data
    const cardMap = Object.fromEntries(allCards.map((c) => [c.id, c]));
    const queueCards = sorted
      .map((s) => cardMap[s.id])
      .filter(Boolean);

    setQueue(queueCards);
    if (queueCards.length === 0 && !loading) {
      setSessionDone(true);
    }
  }, [allCards, progress, loading]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (sessionDone || queue.length === 0) return;

      if (!revealed && e.code === 'Space') {
        e.preventDefault();
        setRevealed(true);
        return;
      }

      if (revealed) {
        const gradeMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (e.key in gradeMap) {
          e.preventDefault();
          handleGrade(gradeMap[e.key]);
        }
      }
    },
    [revealed, queue, sessionDone]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function handleGrade(grade) {
    const card = queue[0];
    if (!card) return;

    const currentState = progress[card.id] || createCardState(card.id);
    const newState = reviewCard(currentState, grade);

    const newProgress = { ...progress, [card.id]: newState };
    setProgress(newProgress);
    saveProgress(newProgress);

    setReviewed((r) => r + 1);
    setRevealed(false);
    setQueue((q) => q.slice(1));

    if (queue.length <= 1) {
      setSessionDone(true);
    }
  }

  function handleRestart() {
    // Add unreviewed cards (new cards)
    const states = allCards.map((card) => {
      return progress[card.id] || createCardState(card.id);
    });
    const newCards = states.filter((s) => s.reps === 0);
    const cardMap = Object.fromEntries(allCards.map((c) => [c.id, c]));
    const newQueue = newCards.slice(0, 10).map((s) => cardMap[s.id]).filter(Boolean);

    if (newQueue.length > 0) {
      setQueue(newQueue);
      setSessionDone(false);
      setRevealed(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Review" description="Spaced repetition review for DevOps cards">
        <div className={styles.container}>
          <p>Loading cards...</p>
        </div>
      </Layout>
    );
  }

  const stats = {
    totalReviewed: Object.values(progress).filter((s) => s.reps > 0).length,
    mature: Object.values(progress).filter((s) => s.interval >= 21).length,
    learning: Object.values(progress).filter((s) => s.reps > 0 && s.interval < 21).length,
  };

  return (
    <Layout title="Review" description="Spaced repetition review for DevOps cards">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Daily Review</h1>
          <div className={styles.progress}>
            <span>{queue.length} cards remaining</span>
            <span className={styles.dot}>·</span>
            <span>{reviewed} reviewed this session</span>
          </div>
        </div>

        {sessionDone ? (
          <SessionComplete stats={stats} onRestart={handleRestart} />
        ) : queue.length > 0 ? (
          <>
            <ReviewCard
              card={queue[0]}
              revealed={revealed}
              onReveal={() => setRevealed(true)}
              onGrade={handleGrade}
            />
            <p className={styles.shortcutHint}>
              Space to reveal · 1-4 to grade
            </p>
          </>
        ) : (
          <p>No cards loaded.</p>
        )}
      </div>
    </Layout>
  );
}
