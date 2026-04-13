---
name: claude-code-memory
description: "Use CLAUDE.md files to give Claude Code persistent project context, coding standards, and team conventions. Use when user says 'how does Claude remember my project', 'set up project memory', 'create a CLAUDE.md', 'tell Claude about my codebase', 'make Claude follow my coding standards'."
tab: claude-code
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, claude-code, memory, project-setup]
---

# Claude Code Memory (CLAUDE.md)

CLAUDE.md is a markdown file that Claude Code reads at the start of every session. It is your persistent memory layer: project conventions, architecture decisions, team rules, and any context Claude needs to work effectively without re-explaining it every time.

Place `CLAUDE.md` at your project root for project-level memory, and `~/.claude/CLAUDE.md` for global memory that applies across every project.

## Triggers

- "How do I get Claude to remember my project conventions?"
- "Create a CLAUDE.md for this project"
- "Claude keeps forgetting my coding standards — how do I fix that?"
- "What should I put in CLAUDE.md?"
- "How does Claude Code remember context between sessions?"
- "Set up project memory so Claude follows our team rules"

## How It Works

1. **Claude reads CLAUDE.md automatically at session start.** You do not need to upload it or reference it in your prompt. Claude Code discovers `CLAUDE.md` files in the current directory and any parent directories up to the git root. Global `~/.claude/CLAUDE.md` is always read.

2. **Layer multiple CLAUDE.md files for large codebases.** Place a `CLAUDE.md` at the project root for global project context. Add `CLAUDE.md` files in subdirectories for module-specific context. Claude reads all of them in hierarchy order: global first, then root, then subdirectory.

3. **Write what Claude needs to work correctly, not a tutorial.** Good CLAUDE.md content: your tech stack versions, naming conventions, architectural decisions, file structure, scripts to run before committing, common gotchas. Bad content: explaining what React is, generic best practices.

4. **Keep it under 200 lines.** Claude reads the whole file into context on every session. Long CLAUDE.md files waste context budget and dilute the important parts. Link to external docs for deep reference material; put only the actionable rules in CLAUDE.md.

5. **Commit to git and keep it up to date.** CLAUDE.md is team infrastructure. Every new developer who clones the repo gets the same context. Treat it like your `.eslintrc` — update it when conventions change.

6. **Use `@file` references for volatile content.** Instead of embedding a large architecture diagram in CLAUDE.md, write `See @docs/architecture.md for the full system diagram`. Claude will read that file when relevant without loading it into every session.

```bash
# Create a project CLAUDE.md
cat > CLAUDE.md << 'EOF'
# Project: OrderFlow API

## Tech Stack
- Node.js 22 with TypeScript 5.4
- Express 4.x for HTTP, Zod for validation
- Prisma 5.x with PostgreSQL 16
- Vitest for unit tests, Supertest for integration tests

## Project Structure
- src/routes/ -- HTTP route handlers (thin, delegate to services)
- src/services/ -- Business logic (no direct DB access)
- src/repositories/ -- All database queries live here
- src/models/ -- Zod schemas and TypeScript types

## Naming Conventions
- Files: kebab-case (order-service.ts, not orderService.ts)
- Functions: camelCase
- Types and Interfaces: PascalCase, no I prefix
- Constants: SCREAMING_SNAKE_CASE
- Database tables: snake_case plural (order_items, not orderItems)

## Before Committing
- Run: npm run type-check && npm run lint && npm test
- All tests must pass, no TypeScript errors, no lint warnings
- Never commit .env files

## Architecture Rules
- Services must not import from other services directly (use events or dependency injection)
- Repository functions must return domain objects, not raw Prisma results
- All HTTP errors must use our AppError class (src/errors/app-error.ts)
- Never use any type without a comment explaining why

## Common Gotchas
- The database uses UTC timestamps everywhere; never use new Date() without toUTC()
- Order IDs are UUIDs prefixed with "ord_" (e.g., ord_01j9abc...)
- Rate limiting is handled at the gateway layer, not in this service
EOF

# Create global CLAUDE.md for personal preferences
cat > ~/.claude/CLAUDE.md << 'EOF'
# Global Claude Code Preferences

## My Stack
TypeScript, Node.js, React, Prisma, PostgreSQL. Prefer functional patterns.

## Writing Style
- Concise code with minimal comments (code should be self-documenting)
- Explicit error handling — never swallow errors silently
- Use named exports, not default exports

## Commit Style
Conventional commits: feat/fix/chore/docs/refactor/test with scope.
Always explain WHY in the commit body if the change is non-obvious.

## I Never Want
- Barrel files (index.ts re-exporting everything)
- Class-based code when a function will do
- Lodash or underscore (use native JS)
EOF
```

## Quick Reference

| File location | Scope | Who reads it |
|--------------|-------|-------------|
| `~/.claude/CLAUDE.md` | Global | Every project, every session |
| `<project-root>/CLAUDE.md` | Project | All sessions in this project |
| `<subdir>/CLAUDE.md` | Module | Sessions working in that subdirectory |

| What to include | What to skip |
|-----------------|--------------|
| Tech stack versions | Generic best practices |
| Naming conventions | What the language features do |
| File structure | Full API docs (link instead) |
| Build/test commands | Credentials or secrets |
| Common gotchas | Information Claude already knows |
| Architectural rules | Instructions that never apply |

## Common Patterns

### Pattern 1: New Project Bootstrap

When starting a new project, generate a CLAUDE.md based on your actual stack and conventions.

Ask Claude: "I'm starting a new Next.js 15 project with Prisma, TypeScript strict mode, and Vitest. Create a CLAUDE.md for this project with the structure and conventions I should use."

Then edit the output to match your actual decisions. Commit it with your initial setup commit so it is in the repo from day one.

### Pattern 2: Importing Legacy Codebase Context

When onboarding to a large existing codebase, generate CLAUDE.md by having Claude explore the project first.

```
Please explore this codebase and generate a CLAUDE.md that captures:
1. The actual tech stack and versions from package.json
2. The folder structure and what belongs where
3. Any naming conventions you observe in the existing code
4. The test setup and how to run tests
5. Any patterns used consistently (error handling, validation, etc.)
```

Review and correct the output, then commit it.

### Pattern 3: Subdirectory Module Context

Large monorepos benefit from per-module CLAUDE.md files.

```
# packages/auth/CLAUDE.md
# Auth Module

This module handles all authentication and authorization.

## Key Files
- src/providers/ -- OAuth provider implementations (Google, GitHub, Azure AD)
- src/tokens/ -- JWT generation and validation
- src/middleware/ -- Express middleware for route protection

## Important Rules
- Never log tokens or credentials, even partially
- All token validation happens in src/tokens/validator.ts -- never inline it
- Session expiry is configured via AUTH_SESSION_TTL env variable (default 8h)
- Permissions use RBAC patterns from @company/rbac-core package
```

### Pattern 4: Team Onboarding Context

CLAUDE.md doubles as onboarding documentation for new developers.

```markdown
# Onboarding Notes for New Developers

## First Session
Run `npm run setup` to initialize your local environment.
The setup script creates .env from .env.example and seeds the dev database.

## Key Architectural Decisions
- We chose Prisma over raw SQL for migrations (decision log: docs/decisions/001-orm.md)
- The event system uses Redis pub/sub, not database polling
- All background jobs are in src/jobs/ and use BullMQ

## Where to Start
- src/server.ts is the entry point
- src/routes/index.ts registers all route handlers
- docs/architecture.md has the full system diagram
```

## Troubleshooting

**Claude ignores my CLAUDE.md conventions**

Make sure the file is at the git root (where `.git` is located), not in a subdirectory unless that is where you are working. Check that the file is named exactly `CLAUDE.md` (uppercase, `.md` extension). Verify Claude confirms reading it at session start — if not, the file may not be discovered.

**CLAUDE.md is too long and Claude seems to forget parts of it**

Trim to under 200 lines. Move detailed documentation to separate files and reference them with `@filename` syntax. Keep CLAUDE.md focused on rules and conventions. Remove anything that is good-practice-but-obvious or that Claude would follow by default anyway.

**Team members have different behavior from Claude**

The project `CLAUDE.md` should be committed to git (it is safe to commit). Check that everyone is running Claude Code from the project root (not from a subdirectory). Verify the file has no merge conflicts or stale content from an old branch.

**Conventions in CLAUDE.md conflict with global CLAUDE.md**

Project-level CLAUDE.md takes precedence over global for the same instructions. Be explicit about overrides. If global says "use tabs" and project says "use spaces," state in the project file: "Use 2 spaces for indentation (overrides global preference)."

**I updated CLAUDE.md but Claude still behaves the old way**

Start a new session — CLAUDE.md is read at session start, not mid-session. Changes to CLAUDE.md take effect on the next session.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
