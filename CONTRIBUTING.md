# Contributing Guide

Thanks for wanting to contribute! Here's how you can help.

## How to Add Questions

1. Fork this repository
2. Find the right topic folder under `docs/` (or create one, see below)
3. Copy the block from `docs/_templates/question-template.md` into the topic file
4. Fill in your question and answer
5. Submit a Pull Request

## Q&A Format

Each question uses a collapsible `<details>` block so readers can try to
recall the answer before revealing it (better for studying than a plain
question-and-answer list):

```markdown
## Q: Your question here?

<details>
<summary>Show answer</summary>

**Summary:**
Clear, concise explanation (2-4 sentences).

**Key points:**
- Point 1
- Point 2
- Point 3

**Learn more:**
- [Doc Title](https://link-to-official-docs)

</details>

---
```

## Adding a New Topic

1. Create a new folder under `docs/` (lowercase, hyphens), e.g. `docs/kubernetes/`
2. Add a `_category_.json` file inside it:
   ```json
   {
     "label": "Kubernetes",
     "position": 6,
     "link": {
       "type": "generated-index",
       "description": "Interview questions and answers covering Kubernetes fundamentals."
     }
   }
   ```
3. Add your first `.md` file with front matter like:
   ```markdown
   ---
   title: Basics
   sidebar_position: 1
   displayed_sidebar: kubernetesSidebar
   description: One-line description for SEO / category cards
   ---
   ```
   The `displayed_sidebar` value must be `<topic-folder-name>Sidebar` (camelCase
   the folder name + `Sidebar`). This scopes the sidebar so visitors browsing
   this topic only see this topic's pages, not every topic at once.
4. That's it — both the sidebar contents and the navbar dropdown are
   generated automatically from the `docs/` folder structure at build time.
   No separate config file to hand-edit.

## Adding a Subtopic to an Existing Topic

Just add a new `.md` file in the topic folder, e.g. `docs/linux/permissions.md`,
with its own front matter (`title`, `sidebar_position`, `displayed_sidebar`
matching that topic, `description`). It shows up automatically in that
topic's sidebar.

## Guidelines

- Keep summaries short and focused on interview recall
- Always link to official documentation, not blog posts
- One subtopic per file (e.g., `file-system.md`, `permissions.md`)
- Use diagrams/images when they help explain concepts (put them in `static/img/`)
- Check for duplicates before adding a new question
- Keep language simple and beginner-friendly

## Local Preview

```bash
npm install
npm run start
```

Then open `http://localhost:3000/devops-interview-questions/`.

## Reporting Issues

If you find incorrect information or broken links, please open an issue.
