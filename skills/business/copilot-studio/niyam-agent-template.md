---
name: "niyam-agent-template"
slug: "niyam-agent-template"
description: "Build policy-driven Copilot Studio agents using the Niyam pattern with Dataverse policy tables, D365 F&O MCP server, and Power Automate enforcement flows. Use when user says 'Niyam pattern', 'policy-driven agent', 'build a D365 agent with Dataverse policies', 'agent that enforces business rules', 'connect Copilot Studio to D365 with MCP', 'Niyam agent template'."
tab: "business"
domain: "copilot-studio"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "niyam-pattern", "policy-driven", "dataverse"]
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



# Niyam Agent Template

Build policy-driven Copilot Studio agents using the Niyam pattern. This is Ragnar's signature enterprise agent architecture: Dataverse policy tables store business rules, the D365 F&O MCP server reads and writes ERP data, and Power Automate flows enforce outcomes. The agent doesn't hardcode business rules — it reads them at runtime from Dataverse.

## Trigger Phrases

- "build a Niyam pattern agent"
- "policy-driven Copilot Studio agent"
- "build a D365 agent with Dataverse policies"
- "agent that enforces business rules from Dataverse"
- "connect Copilot Studio to D365 using MCP"
- "Niyam agent template setup"
- "read business policies from Dataverse in an agent"
- "enterprise agent with configurable business rules"

## What This Skill Does

Takes a D365 business use case (e.g., purchase order validation, vendor onboarding compliance, procurement approval) and builds a complete Niyam-pattern agent. Input is the use case and business rules. Output is a Copilot Studio agent with: Dataverse policy table schema, agent system instructions, topics that query policies, and Power Automate enforcement flows.

## Niyam Pattern Architecture

| Component | What It Does | Technology |
|---|---|---|
| Dataverse Policy Table | Stores business rules, thresholds, procedures | Dataverse (cr023_ prefix) |
| D365 F&O MCP Server | Real-time read and write to ERP | MCP protocol over HTTPS |
| Power Automate Flows | Enforce outcomes, trigger approvals, escalate | Power Automate |
| Copilot Studio Agent | Orchestrates the pattern, talks to user | Copilot Studio |

## Agent Variants

| Variant | Capabilities | Use When |
|---|---|---|
| Read-only learner | Queries D365 via MCP, reads policies, explains business context | Inquiry agents, status checks, policy Q&A |
| Full agent (Read + Write) | Queries and writes to D365, triggers Power Automate flows | Transaction agents, approvals, procurement, compliance |

## Core Tasks

### 1. Design the Policy Table
```text
GIVEN a business domain (e.g., procurement, vendor management)
WHEN skill designs the Dataverse schema
THEN create table with naming convention: cr023_[domain]_policy
AND add columns:
  - cr023_name (text) — policy name
  - cr023_description (text) — plain language description
  - cr023_rule_type (choice) — Threshold / Approval / Compliance / Routing
  - cr023_threshold_value (decimal) — for numeric thresholds
  - cr023_approval_required (boolean) — triggers approval flow
  - cr023_escalation_contact (text) — who gets notified
  - cr023_active (boolean) — enable/disable without deleting
AND seed with initial business rules from stakeholder interviews
```

### 2. Write Agent System Instructions
```text
GIVEN policy table design and D365 domain
WHEN skill writes system instructions
THEN open with agent role and who it serves
AND declare MCP server connection for D365 data access
AND declare Dataverse policy table the agent reads
AND define when to query policies vs when to query D365 directly
AND define escalation path when policies are breached
AND specify confirmation required before any write to D365
AND keep under 800 words total
```

### 3. Build Policy Query Topic
```text
GIVEN agent needs to enforce a business rule
WHEN skill creates the policy query topic
THEN trigger on relevant user intent phrases
AND call Dataverse to retrieve active policies for this domain
AND parse threshold_value and approval_required fields
AND apply policy: if threshold exceeded → route to approval flow
AND if approval_required = true → trigger Power Automate approval
AND return policy context to user in plain language
AND log the interaction for audit trail
```

### 4. Connect D365 via MCP
```text
GIVEN agent needs to read or write ERP data
WHEN skill configures the MCP connection
THEN add MCP server URL to agent connector configuration
AND authenticate using managed identity or service principal
AND define which D365 entities the agent can access
AND for read-only variant: restrict to GET operations only
AND for full variant: add POST/PATCH operations with policy gating
AND test connection with a simple entity query before building topics
```

### 5. Build Power Automate Enforcement Flow
```text
GIVEN approval or escalation is required
WHEN skill creates the Power Automate flow
THEN trigger: Copilot Studio → Power Automate via HTTP action
AND inputs: user identity, request details, policy reference
AND add approval step if approval_required = true
AND add D365 write step after approval granted
AND add notification step to escalation_contact on breach
AND return outcome to Copilot Studio topic
AND log outcome to Dataverse audit table
```

## System Instruction Template

```
You are the [Domain] Agent for [Company]. You serve [audience] and handle [scope].

You have access to:
- D365 F&O via MCP: use for all ERP data queries and transactions
- Dataverse policy table (cr023_[domain]_policy): read at runtime to enforce business rules

Behavior rules:
- Always check the policy table before processing any [domain] request
- If a threshold policy is breached, do not proceed — route to approval flow
- Always confirm with the user before writing any data to D365
- If uncertain, escalate — never guess on compliance decisions

When you cannot complete a request due to policy: explain the policy, tell the user what they need to do next, and offer to trigger the approval process.
```

## Dataverse Table Schema Template

```
Table name:     cr023_[domain]_policy
Display name:   [Domain] Policy

Columns:
cr023_name              Text (Required)       Policy name
cr023_description       Text (Multiline)      Plain language explanation
cr023_rule_type         Choice                Threshold | Approval | Compliance | Routing
cr023_threshold_value   Decimal               Numeric threshold (if applicable)
cr023_approval_required Boolean               Triggers approval workflow
cr023_escalation_email  Text                  Who gets notified on breach
cr023_active            Boolean               Enable/disable without deleting
cr023_domain            Choice                Procurement | Finance | HR | Inventory
```

## Checklist: Niyam Agent Build

- [ ] Use case defined and stakeholder-approved
- [ ] Dataverse policy table schema designed and approved
- [ ] Policy table seeded with initial business rules
- [ ] D365 MCP server endpoint available and authenticated
- [ ] Agent system instructions written and scoped
- [ ] Policy query topic built and tested
- [ ] D365 query topics built (read operations)
- [ ] Power Automate enforcement flow built and tested
- [ ] D365 write topics built with confirmation step (full agent only)
- [ ] Audit logging configured in Dataverse
- [ ] Agent tested end-to-end with real policy scenarios
- [ ] Published and deployed to target channel

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent ignores policy table | Dataverse query not configured in topic, or connection failing | Add explicit Dataverse query step at topic start, verify connection credentials |
| MCP call returning no data | Authentication misconfigured or wrong entity endpoint | Verify service principal permissions on D365, check MCP server logs for 401/403 errors |
| Power Automate flow not triggering | HTTP action inputs don't match flow trigger schema | Check flow trigger input schema matches what the topic sends, test flow independently first |
| Agent writing to D365 without approval | Policy check topic bypassed or approval_required field not read | Add explicit check: if cr023_approval_required = true, pause and trigger approval before any write |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and full content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
