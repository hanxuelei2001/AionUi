# Building AionUi Linux (.deb) Packages with Docker

This guide explains how to build a Linux `.deb` installer for AionUi on macOS (Apple Silicon / Intel) or non-Linux host machines using Docker with `linux/amd64` emulation.

---

## 1. Overview & Architecture

Building Linux desktop packages (Electron apps with native C++ modules like `better-sqlite3`) requires a Linux `x86_64` (`amd64`) build environment.

To avoid native module compilation errors or binary mismatch between macOS (Darwin) and Linux, we use a Docker container configured with:
- **Base Image**: `ubuntu:22.04` (`--platform linux/amd64`)
- **Build Stack**: Node.js 22 LTS, Bun, `fakeroot`, `dpkg`, `rpm`, `squashfs-tools`
- **Isolated Node Modules Volume**: Prevents macOS `node_modules` from clashing with Linux binaries.

---

## 2. Prerequisites

1. **Docker Desktop** installed and running.
2. Enable Docker emulation support for `--platform linux/amd64`.

---

## 3. Quick Start (One-Click Command)

Run the automated helper script from the repo root:

```bash
./scripts/build-deb-in-docker.sh
```

Once completed, the generated `.deb` package will be available in the `./release` folder on your host machine:

```text
release/AionUi_<version>_amd64.deb
```

---

## 4. Manual Step-by-Step Instructions

If you prefer to run the steps manually:

### Step 1: Build the Docker Image

Build the packaging Docker image using `Dockerfile.deb`:

```bash
docker build --platform linux/amd64 -f Dockerfile.deb -t aionui-deb-builder:latest .
```

### Step 2: Run the Packaging Container

Execute the build inside the container. Ensure you use volume mounting with node_modules isolation:

```bash
docker run --platform linux/amd64 --rm \
  -v "$(pwd)":/app \
  -v aionui_linux_node_modules:/app/node_modules \
  aionui-deb-builder:latest
```

---

## 5. Troubleshooting & Tips

### Q: Why isolate `node_modules` with a Docker Volume?
macOS compiles C++ modules (such as `better-sqlite3`) into `.node` binaries for Darwin (macOS). If mounted directly into Linux, Node.js will fail with `invalid ELF header` errors. Using `-v aionui_linux_node_modules:/app/node_modules` keeps the Linux binaries isolated inside Docker.

### Q: Docker pull network timeout or TLS handshake failure
If pulling Docker Hub images fails due to network or proxy settings, prefix your docker commands with your local proxy settings:

```bash
HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 docker pull --platform linux/amd64 ubuntu:22.04
```
