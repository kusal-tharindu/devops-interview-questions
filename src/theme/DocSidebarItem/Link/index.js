import React from 'react';
import OriginalDocSidebarItemLink from '@theme-original/DocSidebarItem/Link';

/**
 * Generated practice pages live at `<page>-qa` and are hidden from the rail.
 * Their theory page is the meaningful location, so treat it as current while
 * the reader is on the practice page.
 */
export default function DocSidebarItemLink(props) {
  const { activePath } = props;
  const normalizedActivePath =
    activePath && activePath.endsWith('-qa')
      ? activePath.slice(0, -3)
      : activePath;

  return <OriginalDocSidebarItemLink {...props} activePath={normalizedActivePath} />;
}
