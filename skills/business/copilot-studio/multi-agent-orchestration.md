---
name: Multi-Agent Orchestration (Parent-Child)
slug: multi-agent-orchestration
description: Design parent/child agent architecture in Copilot Studio with description-based routing, context passing, and the Niyam pattern.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: advanced
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"multi-agent\", \"orchestration\", \"parent-child\", \"niyam\"]"
version: 1.0.1
icon_emoji: 🕸️
is_coming_soon: false
is_featured: true
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 10
prerequisites: "[\"your-first-copilot-studio-agent\", \"topic-design-patterns\"]"
references:
  - "title: "Configure multi-agent orchestration"
  - "title: "Connected agents in Copilot Studio"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Multi-Agent Orchestration (Parent-Child)

When a single agent handles too many domains, it becomes slow, confused, and expensive. Multi-agent architecture solves this: a parent orchestrator routes to specialized child agents, each focused on one domain.

I've built this pattern for multiple enterprise customers. Here's how it actually works in production.

## The Two Patterns: Child Agents vs Connected Agents

**Child agents** are subordinate agents you create within the same Copilot Studio environment. The parent invokes them directly. The user never knows they switched.

**Connected agents** are independent agents in other environments or teams. The parent hands off the conversation entirely via a connection. More powerful, more complex.

For most scenarios, start with child agents.

## Description-Based Routing

This is the key insight that most people miss. The parent agent doesn't use hard-coded topic redirects to route to children. It uses **agent descriptions** and the LLM decides which child is the best fit.

When you add a child agent to a parent:
1. Each child agent has an **agent description** field
2. The parent reads all child descriptions at runtime
3. The LLM matches the user's intent to the best child

**Write descriptions that are routing instructions, not marketing copy:**

```
❌ Bad: "The Procurement Agent helps users with all things procurement-related."

✅ Good: "Use this agent when users ask about: submitting purchase requisitions,
checking purchase order status, vendor onboarding, invoice approval, or
procurement policy questions. This agent handles all Source-to-Pay processes."
```

Be explicit about what this agent handles AND what it doesn't handle.

## Setting Up a Parent-Child Architecture

### 1. Build your child agents first
Each child should be a focused, working agent. Don't add them to a parent until they work independently.

### 2. Create the parent agent
Keep the parent's topics minimal — its job is orchestration, not handling requests itself. System instructions:
```
You are the Contoso Enterprise Assistant. Your role is to understand what
the user needs and route them to the right specialist agent. Do not try to
answer domain-specific questions yourself. Route to the appropriate agent.

Available specialists:
- Procurement Agent: Source-to-Pay processes, PO status, vendor management
- Finance Agent: Expense reports, budget queries, financial approvals  
- HR Agent: Leave requests, policy questions, onboarding
```

### 3. Add child agents
In the parent agent: **Settings** → **Connected agents** (or child agent section) → Add each child.

### 4. Test routing explicitly
Test with real queries and verify the correct child triggers:
- "I want to check my PO status" → Procurement Agent ✅
- "How many vacation days do I have left?" → HR Agent ✅
- "I need to submit an expense report" → Finance Agent ✅

## Passing Context Between Agents

Context doesn't automatically flow from parent to child. You need to pass it explicitly.

**Method 1: Global variables**
Set `Global.UserEmail` and `Global.UserDepartment` in the parent's greeting topic. Child agents can read these global variables without any additional configuration.

**Method 2: Input variables on child agent**
When you add a child agent, you can map parent topic variables to child input variables.

**What to pass:**
- User identity (email, employee ID)
- Department/business unit
- Locale/language preference
- Any context from the parent conversation

## Non-Sequential Access

A key advantage of this pattern: **users can access any child agent directly**, not just via the parent. If a user bookmarks the Procurement Agent URL and comes directly, it still works. The parent just provides the unified entry point.

## The Niyam Pattern: Policy-Driven Routing

For enterprise agents, I use the Niyam pattern on top of this architecture. Instead of hardcoding routing logic in the agent instructions, policies live in Dataverse tables. The agent queries the policy table at runtime to determine:
- Which child agent to route to
- What business rules apply to this user's request
- What approval thresholds to enforce

This means you can change routing logic by updating a Dataverse record — no agent republishing required. See the [Niyam Pattern Explained](../enterprise-ai/niyam-pattern-explained.md) skill for the full implementation.

## Common Issues

**Routing loops** — if child agents have overlapping descriptions, the parent may route incorrectly. Fix by making descriptions more specific and mutually exclusive.

**Context loss** — if users feel like they're starting over when the child picks up, you're not passing enough context. Always pass user identity and conversation summary.

**Slow response** — the parent LLM call + child invocation adds latency. Keep parent topics lean and minimize the number of routing hops.

## Trigger Phrases

- "Help me with multi-agent orchestration (parent-child)"
- "Multi-Agent Orchestration (Parent-Child)"
- "How do I multi-agent orchestration (parent-child)"

## Quick Example

> See `multi-agent-orchestration-example.md` in this folder for a full worked scenario with business impact.

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
