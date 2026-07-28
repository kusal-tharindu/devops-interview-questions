import React, { useEffect, useState } from 'react';
import styles from './TerminalHero.module.css';

// Sample prompts, purely decorative and hardcoded (no user input, no
// external data), so this component has no injection surface.
const PROMPTS = [
  'Q: What is the difference between a Docker image and a container?',
  'Q: What is an inode in Linux?',
  'Q: What is Terraform state and why is it important?',
  'Q: How do you handle errors in a Bash script?',
];

const TYPE_SPEED_MS = 40;
const PAUSE_MS = 1800;

export default function TerminalHero() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    const current = PROMPTS[promptIndex];
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, TYPE_SPEED_MS);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), PAUSE_MS);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 200);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length - 1));
        }, TYPE_SPEED_MS / 2);
      } else {
        setPromptIndex((i) => (i + 1) % PROMPTS.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, promptIndex]);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <span className={styles.dot} style={{ background: '#ff5f56' }} />
        <span className={styles.dot} style={{ background: '#ffbd2e' }} />
        <span className={styles.dot} style={{ background: '#27c93f' }} />
        <span className={styles.terminalTitle}>interview-prep.sh</span>
      </div>
      <div className={styles.terminalBody}>
        <span className={styles.promptSymbol}>$</span>{' '}
        <span>{displayed}</span>
        <span className={styles.cursor}>&nbsp;</span>
      </div>
    </div>
  );
}
