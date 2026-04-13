---
name: "bom-cost-analyzer"
slug: "bom-cost-analyzer"
description: "Analyzes Bill of Materials cost rollups in D365 to identify variance drivers, surface cost reduction opportunities, and model material substitutions. Use when user says \"BOM cost\", \"standard cost vs actual cost\", \"cost rollup\", \"material cost variance\", \"component cost breakdown\", \"make vs buy analysis\", or \"substitute component cost\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "manufacturing-discrete"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "manufacturing", "bom", "cost-analysis"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
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

- "BOM cost"
- "standard cost vs actual cost"
- "cost rollup"
- "material cost variance"
- "component cost breakdown"
- "make vs buy analysis"
- "substitute component cost"
- "scrap rate cost impact"

## Quick Example

> See `bom-cost-analyzer-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Standard cost rollup doesn't match actual production costs | Standard cost version not activated or not updated after last cost run | Run the standard cost calculation in D365 Cost Management; activate the pending cost version so the rollup reflects current component prices |
| Component substitution model shows negative savings | Substitute component has higher landed cost than the base item when freight and tooling are included | Include freight, duty, and tooling amortization in the substitution model; the agent's annual impact calculation must use total landed cost, not purchase price only |
| BOM cost percentage breakdown doesn't add to 100% | Overhead absorption is calculated separately and not included in component-level percentages | Add the overhead absorption line to the cost breakdown table explicitly; confirm the costing sheet is configured to roll overhead into the finished item standard cost |
| Variance analysis shows large price variance on stable-price materials | Standard cost was not updated at the last period-end cost run | Set a calendar reminder to run the standard cost update at each period-end; configure D365 cost alerts to flag when actual purchase prices deviate more than 5% from standard |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
