---
title: Scripting
sidebar_position: 1
displayed_sidebar: bashSidebar
description: Bash scripting - shebang, strict mode with set -euo pipefail, expansion, traps
---

import TopicQA from '@site/src/components/TopicQA';

# Bash Scripting

## The one-sentence version

Bash runs commands top to bottom and, by default, **keeps going after failures** —
so the most important thing you can learn is how to make a script stop when
something breaks.

## The shebang {#shebang}

The first line tells the kernel which interpreter to use.

```bash
#!/usr/bin/env bash
```

| Form | Behaviour |
|---|---|
| `#!/bin/bash` | Bash at a fixed path. Fine on Linux, missing on some systems. |
| `#!/usr/bin/env bash` | First `bash` on `PATH`. More portable. |
| `#!/bin/sh` | The system POSIX shell — **not necessarily Bash** |

On Debian and Ubuntu, `/bin/sh` is `dash`, not Bash. A script with `#!/bin/sh`
that uses arrays or `[[ ]]` will fail there, often with a confusing error. Declare
`bash` if you use Bash features.

## Strict mode {#strict-mode}

Default Bash behaviour is dangerous in automation: a failing command is ignored
and execution continues, so a script can "succeed" having done half its work.

```bash
#!/usr/bin/env bash
set -euo pipefail
```

| Flag | Without it |
|---|---|
| `-e` | A failing command is ignored and the script continues |
| `-u` | A typo'd variable expands to empty string, silently |
| `-o pipefail` | A pipeline reports success if the *last* command succeeded |

`pipefail` is the least obvious and matters most in DevOps:

```bash
# Without pipefail this exits 0 — grep succeeded, so the failure is hidden
curl -f https://api.example.com/health | grep -q ok
```

`set -u` catching typos is worth dwelling on. Without it, this deletes the wrong
thing:

```bash
rm -rf "$BUILD_DIR/"    # if BUILD_DIR is unset, this is rm -rf /
```

Escape hatch for a command allowed to fail:

```bash
grep -q pattern file || true
```

## Expansion and substitution {#expansion}

Two different mechanisms that look similar.

```bash
name=$(hostname)        # command substitution: run it, capture stdout
echo "${name}"          # parameter expansion: read the variable
```

Prefer `$(...)` over backticks — it nests and reads better. Useful parameter
expansions:

| Form | Result |
|---|---|
| `${var:-default}` | `default` when `var` is unset or empty |
| `${var:?message}` | Abort with `message` when unset |
| `${#var}` | Length of the value |
| `${var%.txt}` | Strip shortest matching suffix |

**Always quote your expansions.** Unquoted `$var` is word-split on whitespace,
which is how a filename with a space becomes two arguments.

## Cleanup with trap {#traps}

`trap` runs a handler when the shell exits, so temporary state is cleaned up
whether the script succeeded, failed, or was interrupted.

```bash
#!/usr/bin/env bash
set -euo pipefail

workdir=$(mktemp -d)
cleanup() { rm -rf "$workdir"; }
trap cleanup EXIT

# ... work in "$workdir" ...
```

`EXIT` fires on normal exit, on `set -e` abort, and on `SIGTERM`. Pairing
`set -e` with a `trap ... EXIT` is what makes a script safe to run unattended.

## Questions

<TopicQA />

## Learn more

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Bash — The Set Builtin](https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin)
- [Bash — Shell Expansions](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)
- [ShellCheck](https://www.shellcheck.net/) — static analysis for shell scripts
