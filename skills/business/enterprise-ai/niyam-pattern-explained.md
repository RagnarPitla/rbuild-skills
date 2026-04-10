---
name: niyam-pattern-explained
description: "Ragnar's signature pattern for policy-driven AI agents in D365. Dataverse policies, D365 MCP, and Power Automate from first principles. Use when user says 'Niyam pattern', 'policy-driven agent', 'business rules in Dataverse', 'how to make agent rules editable by business users', 'avoid hardcoding rules in Copilot Studio', 'agent policy management without IT'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, niyam-pattern, architecture, policy-driven]
requires: Copilot Studio, Dataverse MCP
mcp_tools:
  - "copilot-studio-mcp"
  - "dataverse-mcp"
  - "d365-fno-mcp"
---


# The Niyam Pattern

I built the Niyam pattern after watching enterprise agents fail for the same reason repeatedly: business rules hardcoded in agent instructions. Every policy change meant editing the agent, testing, republishing. IT became a bottleneck for business rule changes.

The Niyam pattern fixes this. Policies live in Dataverse tables. Agents read them at runtime. Business users change rules without touching the agent.

## The Three Components

```
+------------------+    reads     +---------------------+
|  Copilot Studio  |------------->|  Dataverse Policy   |
|  Agent           |              |  Tables             |
+--------+---------+              +---------------------+
         |                                ^
         | invokes                        | managed by
         v                               |
+------------------+              +---------------------+
|  D365 F&O MCP    |              |  Business Users     |
|  Server          |              |  (Model-Driven App) |
+------------------+              +---------------------+
         |
         v
+------------------+
|  Power Automate  |
|  (Enforcement)   |
+------------------+
```

**Dataverse Policy Tables:** Where business rules live, managed by business users.
**D365 F&O MCP Server:** Gives the agent real-time ERP data access.
**Power Automate:** Executes enforcement actions (approvals, notifications, record updates).

## The Core Problem It Solves

**Without Niyam:** agent instructions contain:
```
If purchase amount < $5,000 → auto-approve
If $5,000–$25,000 → route to department manager
If > $25,000 → route to CFO
```
When the CFO changes the auto-approve threshold to $10,000: edit agent, test, republish, wait.

**With Niyam:** agent instructions say:
```
Before processing any approval, read the current thresholds from
the Dataverse table [cr023_approvalthreshold]. Apply those thresholds.
```
When the threshold changes: update one Dataverse record. Done. Agent picks it up instantly.

## Policy Table Structure

Every Niyam policy table follows this pattern:

| Column | Type | Purpose |
|---|---|---|
| `cr023_policy_key` | Text (unique, alternate key) | Machine-readable identifier |
| `cr023_policy_value` | Multiline text | The value (numbers, text, JSON arrays) |
| `cr023_description` | Multiline text | Human-readable explanation |
| `cr023_effective_date` | Date/time | When this policy activates |
| `cr023_expiry_date` | Date/time | When it expires (null = no expiry) |
| `cr023_is_active` | Boolean | Quick enable/disable toggle |

**Naming convention:** `cr023_{domain}_{purpose}`
- `cr023_pr_threshold`: Purchase requisition thresholds
- `cr023_ap_rules`: Accounts payable rules
- `cr023_inv_limits`: Inventory adjustment limits

## Sample Policy Data

| policy_key | policy_value | description |
|---|---|---|
| auto_approve_threshold | 10000 | Auto-approve POs under this USD amount |
| manager_approval_max | 50000 | Manager can approve up to this amount |
| preferred_vendors | ["VEND001","VEND002"] | Preferred vendor list (JSON) |
| approval_sla_hours | 24 | SLA for approval response |

## How the Agent Reads Policies

Add a Power Automate action to your Copilot Studio topic:

```
Action: Get Policy Value
  Input: policy_key (text)
  Flow steps:
    1. List rows from cr023_pr_threshold
       where cr023_policy_key = policy_key
       AND cr023_is_active = true
       AND cr023_effective_date <= now()
    2. Return cr023_policy_value
  Output: policy_value (text)
```

Call it at the start of any topic that applies business rules:
```
Topic: Process Purchase Requisition
  → Get auto-approve threshold (Action)
  → Condition: Amount <= threshold?
     Yes → Auto-approve (call Power Automate approval flow)
     No  → Get approver contact (another policy lookup) → Route
```

## Beyond Simple Thresholds

Niyam tables can store richer data:

**Approved vendor lists:**
```
policy_key:   preferred_vendors_category_IT
policy_value: ["MSFT","CISCO","DELL"]
```
Agent validates vendor against the list before allowing the purchase.

**Seasonal policies:** Set `effective_date` and `expiry_date` to auto-activate budget freezes, holiday policies, quarter-end rules. No agent changes needed.

**Regional rules:** Create one policy table per region, or add a `cr023_region` column. Agent reads the right row for the user's business unit.

**Escalation contacts:** Store email addresses, Teams channels, approval group IDs. When org structure changes, update Dataverse. Not the agent.

## The Management UI

Business users need a UI to manage policies without developer help. Build a **Model-Driven App** over your policy tables:

1. `make.powerapps.com` → Create → Model-driven app
2. Add policy table, customize the form to show key, value, description, dates
3. Publish and share with the business team

Now policy changes are a 30-second UI operation.

## When to Use Niyam

**Use Niyam when:**
- Business rules change quarterly or more frequently
- Multiple agents need the same policy logic
- Business users must manage rules without IT involvement
- Compliance requires audit trail of rule changes (Dataverse tracks all changes)

**Don't use Niyam for:**
- Prototype/demo agents (add Niyam when the agent goes to production)
- Rules that genuinely never change
- Simple single-purpose agents with static behavior

## Implementation Checklist

- [ ] Identify all hardcoded rules in current agent instructions
- [ ] Define Dataverse table schema using cr023_ naming convention
- [ ] Create tables in Dataverse with correct column types
- [ ] Build Power Automate "Get Policy Value" flow
- [ ] Update agent topics to call the flow instead of using hardcoded values
- [ ] Build Model-Driven App for business user management
- [ ] Train business users on policy management UI
- [ ] Set up change audit notifications (Dataverse audit log)
- [ ] Document each policy key and expected value format

## The Claude Code Skill

If you're building in Claude Code, the `niyam-agent-template` skill generates the full architecture: Dataverse table schemas, Power Automate flows, agent system instructions, and Copilot Studio YAML from your requirements. One command, complete Niyam implementation.

## Trigger Phrases

- "Niyam pattern"
- "policy-driven agent"
- "business rules in Dataverse"
- "how to make agent rules editable by business users"
- "avoid hardcoding rules in Copilot Studio"
- "agent policy management without IT"
- "Niyam pattern explained"
- "Dataverse policy tables for agents"

## Quick Example

> See `niyam-pattern-explained-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent reads stale policy value | Caching in Power Automate or old token | Ensure the Get Policy Value flow runs fresh on each topic invocation; disable caching on the Dataverse list rows step |
| Policy lookup returns empty | `cr023_is_active` is false or `effective_date` is in the future | Check table data in Dataverse; ensure active = true and dates are correct |
| Business users accidentally break agent behavior | Too much freedom in Model-Driven App, no validation | Add column-level validation in Dataverse (e.g., number fields for thresholds) and a test agent environment for policy changes |
| Multiple agents reading different policy tables | No shared policy layer, each agent has its own tables | Consolidate into one shared policy table per domain; all agents in the domain read from the same table |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
