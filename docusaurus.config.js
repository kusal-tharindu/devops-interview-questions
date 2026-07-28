// @ts-check
// Docusaurus configuration. See https://docusaurus.io/docs/api/docusaurus-config

const { getTopicsForNavbar } = require('./scripts/topics');

// Built from the docs/ folder structure at build/dev time, so adding a new
// topic folder automatically adds it to the navbar dropdown - no manual
// edit needed here.
const topicNavItems = getTopicsForNavbar().map((topic) => ({
  label: topic.label,
  to: `/${topic.firstDocId}`,
}));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DevOps Interview Questions & Answers',
  tagline: 'Community-driven DevOps interview questions covering Linux, Docker, Terraform, Bash, Python',
  favicon: 'img/favicon.ico',

  url: 'https://kusal-tharindu.github.io',
  baseUrl: '/devops-interview-questions/',

  organizationName: 'kusal-tharindu',
  projectName: 'devops-interview-questions',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          editUrl:
            'https://github.com/kusal-tharindu/devops-interview-questions/edit/main/',
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
      navbar: {
        title: 'DevOps Interview Q&A',
        logo: {
          alt: 'DevOps Interview Questions Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/intro',
            position: 'left',
            label: 'Introduction',
          },
          {
            type: 'dropdown',
            label: 'Tech Stack',
            position: 'left',
            items: topicNavItems,
          },
          {
            href: 'https://github.com/kusal-tharindu/devops-interview-questions',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Tech Stack',
            items: topicNavItems,
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/kusal-tharindu/devops-interview-questions',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} devops-interview-questions is maintained by kusal-tharindu.`,
      },
      prism: {
        additionalLanguages: ['bash', 'python', 'hcl', 'docker', 'yaml'],
      },
    }),
};

module.exports = config;
