// @ts-check
// Docusaurus configuration. See https://docusaurus.io/docs/api/docusaurus-config

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
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'DevOps Interview Q&A',
        logo: {
          alt: 'DevOps Interview Questions Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'topicsSidebar',
            position: 'left',
            label: 'Topics',
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
            title: 'Topics',
            items: [
              { label: 'Linux', to: '/linux/file-system' },
              { label: 'Docker', to: '/docker/basics' },
              { label: 'Terraform', to: '/terraform/basics' },
              { label: 'Bash', to: '/bash/scripting-basics' },
              { label: 'Python', to: '/python/basics' },
            ],
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
