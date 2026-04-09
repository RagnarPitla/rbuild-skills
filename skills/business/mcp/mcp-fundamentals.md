---
name: "MCP Fundamentals"
slug: "mcp-fundamentals"
description: "What is Model Context Protocol? How hosts, clients, and servers work together — and why it matters for enterprise AI agents."
tab: "business"
domain: "mcp"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["mcp", "model-context-protocol", "architecture", "enterprise-ai", "d365"]
version: "1.0"
icon_emoji: "🔌"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: "mcp-path"
learning_path_position: 1
prerequisites: []
references:
  - title: "Model Context Protocol Specification"
    url: "https://modelcontextprotocol.io"
  - title: "Claude Code MCP Documentation"
    url: "https://docs.anthropic.com/en/docs/claude-code/mcp"
  - title: "MCP Servers GitHub"
    url: "https://github.com/anthropics/mcp"
---

# MCP Fundamentals

Model Context Protocol (MCP) is the USB-C of AI. It's a standard way for AI agents to connect to any external system — your ERP, your database, your file system — without custom integration code for every combination.

Released by Anthropic in late 2024, MCP has since been adopted by OpenAI, Google, and Microsoft. It's becoming the standard protocol for agent-to-system connectivity.

## The Three Components

```
┌─────────────────────────────────────────────────┐
│                    HOST                          │
│  (Claude Code, Claude Desktop, your app)        │
│                                                  │
│   ┌──────────┐        ┌──────────────────────┐  │
│   │  CLIENT  │◄──────►│    MCP SERVER        │  │
│   └──────────┘  MCP   │  (your D365, files,  │  │
│                Protocol│   databases, APIs)   │  │
│                        └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Host:** The AI application that manages the conversation (Claude Code, your custom app)

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

**stdio** — the server runs as a local process, communicating via standard input/output. Simple, used for local tools.

**Streamable HTTP** — the server runs as an HTTP service. Used for remote servers, enterprise deployments, Azure-hosted servers. This is what you want for production D365 integrations.

## Why MCP Matters for Enterprise (D365, Dataverse, SAP)

Before MCP, connecting an AI agent to D365 required:
1. Building a custom connector
2. Writing Power Automate flows
3. Wiring up REST calls with auth handling
4. Rebuilding this for every agent

With MCP, you build **one D365 MCP server** that exposes your ERP's capabilities as tools. Every agent that needs D365 access just connects to that server. Build once, use everywhere.

**Real example from my work at Microsoft:**  
We built an MCP server that exposes D365 F&O OData entities as tools — `get_inventory_on_hand`, `create_purchase_requisition`, `get_vendor_invoice_status`. Any Copilot Studio agent or Claude Code session that needs D365 data connects to this single server. The agent gets D365 access in seconds, not weeks.

## MCP vs Traditional APIs vs Power Automate

| | MCP | REST API | Power Automate |
|---|---|---|---|
| **Who calls it** | AI agent directly | Developer-controlled | Triggered by flow |
| **Schema documentation** | Rich, LLM-readable | OpenAPI (if exists) | Connector metadata |
| **Agent autonomy** | Agent decides when/how | Fixed code path | Fixed trigger |
| **Best for** | Agent-driven operations | App-to-app integration | Human workflow automation |

Use MCP when the **agent** needs to decide what to do and when. Use Power Automate when you know the exact sequence of steps in advance.

## When NOT to Use MCP

- Simple data lookups that happen in every conversation → use a connector action in Copilot Studio
- Human-approval workflows → Power Automate is better suited
- Very simple integrations (one API call, one response) → Power Automate HTTP connector is faster to build

## Next Step

Ready to build your first MCP server? See the [Your First MCP Server](./your-first-mcp-server.md) skill.
