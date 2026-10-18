import React, { useEffect, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import config from '@site/site.config';
import TopicIcon from '@site/src/components/TopicIcon';
import StudyCardPreview from '@site/src/components/StudyCardPreview';
import { loadProgress } from '@site/src/lib/storage';
import { summarise } from '@site/src/lib/sm2';
import topicStats from '@site/src/data/topics.json';
import previewData from '@site/src/data/preview.json';

import styles from './index.module.css';

/**
 * Landing page.
 *
 * Written as a field manual rather than a marketing page: the questions are
 * real, the counts come from the generated content data, and the preview card
 * is the actual thing you do on the Revise page. Keeping the page anchored to
 * the product is what stops it going stale.
 */

const TIER_COLORS = {
  core: 'var(--ifm-color-primary)',
  deep: '#6fa8dc',
  trivia: '#8b95a8',
};

/**
 * Read the learner's local schedule after hydration.
 *
 * Returns null on the server and on the first client render so the markup
 * matches; the effect then swaps in the personalised line. No progress ever
 * leaves this browser.
 *
 * @returns {null|{isNew: boolean, dueNow: number, mature: number, tracked: number}}
 */
function useStudyStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const states = Object.values(loadProgress());
    if (states.length === 0) {
      setStatus({ isNew: true, dueNow: 0, mature: 0, tracked: 0 });
      return;
    }
    const summary = summarise(states);
    setStatus({ isNew: false, ...summary });
  }, []);

  return status;
}

function ReviewStatus({ total }) {
  const status = useStudyStatus();

  const returning = Boolean(status && !status.isNew);
  const text = returning
    ? status.dueNow > 0
      ? `${status.dueNow} due now · ${status.mature} mature · ${status.tracked} of ${total} seen`
      : `Nothing due · ${status.mature} mature · ${status.tracked} of ${total} seen`
    : `${config.srs.sessionSize} cards · about ten minutes`;

  const percent =
    returning && total > 0
      ? Math.min(100, Math.round((status.tracked / total) * 100))
      : 0;

  return (
    <div className={styles.reviewStatus}>
      <div className={styles.reviewStatusRow}>
        <span className={styles.reviewLabel}>
          {returning ? 'Your queue' : 'First session'}
        </span>
        <span className={styles.reviewText} aria-live="polite">
          {text}
        </span>
      </div>
      {returning && (
        <div
          className={styles.reviewBar}
          role="img"
          aria-label={`${status.tracked} of ${total} cards seen`}
        >
          <span
            className={styles.reviewFill}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

/** "Linux and Docker", "Linux, Docker and Git": follows the generated data. */
function joinLabels(labels) {
  if (labels.length <= 1) return labels.join('');
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

function Hero({ totalQuestions }) {
  const topicList = joinLabels(topicStats.topics.map((topic) => topic.label));

  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <a
              className={styles.heroMeta}
              href={config.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Free and open source
              <span className={styles.heroMetaLink}>
                View on GitHub <span aria-hidden="true">↗</span>
              </span>
            </a>

            <Heading as="h1" className={styles.heroTitle}>
              DevOps interview prep that stays with you
            </Heading>

            <p className={styles.heroLede}>
              {totalQuestions} questions across {topicList}, each tied to a
              short theory page. A spaced-review schedule brings back the ones
              you are about to forget.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.buttonPrimary} to="/revise">
                Start a session
                <span className={styles.buttonArrow} aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className={styles.buttonGhost} to="/intro">
                Read the theory
              </Link>
            </div>

            <ReviewStatus total={totalQuestions} />
          </div>

          <StudyCardPreview cards={previewData.cards} />
        </div>
      </div>
    </header>
  );
}

function TierBar({ counts = {}, total }) {
  const tiers = config.cards.tiers.filter(
    (tier) => (counts[tier.id] || 0) > 0
  );

  if (tiers.length === 0 || total === 0) return null;

  const label = tiers
    .map((tier) => `${counts[tier.id]} ${tier.label.toLowerCase()}`)
    .join(', ');

  return (
    <div className={styles.tierBlock}>
      <div className={styles.tierBar} role="img" aria-label={label}>
        {tiers.map((tier) => (
          <span
            key={tier.id}
            className={styles.tierSegment}
            style={{
              width: `${(counts[tier.id] / total) * 100}%`,
              background: TIER_COLORS[tier.id] || 'rgba(230, 237, 246, 0.25)',
            }}
          />
        ))}
      </div>
      <div className={styles.tierLegend}>
        {tiers.map((tier) => (
          <span className={styles.tierItem} key={tier.id}>
            <span
              className={styles.tierDot}
              style={{
                background: TIER_COLORS[tier.id] || 'rgba(230, 237, 246, 0.25)',
              }}
              aria-hidden="true"
            />
            {counts[tier.id]} {tier.label.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

const TOPIC_PAGE_PREVIEW = 4;

function TopicCard({ topic }) {
  const pages = topic.pages || [];
  const visiblePages = pages.slice(0, TOPIC_PAGE_PREVIEW);
  const hiddenPageCount = pages.length - visiblePages.length;
  const readingMinutes = pages.reduce(
    (sum, page) => sum + (page.readingMinutes || 0),
    0
  );
  const questionLabel = `${topic.questionCount} question${
    topic.questionCount === 1 ? '' : 's'
  }`;

  return (
    <article className={styles.topicCard}>
      <div className={styles.topicCardTop}>
        <span className={styles.topicIcon}>
          <TopicIcon slug={topic.slug} />
        </span>
      </div>

      <div className={styles.topicHeading}>
        <Heading as="h3" className={styles.topicTitle}>
          <Link
            to={`/${topic.firstDocId}`}
            className={styles.topicTitleLink}
          >
            {topic.label}
          </Link>
        </Heading>
        <span className={styles.topicCount}>{questionLabel}</span>
      </div>

      <p className={styles.topicDescription}>
        {topic.description ||
          `Theory pages and questions for ${topic.label}.`}
      </p>

      <div className={styles.topicMetrics}>
        <span>
          <strong>{topic.pageCount}</strong> page
          {topic.pageCount === 1 ? '' : 's'}
        </span>
        {readingMinutes > 0 && (
          <>
            <span className={styles.metricDivider} aria-hidden="true" />
            <span>
              <strong>{readingMinutes}</strong> min read
            </span>
          </>
        )}
      </div>

      <TierBar counts={topic.tierCounts} total={topic.questionCount} />

      <div className={styles.topicPages}>
        <div className={styles.pagesHead}>
          <span className={styles.pagesLabel}>Pages</span>
          <span className={styles.pagesCount}>{pages.length}</span>
        </div>

        <ul className={styles.pageList}>
          {visiblePages.map((page) => (
            <li key={page.slug}>
              <Link className={styles.pageLink} to={page.url}>
                <span className={styles.pageTitle}>
                  {page.sidebarLabel || page.title}
                </span>
                <span className={styles.pageMeta}>
                  {page.questionCount} Q
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {hiddenPageCount > 0 && (
          <p className={styles.morePages}>
            +{hiddenPageCount} more page{hiddenPageCount === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <div className={styles.topicFooter}>
        <Link className={styles.topicCta} to={`/${topic.firstDocId}`}>
          Open {topic.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function TopicLibrary() {
  return (
    <section className={styles.section} id="library">
      <div className={styles.shell}>
        <header className={styles.sectionHeader}>
          <div>
            <Heading as="h2" className={styles.sectionTitle}>
              Start with a topic
            </Heading>
            <p className={styles.sectionIntro}>
              Every page is a short read followed by the questions it answers.
              More topics are on the way.
            </p>
          </div>
        </header>

        <div className={styles.topicGrid}>
          {topicStats.topics.map((topic) => (
            <TopicCard topic={topic} key={topic.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Method({ totalPages }) {
  const drillSizes = config.drill.sizeOptions.map((option) => option.value);

  const steps = [
    {
      number: '01',
      title: 'Learn',
      kicker: 'Theory',
      text: 'Start on a topic page. Each one is written to be read in one sitting, with diagrams and the exact commands interviewers ask about.',
      meta: `${totalPages} pages · diagrams · examples`,
      to: '/intro',
      cta: 'Open the introduction',
    },
    {
      number: '02',
      title: 'Revise',
      kicker: 'Spaced review',
      text: 'Twenty cards from one topic. Grade your recall honestly; those grades decide when each card comes back.',
      meta: `${config.srs.sessionSize} cards per session · saved locally`,
      to: '/revise',
      cta: 'Start revising',
    },
    {
      number: '03',
      title: 'Drill',
      kicker: 'Timed',
      text: 'A timed, shuffled set across topics for the week before an interview. It never touches your review schedule.',
      meta: `${drillSizes[0]}–${drillSizes[drillSizes.length - 1]} cards · mixed topics`,
      to: '/drill',
      cta: 'Run a drill',
    },
  ];

  return (
    <section className={styles.methodSection} id="method">
      <div className={styles.shell}>
        <div className={styles.methodGrid}>
          <div className={styles.methodAside}>
            <Heading as="h2" className={styles.sectionTitle}>
              How it works
            </Heading>
            <p className={styles.sectionIntro}>
              Read the theory, review it on a schedule, then test yourself
              under time pressure. All three use the same question bank.
            </p>
          </div>

          <ol className={styles.stepList}>
            {steps.map((step) => (
              <li className={styles.step} key={step.number}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {step.number}
                </span>
                <div className={styles.stepBody}>
                  <div className={styles.stepHeader}>
                    <Heading as="h3" className={styles.stepTitle}>
                      {step.title}
                    </Heading>
                    <span className={styles.stepKicker}>{step.kicker}</span>
                  </div>
                  <p className={styles.stepText}>{step.text}</p>
                  <div className={styles.stepFooter}>
                    <span className={styles.stepMeta}>{step.meta}</span>
                    <Link className={styles.textLink} to={step.to}>
                      {step.cta}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  const baseline = config.srs.secondInterval;

  const rows = config.grades.map((grade) => {
    let days = baseline;
    if (grade.grade === 0) days = 0;
    else if (grade.grade === 1) {
      days = Math.max(1, Math.round(baseline * config.srs.intervalFactorHard));
    } else if (grade.grade === 3) {
      days = Math.round(baseline * config.srs.intervalFactorEasy);
    }
    return { ...grade, days };
  });

  const maxDays = Math.max(...rows.map((row) => row.days), 1);
  const tickStep = maxDays > 12 ? 4 : 2;
  const ticks = [];
  for (let day = 0; day <= maxDays; day += tickStep) ticks.push(day);
  if (ticks[ticks.length - 1] !== maxDays) ticks.push(maxDays);

  return (
    <section className={styles.scheduleSection} id="schedule">
      <div className={styles.shell}>
        <div className={styles.scheduleGrid}>
          <div className={styles.scheduleCopy}>
            <Heading as="h2" className={styles.sectionTitle}>
              Your grades set the schedule
            </Heading>
            <p className={styles.sectionIntro}>
              Each grade updates an SM-2 schedule: ease, interval and next due
              date. You don’t pick what to study next. The queue does.
            </p>
            <p className={styles.scheduleBody}>
              The chart shows a card on its second successful review. From
              there, intervals keep growing for as long as recall holds.
            </p>
            <Link className={styles.textLink} to="/revise">
              Open the review queue
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.schedulePanel}>
            <div className={styles.chart}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  Next review, by grade
                </span>
                <span className={styles.chartBadge}>SM-2 defaults</span>
              </div>

              <div className={styles.chartScale} aria-hidden="true">
                <span className={styles.scaleSpacer} />
                <div className={styles.scaleTicks}>
                  {ticks.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
                <span className={styles.scaleUnit}>days</span>
              </div>

              <div className={styles.chartRows}>
                {rows.map((row) => {
                  const percent = (row.days / maxDays) * 100;
                  const label =
                    row.days === 0
                      ? 'today'
                      : row.days === 1
                        ? '1 day'
                        : `${row.days} days`;

                  return (
                    <div className={styles.chartRow} key={row.grade}>
                      <span className={styles.chartGrade}>
                        <span
                          className={styles.chartDot}
                          style={{ background: row.color }}
                          aria-hidden="true"
                        />
                        {row.label}
                      </span>
                      <div className={styles.chartTrack}>
                        <span
                          className={styles.chartBar}
                          style={{
                            width: `${percent}%`,
                            background: row.color,
                          }}
                        />
                        <span
                          className={styles.chartMarker}
                          style={{
                            left: `${percent}%`,
                            background: row.color,
                          }}
                        />
                      </div>
                      <span className={styles.chartValue}>{label}</span>
                    </div>
                  );
                })}
              </div>

              <p className={styles.chartNote}>
                Good holds the baseline. Easy stretches it, Hard compresses it,
                Again resets the card to today. Intervals expand from there.
              </p>
            </div>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Storage</dt>
                <dd>This browser only</dd>
              </div>
              <div className={styles.fact}>
                <dt>Backup</dt>
                <dd>JSON export on Revise</dd>
              </div>
              <div className={styles.fact}>
                <dt>Accounts</dt>
                <dd>None required</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={styles.closingSection}>
      <div className={styles.shell}>
        <div className={styles.closingPanel}>
          <Heading as="h2" className={styles.closingTitle}>
            Try a {config.srs.sessionSize}-card session
          </Heading>
          <p className={styles.closingCopy}>
            It takes about ten minutes. There is no account to create, and your
            progress stays in this browser.
          </p>
          <div className={styles.closingActions}>
            <Link className={styles.buttonPrimary} to="/revise">
              Start a session
              <span className={styles.buttonArrow} aria-hidden="true">
                →
              </span>
            </Link>
            <Link className={styles.buttonGhost} to="/intro">
              Read the introduction
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const totalPages = useMemo(
    () =>
      topicStats.topics.reduce((sum, topic) => sum + topic.pageCount, 0),
    []
  );

  return (
    <Layout
      title="DevOps interview prep that stays with you"
      description={config.site.tagline}
      wrapperClassName={styles.page}
    >
      <Hero totalQuestions={topicStats.totalQuestions} />
      <main>
        <TopicLibrary />
        <Method totalPages={totalPages} />
        <Schedule />
        <Closing />
      </main>
    </Layout>
  );
}
