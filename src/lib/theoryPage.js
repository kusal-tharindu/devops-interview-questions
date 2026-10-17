import config from '@site/site.config';
import topicStats from '@site/src/data/topics.json';

/**
 * Resolve everything the theory-page chrome needs from a Docusaurus doc id.
 *
 * Theory pages and their generated practice pages share an identity:
 *
 *   linux/filesystem       -> theory
 *   linux/filesystem-qa    -> practice for that same page
 *
 * Keeping the parsing here means the header, the bottom practice card, and any
 * future surface all agree on which topic/page they are looking at.
 *
 * @param {string} docId
 * @returns {null|{
 *   isQa: boolean,
 *   baseId: string,
 *   topicSlug: string,
 *   pageSlug: string,
 *   topic: object|null,
 *   page: object|null,
 *   label: string,
 *   theoryHref: string,
 *   qaHref: string,
 *   questionCount: number|null,
 *   hasPractice: boolean,
 * }}
 */
export function parseTheoryDocId(docId) {
  if (!docId || !docId.includes('/')) return null;

  const isQa = docId.endsWith('-qa');
  const baseId = isQa ? docId.slice(0, -3) : docId;
  const slash = baseId.indexOf('/');
  if (slash === -1) return null;

  const topicSlug = baseId.slice(0, slash);
  const pageSlug = baseId.slice(slash + 1);

  const topic = topicStats.topics.find((item) => item.slug === topicSlug) || null;
  const page = topic?.pages?.find((item) => item.slug === pageSlug) || null;

  const label =
    topic?.label ||
    config.topics.labels[topicSlug] ||
    topicSlug.charAt(0).toUpperCase() + topicSlug.slice(1);

  return {
    isQa,
    baseId,
    topicSlug,
    pageSlug,
    topic,
    page,
    label,
    theoryHref: `/${baseId}`,
    qaHref: `/${baseId}-qa`,
    questionCount: page?.questionCount ?? null,
    hasPractice: Boolean(page && page.questionCount > 0),
  };
}
