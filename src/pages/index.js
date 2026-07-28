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
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/intro">
            Start Reading
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
        <span>
          <strong>{totalTopics}</strong> topics
        </span>
        <span className={styles.statsDivider}>·</span>
        <span>
          <strong>{totalQuestions}</strong> questions
        </span>
        <span className={styles.statsDivider}>·</span>
        <span>Community-maintained, always growing</span>
      </div>
    </div>
  );
}

function TopicCards() {
  return (
    <section className={styles.topics}>
      <div className="container">
        <div className="row">
          {topicStats.topics.map((topic) => (
            <div className="col col--4 margin-bottom--lg" key={topic.slug}>
              <Link to={`/${topic.firstDocId}`} className={styles.card}>
                <div className={styles.cardIcon}>
                  <TopicIcon slug={topic.slug} />
                </div>
                <Heading as="h3">{topic.label}</Heading>
                <p className={styles.cardDescription}>{topic.description}</p>
                <span className={styles.cardCount}>
                  {topic.questionCount} question{topic.questionCount === 1 ? '' : 's'}
                </span>
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
      title={siteConfig.title}
      description="Community-driven DevOps interview questions covering Linux, Docker, Terraform, Bash, Python">
      <HomepageHeader />
      <StatsStrip />
      <main>
        <TopicCards />
      </main>
    </Layout>
  );
}
