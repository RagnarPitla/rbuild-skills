---
name: dataverse-table-design-for-agents
description: Design Dataverse tables that AI agents consume — column types, naming conventions, the Niyam policy table pattern, and security considerations. Use when user says "design a Dataverse table for agents", "table schema for agents", "Dataverse policy table", "Niyam pattern table", "agent reads from Dataverse", "policy table design".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, dataverse, table-design, agents]
requires: Dataverse MCP, Power Automate
mcp_tools:
  - "dataverse-mcp"
  - "power-automate"
---


# Dataverse Table Design for Agents

When AI agents need business data — policies, configurations, reference data, or structured knowledge — Dataverse is the right place to put it. It's natively integrated with Copilot Studio, Power Automate, and D365. But table design matters: a poorly designed table makes agent queries slow, unreliable, and hard to maintain.

## Column Types for Agent Use Cases

| Column Type | Use For | Agent Access Pattern |
|---|---|---|
| **Text (single line)** | Names, codes, simple values | Read/filter by value |
| **Text (multiline)** | Instructions, descriptions, policies | Read full text |
| **Choice** | Fixed options (status, category) | Filter by choice value |
| **Lookup** | Link to another table | Navigate relationships |
| **Number (whole)** | Counts, thresholds, quantities | Compare in conditions |
| **Currency** | Monetary values | Compare in approval flows |
| **Date/time** | Effective dates, expiry dates | Filter active policies |
| **Boolean** | Yes/no flags | Condition branching |

**Tip for agents:** Text columns are the most flexible. When in doubt, store complex data as JSON in a text column rather than over-normalizing. Agents read JSON well; complex table joins slow down Power Automate calls.

## The Naming Convention (Niyam Pattern)

Every custom Dataverse table and column needs a publisher prefix. For Niyam pattern work, use:

```
Publisher prefix: cr023_
Table names: cr023_{domain}_{purpose}
Column names: cr023_{attribute}

Examples:
cr023_pr_policy         → Procurement policy table
cr023_pr_threshold_amt  → Procurement threshold amount column
cr023_ap_approval_rule  → AP approval rule table
```

**Why this matters:** When you add a Dataverse table to a managed solution and deploy to another environment, the publisher prefix prevents naming conflicts with other solutions.

## The Policy Table Pattern

The most common table pattern for AI agents is the **policy table** — a simple lookup table that stores business rules agents read at runtime.

**Minimal policy table structure:**

| Column | Type | Purpose |
|---|---|---|
| `cr023_policy_key` | Text (unique) | Machine-readable identifier |
| `cr023_policy_value` | Text (multiline) | The actual value (number, text, JSON) |
| `cr023_description` | Text (multiline) | Human-readable explanation |
| `cr023_effective_date` | Date/time | When this policy activates |
| `cr023_expiry_date` | Date/time | When it expires (null = no expiry) |
| `cr023_is_active` | Boolean | Quick enable/disable toggle |

**Sample data:**

| policy_key | policy_value | description |
|---|---|---|
| auto_approve_threshold | 5000 | Auto-approve POs under this USD amount |
| manager_approval_threshold | 25000 | Route to manager above this amount |
| preferred_vendors | ["VEND001","VEND002","VEND003"] | List of preferred vendors (JSON) |
| approval_email_template | Please review PO #{po_number}... | Email template with tokens |

The agent queries this table before making any decision that involves business rules.

## Alternate Keys

Set an alternate key on the column your agents use to look up records. For the policy table, set an alternate key on `cr023_policy_key`.

Without an alternate key, you look up records by GUID — meaningless to humans and fragile in code. With an alternate key, you can look up `get_policy("auto_approve_threshold")` directly.

How to create: Table settings → Keys → Add key → Select your column.

## Indexing for Agent Query Performance

Agents query Dataverse via Power Automate or OData. Without proper indexing, queries on large tables are slow.

**Columns to index (mark as "searchable"):**
- Any column you filter on frequently
- Lookup columns
- Date columns used for range filters

In the column settings: check **Searchable** for columns you filter on.

## Security Roles for Agent Access

Agents run as a service account (the Copilot Studio agent's identity or a service principal). This identity needs read access to the Dataverse tables it queries.

**Principle of least privilege:**
- Agent service account → Read-only on policy tables
- Human users → Read/Write via Model-Driven App
- Admins only → Schema changes

Create a custom security role:
1. Power Platform Admin Center → Security Roles → New
2. Add table-level read permissions for your agent's tables
3. Assign to the agent's service account

**Never give agents owner-level access.** Read-only is sufficient for policy tables and reference data.

## Building the Management UI

Business users need a way to edit policy tables without writing code. Build a **Model-Driven App** that provides a form-based UI over your Dataverse tables.

1. make.powerapps.com → Create → Model-driven app
2. Add your policy table as a table view
3. Publish and share with the business team

Now policy changes are a UI operation — no developer required.

## Trigger Phrases

- "design a Dataverse table for agents"
- "table schema for agents"
- "Dataverse policy table"
- "Niyam pattern table"
- "agent reads from Dataverse"
- "policy table design"
- "cr023_ naming convention"
- "agent data table structure"

## Quick Example

> See `dataverse-table-design-for-agents-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent cannot find records by policy key | No alternate key set on the lookup column | Table settings > Keys > Add key > select `cr023_policy_key`; rebuild the flow to use the alternate key instead of GUID |
| Power Automate flow returns empty results when querying policy table | Filter expression syntax error in OData filter | Test the OData query directly in browser: `[envurl]/api/data/v9.2/cr023_pr_policies?$filter=cr023_policy_key eq 'auto_approve_threshold'`; fix syntax before putting in flow |
| Policy table changes not being picked up by the agent | Copilot Studio agent or flow is caching the response | Add a cache-busting parameter to the query or set the flow to fetch fresh data each invocation; check if any static response is stored in the agent topic |
| Security error when agent tries to read the table | Agent service account not assigned to the custom security role | Power Platform Admin Center > Security Roles > assign the custom read-only role to the Copilot Studio agent's service account or environment app user |


## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
