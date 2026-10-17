import React from 'react';
import Link from '@docusaurus/Link';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

import { parseTheoryDocId } from '@site/src/lib/theoryPage';
import styles from './styles.module.css';

/**
 * Automatic article header for every topic page.
 *
 * Authors write front matter and markdown; this renders the title, description,
 * reading metadata and the Theory/Practice switch. No page-level imports or
 * duplicated H1 are needed in the markdown.
 */

function TheoryIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 2.5h7.5A2.5 2.5 0 0 1 13 5v9H5.5A2.5 2.5 0 0 1 3 11.5v-9Z" />
      <path d="M3 11.5A2.5 2.5 0 0 1 5.5 9H13" />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.75 1.5 3.5 9h3.4l-.65 5.5L12.5 7H8.9l-.15-5.5Z" />
    </svg>
  );
}

function ModeSwitch({ mode, info }) {
  const { theoryHref, qaHref, questionCount } = info;

  return (
    <div className={styles.switch} role="group" aria-label="Theory and practice">
      <Link
        to={theoryHref}
        className={
          mode === 'theory'
            ? `${styles.segment} ${styles.segmentActive}`
            : styles.segment
        }
        aria-current={mode === 'theory' ? 'page' : undefined}
      >
        <TheoryIcon />
        <span>Theory</span>
      </Link>

      <Link
        to={qaHref}
        className={
          mode === 'practice'
            ? `${styles.segment} ${styles.segmentActive}`
            : styles.segment
        }
        aria-current={mode === 'practice' ? 'page' : undefined}
        aria-label={`Practice — ${questionCount} questions`}
      >
        <PracticeIcon />
        <span>Practice</span>
        {questionCount != null && (
          <span className={styles.count}>{questionCount}</span>
        )}
      </Link>
    </div>
  );
}

export default function TheoryHeader() {
  const { metadata, frontMatter } = useDoc();
  const info = parseTheoryDocId(metadata.id);

  if (!info) return null;

  const { isQa, label, page, hasPractice, questionCount } = info;

  const title = isQa
    ? page?.title || metadata.title.replace(/\s*—\s*Practice$/, '')
    : metadata.title;

  const description = isQa
    ? hasPractice
      ? `${questionCount} questions from this page. Answer first, then reveal.`
      : 'Questions for this page, answered from memory.'
    : frontMatter.description || '';

  const minutes =
    !isQa && page?.readingMinutes
      ? page.readingMinutes
      : !isQa && typeof metadata.readingTime === 'number'
        ? Math.max(1, Math.round(metadata.readingTime))
        : null;

  const topicHref = info.topic?.firstDocId ? `/${info.topic.firstDocId}` : '/';

  return (
    <header className={styles.header} data-mode={isQa ? 'practice' : 'theory'}>
      <div className={styles.kicker}>
        <Link className={styles.topicLink} to={topicHref}>
          {label}
        </Link>
        <span className={styles.slash} aria-hidden="true">
          /
        </span>
        <span className={styles.mode}>{isQa ? 'Practice' : 'Theory'}</span>
      </div>

      <h1 className={styles.title}>{title}</h1>

      {description && <p className={styles.lede}>{description}</p>}

      {(minutes != null || hasPractice) && (
        <div className={styles.metaRow}>
          {minutes != null && <span>{minutes} min read</span>}
          {minutes != null && hasPractice && (
            <span className={styles.metaDot} aria-hidden="true" />
          )}
          {hasPractice && (
            <span>
              {questionCount} question{questionCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      )}

      {hasPractice && <ModeSwitch mode={isQa ? 'practice' : 'theory'} info={info} />}
    </header>
  );
}
