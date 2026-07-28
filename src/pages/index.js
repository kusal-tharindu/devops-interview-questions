import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

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
      </div>
    </header>
  );
}

const topics = [
  { title: 'Linux', to: '/linux/file-system', description: 'File system, permissions, processes, networking' },
  { title: 'Docker', to: '/docker/basics', description: 'Containers, images, networking, volumes' },
  { title: 'Terraform', to: '/terraform/basics', description: 'IaC basics, state management, modules' },
  { title: 'Bash', to: '/bash/scripting-basics', description: 'Shell scripting, text processing, automation' },
  { title: 'Python', to: '/python/basics', description: 'Scripting, data types, DevOps automation' },
];

function TopicCards() {
  return (
    <section className={styles.topics}>
      <div className="container">
        <div className="row">
          {topics.map((topic) => (
            <div className="col col--4 margin-bottom--lg" key={topic.title}>
              <Link to={topic.to} className={styles.card}>
                <Heading as="h3">{topic.title}</Heading>
                <p>{topic.description}</p>
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
      <main>
        <TopicCards />
      </main>
    </Layout>
  );
}
