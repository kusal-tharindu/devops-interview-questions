---
title: Basics
sidebar_position: 1
displayed_sidebar: terraformSidebar
description: Terraform interview questions - state management, plan vs apply
---

# Terraform Basics - Interview Q&A

## Q: What is Terraform and how does it work?

<details>
<summary>Show answer</summary>

**Summary:**
Terraform is an Infrastructure as Code (IaC) tool by HashiCorp that lets you define cloud resources in declarative configuration files (HCL). It compares your desired state with the current state and makes only the necessary changes.

**Key points:**
- Declarative — you describe WHAT you want, not HOW to create it
- Provider-based — supports AWS, Azure, GCP, and hundreds more
- State file (`terraform.tfstate`) tracks what's currently deployed
- Workflow: `init` → `plan` → `apply` → `destroy`
- Idempotent — running apply multiple times produces the same result

**Learn more:**
- [Terraform Docs — Introduction](https://developer.hashicorp.com/terraform/intro)
- [Terraform Docs — CLI Workflow](https://developer.hashicorp.com/terraform/cli)

</details>

---

## Q: What is Terraform state and why is it important?

<details>
<summary>Show answer</summary>

**Summary:**
Terraform state is a JSON file that maps your configuration to real-world resources. It's how Terraform knows what it's managing and what changes need to be made on the next apply.

**Key points:**
- Default: stored locally as `terraform.tfstate`
- Production: store remotely (S3 + DynamoDB, Terraform Cloud, etc.)
- Contains sensitive data — never commit to git
- `terraform state list` — shows all managed resources
- `terraform state show <resource>` — shows details of a resource
- State locking prevents concurrent modifications

**Learn more:**
- [Terraform Docs — State](https://developer.hashicorp.com/terraform/language/state)
- [Terraform Docs — Remote State](https://developer.hashicorp.com/terraform/language/state/remote)

</details>

---

## Q: What is the difference between `terraform plan` and `terraform apply`?

<details>
<summary>Show answer</summary>

**Summary:**
`terraform plan` is a dry run — it shows what changes Terraform WOULD make without actually making them. `terraform apply` executes those changes for real.

**Key points:**
- `plan` — read-only, shows additions/changes/deletions
- `apply` — executes the plan and modifies infrastructure
- Always run `plan` before `apply` in production
- `apply` can auto-approve with `-auto-approve` flag (use carefully)
- Plan output uses: `+` create, `~` update, `-` destroy

**Learn more:**
- [Terraform Docs — Plan Command](https://developer.hashicorp.com/terraform/cli/commands/plan)
- [Terraform Docs — Apply Command](https://developer.hashicorp.com/terraform/cli/commands/apply)

</details>
