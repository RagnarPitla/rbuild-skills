---
name: Copilot Studio Multi-Agent Orchestration
slug: cs-multi-agent-orchestration
description: Design parent/child agent architecture with description-based routing, context passing, and the Niyam pattern for enterprise agents.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: advanced
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"multi-agent\", \"orchestration\", \"parent-child\", \"enterprise\"]"
version: 1.0.1
icon_emoji: 🕸️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 10
prerequisites: "[\"cs-first-agent\", \"cs-topic-basics\"]"
references:
  - "title: "Multi-agent orchestration in Copilot Studio"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Copilot Studio Multi-Agent Orchestration

When a single agent handles too many domains it becomes slow, confused, and expensive to maintain. Multi-agent architecture solves this: a parent orchestrator routes to specialized child agents, each focused on one domain.

## Child Agents vs Connected Agents

**Child agents** — subordinate agents in the same environment. Parent invokes them directly. User never sees the handoff. Start here.

**Connected agents** — independent agents in other environments/teams. Full conversation handoff. More powerful, more complex.

## The Key: Description-Based Routing

The parent doesn't use hard-coded topic redirects. It uses **agent descriptions** and the LLM decides who handles the request.

**Write descriptions as routing instructions, not marketing:**

```
❌ "The Procurement Agent helps users with procurement."

✅ "Use this agent when users ask about: purchase requisitions,
   PO status, vendor onboarding, invoice approval, or procurement
   policy. Handles all Source-to-Pay processes."
```

Be explicit about what each child handles. Overlapping descriptions cause routing errors.

## Setup Steps

1. **Build child agents first** — each should work independently before joining a parent
2. **Create parent agent** — minimal topics, focused on orchestration
3. **Add child agents** — Settings → Connected agents → add each child
4. **Test routing explicitly** — verify each query type routes to the right child

**Parent system instructions example:**
```
You are the Contoso Enterprise Assistant. Understand what the user
needs and route to the right specialist. Do not answer domain
questions yourself.

Specialists available:
- Procurement Agent: Source-to-Pay, PO status, vendor management
- Finance Agent: Expenses, budget queries, financial approvals
- HR Agent: Leave requests, policies, onboarding
```

## Passing Context to Children

Context doesn't flow automatically. Pass it explicitly:

**Method 1 — Global variables:** Set `Global.UserEmail` in the parent greeting. All child agents can read it.

**Method 2 — Input variables:** When adding a child agent, map parent variables to child inputs.

Always pass: user identity, department, any context from the parent conversation.

## Common Pitfalls

**Routing loops** — overlapping child descriptions. Fix by making descriptions mutually exclusive.

**Context loss** — user feels they're starting over when child picks up. Pass more context via globals.

**Slow responses** — parent LLM call + child invocation adds latency. Keep parent topics lean.

## Adding the Niyam Pattern

For enterprise agents, add policy-driven routing on top: instead of hardcoding routing rules in agent instructions, store them in Dataverse. The agent reads policies at runtime, enabling business users to change routing without touching the agent. See the [Niyam Pattern Explained](../enterprise-ai/niyam-pattern-explained.md) skill.

## Trigger Phrases

- "Help me with copilot studio multi-agent orchestration"
- "Copilot Studio Multi-Agent Orchestration"
- "How do I copilot studio multi-agent orchestration"

## Quick Example

> See `cs-multi-agent-orchestration-example.md` in this folder for a full worked scenario with business impact.

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
