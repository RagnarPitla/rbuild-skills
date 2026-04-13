---
name: claude-code-mcp
description: "Connect Claude Code to external tools and services using MCP (Model Context Protocol) servers. Use when user says 'connect Claude to my database', 'add GitHub MCP', 'use Playwright with Claude Code', 'how do I set up MCP servers', 'give Claude access to my tools'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, claude-code, mcp, integrations]
---

# Claude Code MCP Integrations

MCP (Model Context Protocol) is an open standard that lets Claude connect to external tools, databases, and services. Each MCP server exposes tools, resources, and prompts that Claude can discover and call just like built-in tools.

Claude Code manages MCP servers via the `claude mcp` CLI commands. Servers are scoped either per-user (`~/.claude/settings.json`) or per-project (`.mcp.json` in the project root).

## Triggers

- "How do I connect Claude Code to my Postgres database?"
- "Add GitHub MCP to my Claude Code setup"
- "I want Claude to be able to control a browser using Playwright"
- "How do MCP servers work in Claude Code?"
- "Give Claude Code access to my custom tools"
- "What is the mcp__ prefix I see in tool names?"

## How It Works

1. **Understand the architecture.** An MCP server is a separate process that exposes tools over a standardized protocol. Claude Code spawns the server process, discovers its tools, and routes calls through the protocol. The server handles the actual execution and returns results.

2. **Add a server with `claude mcp add`.** This registers the server in your settings. Specify the command to start the server and any arguments or environment variables it needs.

3. **Choose the right scope.** Use `--scope user` (default) to register in `~/.claude/settings.json` for personal access across all projects. Use `--scope project` to register in `.mcp.json` in the current directory for team sharing via git.

4. **Discover what a server provides.** After adding a server, Claude Code automatically discovers its tools, resources, and prompts. Tools appear with the `mcp__<server-name>__<tool-name>` prefix in the tool namespace.

5. **Use the ToolSearch pattern for lazy loading.** MCP tools are deferred by default. Before calling an MCP tool, use the ToolSearch mechanism to load the tool schema. This keeps context windows clean for servers you may not use every session.

6. **Manage servers with `claude mcp list`, `claude mcp remove`, and `claude mcp get`.** These commands let you inspect and maintain your configured servers.

```bash
# Add a GitHub MCP server (user-scoped, available everywhere)
claude mcp add github-mcp -- npx -y @github/mcp-server

# Add Postgres MCP with environment variable for the connection string
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres \
  --env POSTGRES_URL="postgresql://user:pass@localhost:5432/mydb"

# Add Playwright MCP for browser automation
claude mcp add playwright -- npx -y @playwright/mcp-server

# Add a project-scoped server (stored in .mcp.json, committed to git)
claude mcp add --scope project my-api-server -- node ./mcp-servers/api-server.js

# List all configured servers
claude mcp list

# Get details about a specific server
claude mcp get github-mcp

# Remove a server
claude mcp remove github-mcp

# Check server connection status
claude mcp status
```

## Quick Reference

| Command | What it does |
|---------|-------------|
| `claude mcp add <name> -- <cmd>` | Register a new MCP server |
| `claude mcp add --scope project <name> -- <cmd>` | Register project-scoped (in .mcp.json) |
| `claude mcp list` | Show all configured servers |
| `claude mcp get <name>` | Show details for one server |
| `claude mcp remove <name>` | Remove a server |
| `claude mcp status` | Check connection health |

| Scope | Config file | Shared? | When to use |
|-------|------------|---------|-------------|
| `user` (default) | `~/.claude/settings.json` | No | Personal tools, credentials |
| `project` | `.mcp.json` in project root | Via git | Team tools, project-specific integrations |

| Tool prefix pattern | What it means |
|--------------------|--------------|
| `mcp__github__create_issue` | GitHub MCP server, create_issue tool |
| `mcp__postgres__query` | Postgres MCP server, query tool |
| `mcp__playwright__browser_navigate` | Playwright MCP server, navigate tool |

## Common Patterns

### Pattern 1: GitHub Integration for PR Workflows

Add GitHub MCP to let Claude read issues, create PRs, post comments, and manage repos.

```bash
# Add GitHub MCP (requires GITHUB_TOKEN env var)
claude mcp add github -- npx -y @github/mcp-server \
  --env GITHUB_TOKEN="$GITHUB_TOKEN"
```

With this configured, you can ask Claude things like:
- "List open PRs assigned to me"
- "Create a GitHub issue for the bug we just found"
- "Check the CI status for this PR"
- "What comments were left on PR #142?"

### Pattern 2: Local Database Access

Give Claude read/write access to a development database for schema inspection and query help.

```bash
# Postgres MCP (recommend read-only role for safety)
claude mcp add dev-db -- npx -y @modelcontextprotocol/server-postgres \
  --env POSTGRES_URL="postgresql://readonly_user:pass@localhost:5432/dev_db"

# SQLite for local file-based databases
claude mcp add local-db -- npx -y @modelcontextprotocol/server-sqlite \
  --env SQLITE_PATH="./data/local.db"
```

Claude can then inspect schemas, run diagnostic queries, and help you write correct SQL without needing you to copy-paste schema definitions.

### Pattern 3: Project-Scoped Custom MCP Server

Build and register a custom MCP server for team use. Add it to `.mcp.json` so every developer automatically gets it.

```json
// .mcp.json (committed to git)
{
  "mcpServers": {
    "internal-api": {
      "command": "node",
      "args": ["./tools/mcp-server/index.js"],
      "env": {
        "API_BASE_URL": "https://api.internal.company.com"
      }
    }
  }
}
```

Every team member who clones the repo gets the same MCP server registered automatically. No `claude mcp add` needed.

### Pattern 4: Browser Automation with Playwright MCP

Use Playwright MCP to let Claude control a browser for end-to-end testing, scraping, or UI verification.

```bash
claude mcp add playwright -- npx -y @playwright/mcp-server
```

After adding, Claude can:
- Navigate to URLs and take screenshots
- Click elements, fill forms, submit
- Wait for page states and extract content
- Run full end-to-end test scenarios interactively

Ask: "Navigate to localhost:3000, fill in the login form with test credentials, and verify the dashboard loads correctly."

## Troubleshooting

**Server added but tools not visible**

MCP tools are lazily loaded. Run a quick test by asking Claude "what tools do you have from the X server?" to force tool discovery. If the server fails to start, check the server process logs. Run the server command manually in your terminal to see startup errors.

**`mcp__` tool call fails with input validation error**

The tool schema has not been loaded yet. Use the ToolSearch function first: `ToolSearch("select:mcp__<server>__<tool>")`. This loads the schema and makes the tool callable. This is a lazy-loading pattern to keep context windows clean.

**Environment variables not passed to the server**

Add `--env KEY=VALUE` flags to the `claude mcp add` command for each variable. Or set them in your shell profile before starting Claude Code. Variables in the `env` section of `.mcp.json` are passed at startup. Note: secrets in `.mcp.json` will be committed to git if the file is tracked. Use references to shell variables instead: `"env": { "API_KEY": "${MY_API_KEY}" }`.

**Project-scoped server not loading for teammates**

The `.mcp.json` file must be committed to git. Check that it is not in `.gitignore`. Also verify that the server command (e.g., `node ./tools/mcp-server/index.js`) uses a relative path that works from the project root on any machine. The `node_modules` for the server must also be installed.

**Server connection drops during long sessions**

Some MCP servers time out on inactivity. Claude Code will reconnect automatically on the next tool call, but there may be a brief delay. For production-critical servers, run a keep-alive background script or use a server that has built-in reconnect logic.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
