import React from 'react';
import Link from '@docusaurus/Link';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

import { parseTheoryDocId } from '@site/src/lib/theoryPage';
import styles from './styles.module.css';

/**
 * End-of-article nudge. Reading a theory page is the setup; recalling it is
 * what makes it stick, so the practice route is offered again after the last
 * section — where a reader who has actually finished is most likely to take it.
 */
export default function TheoryPracticeCTA() {
  const { metadata } = useDoc();
  const info = parseTheoryDocId(metadata.id);

  if (!info || info.isQa || !info.hasPractice) return null;

  const { page, qaHref, questionCount } = info;
  const pageTitle = page?.title || 'this page';

  return (
    <aside className={styles.cta} aria-label="Practice this page">
      <div className={styles.copy}>
        <span className={styles.kicker}>Self-test</span>
        <h2 className={styles.title}>Practice this page</h2>
        <p className={styles.text}>
          {questionCount} question{questionCount === 1 ? '' : 's'} from{' '}
          {pageTitle}. Answer first, then reveal.
        </p>
      </div>

      <Link className={styles.action} to={qaHref}>
        Start practice
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
