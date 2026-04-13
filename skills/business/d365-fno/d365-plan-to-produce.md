---
name: "d365-plan-to-produce"
slug: "d365-plan-to-produce"
description: "Configure the Plan to Produce (P2P) process in D365 SCM — bills of materials, routes, master planning, production orders, shop floor reporting, and manufacturing agent patterns. Use when user says \"plan to produce in D365\", \"production order D365\", \"BOM setup D365\", \"master planning D365\", \"shop floor D365\", \"manufacturing process D365\", \"production scheduling D365\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "d365", "plan-to-produce", "manufacturing"]
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

## OData Queries for P2P

### Open Production Orders
```
GET /data/ProductionOrderHeaderEntity?$filter=ProductionOrderStatus eq 'Released'&$select=ProductionOrderNumber,ItemNumber,PlannedStartDate,PlannedEndDate,GoodQuantity,ProductionOrderStatus
```

### Production Orders at Risk (past due date)
```
GET /data/ProductionOrderHeaderEntity?$filter=PlannedEndDate lt 2026-04-10 and ProductionOrderStatus ne 'Ended'&$select=ProductionOrderNumber,ItemNumber,PlannedEndDate,ProductionOrderStatus
```

### BOM Components for a Finished Good
```
GET /data/BillOfMaterialsLineEntity?$filter=ItemNumber eq 'FG-1001'&$select=ItemNumber,ComponentItemNumber,BOMQuantity,UnitSymbol,BOMLineType
```

### Work Center Capacity Loads
```
GET /data/RouteOperationEntity?$filter=WorkCenterId eq 'MACHLINE1'&$select=WorkCenterId,OperationNumber,SetupTime,ProcessTime,ResourceGroupId
```

### Planned Orders from Master Planning
```
GET /data/PlannedOrderEntity?$filter=ItemNumber eq 'FG-1001' and PlannedOrderType eq 'Production'&$select=PlannedOrderNumber,ItemNumber,PlannedStartDate,RequirementDate,Quantity
```

## Core Tasks

### 1. Production Schedule Monitor
```text
GIVEN all open production orders
WHEN skill monitors schedule
THEN compare PlannedEndDate to today for each order
AND calculate percentage completion based on reported operations
AND flag orders where completion percentage is below expected based on elapsed time
AND return: on-track orders, at-risk orders (behind schedule), critical orders (past due)
```

### 2. BOM Cost Impact Analysis
```text
GIVEN a component item with a price change
WHEN skill analyzes impact
THEN find all BOMs that include this component
AND calculate cost delta per finished good
AND identify items where standard cost update is recommended
AND return impact table: finished good, current cost, new cost, variance amount
```

### 3. Capacity Exception Detection
```text
GIVEN a master planning run result
WHEN skill checks capacity
THEN sum planned operation hours by work center by day
AND compare to work center available hours
AND identify overloaded work centers (utilization above 100%)
AND suggest: split orders, alternative work centers, or schedule shift
```

## Agent Patterns for P2P

**Production schedule monitor:** Monitors open production orders for delays. Compares planned completion vs actual progress, identifies orders at risk of missing due dates, alerts planners with context.

**BOM cost analyzer:** After component price changes, agent identifies which finished goods are most affected, quantifies the cost impact, and flags items where standard cost needs updating.

**Capacity exception agent:** When master planning creates planned orders, agent checks work center capacity constraints. Identifies overloads and suggests splitting orders or moving to alternative work centers.

**Quality hold manager:** When a batch is quarantined, agent reads the quality order results, applies disposition rules from Dataverse policy tables, and routes to the right disposition action (rework, scrap, accept with deviation).

## Trigger Phrases

- "plan to produce in D365"
- "production order D365"
- "BOM setup D365"
- "master planning D365"
- "shop floor D365"
- "manufacturing process D365"
- "production scheduling D365"
- "work center capacity D365"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Production order cannot be released | BOM or route version not active for the production site | Check Product information management → BOMs; ensure BOM version status is "Approved" and site matches the production order site |
| Master planning creates excess planned orders | Demand fence or coverage settings too aggressive | Review master planning parameters: minimum order quantity, coverage group, days fence; adjust to reduce over-planning |
| BOM explosion shows wrong components | Wrong BOM version is active (date or site mismatch) | Verify BOM version effective dates and site filter; set the correct version to active |
| Report as finished posts to wrong inventory location | Output location on route or production order header is incorrect | Update the output warehouse/location on the production order header before reporting as finished |
| Production order cost variance is unexpectedly high | Component prices updated after production order was created without refreshing cost estimate | Run BOM calculation on the finished good; update the production order cost estimate before ending the order |
| Work center scheduling conflict | Two production orders scheduled simultaneously on same work center | Use Operations scheduling or Job scheduling in D365 with finite capacity enabled; re-plan one order |
| Quality order blocking goods receipt | Sampling plan requires inspection before stock is released | Process the quality order in Quality management → Quality orders; record results and set order status to Pass or Fail |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — OData queries, GIVEN/WHEN/THEN tasks, D365-specific error table |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
