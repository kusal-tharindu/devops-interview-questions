---
title: Basics
sidebar_position: 1
displayed_sidebar: terraformSidebar
description: Terraform interview questions - IaC, state management, plan vs apply
---

# Terraform Basics

## Mental model

Terraform is a **declarative** Infrastructure as Code tool: you describe the desired end state, and Terraform figures out how to get there. It maintains a **state file** that maps your config to real-world resources. The core loop is `init → plan → apply`: plan shows what would change, apply makes it real. The state file is the source of truth for what Terraform manages — lose it and Terraform forgets everything it created.

## Learn more

- [Terraform Docs — Introduction](https://developer.hashicorp.com/terraform/intro)
- [Terraform Docs — CLI Workflow](https://developer.hashicorp.com/terraform/cli)
- [Terraform Docs — State](https://developer.hashicorp.com/terraform/language/state)
- [Terraform Docs — Remote State](https://developer.hashicorp.com/terraform/language/state/remote)
