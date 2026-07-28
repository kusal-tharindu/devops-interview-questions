---
title: Scripting Basics
sidebar_position: 1
description: Bash interview questions - shebangs, command substitution, error handling
---

# Bash Scripting Basics - Interview Q&A

## Q: What is the difference between #!/bin/bash and #!/bin/sh?

**Summary:**
`#!/bin/bash` tells the system to use Bash (Bourne Again Shell) which has more features. `#!/bin/sh` uses the system's default POSIX shell, which is more portable but has fewer features.

**Key points:**
- `#!/bin/bash` — Bash-specific features: arrays, `[[ ]]`, string manipulation
- `#!/bin/sh` — POSIX-compliant, works on any Unix system
- On Ubuntu, `/bin/sh` is symlinked to `dash` (not bash)
- Use `/bin/bash` when you need Bash features
- Use `/bin/sh` when portability across systems matters

**Learn more:**
- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [POSIX Shell Specification](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)

---

## Q: What is the difference between $(), ``, and ${} in Bash?

**Summary:**
`$()` and backticks (\`\`) both do command substitution (run a command and capture output). `${}` is for variable expansion (referencing and manipulating variables).

**Key points:**
- `$(command)` — preferred command substitution (nestable, readable)
- `` `command` `` — older command substitution (hard to nest, avoid)
- `${variable}` — variable expansion with optional manipulation
- `${var:-default}` — use default if var is unset
- `${var%%pattern}` — remove longest match from end
- `${#var}` — length of variable value

**Learn more:**
- [GNU Bash — Shell Expansions](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)

---

## Q: How do you handle errors in a Bash script?

**Summary:**
Use `set -e` to exit on any error, `set -u` to treat unset variables as errors, and `set -o pipefail` to catch errors in piped commands. Together they make scripts fail fast and predictably.

**Key points:**
- `set -e` — exit immediately if any command fails
- `set -u` — error on undefined variables
- `set -o pipefail` — pipe fails if ANY command in it fails
- Common combo: `set -euo pipefail` at the top of scripts
- Use `trap` for cleanup on exit: `trap cleanup EXIT`
- Use `|| true` to allow specific commands to fail

**Learn more:**
- [GNU Bash — The Set Builtin](https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin)
