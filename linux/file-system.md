# Linux File System - Interview Q&A

## Q: What is the Linux Filesystem Hierarchy Standard (FHS)?

**Summary:**
FHS defines the directory structure and directory contents in Linux. It provides a standard layout so that programs and users can predict the location of files and directories.

**Key points:**
- `/` is the root of the entire filesystem
- `/etc` — system configuration files
- `/home` — user home directories
- `/var` — variable data (logs, caches, spool)
- `/tmp` — temporary files (cleared on reboot)
- `/usr` — user programs and data
- `/bin` — essential command binaries
- `/sbin` — system administration binaries

**Learn more:**
- [Filesystem Hierarchy Standard (Official)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html)
- [Red Hat — Linux File System Structure](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/index)

---

## Q: What is the difference between /bin and /usr/bin?

**Summary:**
`/bin` contains essential binaries needed for the system to boot and run in single-user mode. `/usr/bin` contains general-purpose user commands that are not critical for basic system operation.

**Key points:**
- `/bin` — essential commands like `ls`, `cp`, `cat`, `mount`
- `/usr/bin` — non-essential commands like `vim`, `git`, `python`
- Modern distros (like Ubuntu) often merge them (symlink `/bin` → `/usr/bin`)
- The split is historical from when `/usr` could be on a separate partition

**Learn more:**
- [Filesystem Hierarchy Standard — /bin](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html#binEssentialUserCommandBinaries)

---

## Q: What is an inode in Linux?

**Summary:**
An inode is a data structure that stores metadata about a file (permissions, owner, size, timestamps, disk block locations) — everything except the filename and actual data. Each file has a unique inode number within its filesystem.

**Key points:**
- Stores: permissions, owner, group, size, timestamps, block pointers
- Does NOT store: filename or file content
- Filenames are stored in directory entries that map names → inode numbers
- `ls -i` shows inode numbers
- Hard links share the same inode; symbolic links have their own inode

**Learn more:**
- [Linux man page — inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html)
- [Red Hat — Understanding inodes](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/index)
