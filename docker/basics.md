# Docker Basics - Interview Q&A

## Q: What is the difference between a Docker image and a container?

**Summary:**
A Docker image is a read-only template containing the application code, runtime, libraries, and dependencies. A container is a running instance of an image — it adds a writable layer on top of the image.

**Key points:**
- Image = blueprint (read-only, built from Dockerfile)
- Container = running instance of an image (writable layer added)
- One image can spawn multiple containers
- Images are stored in registries (Docker Hub, ECR, etc.)
- Containers are ephemeral by default — data is lost when removed

**Learn more:**
- [Docker Docs — Images and Containers](https://docs.docker.com/get-started/overview/#images)

---

## Q: What is a Dockerfile and what are the key instructions?

**Summary:**
A Dockerfile is a text file with instructions to build a Docker image. Each instruction creates a layer in the image. Docker reads the Dockerfile top-to-bottom and executes each instruction sequentially.

**Key points:**
- `FROM` — base image to start from
- `RUN` — execute commands during build (installs, configs)
- `COPY` / `ADD` — copy files from host to image
- `WORKDIR` — set working directory inside container
- `EXPOSE` — document which port the app listens on
- `CMD` — default command when container starts
- `ENTRYPOINT` — main executable (harder to override than CMD)

**Learn more:**
- [Docker Docs — Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)

---

## Q: What is the difference between CMD and ENTRYPOINT?

**Summary:**
`CMD` provides default arguments that can be easily overridden when running the container. `ENTRYPOINT` sets the main command that always runs — `CMD` becomes the default arguments to `ENTRYPOINT`.

**Key points:**
- `CMD` — easily overridden with `docker run <image> <new-command>`
- `ENTRYPOINT` — not overridden unless you use `--entrypoint` flag
- Best practice: use `ENTRYPOINT` for the binary, `CMD` for default args
- Example: `ENTRYPOINT ["python"]` + `CMD ["app.py"]` → can override just the script

**Learn more:**
- [Docker Docs — CMD vs ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#cmd)
