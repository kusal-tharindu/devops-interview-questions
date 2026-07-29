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

## How to use

### Daily Review (`/review`)
Your main loop. Cards that are due today appear automatically. Grade yourself (Again / Hard / Good / Easy) and the algorithm adjusts the next interval. 15-20 minutes per day is enough.

### Interview Drill (`/drill`)
Timed, mixed-topic practice with no scheduling side effects. Simulates a real interview where questions jump between topics. Use it to test yourself before the real thing.

### Browse Topics
Each topic has a **mental model** page (the "understand first" layer) and an atomic card deck. Read the mental model once to build the big picture, then let spaced repetition handle retention.

## Principles

- **One card, one fact** — atomic questions are easier to remember than complex ones
- **Recall before reveal** — never see an answer you haven't first tried to produce
- **Version-stamped** — every card carries a verification date because DevOps facts expire
- **Your data stays yours** — progress is in localStorage, no accounts, no tracking

## Contributing

This is community-maintained. See the [Contributing Guide](https://github.com/kusal-tharindu/devops-interview-questions/blob/main/CONTRIBUTING.md) for how to add cards, fix errors, or propose new topics.
