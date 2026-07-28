# DevOps Interview Questions & Answers

A community-driven collection of DevOps interview questions and answers covering Linux, Docker, Terraform, Kubernetes, Bash, Python, and more.

Live site: https://kusal-tharindu.github.io/devops-interview-questions/

Each question includes a **short summary answer** for quick recall and **links to official documentation** for deeper learning.

## Topics

| Topic | Description |
|-------|-------------|
| [Linux](./docs/linux/) | File system, permissions, processes, networking |
| [Docker](./docs/docker/) | Containers, images, networking, volumes |
| [Terraform](./docs/terraform/) | IaC basics, state management, modules |
| [Bash](./docs/bash/) | Shell scripting, text processing, automation |
| [Python](./docs/python/) | Scripting, data types, DevOps automation |

## How to Use

1. **Interview prep** — Read the question, try to recall the answer, then check the summary
2. **Deep learning** — Follow the official doc links for full understanding
3. **Quick reference** — Use key points as a cheat sheet

## Q&A Format

Each page follows this structure:

```markdown
## Q: [Question here]

**Summary:**
Short, clear explanation that covers the core concept.

**Key points:**
- Important fact 1
- Important fact 2
- Important fact 3

**Learn more:**
- [Official Doc Title](link)
```

## Tech Stack

This site is built with [Docusaurus](https://docusaurus.io/), a static site generator maintained by Meta's open source team. Content is plain Markdown under `docs/`.

## Local Development

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm run start
```

This starts a local dev server at `http://localhost:3000` with hot reload.

To build a production bundle:

```bash
npm run build
```

The build output goes to `build/` and is served with:

```bash
npm run serve
```

## Deployment

Pushing to `main` automatically triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and publishes it to GitHub Pages. No manual deployment steps are needed.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a PR.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

If this helped you, consider giving it a star!
