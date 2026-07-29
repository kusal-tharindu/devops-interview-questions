---
title: Basics
sidebar_position: 1
displayed_sidebar: networkingSidebar
description: Networking interview questions - OSI model, DNS, TCP vs UDP, HTTP, firewalls
---

import TopicQA from '@site/src/components/TopicQA';

# Networking Basics

## Mental model

All network communication follows the **OSI 7-layer model** (or the simpler TCP/IP 4-layer model). Data starts at the application layer and is encapsulated through each layer with headers/trailers until it reaches the physical wire. At the receiving end, each layer strips its header. **DNS** translates names to IPs. **TCP** provides reliable ordered delivery. **UDP** provides fast unreliable delivery. **HTTP** carries web traffic over TCP. Firewalls and security groups filter traffic by port, protocol, and source/destination.

## Questions

<TopicQA topic="networking" />

## Learn more

- [Cloudflare — What is the OSI Model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)
- [Cloudflare — What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works)
