---
name: "mcp-what-is-it"
slug: "mcp-what-is-it"
description: "Model Context Protocol explained for business audiences. What it is, why it matters, and how it connects AI agents to enterprise systems. Use when user says 'explain MCP to me', 'what is model context protocol', 'MCP for non-technical audience', 'why does MCP matter for enterprise AI', 'MCP vs API', 'how does Copilot Studio connect to D365 with MCP'."
tab: "business"
domain: "mcp"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["beginner", "mcp", "explainer", "introduction"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Node.js TypeScript SDK"
mcp_tools: []
---



# What is MCP?

Model Context Protocol (MCP) is an open standard that defines how AI agents connect to external systems. Think of it as a universal adapter, like USB-C for AI.

## The Problem MCP Solves

Before MCP, connecting an AI agent to your ERP system required:
- Custom API integration for each agent-system pair
- Different code for every new system you wanted to connect
- Months of development for each integration

With MCP, you build **one server** for your system. Any MCP-compatible agent can connect to it immediately. Build once, use everywhere.

## How It Works (Simple Version)

```
Your AI Agent (Claude, GPT, Copilot Studio)
        |
        | MCP Protocol (standard messages)
        |
  Your MCP Server
        |
        | API/Database calls
        |
  Your System (D365, SAP, Dataverse)
```

The MCP server is a thin adapter that:
1. Receives requests from the agent in a standard format
2. Translates them into calls your system understands
3. Returns results in a standard format the agent can use

## What the Agent Can Do Through MCP

MCP servers expose **tools**, which are functions the agent can call:

```
Tool: check_inventory
  "What's the current stock level of item X at warehouse Y?"

Tool: get_purchase_order_status
  "What's the status of PO #12345?"

Tool: create_purchase_requisition
  "Create a requisition for 100 units of item X"
```

The agent decides which tool to call based on the conversation. It's not hard-coded. The agent reasons about what it needs.

## The Business Value: One Server, Every Agent

Without MCP:

| Agent | Integration Needed |
|---|---|
| Invoice matching agent | Custom D365 connector built |
| Inventory reorder agent | Another custom D365 connector built |
| Period-close agent | Yet another custom D365 connector built |
| New agent next quarter | Start from scratch again |

With MCP:

| Agent | Integration Needed |
|---|---|
| Invoice matching agent | Connect to D365 MCP server |
| Inventory reorder agent | Connect to same D365 MCP server |
| Period-close agent | Connect to same D365 MCP server |
| New agent next quarter | Connect to same D365 MCP server |

That's the leverage. One MCP server, maintained in one place, used by every agent in your organization that needs D365 data.

## Why MCP for D365

Connecting Copilot Studio agents to D365 F&O without MCP typically requires building Power Automate flows for every data query. This works but creates a lot of maintenance overhead.

With a D365 MCP server:
- Agent queries D365 inventory in real time, no flow needed
- Agent checks PO status, no flow needed
- Agent reads vendor payment terms, no flow needed
- All of this through one connection, maintained once

For read-only operations, MCP is dramatically simpler. For write operations (creating records, approvals), Power Automate flows are still often the right choice. They provide better audit trails and approval routing.

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
- You need the agent to decide dynamically which data to fetch

**Use Power Automate instead when:**
- You need approval workflows built in
- Your team has no developer resources
- You need one specific integration for one specific agent
- The integration involves multi-step human approvals

For most enterprise teams: both. MCP for data access, Power Automate for actions.

## Quick Decision Guide

```
Q: Does the agent need to decide what data to fetch?
   Yes → MCP

Q: Does it involve human approvals or notifications?
   Yes → Power Automate

Q: Will multiple agents need the same system access?
   Yes → MCP (build once, share)

Q: No developers available?
   → Power Automate connectors for now
```

## Trigger Phrases

- "explain MCP to me"
- "what is model context protocol"
- "MCP for non-technical audience"
- "why does MCP matter for enterprise AI"
- "MCP vs API"
- "how does Copilot Studio connect to D365 with MCP"
- "what is MCP"
- "model context protocol business explanation"

## Quick Example

> See `mcp-what-is-it-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Stakeholders confuse MCP with RPA or Power Automate | Different abstraction levels, terminology overlaps | Use the analogy: "MCP is the plug standard, Power Automate is a specific appliance that uses it. They solve different problems." |
| Team builds new MCP server for every project | No shared server strategy | Establish a shared D365 MCP server as organizational infrastructure; each new agent connects to it rather than building new |
| Business users asking why MCP not just "connects" D365 directly | Expectation of plug-and-play | Set expectation: building the MCP server takes 1-2 weeks; after that, any agent connects in minutes |
| Developer unsure which approach to use | MCP vs Power Automate decision is unclear | Rule of thumb: read operations → MCP; write operations with approvals → Power Automate; complex writes → both |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
