import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Retired route. /review was the v1 daily-review page; v2 replaced it with
 * /revise (topic picker + the same SM-2 engine underneath).
 *
 * Kept as a redirect so any existing bookmark still lands somewhere useful.
 * Uses @docusaurus/router, which ships with the classic preset, so this
 * needs no extra dependency.
 */
export default function ReviewRedirect() {
  return <Redirect to={useBaseUrl('/revise')} />;
}
