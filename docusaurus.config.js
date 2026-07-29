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

const { site, links } = siteConfig;

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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
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
          { href: links.github, label: 'GitHub', position: 'right' },
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
        additionalLanguages: ['bash', 'python', 'hcl', 'docker', 'yaml', 'json', 'ini'],
      },
    }),
};

module.exports = config;
