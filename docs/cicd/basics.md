---
title: Basics
sidebar_position: 1
displayed_sidebar: cicdSidebar
description: CI/CD interview questions - pipelines, GitHub Actions, deployment strategies
---

import TopicQA from '@site/src/components/TopicQA';

# CI/CD Basics

## Mental model

**CI (Continuous Integration)** means every code change triggers an automated build and test — catching bugs before they merge. **CD (Continuous Delivery)** means code is always in a deployable state; deployment to production is a single button click or automatic. The pipeline is the assembly line: source → build → test → deploy. Deployment strategies (blue-green, canary, rolling) manage the risk of pushing changes to real users.

## Questions

<TopicQA topic="cicd" />

## Learn more

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Martin Fowler — Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
- [Atlassian — CI/CD](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
