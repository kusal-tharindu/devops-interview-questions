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
  const modes = [
    {
      num: '01',
      title: 'Learn',
      desc: 'Pick a topic. Read the mental model, then work through its questions at your own pace.',
      to: '/intro',
      cta: 'Browse topics',
    },
    {
      num: '02',
      title: 'Revise',
      desc: 'Test yourself on one tech stack. Your grades quietly build a spaced schedule underneath.',
      to: '/revise',
      cta: 'Start revising',
    },
    {
      num: '03',
      title: 'Drill',
      desc: 'Timed, all topics mixed, randomised. Cram the night before an interview.',
      to: '/drill',
      cta: 'Run a drill',
    },
  ];

  return (
    <section className={styles.howSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>Three Ways to Use It</Heading>
          <p className={styles.sectionSub}>
            Learn it, check it, cram it. Spacing happens without you managing it.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {modes.map((mode) => (
            <div key={mode.num} className={styles.step}>
              <span className={styles.stepNum}>{mode.num}</span>
              <h3 className={styles.stepTitle}>{mode.title}</h3>
              <p className={styles.stepDesc}>{mode.desc}</p>
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
