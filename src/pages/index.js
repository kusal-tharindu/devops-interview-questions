import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import TopicIcon from '@site/src/components/TopicIcon';
import TerminalHero from '@site/src/components/TerminalHero';
import topicStats from '@site/src/data/topics.json';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.badge}>Open Source · Free Forever</div>
        <Heading as="h1" className="hero__title">
          Master DevOps Fundamentals
        </Heading>
        <p className="hero__subtitle">
          Recall-based learning with spaced repetition. Stop re-reading — start remembering.
        </p>
        <div className={styles.buttons}>
          <Link className={styles.btnPrimary} to="/review">
            Start Review
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
  const { totalTopics, totalQuestions } = topicStats;
  return (
    <div className={styles.statsStrip}>
      <div className={styles.statsInner}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{totalTopics}</span>
          <span className={styles.statLabel}>Topics</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{totalQuestions}</span>
          <span className={styles.statLabel}>Cards</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>SM-2</span>
          <span className={styles.statLabel}>Algorithm</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>0</span>
          <span className={styles.statLabel}>Accounts needed</span>
        </div>
      </div>
    </div>
  );
}

function TopicCards() {
  return (
    <section className={styles.topics}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>Topics</Heading>
          <p className={styles.sectionSub}>
            Each topic contains atomic flashcards with spaced repetition scheduling.
          </p>
        </div>
        <div className={styles.grid}>
          {topicStats.topics.map((topic) => (
            <Link to={`/${topic.firstDocId}`} className={styles.card} key={topic.slug}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>
                  <TopicIcon slug={topic.slug} />
                </div>
                <span className={styles.cardCount}>
                  {topic.questionCount} cards
                </span>
              </div>
              <Heading as="h3" className={styles.cardTitle}>{topic.label}</Heading>
              <p className={styles.cardDescription}>{topic.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'See the question', desc: 'Try to recall the answer from memory before revealing it.' },
    { num: '02', title: 'Grade yourself', desc: 'Rate how well you remembered — Again, Hard, Good, or Easy.' },
    { num: '03', title: 'Spaced scheduling', desc: 'SM-2 algorithm schedules your next review at the optimal interval.' },
    { num: '04', title: 'Long-term retention', desc: 'Repeated recall at expanding intervals moves knowledge to permanent memory.' },
  ];

  return (
    <section className={styles.howSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>How It Works</Heading>
          <p className={styles.sectionSub}>
            Based on decades of memory research. No gimmicks.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.num} className={styles.step}>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="DevOps Recall — Spaced Repetition for DevOps Engineers"
      description="Free, open-source spaced repetition flashcards for DevOps interview preparation. Linux, Docker, Kubernetes, Terraform, Bash, Python, Networking.">
      <HomepageHeader />
      <StatsStrip />
      <main>
        <TopicCards />
        <HowItWorks />
      </main>
    </Layout>
  );
}
