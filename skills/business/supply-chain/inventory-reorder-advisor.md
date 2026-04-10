---
name: Inventory Reorder Advisor
slug: inventory-reorder-advisor
description: AI agent skill for inventory reorder optimization — EOQ calculations, reorder points, safety stock, and D365 integration patterns.
tab: business
domain: supply-chain
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"supply-chain\", \"inventory\", \"demand-planning\", \"d365\", \"reorder\", \"safety-stock\"]"
version: 1.0.1
icon_emoji: 📦
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Inventory Management"
  - "title: "Master planning in D365 SCM"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Inventory Reorder Advisor

Inventory reorder decisions are textbook agent territory: they require reading multiple data sources, applying business logic, handling edge cases, and producing actionable recommendations. Manual review of hundreds of SKUs is where agents beat humans every time.

## What This Skill Does

The Inventory Reorder Advisor agent:
1. Queries D365 for current on-hand inventory per item/warehouse
2. Calculates consumption rate from historical transactions
3. Applies reorder point formula with safety stock buffer
4. Flags items that are at or below reorder point
5. Calculates recommended order quantities using EOQ
6. Generates a prioritized reorder list with recommendations

## The Formulas

### Reorder Point (ROP)
```
ROP = (Average Daily Demand × Lead Time) + Safety Stock

Where:
- Average Daily Demand = Total consumption in period / Number of days
- Lead Time = Supplier lead time in days (from vendor record in D365)
- Safety Stock = Z-score × σ(demand) × √(lead time)
  (Z-score = 1.65 for 95% service level)
```

### Economic Order Quantity (EOQ)
```
EOQ = √(2 × Annual Demand × Ordering Cost / Holding Cost)

Where:
- Ordering Cost = Cost per purchase order (from policy table)
- Holding Cost = % of item value per year (from policy table)
```

For most enterprise clients, EOQ is an approximation — use it as a starting point, not gospel. Supplier minimum order quantities and volume discounts often override the formula.

## D365 Data Sources

The agent needs these from D365 (via MCP server or Power Automate):

| Data | D365 Source | API/Entity |
|---|---|---|
| On-hand inventory | Inventory management | `InventOnHandV2` entity |
| Consumption history | Inventory transactions | `InventTransList` |
| Vendor lead times | Procurement → Vendors → Trade agreements | `PurchaseOrderHeadersV2` |
| Item cost | Cost management | `InventItemPrice` |
| Warehouse locations | Warehouse management | `WHSLocationTable` |

## Agent Conversation Flow

```
User: "Which items need reordering this week?"

Agent:
1. Queries InventOnHandV2 for all items below safety stock threshold
2. For each item: calculates days of supply remaining
3. Sorts by urgency (items with < 7 days supply = critical)
4. Calculates recommended order quantity (EOQ or min order, whichever is larger)
5. Returns prioritized list:

   CRITICAL (< 7 days supply):
   - Widget-A | On hand: 45 units | Daily demand: 12 | Order 500 units from Vendor X
   - Bracket-B | On hand: 8 units | Daily demand: 3 | Order 250 units from Vendor Y

   REVIEW (7-14 days supply):
   - Fastener-C | On hand: 180 units | Daily demand: 15 | Order 400 units when ready
```

## Seasonality Adjustment

For items with seasonal demand, the agent should adjust calculations:

1. Compare current period demand to same period last year
2. Calculate seasonality index: Current period average / Annual average
3. Multiply base demand by seasonality index before applying ROP formula

Store seasonality indices in a Dataverse table (`cr023_inventory_seasonality`) so business users can override calculated values.

## Integration with D365 Master Planning

The Inventory Reorder Advisor can complement (not replace) D365 master planning:
- Use for items not in the master plan
- Use for rapid manual analysis when master plan hasn't run
- Use for exception items where planners need a second opinion

To trigger a purchase order directly from agent recommendation:
- Use Power Automate to create a `PurchReqLine` in D365
- Set status to "Draft" — never auto-submit without human review
- Notify the planner with the recommendation and a one-click approval link

## Output Format

Agent should always return:

```
Item: [Item number] - [Description]
Warehouse: [Location]
On Hand: [Quantity] [Unit]
Days of Supply: [X days]
Recommended Order: [Quantity] [Unit]
Suggested Vendor: [Vendor name]
Est. Lead Time: [X days]
Priority: CRITICAL / REVIEW / MONITOR
```

Include a confidence indicator when data quality is low (e.g., less than 30 days of consumption history).

## Trigger Phrases

- "Help me with inventory reorder advisor"
- "Inventory Reorder Advisor"
- "How do I inventory reorder advisor"

## Quick Example

> See `inventory-reorder-advisor-example.md` in this folder for a full worked scenario with business impact.

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
