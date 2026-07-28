import React from 'react';

/**
 * Small inline SVG icon set for topic cards. Kept as plain inline SVG
 * (no icon library dependency) to avoid adding new third-party packages.
 * Falls back to a generic "terminal" icon for unknown topic slugs, so
 * adding a new topic later never breaks the homepage.
 */
const icons = {
  linux: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 2c-1.5 0-2.5 1.5-2.5 3.2 0 1 .3 1.7.3 2.6 0 1.3-1.8 2.4-1.8 4.6 0 1 .4 1.8.4 1.8s-2.4.8-2.4 3c0 1.6 1.4 2.8 1.4 2.8s-.4 1 .6 1.6c1 .6 2 .2 2 .2s.6 1.2 2 1.2 2-1.2 2-1.2.9.4 2-.2c1-.6.6-1.6.6-1.6s1.4-1.2 1.4-2.8c0-2.2-2.4-3-2.4-3s.4-.8.4-1.8c0-2.2-1.8-3.3-1.8-4.6 0-.9.3-1.6.3-2.6C14.5 3.5 13.5 2 12 2Z" />
      <circle cx="9.7" cy="9.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="14.3" cy="9.5" r=".6" fill="currentColor" stroke="none" />
    </svg>
  ),
  docker: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="11" width="3" height="3" />
      <rect x="7" y="11" width="3" height="3" />
      <rect x="11" y="11" width="3" height="3" />
      <rect x="11" y="7" width="3" height="3" />
      <rect x="15" y="11" width="3" height="3" />
      <path d="M2 14c0 4 3.5 6.5 8 6.5 6 0 10-3.5 11-7-1-.6-2.4-.8-3.6-.4-.3-1-1.2-1.8-1.2-1.8" />
    </svg>
  ),
  terraform: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 4l7 4v8l-7-4V4Z" />
      <path d="M12 8l7-4v8l-7 4V8Z" />
      <path d="M4 16l7 4v-8" />
    </svg>
  ),
  bash: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3" />
      <path d="M13 15h4" />
    </svg>
  ),
  python: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 3c-3 0-5 1-5 3.5V9h5v1H5.5C3.5 10 3 11.8 3 13.5s.5 3.5 2.5 3.5H8v-2.3c0-2 1.7-3.2 3.7-3.2H16c1.8 0 3-1.2 3-3V6.5C19 4 17 3 14 3h-2Z" />
      <path d="M12 21c3 0 5-1 5-3.5V15h-5v-1h6.5c2 0 2.5-1.8 2.5-3.5S20.5 7 18.5 7H16v2.3c0 2-1.7 3.2-3.7 3.2H8c-1.8 0-3 1.2-3 3v2.5c0 2.5 2 3.5 5 3.5h2Z" />
    </svg>
  ),
  default: (props) => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3" />
      <path d="M13 15h4" />
    </svg>
  ),
};

export default function TopicIcon({ slug, ...props }) {
  const Icon = icons[slug] ?? icons.default;
  return <Icon {...props} />;
}
