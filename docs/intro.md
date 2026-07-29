---
title: Introduction
sidebar_position: 0
displayed_sidebar: introSidebar
---

# DevOps Recall

A free, open-source spaced repetition system for DevOps engineers preparing for interviews or wanting to solidify their fundamentals.

## The problem

DevOps spans dozens of tools — Linux, Docker, Kubernetes, Terraform, Ansible, AWS, networking, CI/CD, monitoring — and no one can memorise everything from a single read. Studies show that **re-reading and highlighting are the least effective study techniques**, yet they are what most people default to.

## The solution

This site applies two high-utility learning techniques backed by decades of cognitive science research:

1. **Retrieval practice** — you see the question and try to recall the answer *before* revealing it
2. **Spaced repetition** — the SM-2 algorithm schedules your next review at the optimal interval to combat the forgetting curve

## Three ways to use this

### 1. Learn — pick a topic from the nav
Each topic page opens with a **mental model**: a few paragraphs building the big picture, because memorising facts you do not understand is wasted effort. Below that is every question for that topic as a collapsible list.

Read the question, answer it in your head, then expand to check yourself. Self-paced, nothing tracked.

### 2. Revise (`/revise`) — test one topic
Pick a tech stack and work through its questions, grading how well you recalled each one.

To you it is a self-test. Underneath, your grades build a spaced review schedule, so questions you fumbled come back sooner and ones you know cold drop away. No daily habit required — the scheduling just happens.

### 3. Drill (`/drill`) — cram before an interview
Timed, all topics mixed, randomised order. A Terraform question, then Linux, then a troubleshooting scenario. Like the real thing.

Drill deliberately does not touch your review schedule — cramming should not distort your long-term data.

## Principles

- **One card, one fact** — atomic questions are easier to remember than complex ones
- **Recall before reveal** — never see an answer you haven't first tried to produce
- **Version-stamped** — every card carries a verification date because DevOps facts expire
- **Your data stays yours** — progress is in localStorage, no accounts, no tracking

## Contributing

This is community-maintained. See the [Contributing Guide](https://github.com/kusal-tharindu/devops-interview-questions/blob/main/CONTRIBUTING.md) for how to add cards, fix errors, or propose new topics.
