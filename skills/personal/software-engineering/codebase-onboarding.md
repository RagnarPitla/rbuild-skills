---
name: codebase-onboarding
description: Structured approach to understanding an unfamiliar codebase fast — entry points, data model, key abstractions, and mental model building. Use when user says 'onboard to this codebase', 'understand this repo', 'new codebase', 'explain this project', 'where do I start', 'how does this code work'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, software-engineering, onboarding, codebase]
---


# Codebase Onboarding

The fastest way to understand a new codebase is not to read all the code — it's to read the right code in the right order. Most engineers start by trying to read everything. The engineers who onboard fastest start with structure, then trace a single path end-to-end.

## The 5-Step Onboarding Protocol

### Step 1: Read the README and Docs (15 min)

Before touching code:
- What problem does this system solve?
- What are the key components?
- How do you run it locally?
- What is the deployment model?

If the README is missing or outdated, that's important information — it tells you about the team's documentation culture.

### Step 2: Understand the Folder Structure (10 min)

```bash
# Get a high-level view without diving in
ls -la
# Look at the top-level directories
# What is the tech stack?
# Is this a monorepo? Microservices? Monolith?
```

Common patterns:
```
src/
  api/        # Route handlers / controllers
  services/   # Business logic
  models/     # Data models / database schemas
  utils/      # Shared utilities
  types/      # TypeScript type definitions
tests/
  unit/
  integration/
  e2e/
```

### Step 3: Find the Entry Points

Every system has entry points — where requests come in.

**For a web API:** Find the router/main file where routes are registered
```typescript
// Express
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// FastAPI
app.include_router(users_router, prefix="/users")
```

**For a CLI:** Find the main command handler
**For a background worker:** Find the queue consumer or cron setup
**For a frontend:** Find the App component and router

The entry points tell you every capability the system has.

### Step 4: Trace a Request End-to-End

Pick ONE important user journey and trace it from entry to exit. For an API, pick the most important endpoint and follow it all the way through:

```
HTTP Request
  -> Router / Handler
    -> Input validation
      -> Service layer (business logic)
        -> Database query
          -> Response formatting
            -> HTTP Response
```

As you trace, note:
- Where is authentication checked?
- Where is authorization checked?
- What external services are called?
- What is logged?
- How are errors handled?

This single trace will teach you 70% of the system's patterns.

### Step 5: Understand the Data Model

The data model is the skeleton of the system. Everything else is built around it.

```bash
# For a database-backed app, find the schema files
# Prisma: prisma/schema.prisma
# Django: look for models.py
# Rails: db/schema.rb
# Raw SQL: look for migrations/
```

Draw (or mentally map) the entity relationships:
- What are the main entities?
- What are the relationships (one-to-many, many-to-many)?
- What are the key foreign keys?

If you understand User, Order, Product, and how they relate — you understand most e-commerce systems.

## Quick Reference Checklist

- [ ] README read, local setup working
- [ ] Tech stack identified (language, framework, database, cache, message queue)
- [ ] Folder structure understood
- [ ] Entry points (routes, main, consumers) identified
- [ ] One request traced end-to-end
- [ ] Data model understood (core entities and relationships)
- [ ] Test structure found (unit, integration, e2e — what exists?)
- [ ] CI/CD pipeline understood (how does code get to production?)
- [ ] Key configurations identified (.env, config files, feature flags)
- [ ] Team norms understood (coding standards, PR process)

## Building a Mental Model Document

After your onboarding session, write a one-page mental model:

```markdown
# [Project Name] — Mental Model

## What it does
[One paragraph: the system's purpose and main users]

## Tech Stack
- Language: TypeScript / Node.js 22
- Framework: Express 4.x
- Database: PostgreSQL 16 (ORM: Prisma)
- Cache: Redis
- Queue: BullMQ
- Hosting: AWS ECS

## Key Entry Points
- REST API: src/api/ — registered in src/app.ts
- Background jobs: src/workers/ — started in src/worker.ts
- Cron jobs: src/cron/ — configured in src/scheduler.ts

## Core Data Model
User (1) -- (many) Order -- (many) OrderItem -- (1) Product
Order has status: pending -> confirmed -> shipped -> delivered

## One Request End-to-End
POST /orders:
1. auth middleware validates JWT (src/middleware/auth.ts)
2. validation: zod schema in src/api/orders/schema.ts
3. OrderService.createOrder() in src/services/OrderService.ts
4. DB write via Prisma, cache invalidated, event emitted to queue
5. Returns 201 with Location header

## Key Abstractions
- BaseService: all services extend this (logging, error handling)
- AuthContext: injected into every handler via middleware
- EventBus: used for all async side effects (emails, notifications)

## What I Don't Understand Yet
- How the pricing engine works (src/services/PricingService.ts)
- The inventory reservation flow during checkout
```

This document pays dividends when you're onboarding other engineers.

## Trigger Phrases

- "onboard to this codebase"
- "understand this repo"
- "new codebase"
- "explain this project"
- "where do I start"
- "how does this code work"
- "analyze this codebase"
- "give me an overview of this project"

## Quick Example

> See `codebase-onboarding-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Overwhelmed by the codebase size | Trying to read everything | Follow the 5-step protocol strictly — trace one path only, resist the urge to explore |
| Cannot find the entry points | Complex routing setup or framework magic | Search for where the HTTP server is started (listen(), app.run()), then work backwards from there |
| Data model is unclear | No schema files or no ORM | Look for migration files in db/ or migrations/, or read the test fixtures which often reflect the full schema |
| README is outdated and misleading | Documentation not maintained | Trust the code over the README; run the tests to verify what actually works |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
