# syntax=docker/dockerfile:1
FROM node:16.20.2-bookworm-slim@sha256:89061680359f5d9103d24f0066e2c96a8018c24d5c4fe8eb8d59d16dd4ab64ba AS base
FROM base AS builder

RUN <<EOT
    set -eu
    apt-get update
    buildDeps="python3 build-essential git ca-certificates"
    apt-get install -y --no-install-recommends $buildDeps
    rm -rf /var/lib/apt/lists/*
EOT

COPY --chown=node . /build/
RUN corepack enable

USER node
WORKDIR /build
RUN <<EOT
    set -eu
    make install
    yarn build
EOT

FROM base

LABEL maintainer="INTK <collective@plone.org>" \
      org.label-schema.name="bonnefanten-frontend" \
      org.label-schema.description="Bonnefanten frontend image." \
      org.label-schema.vendor="INTK"

RUN <<EOT
    set -eu
    apt-get update
    buildDeps="busybox"
    apt-get install -y --no-install-recommends $buildDeps
    busybox --install -s
    rm -rf /var/lib/apt/lists/*
EOT


USER node
COPY --from=builder /build/ /app/

WORKDIR /app
EXPOSE 3000
CMD ["yarn", "start:prod"]
