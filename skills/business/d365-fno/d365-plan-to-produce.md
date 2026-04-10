---
name: D365 Plan to Produce
slug: d365-plan-to-produce
description: Configure the Plan to Produce process in D365 SCM — BOMs, routes, production orders, shop floor, and manufacturing agent patterns.
tab: business
domain: d365-fno
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"d365-fno\", \"manufacturing\", \"production\", \"bom\", \"plan-to-produce\"]"
version: 1.0.1
icon_emoji: 🏭
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: d365-fno-path
learning_path_position: 5
prerequisites: "[\"d365-navigation-fundamentals\"]"
references:
  - "title: "D365 Supply Chain — Manufacturing"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
---


# D365 Plan to Produce

Plan to Produce (P2P) covers the manufacturing lifecycle: capacity planning through production order completion. In D365, this spans Production Control, Master Planning, and Quality Management.

## P2P Process Flow

```
Demand signal (sales order / forecast)
    ↓
Master Planning run → planned production orders
    ↓
Planner reviews and firms planned orders → production orders
    ↓
BOM explosion → material requirements calculated
    ↓
Route released → shop floor instructions generated
    ↓
Production started → operations reported
    ↓
Production reported as finished → inventory updated
    ↓
Quality check (if required) → release to stock
    ↓
Production order costing → actual vs standard variance
```

## Bills of Materials (BOM)

The BOM defines what materials are needed to produce one unit of a finished good.

**Product information management → Bills of materials → Bills of materials**

BOM structure:
- **BOM header:** Finished item, quantity (BOM is per X units), site, effective dates
- **BOM lines:** Component item, quantity per, unit, scrap %, step (which operation uses it)
- **BOM version:** Active version controls which BOM is used in production

**Multi-level BOMs:** Sub-assemblies have their own BOMs. D365 explodes these automatically during production order creation.

**BOM calculation:** Calculates the rolled-up cost of the finished good based on component costs and routing operations. Run after any cost change.

## Routes (Work Centers and Operations)

Routes define HOW to make the product — the sequence of operations and where they're performed.

**Production control → Setup → Routes → Routes**

Route structure:
- **Operations:** Individual steps (Cut, Weld, Paint, Inspect)
- **Work centers:** Where each operation is performed (Machine Line 1, Assembly Cell B)
- **Time:** Setup time + process time per unit
- **Next operation:** Sequence and overlap/link relationships

**Scheduling:** D365 can forward-schedule (start date → when will it finish?) or backward-schedule (need date → when must we start?).

## Master Planning

Master planning calculates what to produce and when to meet demand.

**Master planning → Master planning → Run**

Key outputs:
- **Planned production orders** — suggestions for what to produce, when to start, quantity
- **Planned purchase orders** — suggestions for what to buy to support production
- **Action messages** — "Advance this order," "Postpone this order," "Cancel this order"

Planners review planned orders in the **Net requirements** form and firm them into real production orders.

## Shop Floor Control

Once a production order is released:

1. **Pick list** — material issued from warehouse to production
2. **Route card / Job card** — operations recorded as complete (with actual times)
3. **Report as finished** — finished quantity entered, production inventory updated
4. **End production order** — actual costs calculated, variances posted

**Shop floor terminals:** Workers can report operations via handheld devices or PC terminals on the shop floor without needing a full D365 license.

## Agent Patterns for P2P

**Production schedule monitor:** Monitors open production orders for delays. Compares planned completion vs actual progress, identifies orders at risk of missing due dates, alerts planners with context.

**BOM cost analyzer:** After component price changes, agent identifies which finished goods are most affected, quantifies the cost impact, and flags items where standard cost needs updating.

**Capacity exception agent:** When master planning creates planned orders, agent checks work center capacity constraints. Identifies overloads and suggests splitting orders or moving to alternative work centers.

**Quality hold manager:** When a batch is quarantined, agent reads the quality order results, applies disposition rules from Dataverse policy tables, and routes to the right disposition action (rework, scrap, accept with deviation).

## Trigger Phrases

- "How do I d365 plan to produce"
- "Help me with d365 plan to produce in D365"
- "Check d365 plan to produce"
- "Analyze d365 plan to produce"
- "Show me d365 plan to produce status"

## Quick Example

> See `d365-plan-to-produce-example.md` in this folder for a full worked scenario with business impact.

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
