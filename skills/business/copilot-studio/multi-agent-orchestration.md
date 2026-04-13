---
name: "multi-agent-orchestration"
slug: "multi-agent-orchestration"
description: "Design parent and child agent architecture in Copilot Studio with description-based routing, context passing, and the Niyam pattern for enterprise deployments. Use when user says 'parent child agent setup', 'agent not routing to right specialist', 'how do I add child agents', 'connected agents Copilot Studio', 'multi-agent enterprise architecture', 'Niyam pattern routing'."
tab: "business"
domain: "copilot-studio"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "copilot-studio", "multi-agent", "child-agents"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Copilot Studio VS Code Extension"
mcp_tools: []
---



# Multi-Agent Orchestration (Parent-Child)

When a single agent handles too many domains, it becomes slow, confused, and expensive. Multi-agent architecture solves this: a parent orchestrator routes to specialized child agents, each focused on one domain.

I've built this pattern for multiple enterprise customers. Here's how it actually works in production.

## Trigger Phrases

- "set up parent child agents in Copilot Studio"
- "agent not routing to the right specialist"
- "how do I add child agents to a parent"
- "connected agents Copilot Studio setup"
- "build multi-agent enterprise architecture"
- "description-based routing not working"
- "Niyam pattern parent child routing"
- "child agent context loss"

## The Two Patterns: Child Agents vs Connected Agents

| Pattern | Description | Best For |
|---|---|---|
| Child agents | Subordinate agents in the same environment. Parent invokes them. User never knows they switched. | Most enterprise scenarios. Start here. |
| Connected agents | Independent agents in other environments or teams. Full conversation handoff. | Cross-team or cross-environment federation. |

For most scenarios, start with child agents.

## Description-Based Routing

This is the key insight most people miss. The parent agent doesn't use hard-coded topic redirects to route to children. It uses **agent descriptions** and the LLM decides which child is the best fit.

When you add a child agent to a parent:
1. Each child agent has an **agent description** field
2. The parent reads all child descriptions at runtime
3. The LLM matches the user's intent to the best child

Write descriptions as routing instructions, not marketing copy:

```
Bad: "The Procurement Agent helps users with all things procurement-related."

Good: "Use this agent when users ask about: submitting purchase requisitions,
checking purchase order status, vendor onboarding, invoice approval, or
procurement policy questions. This agent handles all Source-to-Pay processes."
```

Be explicit about what this agent handles AND what it doesn't handle.

## Setting Up a Parent-Child Architecture

### Step 1: Build child agents first
Each child should be a focused, working agent. Don't add them to a parent until they work independently.

### Step 2: Create the parent agent
Keep the parent's topics minimal — its job is orchestration, not handling requests itself.

```
You are the Contoso Enterprise Assistant. Your role is to understand what
the user needs and route them to the right specialist agent. Do not answer
domain-specific questions yourself. Route to the appropriate agent.

Available specialists:
- Procurement Agent: Source-to-Pay processes, PO status, vendor management
- Finance Agent: Expense reports, budget queries, financial approvals
- HR Agent: Leave requests, policy questions, onboarding
```

### Step 3: Add child agents
In the parent agent: **Settings** → **Connected agents** (or child agent section) → Add each child.

### Step 4: Test routing explicitly
Test with real queries and verify the correct child triggers:
```
"I want to check my PO status"            → Procurement Agent
"How many vacation days do I have left?"  → HR Agent
"I need to submit an expense report"      → Finance Agent
```

## Passing Context Between Agents

Context doesn't automatically flow from parent to child. Pass it explicitly.

**Method 1: Global variables**
Set `Global.UserEmail` and `Global.UserDepartment` in the parent's greeting topic. Child agents can read these global variables without any additional configuration.

**Method 2: Input variables on child agent**
When you add a child agent, map parent topic variables to child input variables.

**What to always pass:**
- User identity (email, employee ID)
- Department and business unit
- Locale and language preference
- Any context from the parent conversation

## Non-Sequential Access

A key advantage: users can access any child agent directly, not only via the parent. If a user bookmarks the Procurement Agent URL and comes in directly, it still works. The parent just provides the unified entry point.

## The Niyam Pattern: Policy-Driven Routing

For enterprise agents, I use the Niyam pattern on top of this architecture. Instead of hardcoding routing logic in agent instructions, policies live in Dataverse tables. The agent queries the policy table at runtime to determine:
- Which child agent to route to
- What business rules apply to this user's request
- What approval thresholds to enforce

This means you change routing logic by updating a Dataverse record — no agent republishing required. See the `niyam-agent-template` skill for the full implementation.

## Architecture Decision: When to Use Each Pattern

| Scenario | Recommended Pattern |
|---|---|
| Single team, one environment, up to 5 domains | Child agents with parent orchestrator |
| Multiple teams, separate environments | Connected agents |
| Policy-driven routing that changes frequently | Niyam pattern with Dataverse policies |
| User needs seamless experience across domains | Child agents (user never sees handoff) |
| Independent agents that also need to work standalone | Connected agents |

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Child agent not being invoked | Child description too vague or overlapping with another child | Rewrite child descriptions to be specific and mutually exclusive, add explicit scope exclusions |
| Routing loops or wrong child selected | Overlapping child descriptions | Audit all child agent descriptions for overlap, add "This agent does NOT handle..." statements |
| Context lost when child agent picks up | Global variables not set in parent greeting, or child not reading them | Set Global.UserEmail and Global.UserDepartment in parent Greeting topic, verify child topics read them |
| High response latency | Too many routing hops, parent has heavy topics | Keep parent lean with no heavy topics, minimize child agent chain depth |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
