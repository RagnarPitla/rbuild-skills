---
name: "docker-patterns"
slug: "docker-patterns"
description: "Dockerfile best practices with multi-stage builds, layer caching, non-root user patterns, docker-compose for local dev, networking, volume management, and environment variable handling. Use when user says 'Docker setup', 'containerize my app', 'Dockerfile', 'docker-compose', 'Docker best practices', 'container setup'."
tab: "personal"
domain: "devops"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "devops", "docker", "containers"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Azure CLI, Docker"
mcp_tools: []
---


# Docker Patterns

Production-ready Docker patterns for containerizing apps that will run on Azure Container Apps, Container Instances, or any container platform. Covers Dockerfiles, multi-stage builds, compose for local dev, and security hardening.

## Trigger Phrases

- "Docker setup"
- "containerize my app"
- "write a Dockerfile"
- "docker-compose for local dev"
- "Docker best practices"
- "multi-stage build"
- "container setup"
- "Docker networking"

## Dockerfile Patterns

### Multi-Stage Build (Node.js / TypeScript)

Multi-stage builds produce smaller final images by separating the build environment from the runtime environment.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer cache optimization)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

# Security: create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Security: drop to non-root user
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/index.js"]
```

### Multi-Stage Build (Python)

```dockerfile
FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim AS runtime

RUN useradd -m -u 1001 appuser

WORKDIR /app

COPY --from=builder /root/.local /home/appuser/.local
COPY src/ ./src/

USER appuser

ENV PATH=/home/appuser/.local/bin:$PATH

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Layer Caching Strategy

Order Dockerfile commands from least to most frequently changed:

```dockerfile
# Good order (most cache hits)
COPY package.json ./          # Changes rarely
RUN npm install               # Expensive: only re-runs when package.json changes
COPY src/ ./                  # Changes often
RUN npm run build             # Re-runs whenever src changes
```

**Rule:** Put `COPY` for dependencies before `COPY` for source code.

## Security Hardening

### Non-Root User (must do)
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### Read-Only Filesystem
```dockerfile
# In docker-compose or run command
--read-only --tmpfs /tmp --tmpfs /var/run
```

### Minimal Base Image
```
node:20-alpine     # 50MB vs 900MB for node:20
python:3.12-slim   # 130MB vs 1GB for python:3.12
distroless         # Near-zero attack surface
```

### No secrets in Dockerfile
```dockerfile
# Never do this:
ENV API_KEY=abc123

# Do this instead:
# Pass at runtime via environment or secret store
```

## docker-compose for Local Dev

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build:
      context: .
      target: builder    # Use builder stage for dev (hot reload)
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://dev:dev@db:5432/myapp
    env_file:
      - .env.local        # Local overrides, never committed
    volumes:
      - ./src:/app/src    # Hot reload: mount source for local dev only
      - node_modules:/app/node_modules  # Named volume for node_modules
    depends_on:
      db:
        condition: service_healthy
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  node_modules:
```

## Networking

### Service-to-Service Communication

In docker-compose, services communicate by service name:

```typescript
// App connecting to 'db' service
const pool = new Pool({
  connectionString: 'postgresql://dev:dev@db:5432/myapp'
  // 'db' resolves to the db container's IP on the compose network
});
```

### Network Isolation

```yaml
services:
  frontend:
    networks:
      - public
  api:
    networks:
      - public
      - internal
  db:
    networks:
      - internal    # DB not accessible from outside compose network

networks:
  public:
  internal:
    internal: true  # No external routing
```

## Environment Variable Management

```
.env                 # Defaults committed to git (no secrets)
.env.local           # Local overrides, add to .gitignore
.env.production      # Production values, add to .gitignore or use secret store
```

**.env (committed):**
```
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

**.env.local (not committed):**
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
AZURE_CLIENT_SECRET=...
```

**Always add to .gitignore:**
```
.env.local
.env.production
.env*.local
```

## .dockerignore

Prevent large or sensitive files from entering the build context:

```
node_modules
dist
.git
.env*
*.log
.DS_Store
coverage
.nyc_output
```

## Useful Commands

```bash
# Build with specific target stage
docker build --target runtime -t myapp:latest .

# Run with env file
docker run --env-file .env.local -p 3000:3000 myapp:latest

# Inspect image layers and sizes
docker history myapp:latest

# Clean up stopped containers and dangling images
docker system prune

# Follow logs from all compose services
docker compose logs -f

# Rebuild a single service
docker compose up --build app
```

## Quick Example

> See `docker-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Image too large | No multi-stage build or wrong base image | Use alpine/slim base images and multi-stage to separate build from runtime |
| Container exits immediately | CMD fails or process exits | Check logs with `docker logs [container]`, ensure CMD starts a foreground process |
| Volume permissions error | Host volume mounted with root ownership | Add `USER appuser` before `VOLUME` declaration, or use named volumes instead of bind mounts |
| Hot reload not working in compose | Source not mounted or watcher not polling | Add `volumes: - ./src:/app/src` and set file watcher to polling mode (needed in Docker Desktop on Mac) |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
