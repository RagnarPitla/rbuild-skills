# Docker Patterns — Example

## Scenario: Shrinking a 1.8GB MCP Server Image and Fixing a Root User Issue

**Who:** Sam Okafor, Backend Developer building an MCP server for enterprise D365 integration
**Where:** Node.js/TypeScript MCP server, Docker, GitHub Actions CI pipeline
**The Problem:** Sam's MCP server Docker image is 1.8GB and takes 4 minutes to build in CI. The image was built from `node:20` (full Debian image) with all dev dependencies included. A security scan flagged that the container runs as root, which violates the company's container security policy. Every PR takes 4 minutes just for the Docker build step, developers are complaining, and the security team will not approve the production deployment until the root user issue is fixed.

**Prerequisites:** An existing Dockerfile. The skill works by reading the current file and producing an optimized replacement.

---

### What You Say to the Agent

> "My MCP server Docker image is 1.8GB and takes 4 minutes to build. It's running as root. Here's my current Dockerfile. Optimize it: reduce image size, fix the root user security issue, and keep the build cache working well for CI where dependencies rarely change but code changes on every commit."

### What the Agent Does

Diagnoses the problems and rewrites the Dockerfile:

```dockerfile
# Before: single-stage, node:20, all deps, running as root
# FROM node:20
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build
# CMD ["node", "dist/index.js"]
# Result: 1.8GB, 4 min build, runs as root

# After: multi-stage, alpine, non-root user, layer-cached deps
FROM node:20-alpine AS builder
WORKDIR /app

# Layer 1: dependencies (cached unless package.json changes)
COPY package*.json ./
RUN npm ci --only=production

# Layer 2: TypeScript build (separate so type-check deps don't land in prod)
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Production stage: only the runtime artifact
FROM node:20-alpine AS production
WORKDIR /app

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what the runtime needs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Minimal metadata
EXPOSE 3000
USER appuser
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

Also adds a `.dockerignore` that excludes `node_modules`, `src/`, `*.test.ts`, `.env*`, and `dist/` from the build context — this alone cuts the build context from 400MB to under 5MB.

### The Business Impact

- **Image size: 1.8GB to 148MB** — 92% reduction, Alpine base plus production deps only
- **Build time: 4 minutes to 45 seconds** — layer caching means `npm ci` only runs when `package.json` changes, which is rare
- **Security policy satisfied** — container runs as `appuser`, not root. Security scan passes
- **CI costs reduced** — faster builds mean fewer minutes billed on GitHub Actions runners

### Try It Yourself

> "Now add a Docker Compose file for local development. The dev setup needs hot-reload (mount `src/` as a volume), the same non-root user, environment variables loaded from a `.env` file, and a depends_on for a local Azurite container simulating Azure Storage."
