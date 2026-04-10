---
name: power-automate-basics
description: Build Power Automate cloud flows that Copilot Studio agents invoke — triggers, inputs/outputs, error handling, and action patterns. Use when user says "create a flow for agents", "Power Automate for Copilot Studio", "agent-callable flow", "flow trigger for agents", "Power Automate error handling", "flow inputs and outputs".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, power-automate, flows, automation]
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

- "create a flow for agents"
- "Power Automate for Copilot Studio"
- "agent-callable flow"
- "flow trigger for agents"
- "Power Automate error handling"
- "flow inputs and outputs"
- "Respond to Copilot Studio action"
- "start approval from agent"

## Quick Example

> See `power-automate-basics-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Copilot Studio agent cannot see the flow to add as an action | Flow not using the "When Copilot Studio calls a flow" trigger, or flow is in a different environment | Verify the flow trigger is exactly "When Copilot Studio calls a flow" (Instant); ensure the flow and the agent are in the same Dataverse environment |
| Flow returns empty string for output that should have a value | Expression path is wrong or the upstream action returned null | Test the flow manually with a known input; use the flow run history to inspect each step's output and correct the expression path |
| Flow times out when querying D365 | D365 query returns too many rows, causing slow response | Add `$top=50` and specific `$filter` clauses to the D365 connector query; never fetch all records |
| Approval action is blocking the agent response for too long | Start and wait for approval is synchronous and blocks the flow | Switch to "Start an approval" (non-blocking) and use a separate flow triggered by approval completion to update the record and notify the agent via a callback or status check |


## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
