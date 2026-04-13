# Claude Code MCP — Example

## Scenario: Connecting Claude to a Development Database for Schema-Aware Query Help

**Who:** Sofia Reyes, Full-Stack Developer, building a multi-tenant inventory management system
**Where:** Claude Code on a Next.js + Prisma + PostgreSQL project
**The Problem:** Every time Sofia asks Claude for help with database queries, she has to paste in the full schema manually. It takes 3-4 minutes just to get Claude enough context to help. The schema has 40+ tables. Claude frequently suggests queries for columns that were renamed months ago, causing wasted back-and-forth.

**Prerequisites:** PostgreSQL development database running locally, `POSTGRES_URL` set in the shell environment, Claude Code installed

---

### What You Say to the Agent

> "Connect Claude Code to my local dev database so you can inspect the schema directly. I'm tired of pasting schema definitions every time I ask for query help. Use MCP and scope it to this project so my teammates get it too."

### What the Agent Does

1. Runs `claude mcp add --scope project dev-db -- npx -y @modelcontextprotocol/server-postgres` with the `POSTGRES_URL` environment variable, creating a project-scoped entry in `.mcp.json`
2. Creates or updates `.mcp.json` in the project root with the server configuration
3. Confirms the server connection by asking Claude to list available tables from the database
4. Demonstrates the integration: introspects the `inventory_items` table, retrieves column names, types, and constraints directly from the live schema
5. Shows a sample query using the actual current column names, proving the schema context is live and accurate

### The Business Impact

- **Speed** — no more pasting schema definitions; Claude has live schema access in every session
- **Accuracy** — queries reference actual current column names, not stale documentation
- **Team alignment** — `.mcp.json` is committed to git, so every developer on the team gets the same database integration automatically

### Try It Yourself

> "Now that you have database access, find all tables that are missing indexes on their foreign key columns and generate the ALTER TABLE statements to add them."
