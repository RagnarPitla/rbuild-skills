---
name: "cs-multi-agent-orchestration"
slug: "cs-multi-agent-orchestration"
description: "Design parent and child agent architecture with description-based routing, context passing, and the Niyam pattern for enterprise agents. Use when user says 'set up parent child agents', 'agent routing to wrong child', 'connect agents together', 'multi-agent Copilot Studio', 'child agent not being invoked', 'how do I add agents to a parent'."
tab: "business"
domain: "copilot-studio"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "copilot-studio", "multi-agent", "orchestration"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Copilot Studio VS Code Extension"
mcp_tools: []
---



# CS Multi-Agent Orchestration

When a single agent handles too many domains it becomes slow, confused, and expensive to maintain. Multi-agent architecture solves this: a parent orchestrator routes to specialized child agents, each focused on one domain.

## Trigger Phrases

- "set up parent child agents in Copilot Studio"
- "agent routing to the wrong child"
- "connect multiple agents together"
- "multi-agent orchestration Copilot Studio"
- "child agent not being invoked"
- "how do I add agents to a parent agent"
- "build enterprise agent architecture"
- "description-based routing Copilot Studio"

## Child Agents vs Connected Agents

| Type | What It Is | When to Use |
|---|---|---|
| Child agents | Subordinate agents in the same environment. Parent invokes them. User never sees the handoff. | Start here for most enterprise scenarios |
| Connected agents | Independent agents in other environments or teams. Full conversation handoff. | Cross-team or cross-environment agent federation |

## The Key: Description-Based Routing

The parent doesn't use hard-coded topic redirects. It uses **agent descriptions** and the LLM decides who handles the request.

Write descriptions as routing instructions, not marketing copy:

```
Bad: "The Procurement Agent helps users with procurement."

Good: "Use this agent when users ask about: purchase requisitions,
PO status, vendor onboarding, invoice approval, or procurement
policy. Handles all Source-to-Pay processes."
```

Be explicit about what each child handles. Overlapping descriptions cause routing errors.

## Setup Steps

### 1. Build child agents first
Each child should be a focused, working agent. Don't add them to a parent until they work independently.

### 2. Create the parent agent
Keep the parent minimal — its job is orchestration, not handling requests itself.

```
You are the Contoso Enterprise Assistant. Understand what the user
needs and route to the right specialist. Do not answer domain
questions yourself.

Specialists available:
- Procurement Agent: Source-to-Pay, PO status, vendor management
- Finance Agent: Expenses, budget queries, financial approvals
- HR Agent: Leave requests, policies, onboarding
```

### 3. Add child agents
Parent agent: **Settings** → **Connected agents** → add each child.

### 4. Test routing explicitly
Verify each query type routes to the right child:
```
"I want to check my PO status"            → Procurement Agent
"How many vacation days do I have left?"  → HR Agent
"I need to submit an expense report"      → Finance Agent
```

## Passing Context to Children

Context doesn't flow automatically. Pass it explicitly.

**Method 1: Global variables**
Set `Global.UserEmail` and `Global.UserDepartment` in the parent greeting topic. All child agents can read global variables without additional configuration.

**Method 2: Input variables**
When adding a child agent, map parent topic variables to child input variables.

Always pass: user identity, department, and any context from the parent conversation.

## Non-Sequential Access

A key advantage of this pattern: users can access any child agent directly, not only via the parent. If a user bookmarks the Procurement Agent URL and comes directly, it still works. The parent provides the unified entry point.

## Adding the Niyam Pattern

For enterprise agents, add policy-driven routing on top: instead of hardcoding routing rules in agent instructions, store them in Dataverse. The agent reads policies at runtime, enabling business users to change routing logic without touching the agent. See the `niyam-agent-template` skill for the full implementation.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Child agent not being invoked | Child description too vague or overlapping with another child | Rewrite child agent descriptions to be mutually exclusive and explicit about what they handle |
| Routing loops or wrong child selected | Overlapping descriptions between children | Audit all child agent descriptions, add explicit exclusion statements ("This agent does NOT handle...") |
| Context lost when child agent takes over | Global variables not set in parent greeting, or child not reading globals | Set Global.UserEmail and Global.UserDepartment in parent greeting, verify child topics reference them |
| High latency on every response | Too many routing hops, parent topics too heavy | Keep parent lean with no heavy topics, reduce number of child agents if possible |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
