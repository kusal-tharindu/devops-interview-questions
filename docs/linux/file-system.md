---
title: File System
sidebar_position: 1
displayed_sidebar: linuxSidebar
description: Linux file system interview questions - FHS, inodes, /bin vs /usr/bin
---

# Linux File System

## Mental model

Every Linux system organises files into a single tree rooted at `/`. The Filesystem Hierarchy Standard (FHS) assigns meaning to each top-level directory so that programs and administrators can predict where things live regardless of distribution. An **inode** is the actual on-disk data structure that represents a file — filenames are just pointers to inodes stored in directory entries.

Understanding these three layers — the standard, the namespace (paths), and the storage (inodes/blocks) — covers the majority of filesystem interview questions.

## Learn more

- [Filesystem Hierarchy Standard 3.0 (Official)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html)
- [Red Hat — Managing File Systems](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/index)
- [Linux man page — inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html)
