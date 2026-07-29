import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Retired route.
 *
 * /review was the v1 daily-review page. v2 replaced it with /revise, which
 * wraps the same SM-2 engine in a topic picker. Kept as a redirect so existing
 * bookmarks and any indexed links still land somewhere useful.
 *
 * Uses @docusaurus/router, which ships with the classic preset — no extra
 * dependency for one redirect.
 */
export default function ReviewRedirect() {
  return <Redirect to={useBaseUrl('/revise')} />;
}
