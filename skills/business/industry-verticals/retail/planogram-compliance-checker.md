---
name: Planogram Compliance Checker
slug: planogram-compliance-checker
description: Verify store shelf planogram compliance from image data and generate corrective action reports with prioritized fixes.
tab: business
domain: industry-verticals
industry_vertical: retail
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"retail\", \"planogram\", \"merchandising\", \"store-ops\", \"compliance\"]"
version: 1.0.1
icon_emoji: 🛒
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references: "[]"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Planogram Compliance Checker

Planogram compliance directly impacts sales — misplaced products, empty shelves, and wrong facings cost revenue. Store audits are expensive and infrequent. This agent makes compliance monitoring continuous.

## How It Works

**Input:** Store shelf photos (from store staff via app, or from shelf cameras)

**Agent processing:**
1. Image recognition identifies products and their positions
2. Compares actual positions vs planogram specification for this store/section
3. Calculates compliance score per section and per SKU
4. Identifies: missing products, wrong positions, insufficient facings, price tag issues
5. Ranks issues by sales impact (based on sales velocity and margin data)

**Output:** Prioritized corrective action report for store manager

```
PLANOGRAM COMPLIANCE REPORT
Store: Downtown #247 | Section: Beverages Aisle 3 | Score: 74%

PRIORITY FIXES (act today):
1. [HIGH IMPACT] Coca-Cola 12-pack missing from shelf positions 4-6
   Sales impact: ~$180/day in lost sales
   Action: Replenish from back stock (2 cases available)

2. [HIGH IMPACT] Pepsi and Dr Pepper positions switched
   Action: Move Pepsi to positions 7-9, Dr Pepper to 10-12

ROUTINE FIXES (next restock):
3. Sprite facings: 2 actual vs 3 required (shortage)
4. Price tag missing: Gatorade 32oz Blue
```

## Integration Points

- Planogram database: approved shelf layout per store format
- Sales data: to prioritize by revenue impact
- Inventory system: to confirm back stock availability
- Store task management: to create work orders for fixes
- Retailer's master data: item images for recognition model

## ROI

Retail studies consistently show 1-3% sales lift from improved planogram compliance. For a store doing $10M/year, that's $100K-$300K in recovered revenue — from better shelf execution.

## Trigger Phrases

- "Help me with planogram compliance checker"
- "Planogram Compliance Checker"
- "How do I planogram compliance checker"

## Quick Example

> See `planogram-compliance-checker-example.md` in this folder for a full worked scenario with business impact.

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
