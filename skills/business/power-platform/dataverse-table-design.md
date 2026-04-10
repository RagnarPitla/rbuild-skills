---
name: dataverse-table-design
description: Design Dataverse tables — standard vs custom, column types, relationships, alternate keys, and naming conventions for agent workloads. Use when user says "design a Dataverse table", "Dataverse schema", "table relationships in Dataverse", "alternate key Dataverse", "naming convention Power Platform", "custom table setup".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, dataverse, schema, power-platform]
requires: Dataverse MCP, Power Automate
mcp_tools:
  - "dataverse-mcp"
  - "power-automate"
---


# Dataverse Table Design

Dataverse is the data layer that connects Power Platform, Copilot Studio, and D365. Knowing how to design tables well is foundational to every enterprise agent.

## Standard vs Custom Tables

**Standard tables** — pre-built by Microsoft (Account, Contact, Opportunity). Use these when they fit. Don't re-invent what's already there.

**Custom tables** — you create them. Use the publisher prefix naming: `cr023_tablename`. The `cr023` is your publisher prefix, ensuring no conflicts with other solutions.

## Column Types

| Type | Use For | Notes |
|---|---|---|
| Text (single line) | Names, codes, keys | Max 4,000 chars |
| Text (multiline) | Instructions, descriptions, JSON values | No limit |
| Number (whole) | Counts, IDs, thresholds | Integer only |
| Number (decimal) | Amounts, rates | Specify precision |
| Currency | Money | Always use for financial data |
| Date only | Dates without time | Birthday, effective date |
| Date and Time | Timestamps | Stored as UTC |
| Boolean | Yes/No flags | True/False |
| Choice | Fixed options | Creates global option set |
| Lookup | Reference to another table | Creates relationship |
| File | Binary file storage | Max 128MB |

**For agent workloads:** Use Text (multiline) for anything agents read and write. It handles JSON, long text, formatted data. Use Number and Currency for thresholds agents compare against.

## Table Relationships

**One-to-many (1:N):** One parent record has many child records.
Example: One Purchase Order → many Purchase Order Lines

**Many-to-many (N:N):** Many records on both sides relate to each other.
Example: Many Skills → many Agents (an agent has multiple skills, a skill applies to multiple agents)

**Lookup column** creates the relationship. Add it to the "many" side — a Purchase Order Line has a lookup to its Purchase Order.

## Alternate Keys

By default, Dataverse identifies records by a GUID (meaningless string). Set an alternate key on the column your code uses to look up records.

Example: Policy table with `cr023_policy_key` column → set as alternate key → query by `policyKey='auto_approve_threshold'` instead of by GUID.

**How to create:** Table settings → Keys → Add key → select your column → Save.

This is essential for agent code that looks up specific records by business key.

## Naming Convention (Niyam Pattern)

```
Publisher prefix: cr023_
Tables: cr023_{domain}_{purpose}
Columns: cr023_{attribute}

Examples:
cr023_pr_policy          → Procurement policies
cr023_ap_threshold       → AP approval thresholds
cr023_inv_adjustment_rule → Inventory adjustment rules
```

System names (used in code) must be unique across your environment. Display names (shown to users) can be anything.

## What to Index

Mark columns as **searchable** that you filter on frequently:
- Policy key columns (used in agent lookups)
- Date columns (filtering active policies by date)
- Status/type columns (filtering by status)

Column settings → check "Searchable" → this adds an index.

## Quick Setup Checklist

For any new Dataverse table:
- [ ] Publisher prefix in system name
- [ ] Meaningful display name for business users
- [ ] Alternate key on the primary business identifier column
- [ ] Required columns marked as required
- [ ] Searchable marked on filter columns
- [ ] Description filled in on table and all columns
- [ ] Security role configured (who can read/write)

## Trigger Phrases

- "design a Dataverse table"
- "Dataverse schema"
- "table relationships in Dataverse"
- "alternate key Dataverse"
- "naming convention Power Platform"
- "custom table setup"
- "cr023_ prefix"
- "standard vs custom table"

## Quick Example

> See `dataverse-table-design-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Column system name already taken | Another solution uses the same name without a publisher prefix | Always use your publisher prefix (e.g., `cr023_`) in system names; check for conflicts in the environment before creating |
| Relationships not showing in model-driven app form | Lookup column created but not added to the form layout | Open the table form in the app designer; drag the lookup column onto the form canvas; save and publish |
| OData query returns different results than expected | Filter uses display name instead of schema name | Use column schema names (with publisher prefix) in OData filters, not display names: `$filter=cr023_policy_key eq 'value'` |
| Managed solution upgrade fails because of table conflicts | Table schema changed in source environment but not properly versioned | Never manually edit managed solution tables; make changes in the development environment, increment the solution version, and re-export before deploying |


## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
