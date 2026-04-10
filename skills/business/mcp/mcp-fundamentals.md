---
name: mcp-fundamentals
description: "What is Model Context Protocol? How hosts, clients, and servers work together, and why it matters for enterprise AI agents. Use when user says 'how does MCP work', 'model context protocol explained', 'what is MCP', 'MCP architecture', 'how do AI agents connect to systems', 'MCP vs REST API vs Power Automate'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, mcp, model-context-protocol, architecture]
requires: Node.js TypeScript SDK
mcp_tools:
  - "mcp-server-sdk"
---


# MCP Fundamentals

Model Context Protocol (MCP) is the USB-C of AI. It's a standard way for AI agents to connect to any external system: your ERP, your database, your file system, without custom integration code for every combination.

Released by Anthropic in late 2024, MCP has since been adopted by OpenAI, Google, and Microsoft. It's becoming the standard protocol for agent-to-system connectivity.

## The Three Components

```
+--------------------------------------------------+
|                      HOST                         |
|   (Claude Code, Claude Desktop, your app)        |
|                                                   |
|   +-----------+        +----------------------+  |
|   |  CLIENT   |<------>|    MCP SERVER        |  |
|   +-----------+  MCP   |  (D365, files,       |  |
|                Protocol|   databases, APIs)   |  |
|                        +----------------------+  |
+--------------------------------------------------+
```

**Host:** The AI application that manages the conversation (Claude Code, your custom app).

**Client:** Lives inside the host. Maintains the connection to MCP servers. One client per server connection.

**Server:** The external system adapter you build. Exposes tools, resources, and prompts that the agent can use.

## What MCP Servers Expose

### Tools
Functions the agent can call. Like API endpoints but with rich schema documentation that the LLM understands:

```
Tool: get_purchase_order
Description: Retrieve a D365 purchase order by PO number
Input: { po_number: string }
Output: { vendor, amount, status, line_items[] }
```

The agent decides when to call this tool based on the conversation context.

### Resources
Data the agent can read, like files or database records. Think of them as context that gets added to the agent's working memory.

### Prompts
Pre-built prompt templates that guide the agent on how to use the server's capabilities.

## Transport Protocols

| Transport | Description | Use Case |
|---|---|---|
| **stdio** | Server runs as local process, communicates via stdin/stdout | Local tools, development, Claude Code |
| **Streamable HTTP** | Server runs as HTTP service with SSE support | Production enterprise deployments, Azure-hosted servers |

For D365 integrations in production: use Streamable HTTP, deployed to Azure Container Apps.

## The MCP Message Flow

```
1. Agent receives user message: "What's the PO status for PO-12345?"
2. Agent reasons: I need to call get_purchase_order
3. Agent sends tool call to MCP client
4. Client forwards to MCP server over transport
5. Server calls D365 OData: GET /data/PurchaseOrderHeadersV2?$filter=...
6. D365 returns data
7. Server formats result, returns to client
8. Client passes result back to agent
9. Agent synthesizes response to user
```

## Why MCP Matters for Enterprise (D365, Dataverse, SAP)

Before MCP, connecting an AI agent to D365 required:
1. Building a custom connector
2. Writing Power Automate flows
3. Wiring up REST calls with auth handling
4. Rebuilding this for every agent

With MCP, you build **one D365 MCP server** that exposes your ERP's capabilities as tools. Every agent that needs D365 access just connects to that server. Build once, use everywhere.

**Real example from my work at Microsoft:**
We built an MCP server that exposes D365 F&O OData entities as tools: `get_inventory_on_hand`, `create_purchase_requisition`, `get_vendor_invoice_status`. Any Copilot Studio agent or Claude Code session that needs D365 data connects to this single server. The agent gets D365 access in seconds, not weeks.

## MCP vs Traditional APIs vs Power Automate

| | MCP | REST API | Power Automate |
|---|---|---|---|
| **Who calls it** | AI agent directly | Developer-controlled | Triggered by flow |
| **Schema documentation** | Rich, LLM-readable | OpenAPI (if exists) | Connector metadata |
| **Agent autonomy** | Agent decides when/how | Fixed code path | Fixed trigger |
| **Best for** | Agent-driven operations | App-to-app integration | Human workflow automation |
| **Write operations** | Possible but use carefully | Standard pattern | Preferred for approvals |
| **Setup complexity** | Medium (requires server) | Low to medium | Low (no-code) |

Use MCP when the **agent** needs to decide what to do and when. Use Power Automate when you know the exact sequence of steps in advance.

## When NOT to Use MCP

- Simple data lookups that happen in every conversation: use a connector action in Copilot Studio
- Human-approval workflows: Power Automate is better suited
- Very simple integrations (one API call, one response): Power Automate HTTP connector is faster to build
- Team has no developer resources: stay with Power Automate connectors for now

## Capability Comparison

| Capability | MCP Server | Copilot Studio Connector | Power Automate Flow |
|---|---|---|---|
| Real-time ERP read | Yes | Yes (with setup) | Yes (with trigger) |
| Agent-decided queries | Yes (agent picks filters) | Limited | No |
| Write / create records | Yes | Yes | Yes (preferred) |
| Approval routing | Possible | Possible | Best tool |
| Audit trail | Build it yourself | Limited | Built-in |
| Non-developer friendly | No | Partially | Yes |

## Next Step

Ready to build your first MCP server? See the `build-mcp` skill for a step-by-step TypeScript implementation guide.

## Trigger Phrases

- "how does MCP work"
- "model context protocol explained"
- "what is MCP"
- "MCP architecture"
- "how do AI agents connect to systems"
- "MCP vs REST API vs Power Automate"
- "mcp fundamentals"
- "model context protocol for enterprise"

## Quick Example

> See `mcp-fundamentals-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent calls wrong tool or no tool | Tool descriptions too vague, LLM can't distinguish them | Rewrite tool descriptions to be highly specific: include when to use it vs similar tools, expected input format, output shape |
| MCP server not connecting | Transport mismatch (stdio vs HTTP) or wrong config | Match transport type in server and client config; for remote servers use Streamable HTTP, not stdio |
| Tools return data but agent ignores it | Tool output format not LLM-friendly (raw JSON, nested objects) | Format tool output as clean, structured text with field labels; avoid deeply nested JSON in tool responses |
| Performance slow for ERP queries | No response caching, every call hits D365 | Add in-memory cache for read tools with 5-15 minute TTL; most ERP data doesn't change second-to-second |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
