---
title: Scripting Basics
sidebar_position: 1
displayed_sidebar: bashSidebar
description: Bash interview questions - shebangs, command substitution, error handling
---

import TopicQA from '@site/src/components/TopicQA';

# Bash Scripting Basics

## Mental model

A Bash script is just a sequence of commands the shell executes top-to-bottom. The **shebang** (`#!`) tells the kernel which interpreter to use. The three essential safety mechanisms are `set -e` (exit on error), `set -u` (error on undefined vars), and `set -o pipefail` (pipe fails if any command in it fails). Master variable expansion (`${}`) and command substitution (`$()`) and you can automate almost anything.

## Questions

<TopicQA topic="bash" />

## Learn more

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [POSIX Shell Specification](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [GNU Bash — Shell Expansions](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)
