#!/usr/bin/env bash
set -e

echo "=== Building AionUi Linux (.deb) Package inside Docker (amd64) ==="

# Build the docker image for linux/amd64
docker build --platform linux/amd64 -f Dockerfile.deb -t aionui-deb-builder:latest .

# Run container with volume mount and node_modules isolation
docker run --platform linux/amd64 --rm \
  -v "$(pwd)":/app \
  -v aionui_linux_node_modules:/app/node_modules \
  aionui-deb-builder:latest

echo "=== Linux (.deb) Package Build Complete! Output located in release/ ==="
