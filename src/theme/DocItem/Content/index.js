import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';

/**
 * Markdown content only.
 *
 * Topic pages get their title from TheoryHeader, so the stock synthetic-title
 * fallback would duplicate it. Root docs (the introduction) keep the fallback
 * for pages that do not provide their own H1.
 */
export default function DocItemContent({ children }) {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const isTopicDoc = metadata.id.includes('/');

  const showSyntheticTitle =
    !isTopicDoc &&
    !frontMatter.hide_title &&
    typeof contentTitle === 'undefined';

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {showSyntheticTitle && (
        <header>
          <Heading as="h1">{metadata.title}</Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
