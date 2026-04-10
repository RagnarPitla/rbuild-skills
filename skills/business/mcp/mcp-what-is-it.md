---
name: What is MCP?
slug: mcp-what-is-it
description: Model Context Protocol explained for business audiences — what it is, why it matters, and how it connects AI agents to enterprise systems.
tab: business
domain: mcp
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"mcp\", \"model-context-protocol\", \"enterprise-ai\", \"explainer\", \"d365\"]"
version: 1.0.1
icon_emoji: 🔌
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: mcp-path
learning_path_position: 1
prerequisites: "[]"
references:
  - "title: "Model Context Protocol Specification"
  - "title: "Anthropic MCP Documentation"
requires: Node.js TypeScript SDK
mcp_tools:
  - "mcp-server-sdk"
---


# What is MCP?

Model Context Protocol (MCP) is an open standard that defines how AI agents connect to external systems. Think of it as a universal adapter — like USB-C for AI.

## The Problem MCP Solves

Before MCP, connecting an AI agent to your ERP system required:
- Custom API integration for each agent-system pair
- Different code for every new system you wanted to connect
- Months of development for each integration

With MCP, you build **one server** for your system. Any MCP-compatible agent can connect to it immediately. Build once, use everywhere.

## How It Works (Simple Version)

```
Your AI Agent (Claude, GPT, etc.)
        ↕  (MCP Protocol)
  Your MCP Server
        ↕  (API/Database calls)
  Your System (D365, SAP, database)
```

The MCP server is a thin adapter that:
1. Receives requests from the agent in a standard format
2. Translates them into calls your system understands
3. Returns results in a standard format the agent can use

## What the Agent Can Do Through MCP

MCP servers expose **tools** — functions the agent can call:

```
Tool: check_inventory
  "What's the current stock level of item X at warehouse Y?"

Tool: get_purchase_order_status
  "What's the status of PO #12345?"

Tool: create_purchase_requisition
  "Create a requisition for 100 units of item X"
```

The agent decides which tool to call based on the conversation. It's not hard-coded — the agent reasons about what it needs.

## Why MCP for D365

Connecting Copilot Studio agents to D365 F&O without MCP typically requires building Power Automate flows for every data query. This works but creates a lot of maintenance overhead.

With a D365 MCP server:
- Agent queries D365 inventory in real time — no flow needed
- Agent checks PO status — no flow needed
- Agent reads vendor payment terms — no flow needed
- All of this through one connection, maintained once

For read-only operations, MCP is dramatically simpler. For write operations (creating records, approvals), Power Automate flows are still often the right choice — they provide better audit trails and approval routing.

## Who Supports MCP

As of 2026, MCP is supported by:
- **Anthropic** (Claude, Claude Code)
- **OpenAI** (ChatGPT, Codex)
- **Microsoft** (GitHub Copilot, some Azure AI services)
- **Cursor, Windsurf, Zed** (AI code editors)
- 12+ skill marketplaces that index MCP-connected skills

It's becoming the standard. Building an MCP server today means your system is compatible with tomorrow's AI tools.

## Is MCP Right for You?

**Use MCP when:**
- You want agents to query live data from multiple systems
- You're building reusable integrations used by multiple agents
- Your team can deploy and maintain a TypeScript/Python server

**Use Power Automate instead when:**
- You need approval workflows built in
- Your team has no developer resources
- You need one specific integration for one specific agent

For most enterprise teams: both. MCP for data access, Power Automate for actions.

## Trigger Phrases

- "Help me with what is mcp?"
- "What is MCP?"
- "How do I what is mcp?"

## Quick Example

> See `mcp-what-is-it-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
