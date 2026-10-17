---
title: "DevOps Recall"
sidebar_label: "Introduction"
sidebar_position: 0
displayed_sidebar: introSidebar
description: "How DevOps Recall works: short theory pages, practice checks, spaced review, and timed drills for DevOps interview preparation."
---

# DevOps Recall

DevOps Recall is the study system behind **DevOps Interview Q&A**: short theory pages, atomic questions, and a review schedule that brings back what you are about to forget. It is free, open source, and runs entirely in your browser — no account, no tracking.

## The problem {#the-problem}

DevOps is broad: Linux, containers, networking, Kubernetes, infrastructure as code, CI/CD, and more. No one holds it all after one read. Re-reading and highlighting feel productive, but they are weak at building durable recall. They are also the habits most of us fall back on.

## How it works {#how-it-works}

Two techniques do most of the work:

1. **Retrieval practice.** You see a question and try to answer it *before* revealing the answer. The effort of recalling is what strengthens memory.
2. **Spaced repetition.** Your grade feeds the SM-2 algorithm, which sets the next review interval. Questions you miss come back sooner; ones you know cold wait longer.

You do not need to plan a study calendar. Revise keeps the schedule and tells you what is due when you return.

## Three ways to study {#three-ways-to-study}

### 1. Learn {#learn}

Each theory page starts with a one-sentence summary, then builds the mental model behind it. Diagrams, commands, and failure modes are included where they help.

When a page has questions, the **Theory / Practice** switch at the top opens its practice check. Each question is collapsed by default: answer it in your head, then reveal the answer and explanation. Practice is self-paced and does not touch your review data.

### 2. Revise {#revise}

Choose one topic or a mixed session. Revise serves up to 20 due questions, one at a time. Answer from memory, reveal, then grade your recall: **Again**, **Hard**, **Good**, or **Easy**.

Those grades update the schedule stored in this browser, so the next session serves what is due: missed questions sooner, familiar ones later.

### 3. Drill {#drill}

Drill is a timed, randomised set drawn from every live topic: a Docker question, then Linux, then a troubleshooting scenario. Choose a set of 10, 20, 30, or 50 questions; the timer runs while you work.

Drill deliberately does not write to your review schedule. Cramming is not a review, and its grades would distort the intervals you built in Revise.

## What is live now {#what-is-live-now}

The live library starts with two topics:

- **[Linux](/linux/filesystem)** — the filesystem, inodes, hard and symbolic links, and the "disk is full but isn't" failure mode.
- **[Docker](/docker/architecture)** — containers vs virtual machines, images, Dockerfiles, and networking.

More topics will appear in **Learn** as they are ready.

New here? Read [Linux: Filesystem](/linux/filesystem), take its [practice check](/linux/filesystem-qa), then [start a Revise session](/revise).

## Principles {#principles}

- **Atomic questions.** One idea per card, so a miss points to one gap.
- **Recall before reveal.** Never read an answer you have not first tried to produce.
- **Version-stamped.** Every card carries a verification date because DevOps facts expire.
- **Local-first.** Progress stays in this browser. Export a backup from Revise before switching devices.

## Contributing {#contributing}

DevOps Recall is community-maintained. See the [Contributing Guide](https://github.com/kusal-tharindu/devops-interview-questions/blob/main/CONTRIBUTING.md) for how to add cards, fix errors, or propose a new topic. For a correction, opening an [issue](https://github.com/kusal-tharindu/devops-interview-questions/issues) is enough.
