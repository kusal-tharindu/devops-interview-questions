---
title: Basics
sidebar_position: 1
description: Python interview questions - lists vs tuples, args/kwargs, virtual environments
---

# Python Basics - Interview Q&A

## Q: What is the difference between a list and a tuple in Python?

**Summary:**
Lists are mutable (can be changed after creation) while tuples are immutable (cannot be modified). Tuples are faster and can be used as dictionary keys; lists are for collections that need to change.

**Key points:**
- List: `[1, 2, 3]` — mutable, can append/remove/modify
- Tuple: `(1, 2, 3)` — immutable, fixed after creation
- Tuples use less memory and are faster to iterate
- Tuples can be dictionary keys; lists cannot
- Use tuples for fixed collections (coordinates, RGB values)
- Use lists when you need to add/remove items

**Learn more:**
- [Python Docs — Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)
- [Python Docs — Tuples](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences)

---

## Q: What are *args and **kwargs in Python?

**Summary:**
`*args` allows a function to accept any number of positional arguments (as a tuple). `**kwargs` allows any number of keyword arguments (as a dictionary). They make functions flexible.

**Key points:**
- `*args` — collects extra positional args into a tuple
- `**kwargs` — collects extra keyword args into a dictionary
- Names `args`/`kwargs` are convention, not required (`*x` works too)
- Order in function definition: regular → `*args` → `**kwargs`
- Useful for wrapper functions, decorators, and flexible APIs

**Learn more:**
- [Python Docs — More on Functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions)

---

## Q: What is a virtual environment and why use one?

**Summary:**
A virtual environment is an isolated Python environment that has its own packages independent of the system Python. It prevents dependency conflicts between different projects.

**Key points:**
- Create: `python -m venv myenv`
- Activate: `source myenv/bin/activate` (Linux/Mac)
- Each project gets its own dependencies
- `pip freeze > requirements.txt` — export installed packages
- `pip install -r requirements.txt` — reproduce environment
- Never install project packages globally

**Learn more:**
- [Python Docs — Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
