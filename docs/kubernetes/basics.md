---
title: Basics
sidebar_position: 1
displayed_sidebar: kubernetesSidebar
description: Kubernetes interview questions - pods, deployments, services, namespaces
---

# Kubernetes Basics

## Mental model

Kubernetes (K8s) is a container orchestrator: it decides which nodes run which containers, restarts them when they fail, scales them up/down, and routes traffic to them. The **control plane** (API server, scheduler, etcd, controller manager) makes decisions. **Worker nodes** (kubelet, container runtime) execute them. Everything is expressed as **declarative YAML** — you describe desired state, K8s converges to it.

The key abstraction layers: **Pod** (smallest deployable unit) → **Deployment** (manages replica sets) → **Service** (stable network identity) → **Ingress** (external traffic routing).

## Learn more

- [Kubernetes Docs — Concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes Docs — Workloads](https://kubernetes.io/docs/concepts/workloads/)
- [Kubernetes Docs — Services, Load Balancing, and Networking](https://kubernetes.io/docs/concepts/services-networking/)
