import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

/**
 * Thin reading-progress rail pinned under the navbar.
 *
 * Progress is measured against the article, not the whole document, so the
 * footer and pagination do not make the bar jump around near the end.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return undefined;

    const update = () => {
      frame.current = 0;
      const top = window.scrollY + article.getBoundingClientRect().top;
      const height = article.offsetHeight;
      const start = top - 120;
      const end = top + height - window.innerHeight + 120;
      const span = Math.max(1, end - start);
      const next = Math.min(1, Math.max(0, (window.scrollY - start) / span));
      setProgress(next);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <span
        className={styles.fill}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
