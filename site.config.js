/**
 * Single source of truth for site-wide configuration.
 *
 * Consumed by:
 *   - docusaurus.config.js       (site metadata, navbar, footer)
 *   - scripts/*                  (content pipeline, build-time)
 *   - src/lib/*, src/pages/*     (runtime, via webpack)
 *
 * CommonJS on purpose: build scripts run in plain Node, and Docusaurus
 * bundles CJS for the client without complaint. One format, both worlds.
 *
 * Rule of thumb: if a value appears in more than one file, or a contributor
 * might reasonably want to change it, it belongs here — not inline.
 */

const GITHUB_OWNER = 'kusal-tharindu';
const GITHUB_REPO = 'devops-interview-questions';
const GITHUB_BASE = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
const DEFAULT_BRANCH = 'main';

/** Site identity and hosting. */
const site = {
  title: 'DevOps Interview Questions & Answers',
  shortTitle: 'DevOps Interview Q&A',
  tagline:
    'Study the theory, then prove you remember it. Linux, Docker, Kubernetes, Terraform, Bash, Python, Networking, Git, CI/CD.',
  url: `https://${GITHUB_OWNER}.github.io`,
  baseUrl: `/${GITHUB_REPO}/`,
  organizationName: GITHUB_OWNER,
  projectName: GITHUB_REPO,
  defaultBranch: DEFAULT_BRANCH,
};

/** Every outbound GitHub URL, derived so the owner/repo appear exactly once. */
const links = {
  github: GITHUB_BASE,
  issues: `${GITHUB_BASE}/issues`,
  newIssue: `${GITHUB_BASE}/issues/new`,
  discussions: `${GITHUB_BASE}/discussions`,
  contributing: `${GITHUB_BASE}/blob/${DEFAULT_BRANCH}/CONTRIBUTING.md`,
  editUrlBase: `${GITHUB_BASE}/edit/${DEFAULT_BRANCH}/`,
  ownerProfile: `https://github.com/${GITHUB_OWNER}`,
};

/** Filesystem and URL paths for generated content. */
const paths = {
  /** Source of truth for all content, relative to repo root. */
  docsDir: 'docs',
  /** Where the content pipeline writes its output, relative to repo root. */
  cardsOutDir: 'static/cards',
  /** Public URL prefix for the generated card data (baseUrl is prepended). */
  cardsPublicDir: '/cards',
  /** Manifest filename inside cardsOutDir. */
  manifestFile: 'index.json',
  /** Legacy aggregate stats consumed by the homepage. */
  statsFile: 'src/data/topics.json',
};

/**
 * Card schema. Changing a tier or type here updates validation, filters, and
 * every badge in the UI at once.
 */
const cards = {
  /** Suffix that marks a file as a card deck. */
  fileSuffix: '.cards.yaml',

  requiredFields: ['id', 'tier', 'type', 'q', 'a', 'tags', 'verified'],

  /** Author-supplied optional fields. */
  optionalFields: ['why', 'version', 'sources', 'deprecated', 'ref'],

  /** Injected by the pipeline. Authors must not set these by hand. */
  derivedFields: ['topic', 'page', 'pageUrl'],

  /** `{topic}-{subtopic}-{slug}`: lowercase, hyphens, 3+ segments. */
  idPattern: /^[a-z0-9]+(-[a-z0-9]+){2,}$/,
  idPatternHint: '{topic}-{subtopic}-{slug} (lowercase, hyphens, 3+ segments)',

  /** ISO date, used by the `verified` field. */
  datePattern: /^\d{4}-\d{2}-\d{2}$/,

  /**
   * Importance tiers, in study order. `label` drives UI, `description` drives
   * contributor docs, `defaultInDrill` decides inclusion in mixed drills.
   */
  tiers: [
    {
      id: 'core',
      label: 'Core',
      description: 'Every DevOps engineer should know this cold.',
      targetShare: 0.6,
      defaultInDrill: true,
    },
    {
      id: 'deep',
      label: 'Deep',
      description: 'Senior or specialist depth.',
      targetShare: 0.3,
      defaultInDrill: true,
    },
    {
      id: 'trivia',
      label: 'Trivia',
      description: 'Real, but rarely load-bearing.',
      targetShare: 0.1,
      defaultInDrill: false,
    },
  ],

  /** Card shapes. `prompt` is shown to contributors in docs. */
  types: [
    { id: 'recall', label: 'Recall', prompt: 'One atomic fact.' },
    { id: 'concept', label: 'Concept', prompt: 'Tests the mental model, not a detail.' },
    { id: 'elaborative', label: 'Elaborative', prompt: 'A "why" or "how" question.' },
    { id: 'scenario', label: 'Scenario', prompt: 'Symptom to diagnosis.' },
    { id: 'cloze', label: 'Cloze', prompt: 'Fill the gap.' },
    { id: 'command', label: 'Command', prompt: 'Write the command that does X.' },
  ],

  /** Warn in CI when a card has not been re-verified in this long. */
  stalenessWarnDays: 365,
};

/**
 * Spaced repetition tuning (SM-2). These numbers are a reasonable default,
 * not settled science — the research does not prescribe an exact curve.
 * See .kiro-guide/plan.md section 4.
 */
const srs = {
  defaultEase: 2.5,
  minEase: 1.3,
  /** Interval in days after the first and second successful review. */
  firstInterval: 1,
  secondInterval: 6,
  /** Ease adjustments per grade. */
  easePenaltyAgain: 0.2,
  easePenaltyHard: 0.15,
  easeBonusEasy: 0.15,
  /** Interval multipliers for non-Good grades. */
  intervalFactorHard: 0.8,
  intervalFactorEasy: 1.3,
  /** A card at or above this interval counts as "mature". */
  matureIntervalDays: 21,
  /** Cards served per Revise session. */
  sessionSize: 20,
  /** localStorage key. Bump the suffix only for a breaking state migration. */
  storageKey: 'devops-recall-v1',
  /** Prompt a progress backup after this many days of use. */
  backupNagAfterDays: 30,
};

/** Grade buttons. Order defines display order and the 1..n keyboard shortcuts. */
const grades = [
  { grade: 0, label: 'Again', color: '#ff5f56', hint: 'No recall' },
  { grade: 1, label: 'Hard', color: '#ffbd2e', hint: 'Recalled with difficulty' },
  { grade: 2, label: 'Good', color: '#4fd1a5', hint: 'Recalled correctly' },
  { grade: 3, label: 'Easy', color: '#6fa8dc', hint: 'Effortless' },
];

/** Interview drill options. */
const drill = {
  /** Selectable session lengths. */
  sizeOptions: [
    { value: 10, label: '10 (Quick)' },
    { value: 20, label: '20 (Standard)' },
    { value: 30, label: '30 (Deep)' },
    { value: 50, label: '50 (Marathon)' },
  ],
  defaultSize: 20,
  /** Drill never writes to the SM-2 schedule — cramming is low-quality signal. */
  affectsSchedule: false,
  /** Self-grade buttons for drill (simpler than SRS grades). */
  outcomes: [
    { id: 'wrong', label: 'Wrong', color: '#ff5f56' },
    { id: 'unsure', label: 'Unsure', color: '#ffbd2e' },
    { id: 'correct', label: 'Correct', color: '#4fd1a5' },
  ],
};

/**
 * Display labels and ordering for topics.
 *
 * A topic is a first-level folder under docs/. Anything not listed here still
 * works — it falls back to a title-cased folder name and sorts last — so
 * adding a topic never requires editing this file. Listing it just gives you
 * a nicer label and a deliberate position.
 */
const topics = {
  order: [
    'linux',
    'bash',
    'git',
    'networking',
    'docker',
    'kubernetes',
    'terraform',
    'cicd',
    'python',
  ],
  labels: {
    linux: 'Linux',
    bash: 'Bash',
    git: 'Git',
    networking: 'Networking',
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    terraform: 'Terraform',
    cicd: 'CI/CD',
    python: 'Python',
  },
};

/** Keyboard shortcuts, surfaced in UI hints so they stay in sync. */
const keys = {
  reveal: 'Space',
  revealCode: 'Space',
  gradeHint: '1-4 to grade',
  drillGradeHint: '1-3 to grade',
};

/** Minimum bar for a topic to be worth publishing. See plan.md section 5. */
const contentTargets = {
  minCoreCardsPerTopic: 20,
  minCardsPerPage: 5,
  /** Split a topic into grouped subfolders past this many pages. */
  groupPagesAfter: 8,
};

module.exports = {
  site,
  links,
  paths,
  cards,
  srs,
  grades,
  drill,
  topics,
  keys,
  contentTargets,
};
