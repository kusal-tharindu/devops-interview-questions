import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import config from '@site/site.config';
import TopicIcon from '@site/src/components/TopicIcon';
import TerminalHero from '@site/src/components/TerminalHero';
import topicStats from '@site/src/data/topics.json';

import styles from './index.module.css';

/**
 * Landing page.
 *
 * Stats and the topic grid come from the generated topics.json, so the numbers
 * can never drift from the actual content. The three study modes are described
 * here in the same order the navbar presents them.
 */

/** The three study modes, in the order a learner meets them. */
const STUDY_MODES = [
  {
    step: '01',
    title: 'Learn',
    description:
      'Pick a topic. Read the theory with diagrams, then work through its questions at your own pace.',
    to: '/intro',
    cta: 'Browse topics',
  },
  {
    step: '02',
    title: 'Revise',
    description:
      'Test yourself on one tech stack. Your grades quietly build a spaced schedule underneath.',
    to: '/revise',
    cta: 'Start revising',
  },
  {
    step: '03',
    title: 'Drill',
    description:
      'Timed, all topics mixed, random order. Cram the night before an interview.',
    to: '/drill',
    cta: 'Run a drill',
  },
];

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <p className={styles.badge}>Open Source · Free Forever</p>

        <Heading as="h1" className="hero__title">
          Master DevOps Fundamentals
        </Heading>

        <p className="hero__subtitle">
          Study the theory, then prove you remember it. Spaced repetition built in.
        </p>

        <div className={styles.buttons}>
          <Link className={styles.btnPrimary} to="/revise">
            Start Revising
          </Link>
          <Link className={styles.btnSecondary} to="/intro">
            Browse Topics
          </Link>
        </div>

        <TerminalHero />
      </div>
    </header>
  );
}

function StatsStrip() {
  const stats = [
    { value: topicStats.totalTopics, label: 'Topics' },
    { value: topicStats.totalQuestions, label: 'Questions' },
    { value: 'SM-2', label: 'Algorithm' },
    { value: '0', label: 'Accounts needed' },
  ];

  return (
    <div className={styles.statsStrip}>
      <div className={styles.statsInner}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            {index > 0 && <span className={styles.statDivider} aria-hidden="true" />}
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function TopicCards() {
  return (
    <section className={styles.topics}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Topics
          </Heading>
          <p className={styles.sectionSub}>
            Each topic pairs written theory with atomic questions and spaced review.
          </p>
        </div>

        <div className={styles.grid}>
          {topicStats.topics.map((topic) => (
            <Link
              to={`/${topic.firstDocId}`}
              className={styles.card}
              key={topic.slug}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>
                  <TopicIcon slug={topic.slug} />
                </div>
                <span className={styles.cardCount}>
                  {topic.questionCount} questions
                </span>
              </div>

              <Heading as="h3" className={styles.cardTitle}>
                {topic.label}
              </Heading>

              <p className={styles.cardDescription}>
                {topic.pageCount} page{topic.pageCount === 1 ? '' : 's'} of theory
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className={styles.howSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Three Ways to Use It
          </Heading>
          <p className={styles.sectionSub}>
            Learn it, check it, cram it. Spacing happens without you managing it.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {STUDY_MODES.map((mode) => (
            <div key={mode.step} className={styles.step}>
              <span className={styles.stepNum}>{mode.step}</span>
              <h3 className={styles.stepTitle}>{mode.title}</h3>
              <p className={styles.stepDesc}>{mode.description}</p>
              <Link to={mode.to} className={styles.stepLink}>
                {mode.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Spaced Repetition for DevOps Engineers"
      description={config.site.tagline}
    >
      <HomepageHeader />
      <StatsStrip />
      <main>
        <TopicCards />
        <HowItWorks />
      </main>
    </Layout>
  );
}
