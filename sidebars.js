/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  topicsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Linux',
      items: ['linux/file-system'],
    },
    {
      type: 'category',
      label: 'Docker',
      items: ['docker/basics'],
    },
    {
      type: 'category',
      label: 'Terraform',
      items: ['terraform/basics'],
    },
    {
      type: 'category',
      label: 'Bash',
      items: ['bash/scripting-basics'],
    },
    {
      type: 'category',
      label: 'Python',
      items: ['python/basics'],
    },
  ],
};

module.exports = sidebars;
