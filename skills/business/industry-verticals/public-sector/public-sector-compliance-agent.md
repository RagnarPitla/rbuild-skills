---
name: Public Sector Compliance Agent
slug: public-sector-compliance-agent
description: Compliance monitoring for government and public sector — procurement regulations, fund accounting rules, and audit trail generation.
tab: business
domain: industry-verticals
industry_vertical: public-sector
difficulty: advanced
source_type: ragnar-custom
tags: "[\"public-sector\", \"compliance\", \"government\", \"procurement\", \"audit\"]"
version: 1.0.1
icon_emoji: ⚖️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Public Sector"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Public Sector Compliance Agent

Government organizations operate under strict procurement rules, fund accounting requirements, and audit obligations. This agent monitors compliance continuously rather than catching issues at audit time.

## Procurement Compliance Monitoring

Public sector procurement has specific rules that differ from commercial:

**Competitive bidding thresholds:**
- Purchases above $X require formal bidding process
- Agent checks every PO against applicable threshold
- Flags sole-source purchases that should have been bid

**Vendor debarment checks:**
- Validates vendors against federal/state debarment lists before payment
- Alerts AP team when a vendor appears on a debarment list
- Prevents payment until cleared

**Local preference requirements:**
- Some jurisdictions require preference to local vendors
- Agent tracks whether procurement is meeting local preference targets
- Flags procurements where local alternative exists but wasn't used

## Fund Accounting Compliance

Government accounting requires tracking that funds are spent only for authorized purposes:

**Appropriation verification:**
- Every expenditure transaction checked against the authorizing appropriation
- Flags transactions that would exceed appropriation authority
- Tracks cumulative spending against appropriation balance

**Fund restriction compliance:**
- Grant funds can only be spent on approved categories
- Agent monitors grant expenditures against spending plan
- Alerts grant manager when approaching fund restrictions

**Carry-forward eligibility:**
- At year-end, determines which encumbrances can be carried forward
- Generates carry-forward request documentation

## Audit Preparation

**Continuous audit file generation:**
Rather than scrambling at audit time, the agent maintains:
- Transaction samples with supporting documentation links
- Procurement file completeness check (bid tabulation, award justification, contract)
- Required approvals documentation for all transactions

**Audit question response:**
When auditors ask questions, the agent finds supporting documentation and generates a structured response with evidence attachments.

## Trigger Phrases

- "Help me with public sector compliance agent"
- "Public Sector Compliance Agent"
- "How do I public sector compliance agent"

## Quick Example

> See `public-sector-compliance-agent-example.md` in this folder for a full worked scenario with business impact.

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
