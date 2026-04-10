---
name: budget-vs-actual-analyzer
description: Analyzes budget variances in D365 Finance, identifies top drivers, generates plain-language explanations, and flags items needing management action. Use when user says "budget vs actual", "variance analysis", "over budget", "under budget", "budget commentary", "management reporting", or "explain budget variance".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, financial-services, budget, variance-analysis]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Budget vs Actual Analyzer

Budget variance analysis is a monthly ritual that typically takes finance teams days to produce. This agent does it in minutes and explains the variances in plain language that non-finance managers can understand.

## Analysis Framework

**Step 1: Pull actual vs budget data from D365**
- Actual: Posted GL transactions for the period by account + dimension
- Budget: Budget register entries for the same period + dimensions
- Prior period: Same accounts from prior month and prior year

**Step 2: Calculate variances**
- Absolute variance ($ or €)
- Percentage variance (%)
- Flag based on materiality thresholds (from Dataverse policy table)

**Step 3: Rank and prioritize**
- Top 10 favorable variances
- Top 10 unfavorable variances
- Accounts trending worse over rolling 3 months

**Step 4: Generate explanations**
For each significant variance, the agent:
- Looks at the underlying transactions to identify the cause
- Cross-references purchase orders, journal descriptions, vendor names
- Generates a one-sentence plain-English explanation

## Output Format

```
BUDGET VARIANCE SUMMARY — March 2026

UNFAVORABLE VARIANCES (Over Budget):
1. Travel & Entertainment: $45,000 unfavorable (+23%)
   Explanation: Q1 Sales Kickoff conference in February posted in March
   ($38K of the variance) plus two executive international trips.

2. IT Licenses: $28,000 unfavorable (+15%)
   Explanation: Annual Microsoft EA renewal invoiced in March vs
   budget spread monthly. Full year impact, one-month budget.

FAVORABLE VARIANCES (Under Budget):
1. Consulting Fees: $62,000 favorable (-31%)
   Explanation: ERP implementation project paused pending scope change.
   Three consultants not billed for the month.
```

## Management Narrative Generator

The agent can draft the full budget commentary for management reporting:

```
Please draft the budget commentary for March 2026 finance review.
Focus on variances over $25K or 10%. Include recommended management actions.
```

Output: A formatted management commentary ready for CFO review, typically needing only minor edits.

## Threshold Configuration (Niyam Pattern)

Store materiality thresholds in Dataverse:
- Absolute threshold: flag variances over $X
- Percentage threshold: flag variances over X%
- Trend threshold: flag accounts deteriorating over 3+ months
- Accounts always flagged regardless of size (e.g., legal expenses, executive comp)

## Trigger Phrases

- "budget vs actual"
- "variance analysis"
- "over budget"
- "under budget"
- "budget commentary"
- "explain budget variance"
- "management reporting variance"
- "top variance drivers"

## Quick Example

> See `budget-vs-actual-analyzer-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Budget amounts show as zero for some accounts | Budget register entries not posted or wrong budget model selected | Confirm the budget model is set to the current fiscal year's approved model; check that budget entries are in Posted status |
| Variance explanation is missing for large items | GL transaction descriptions are blank or use generic voucher references | Enforce a description standard on journal posting; use vendor name and PO reference in journal descriptions |
| Prior year comparison shows wrong numbers | Fiscal year mapping not configured for comparative periods | Set the correct fiscal year offset in the period comparison configuration; verify the comparison period is the same calendar month |
| Materiality threshold not filtering small variances | Threshold stored in code rather than Dataverse policy table | Move thresholds to Dataverse using the Niyam pattern; update the absolute and percentage fields to match CFO-approved materiality levels |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
