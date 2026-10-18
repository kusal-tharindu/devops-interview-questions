// @ts-check
/**
 * Docusaurus configuration.
 *
 * Site identity, links and topic labels come from site.config.js so they are
 * defined once and shared with the build scripts and the React app. Prefer
 * editing site.config.js over hardcoding anything here.
 *
 * @see https://docusaurus.io/docs/api/docusaurus-config
 */

const siteConfig = require('./site.config');
const { getTopicsForNavbar } = require('./scripts/topics');
// Custom token palette: the familiar shape of One Dark, brightened and warmed
// to match the site's navy/emerald reading surface.
const codeTheme = {
  plain: { color: '#cdd7e3', backgroundColor: '#0b111b' },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#7f8b9d', fontStyle: 'italic' },
    },
    { types: ['punctuation'], style: { color: '#93a0b2' } },
    {
      types: ['property', 'tag', 'constant', 'symbol', 'deleted'],
      style: { color: '#f0a0a0' },
    },
    { types: ['boolean', 'number'], style: { color: '#e5c07b' } },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#9be8cd' },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: { color: '#8bd3ff' },
    },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: '#c9a6ff' } },
    {
      types: ['function', 'class-name', 'key'],
      style: { color: '#82b8ff' },
    },
    { types: ['regex', 'important'], style: { color: '#ffcb6b' } },
    { types: ['namespace'], style: { opacity: 0.8 } },
  ],
};

const { site, links } = siteConfig;

// Hidden topics (site.config.js topics.hidden, minus any SHOW_HIDDEN override)
// are excluded from the docs plugin so their pages never become routes. Built
// from the same single source as the nav, sidebar, and card pipeline, so a
// topic is hidden everywhere or nowhere — never half in. Draft topics often
// lack frontmatter, which would break `onBrokenLinks: 'throw'`; excluding them
// keeps the production build green until they are ready to ship.
const hiddenTopicExcludes = siteConfig
  .effectiveHiddenTopics()
  .map((topic) => `${topic}/**`);

// Built from the docs/ tree at build time, so a new topic folder appears in the
// navbar and footer with no edit here.
const topicNavItems = getTopicsForNavbar().map((topic) => ({
  label: topic.label,
  to: `/${topic.firstDocId}`,
}));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: site.title,
  tagline: site.tagline,
  favicon: 'img/favicon.ico',

  url: site.url,
  baseUrl: site.baseUrl,
  organizationName: site.organizationName,
  projectName: site.projectName,

  onBrokenLinks: 'throw',

  markdown: {
    // Diagrams live in markdown as Mermaid code blocks: diffable in review,
    // no binary assets to maintain.
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: links.editUrlBase,
          showLastUpdateTime: true,
          // Keep hidden topics out of the generated routes. Their markdown
          // stays on disk; it just is not built. See hiddenTopicExcludes above.
          exclude: hiddenTopicExcludes,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/theory.css'],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',

      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },

      mermaid: {
        theme: { light: 'dark', dark: 'dark' },
        options: {
          fontFamily: 'inherit',
        },
      },

      navbar: {
        title: site.shortTitle,
        logo: {
          alt: `${site.shortTitle} logo`,
          src: 'img/logo.svg',
        },
        items: [
          { to: '/intro', position: 'left', label: 'Introduction' },
          {
            type: 'dropdown',
            label: 'Learn',
            position: 'left',
            items: topicNavItems,
          },
          { to: '/revise', position: 'left', label: 'Revise' },
          { to: '/drill', position: 'left', label: 'Drill' },
          {
            href: links.github,
            label: 'GitHub',
            position: 'right',
            className: 'navbar__github',
          },
          {
            to: '/revise',
            label: 'Start a session',
            position: 'right',
            className: 'navbar__cta',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Topics',
            items: topicNavItems,
          },
          {
            title: 'Study',
            items: [
              { label: 'Getting Started', to: '/intro' },
              { label: 'Revise a Topic', to: '/revise' },
              { label: 'Interview Drill', to: '/drill' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub', href: links.github },
              { label: 'Contributing Guide', href: links.contributing },
              { label: 'Report an Issue', href: links.issues },
            ],
          },
        ],
        copyright:
          `© ${new Date().getFullYear()} ${site.shortTitle} — Built with Docusaurus · ` +
          `Maintained by <a href="${links.ownerProfile}" target="_blank" rel="noopener noreferrer">${site.organizationName}</a>`,
      },

      prism: {
        theme: codeTheme,
        additionalLanguages: ['bash', 'python', 'hcl', 'docker', 'yaml', 'json', 'ini'],
      },
    }),
};

module.exports = config;
