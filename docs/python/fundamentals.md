---
title: Fundamentals
sidebar_position: 1
displayed_sidebar: pythonSidebar
description: Python for DevOps - mutability, args and kwargs, virtual environments, dependency pinning
---

import TopicQA from '@site/src/components/TopicQA';

# Python Fundamentals

## The one-sentence version

For automation work, most Python surprises trace back to two things: whether an
object is **mutable**, and which **interpreter and packages** your script is
actually running against.

## Mutability {#mutability}

Python objects are either mutable or immutable, and this single property explains
a lot of behaviour.

| Immutable | Mutable |
|---|---|
| `int`, `float`, `str`, `bool` | `list`, `dict`, `set` |
| `tuple`, `frozenset` | most custom classes |

Two practical consequences:

**Only immutable objects can be dict keys.** A key's hash must never change, and a
mutable object's would.

```python
{("eu-west-1", "prod"): "vpc-123"}   # tuple key: fine
{["eu-west-1", "prod"]: "vpc-123"}   # TypeError: unhashable type
```

**Mutable default arguments are evaluated once**, at function definition, not per
call. This is the classic Python trap:

```python
def add_host(host, hosts=[]):     # created ONCE
    hosts.append(host)
    return hosts

add_host("a")   # ['a']
add_host("b")   # ['a', 'b']   <- not what anyone wants
```

```python
def add_host(host, hosts=None):   # correct
    if hosts is None:
        hosts = []
    hosts.append(host)
    return hosts
```

## Flexible function signatures {#args-kwargs}

`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra
keyword arguments into a dict.

```python
def run(cmd, *args, check=True, **kwargs):
    ...

run("kubectl", "get", "pods", check=False, timeout=30)
# cmd    = "kubectl"
# args   = ("get", "pods")
# check  = False
# kwargs = {"timeout": 30}
```

Order in a signature is fixed: positional, `*args`, keyword-only, `**kwargs`. The
names `args` and `kwargs` are convention only — the `*` and `**` do the work.

## Virtual environments {#venv}

A virtual environment is an isolated interpreter with its own `site-packages`. It
exists so two projects can need different versions of the same library without
conflict, and so you never install project dependencies into the system Python
that your OS tooling depends on.

```bash
python -m venv .venv
source .venv/bin/activate      # Linux / macOS
python -m pip install -r requirements.txt
deactivate
```

Activation simply puts the venv's `bin` first on `PATH`. That is why `which python`
is the fastest way to answer "why is my package missing" — usually the answer is
that you are not in the environment you think you are.

## Reproducible dependencies {#dependencies}

`pip freeze` captures exactly what is installed, including transitive
dependencies:

```bash
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
```

The distinction that matters for automation:

| File style | Contains | Use |
|---|---|---|
| Loose (`requests>=2`) | What you directly need | Libraries |
| Pinned (`requests==2.32.3`) | Exact versions, transitively | Applications, CI |

Pin for anything deployed. An unpinned dependency means a build today and a build
next month can install different code, which is the same reproducibility problem as
using `latest` for a container image.

## Questions

<TopicQA />

## Learn more

- [Python — Virtual environments and packages](https://docs.python.org/3/tutorial/venv.html)
- [Python — Data structures](https://docs.python.org/3/tutorial/datastructures.html)
- [Python — Defining functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions)
- [Python Packaging — Requirements files](https://pip.pypa.io/en/stable/user_guide/#requirements-files)
