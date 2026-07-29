---
title: Basics
sidebar_position: 1
displayed_sidebar: gitSidebar
description: Git interview questions - branching, merging, rebasing, workflows
---

import TopicQA from '@site/src/components/TopicQA';

# Git Basics

## Mental model

Git tracks content as a **directed acyclic graph** of commits. Each commit points to a tree (snapshot of all files) and to its parent commit(s). **Branches** are movable pointers to commits. **HEAD** points to the current branch. The **staging area** (index) sits between your working directory and the commit history, letting you craft commits deliberately. Understanding that Git stores snapshots (not diffs) and that branches are cheap pointers unlocks everything else.

## Questions

<TopicQA topic="git" />

## Learn more

- [Git Book — Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Git Book — Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Atlassian — Git Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows)
