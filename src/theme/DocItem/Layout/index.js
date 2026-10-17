import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';

import TheoryHeader from '@site/src/components/TheoryHeader';
import TheoryPracticeCTA from '@site/src/components/TheoryPracticeCTA';
import ReadingProgress from '@site/src/components/ReadingProgress';

import styles from './styles.module.css';

/**
 * Docs article shell.
 *
 * This is the stock Docusaurus layout with three deliberate additions:
 *
 *   1. A reading-progress rail.
 *   2. The automatic theory header (title, lede, metadata, Theory/Practice).
 *   3. A practice CTA after the article.
 *
 * Topic pages no longer carry an H1 or the toggle in markdown, so the header is
 * the single source of those elements for every theory page.
 */

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return { hidden, mobile, desktop };
}

export default function DocItemLayout({ children }) {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();
  const isTopicDoc = metadata.id.includes('/');
  const hasToc = Boolean(docTOC.desktop || docTOC.mobile);

  return (
    <div className="row">
      <ReadingProgress />

      <div
        className={clsx(
          'col',
          hasToc && 'theoryContentCol',
          hasToc && styles.docItemCol
        )}
      >
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />

        <div
          className={clsx(
            styles.docItemContainer,
            !hasToc && styles.noTocContainer
          )}
        >
          <article>
            {!isTopicDoc && <DocBreadcrumbs />}
            <DocVersionBadge />

            {isTopicDoc && <TheoryHeader />}
            {docTOC.mobile}

            <DocItemContent>{children}</DocItemContent>

            {isTopicDoc && <TheoryPracticeCTA />}
            <DocItemFooter />
          </article>

          <DocItemPaginator />
        </div>
      </div>

      {docTOC.desktop && (
        <div className="col col--3 theoryTocCol">{docTOC.desktop}</div>
      )}
    </div>
  );
}
