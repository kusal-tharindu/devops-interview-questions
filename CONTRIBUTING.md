# Contributing Guide

Thanks for wanting to contribute! Here's how to add questions and topics.

## Architecture

Content lives in two file types per topic:

```
docs/<topic>/basics.md              ← Concept page (mental model + learn more links)
docs/<topic>/basics.cards.yaml      ← Flashcards (parsed at build time → cards.json)
```

The Markdown file is for human reading. The `.cards.yaml` file feeds the spaced repetition engine.

## How to Add Cards

1. Fork this repository
2. Find the right `.cards.yaml` file under `docs/<topic>/`
3. Add a card block following the schema below
4. Run `npm run validate:cards` to verify
5. Submit a Pull Request

### Card Schema

```yaml
- id: topic-subtopic-short-slug
  tier: core
  type: recall
  q: Your question here?
  a: Short, precise answer.
  why: Optional elaboration shown after reveal.
  tags: [topic, subtopic]
  verified: 2026-07-29
  version: "1.9"
  sources:
    - title: Official Doc Title
      url: https://link-to-official-docs
```

### Required Fields

| Field | Format | Description |
|-------|--------|-------------|
| `id` | `{topic}-{subtopic}-{slug}` | Unique ID. Lowercase, hyphens, 3+ segments. **Never reuse.** |
| `tier` | `core` \| `deep` \| `trivia` | Difficulty/importance level |
| `type` | `recall` \| `concept` \| `elaborative` \| `scenario` \| `cloze` \| `command` | Card type |
| `q` | string | The question. One question = one fact. |
| `a` | string | Shortest correct answer. |
| `tags` | array | For filtering and interleaving. Include the topic name. |
| `verified` | `YYYY-MM-DD` | Last date someone confirmed this is correct. |

### Optional Fields

| Field | Description |
|-------|-------------|
| `why` | Elaboration shown after reveal (explains why the answer matters) |
| `version` | Tool version the card is true for (e.g., `k8s: 1.31`) |
| `sources` | Array of `{title, url}` — official docs only |
| `deprecated` | Set to `true` to retire a card without breaking user progress |

### ID Convention

Format: `{topic}-{subtopic}-{2-4 word slug}`

```
linux-fs-etc-purpose
docker-basics-image-vs-container
k8s-pods-crashloop-diagnose
terraform-state-purpose
```

The build script checks for duplicate IDs across all files. If two cards share an ID, the build fails.

### Card Types

- **`recall`** — atomic fact. Q/A pair.
- **`concept`** — tests the mental model, not a detail.
- **`elaborative`** — a "why" or "how" question.
- **`scenario`** — symptom → diagnosis (troubleshooting).
- **`cloze`** — fill the gap in a statement.
- **`command`** — "write the command that does X."

### Tiers

- **`core`** (~60%) — every DevOps engineer should know this cold
- **`deep`** (~30%) — senior / specialist depth
- **`trivia`** (~10%) — real but rarely critical

## Card Quality Checklist

Before submitting, verify:

- [ ] One question = one fact (atomic)
- [ ] Answer is the shortest correct formulation
- [ ] ID follows the naming convention and is globally unique
- [ ] `verified` date is today (you checked the fact is still true)
- [ ] Tags include the topic name
- [ ] `npm run validate:cards` passes
- [ ] Sources link to official docs (not blogs)

## Adding a New Topic

1. Create `docs/<topic-name>/` folder (lowercase, hyphens)
2. Add `_category_.json`:
   ```json
   {
     "label": "Topic Name",
     "position": 10,
     "link": {
       "type": "generated-index",
       "description": "One-line description."
     }
   }
   ```
3. Add `basics.md` with mental model and learn more links:
   ```markdown
   ---
   title: Basics
   sidebar_position: 1
   displayed_sidebar: topicNameSidebar
   description: One-line SEO description
   ---

   # Topic Name Basics

   ## Mental model

   2-3 paragraphs building the picture before drilling.

   ## Learn more

   - [Link 1](url)
   ```
4. Add `basics.cards.yaml` with at least 15-20 cards
5. The navbar, sidebar, and stats update automatically on build

**Minimum viable topic: 20 core cards + one concept page.** Below that, cards become orphans in memory.

## CRUD Operations

| Action | How | Notes |
|--------|-----|-------|
| Add card | Add block to `.cards.yaml` | Build validates uniqueness |
| Edit card | Change q/a/fields, keep same `id`, bump `verified` | User progress preserved |
| Delete card | Remove the block | Engine ignores orphan localStorage state |
| Retire card | Add `deprecated: true` | Optional — engine skips it |

**Rule: never reuse a deleted ID for a different question.**

## Local Development

```bash
npm install
npm run start          # Dev server at localhost:3000
npm run validate:cards # Check card schema without full build
npm run build          # Full production build
```

## Reporting Issues

- Wrong answer? Open an issue with the card ID
- Stale info? Same — include the correct version/date
- Bad formulation? Suggest a rewrite in the issue

Thank you for helping engineers remember what matters.
