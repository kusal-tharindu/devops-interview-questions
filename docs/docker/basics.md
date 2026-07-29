---
title: Basics
sidebar_position: 1
displayed_sidebar: dockerSidebar
description: Docker interview questions - images vs containers, Dockerfile, CMD vs ENTRYPOINT
---

import TopicQA from '@site/src/components/TopicQA';

# Docker Basics

## Mental model

Docker packages applications into **images** (read-only blueprints) and runs them as **containers** (isolated, writable instances). A **Dockerfile** defines the build recipe layer by layer. The key mental shift: a container is not a VM — it shares the host kernel and isolates at the process level using namespaces and cgroups.

## Questions

<TopicQA topic="docker" />

## Learn more

- [Docker Docs — Images and Containers](https://docs.docker.com/get-started/overview/#images)
- [Docker Docs — Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Docs — CMD vs ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#cmd)
