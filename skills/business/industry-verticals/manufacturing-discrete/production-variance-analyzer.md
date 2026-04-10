---
name: production-variance-analyzer
description: Analyzes production order variances across material, quantity, routing, and scrap dimensions with ranked root causes and corrective action recommendations. Use when user says "production variance", "standard cost vs actual cost", "material quantity variance", "labor efficiency variance", "scrap variance", "variance roll-up report", or "why is production over cost".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, manufacturing, production, variance]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Production Variance Analyzer

Production variances — the difference between standard cost and actual cost — reveal where manufacturing performance deviates from plan. Most manufacturers produce this data but lack the bandwidth to analyze it systematically. This agent does it automatically.

## Variance Types

**Material quantity variance:** Used more or less material than the BOM specifies.
```
Standard: 2.00 kg steel per unit
Actual: 2.18 kg steel per unit
Quantity variance: +0.18 kg × $4.20/kg = $0.76/unit UNFAVORABLE
Cause analysis: Excessive scrap during cutting operation
```

**Material price variance:** Actual purchase price differs from standard cost.
```
Standard: $4.20/kg steel
Actual: $4.65/kg steel
Price variance: $0.45/kg × 2.18 kg = $0.98/unit UNFAVORABLE
Cause analysis: Steel market price increase, standard not updated
```

**Labor efficiency variance:** Actual labor hours differ from standard routing.
```
Standard: 0.50 hr/unit
Actual: 0.63 hr/unit
Efficiency variance: 0.13 hr × $22.00/hr = $2.86/unit UNFAVORABLE
Cause analysis: New operator on this work center (learning curve)
```

**Scrap variance:** Components scrapped during production.
```
BOM scrap allowance: 2%
Actual scrap rate: 5.8%
Scrap variance: 3.8% × $8.40/bracket = $0.32/unit UNFAVORABLE
```

## Variance Roll-Up Report

The agent produces a ranked summary for the production manager:

```
PRODUCTION VARIANCE REPORT — March 2026
Total variance: $48,200 UNFAVORABLE

Top 5 variance drivers (accounts for 78% of total variance):

1. Steel bracket — quantity variance: $18,400 UNFAV
   Products affected: Widget Pro, Widget Standard
   Root cause: Die #3 producing parts outside tolerance — scrap rate 5.8%
   Recommended action: Preventive maintenance on Die #3

2. Labor — efficiency variance: $12,100 UNFAV
   Work center: Assembly Line 2
   Root cause: Two new operators (week 2 of 6-week ramp)
   Expected to normalize: 4 weeks

3. Steel — price variance: $8,900 UNFAV
   All products containing steel
   Root cause: Steel price increased 10.7% in Feb, standard not updated
   Recommended action: Update standard cost this period

4. [...]
```

## Trending Analysis

The agent tracks variances over time and identifies patterns:
- Variances that recur every month → systemic issue, not one-time
- Variances that correlate with specific operators → training opportunity
- Variances that correlate with specific material lots → supplier quality issue
- Variances that appear after equipment maintenance → maintenance quality issue

## Trigger Phrases

- "production variance"
- "standard cost vs actual cost"
- "material quantity variance"
- "labor efficiency variance"
- "scrap variance"
- "variance roll-up report"
- "why is production over cost"
- "production cost deviation"

## Quick Example

> See `production-variance-analyzer-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Variance report shows large unexplained residual after accounting for all named drivers | Indirect cost allocation method changed mid-period | Check whether the overhead absorption rate was updated during the period; re-run cost allocation with the consistent rate for the full period and restate the report |
| Labor efficiency variance attributed to wrong work center | Production order reporting point captures total hours, not work-center-specific hours | Enable operation-level reporting on production orders in D365; require operators to report hours at the routing operation level, not just at job completion |
| Price variance spike for a material that had no price change | Same item has two active costing versions with different prices | Identify which costing version was used for each production order; deactivate the older version and rerun the standard cost calculation to eliminate the split |
| Trending analysis showing false improvement in scrap variance | Scrap reporting moved to a different production stage (reducing reported scrap at original stage) | Confirm that scrap reporting points are consistent across periods; align scrap capture to the same routing operation so period-over-period comparison is valid |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
