---
name: Production Variance Analyzer
slug: production-variance-analyzer
description: Analyze production order variances — material, quantity, routing, and scrap — with ranked root causes and corrective action recommendations.
tab: business
domain: industry-verticals
industry_vertical: manufacturing-discrete
difficulty: advanced
source_type: ragnar-custom
tags: "[\"manufacturing\", \"variance\", \"production\", \"d365\", \"cost\", \"quality\"]"
version: 1.0.1
icon_emoji: 📊
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Production Cost Analysis"
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

- "Help me with production variance analyzer"
- "Production Variance Analyzer"
- "How do I production variance analyzer"

## Quick Example

> See `production-variance-analyzer-example.md` in this folder for a full worked scenario with business impact.

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
