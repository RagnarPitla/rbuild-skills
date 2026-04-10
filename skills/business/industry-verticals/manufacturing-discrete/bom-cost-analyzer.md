---
name: BOM Cost Analyzer
slug: bom-cost-analyzer
description: Analyze Bill of Materials cost rollups in D365 — identify variance drivers, surface top cost reduction opportunities, and model material substitutions.
tab: business
domain: industry-verticals
industry_vertical: manufacturing-discrete
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"manufacturing\", \"bom\", \"cost\", \"d365\", \"variance\", \"profitability\"]"
version: 1.0.1
icon_emoji: 🏭
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Cost Management"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# BOM Cost Analyzer

Manufacturing profitability depends on knowing where cost is generated. BOM cost analysis reveals which components drive cost, where standard vs actual diverge, and where cost reduction is possible.

## Cost Rollup Analysis

D365 calculates standard costs by rolling up component costs through the BOM tree. The agent extends this with variance analysis:

**Level 1 rollup — immediate components:**
```
Finished Item: Widget Pro (Item W-4521)
Standard Cost: $47.80

Component breakdown:
  Steel bracket (2 units × $8.40)      = $16.80  (35.1%)
  Circuit board (1 unit × $12.50)      = $12.50  (26.2%)
  Plastic housing (1 unit × $6.80)     =  $6.80  (14.2%)
  Assembly labor (0.5 hr × $22.00)     = $11.00  (23.0%)
  Overhead absorption                  =  $0.70   (1.5%)
                                       --------
  Total Standard Cost                  = $47.80
```

**Variance analysis (standard vs actual):**
```
Steel bracket: Standard $16.80 | Actual $18.20 | Variance $1.40 UNFAV
  Cause: Steel price increase not reflected in standard cost update
  Action: Update standard cost for next period
  
Circuit board: Standard $12.50 | Actual $11.80 | Variance $0.70 FAV
  Cause: Negotiated volume discount from supplier
  Action: Update standard cost to capture savings permanently
```

## Top 10 Cost Reduction Opportunities

The agent identifies and ranks cost reduction opportunities:

1. **Substitute analysis:** Are there approved alternative components at lower cost?
2. **Supplier price variance:** Which components have actual prices significantly above standard?
3. **Scrap analysis:** Which components have high scrap rates that could be reduced?
4. **Make vs buy:** Could we manufacture this component cheaper than buying it?
5. **Overdesign detection:** Are there components with specs significantly exceeding functional requirements?

## Material Substitution Modeling

When a lower-cost substitute is available:

```
Current: Carbon steel bracket @ $8.40/unit
Proposed: Aluminum bracket @ $6.20/unit (functionally equivalent per engineering)

Annual impact:
  Volume: 50,000 units/year
  Savings per unit: $2.20
  Annual material savings: $110,000
  
  Tooling change required: $18,000 one-time
  Payback period: 2.0 months
  
Engineering sign-off: Required (safety-critical part)
Supplier qualification: 1 approved aluminum bracket supplier exists
```

## Integration with D365

Reads from:
- `BOMEntity` — bill of materials structure
- `InventItemPriceEntity` — standard costs by costing version
- `ProdCostTransEntity` — actual production costs by order
- `VendPurchPriceHistoryEntity` — supplier pricing history

## Trigger Phrases

- "Help me with bom cost analyzer"
- "BOM Cost Analyzer"
- "How do I bom cost analyzer"

## Quick Example

> See `bom-cost-analyzer-example.md` in this folder for a full worked scenario with business impact.

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
