# DevOps Interview Questions & Answers

A free, open-source **spaced repetition system** for DevOps interview prep. Study the theory, then prove you remember it — spacing happens without you managing it.

**Live site:** https://kusal-tharindu.github.io/devops-interview-questions/

---

## How It Works

Three modes that match how people actually study:

| Mode | What it does |
|------|-------------|
| **Learn** | Browse a topic's theory page with diagrams, then work through its questions at your own pace |
| **Revise** | Pick a topic, test yourself — your grades silently build a spaced review schedule (SM-2) |
| **Drill** | Timed, all topics mixed, random order — cram the night before an interview |

Spacing is a side effect of Revise, not a daily habit you need to maintain. Progress lives in your browser's localStorage — no accounts, no tracking.

## Topics (185 questions)

| Topic | Questions | Pages |
|-------|-----------|-------|
| Linux | 13 | Filesystem |
| Bash | 12 | Scripting |
| Git | 14 | Fundamentals |
| Networking | 22 | Fundamentals |
| Docker | 51 | Architecture, Dockerfile, Images & Layers, Networking |
| Kubernetes | 27 | Architecture |
| Terraform | 16 | State & Workflow |
| CI/CD | 15 | Pipelines |
| Python | 15 | Fundamentals |

## Tech Stack

- [Docusaurus 3.10](https://docusaurus.io/) + React 18
- Dark-only theme, teal accent, glassmorphism navbar
- SM-2 spaced repetition engine (client-side, localStorage)
- Cards in `.cards.yaml` files, compiled to JSON at build time
- Mermaid diagrams for visual theory

## Local Development

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm run start            # Dev server at localhost:3000/devops-interview-questions/
npm run content:check    # Validate card schema without full build
npm run build            # Full production build
npm run serve            # Serve production build locally
```

## Content Model

Questions live in `.cards.yaml` files next to their theory `.md` page:

```
docs/docker/architecture.md            ← Theory page
docs/docker/architecture.cards.yaml    ← Questions for that page
```

Each card is atomic (one fact per card) and follows a strict schema:

```yaml
- id: docker-arch-daemon-role
  tier: core          # core | deep | trivia
  type: recall        # recall | concept | elaborative | scenario | cloze | command
  q: What is the role of the Docker daemon?
  a: It manages images, containers, networks, and volumes on the host.
  tags: [docker, architecture]
  verified: 2026-07-29
```

The build validates all cards and fails on schema errors or duplicate IDs.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys to GitHub Pages. All changes go through `stg` first.

## Contributing

Contributions welcome! See the [Contributing Guide](./CONTRIBUTING.md) for the card schema, quality checklist, and how to add content.

## License

This project uses a split license to keep contributions open while protecting the brand:

| Layer | License | File |
|-------|---------|------|
| Code (scripts, components, engine) | [AGPL-3.0](./LICENSE) | `LICENSE` |
| Content (questions, theory pages) | [CC BY-NC-SA 4.0](./LICENSE-CONTENT) | `LICENSE-CONTENT` |
| Brand (logo, name, visual design) | All rights reserved | `LICENSE-BRAND` |

**In plain terms:** you can study from it, contribute to it, and fork it for non-commercial use with credit. If you host a derivative publicly, your code changes must also be open-sourced. You cannot clone the brand identity for a competing project.

## Disclaimer & Terms

- [Disclaimer](./DISCLAIMER.md) — trademark notices, no guarantee of accuracy, educational use only
- [Terms and Conditions](./TERMS.md) — usage terms, liability, contribution licensing

All referenced product names (Docker, Kubernetes, AWS, Terraform, etc.) are trademarks of their respective owners. This project is not affiliated with or endorsed by any of them.

---

If this helped you prep, consider giving it a ⭐
