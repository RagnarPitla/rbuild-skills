---
name: Power Automate for Agents
slug: power-automate-basics
description: Build Power Automate cloud flows that Copilot Studio agents invoke — triggers, inputs/outputs, error handling, and action patterns.
tab: business
domain: power-platform
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"power-automate\", \"power-platform\", \"flows\", \"agents\", \"copilot-studio\"]"
version: 1.0.1
icon_emoji: ⚡
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: power-platform-path
learning_path_position: 2
prerequisites: "[\"dataverse-table-design\"]"
references:
  - "title: "Power Automate Documentation"
  - "title: "Call a flow from Copilot Studio"
requires: Dataverse MCP, Power Automate
mcp_tools:
  - "dataverse-mcp"
  - "power-automate"
---


# Power Automate for Agents

Power Automate is the action layer for Copilot Studio agents. When your agent needs to do something — query a system, create a record, send a notification, run an approval — a Power Automate flow executes it.

## How Agents Invoke Flows

In Copilot Studio, you add a flow as an **action** in a topic. The agent calls the flow, passes inputs, and receives outputs.

**Flow trigger:** Must be **"When Copilot Studio calls a flow"** (the instant trigger for agent-callable flows).

**Inputs:** Define what the agent passes to the flow (text, numbers, booleans). These become variables in your flow.

**Outputs:** Define what the flow returns to the agent. The agent uses these values in subsequent topic nodes.

## Building an Agent-Callable Flow

1. **Power Automate** → Create → Instant cloud flow
2. Trigger: "When Copilot Studio calls a flow"
3. Add input parameters (text, number, boolean as needed)
4. Build your flow logic
5. Add "Respond to Copilot Studio" action at the end
6. Add output parameters

```
Trigger: When Copilot Studio calls a flow
  Inputs:
    - policy_key (Text)

Step 1: List rows (Dataverse)
  Table: Policy Rules (cr023_pr_policy)
  Filter: cr023_policy_key eq '{policy_key}'

Step 2: Compose
  Expression: first(outputs('List_rows')?['body/value'])?['cr023_policy_value']

Respond to Copilot Studio:
  Outputs:
    - policy_value (Text): [result from Step 2]
```

## Common Flow Patterns for Agents

### Pattern 1: Dataverse Lookup
Agent asks for data → Flow queries Dataverse → Returns result

Use for: Policy tables, reference data, configuration values

### Pattern 2: D365 Data Query
Agent asks for ERP data → Flow calls D365 connector → Returns result

Use for: PO status, inventory levels, customer data
(Note: MCP server is often better for read-heavy scenarios — flows add latency)

### Pattern 3: Create/Update Record
Agent collects data → Flow creates/updates a Dataverse or D365 record

Use for: Submitting requests, updating status, logging interactions

### Pattern 4: Send Notification
Agent triggers notification → Flow sends Teams message/email

```
Trigger: Copilot Studio calls flow
  Input: recipient_email (Text), message (Text)

Step: Send an email (V2)
  To: [recipient_email]
  Subject: "Action Required from Procurement Agent"
  Body: [message]

Respond: success (Boolean) = true
```

### Pattern 5: Start Approval
Agent surfaces exception → Flow starts a formal approval process

```
Step: Start and wait for an approval
  Approval type: Approve/Reject
  Title: "Purchase Requisition Approval"
  Assigned to: [approver from policy table]
  Details: [details passed from agent]

Condition: Approval outcome = 'Approve'
  Yes → Update D365 record as approved
  No → Update D365 record as rejected

Respond: outcome (Text) = "Approved" or "Rejected"
```

## Error Handling

Every flow called by an agent should handle errors gracefully:

1. Add **Scope** action around your main steps
2. Configure **Run After: Has Failed** to add error handling
3. Return a meaningful error message to the agent

```
Main scope (on success):
  → [your flow steps]
  → Respond: success = true, data = [result]

Error scope (runs if main scope fails):
  → Respond: success = false, error_message = [error details]
```

In the agent topic: check the `success` output, show error message if false.

## Flow Naming Convention

```
Agent: [AgentName] - [Action Description]

Examples:
Agent: Procurement - Get Policy Value
Agent: Procurement - Submit Purchase Requisition
Agent: Inventory - Check On-Hand Stock
Agent: Finance - Get Open Invoices
```

This makes flows easy to find and maintain, especially as you scale to multiple agents.

## Trigger Phrases

- "Help me with power automate for agents"
- "Power Automate for Agents"
- "How do I power automate for agents"

## Quick Example

> See `power-automate-basics-example.md` in this folder for a full worked scenario with business impact.

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
