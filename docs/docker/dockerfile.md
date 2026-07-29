---
title: Dockerfile
sidebar_position: 1
displayed_sidebar: dockerSidebar
description: Dockerfile instructions - FROM, RUN, COPY vs ADD, CMD vs ENTRYPOINT, EXPOSE, WORKDIR
---

import TopicQA from '@site/src/components/TopicQA';

# Dockerfile

## The one-sentence version

A Dockerfile is a build recipe read top to bottom, where each instruction either
adds a layer to the image or sets metadata on it.

## Build-time vs run-time instructions {#build-vs-run}

The single most useful way to organise the instruction set is by *when* it takes
effect. Confusing the two categories is behind most "why isn't my container doing
that" moments.

| Instruction | When | Effect |
|---|---|---|
| `FROM` | Build | Chooses the base image. Must come first. |
| `RUN` | Build | Executes a command, commits the result as a layer |
| `COPY` / `ADD` | Build | Brings files in from the build context |
| `WORKDIR` | Build + run | Sets the working directory for later instructions and the container |
| `ENV` | Build + run | Environment variable, persists into the running container |
| `ARG` | Build only | Build-time variable, **not** available at run time |
| `EXPOSE` | Metadata | Documents a port. Publishes nothing. |
| `CMD` | Run | Default command or arguments |
| `ENTRYPOINT` | Run | The executable that always runs |

`ARG` versus `ENV` is a common trip-up: an `ARG` is gone once the build finishes,
so referencing it from your application at run time silently yields nothing.

## CMD and ENTRYPOINT {#cmd-vs-entrypoint}

Both describe what runs when the container starts. The difference is how easily a
user overrides them.

```dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
```

```bash
docker run myimage                # python app.py
docker run myimage worker.py      # python worker.py   <- CMD replaced
docker run --entrypoint sh myimage  # sh               <- ENTRYPOINT replaced
```

The convention that falls out of this: **`ENTRYPOINT` for the binary, `CMD` for
its default arguments.** That gives users a natural override point without
letting them accidentally run something other than your program.

Use the exec form (`["python", "app.py"]`) rather than the shell form
(`python app.py`). The shell form wraps your process in `/bin/sh -c`, which does
not forward signals — so `docker stop` waits the full timeout and then kills your
process instead of letting it shut down cleanly.

## Layer discipline {#layer-discipline}

Each `RUN` commits a layer, and layers are additive — see
[Images & Layers](./images.md) for why deleting a file later does not shrink the
image. In practice that means chaining related work:

```dockerfile
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
```

Splitting `apt-get update` into its own `RUN` is an especially common mistake: the
update layer gets cached, so a later install can resolve against a stale package
index.

## Build context and .dockerignore {#build-context}

`docker build .` uploads the entire directory to the daemon before the build
starts. A stray `node_modules` or `.git` can turn a fast build into a slow one.

```
# .dockerignore
.git
node_modules
*.log
.env
```

`.dockerignore` also matters for security: without it, `COPY . .` will happily
bake your `.env` file into a layer that ships to your registry.

## Questions

<TopicQA />

## Learn more

- [Docker Docs — Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Docs — Building best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker Docs — .dockerignore](https://docs.docker.com/build/concepts/context/#dockerignore-files)
