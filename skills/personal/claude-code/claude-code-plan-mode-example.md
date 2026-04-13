# Claude Code Plan Mode — Example

## Scenario: Safely Planning a Database Migration Before Touching Any Code

**Who:** Anika Patel, Backend Engineer, responsible for migrating a PostgreSQL schema in a high-traffic SaaS application
**Where:** Claude Code on a Node.js/Prisma API with 200k active users
**The Problem:** Anika needs to add multi-tenancy to a single-tenant schema. The change touches 28 tables and every query in the codebase. Last time a big migration was attempted without proper planning, it caused a 2-hour outage. She needs Claude to map the full blast radius before any file is touched.

**Prerequisites:** Claude Code installed, project is a git repository, `Shift+Tab` available in the terminal

---

### What You Say to the Agent

> "Enter plan mode. Explore the entire database schema and codebase to map what would need to change to add multi-tenancy. I need a complete list of every file, table, and query affected before we touch anything."

### What the Agent Does

1. Activates plan mode (read-only: no writes, no file edits, no destructive commands)
2. Reads the Prisma schema file to map all 28 tables, identifying which ones have no tenant context and which already have an `organizationId` column
3. Greps the entire codebase for every database query, repository function, and migration file to build a complete map of what touches each table
4. Traces the API layer to identify all endpoints that would return cross-tenant data without an `organizationId` filter
5. Identifies the migration sequence: which tables to update first to avoid foreign key constraint errors
6. Produces a phased plan: Phase 1 (add nullable `organization_id` columns), Phase 2 (backfill data), Phase 3 (add NOT NULL constraints), Phase 4 (update all queries), Phase 5 (integration tests)
7. Lists every file that requires changes, grouped by service and risk level

### The Business Impact

- **Zero unplanned outages** — the full blast radius is understood before a single line of code changes
- **Team alignment** — the plan can be reviewed, modified, and approved in a PR before execution begins
- **Risk reduction** — the phased approach identifies a safe rollback point at each phase

### Try It Yourself

> "Enter plan mode and explore what it would take to replace our current session-based authentication with JWT tokens. Map all affected files, middleware, and tests without changing anything."
