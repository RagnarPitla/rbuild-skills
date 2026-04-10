---
name: markdown-advisor
description: Recommend markdown timing and depth for slow-moving inventory based on sell-through rate analysis, margin targets, and seasonal curve modeling. Use when user says "markdown optimization", "price markdown", "slow-moving inventory", "sell-through rate", "clearance pricing", or "seasonal markdown".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, retail, markdown, pricing]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Markdown Advisor

Inventory that doesn't sell at full price must eventually be marked down. The question is when and how much. Too early and you leave margin on the table. Too late and you're stuck with unsellable stock at season end. This agent makes that decision systematically, not by gut feel.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-RET-001 |
| Name | markdown-advisor |
| Category | Industry Vertical / Retail |
| Module | D365 Commerce, Retail Pricing |
| Complexity | Intermediate |
| Prerequisites | D365 Commerce with POS sales history, inventory on-hand, season calendar in Dataverse |

## Description

Evaluates each SKU against three factors: current sell-through rate vs the target curve, remaining season weeks, and the margin trade-off between acting now vs waiting. Recommends markdown amount, timing, and a ladder strategy for progressive clearance.

## Triggers

- "markdown optimization"
- "price markdown"
- "slow-moving inventory"
- "sell-through rate"
- "clearance pricing"
- "seasonal markdown"
- "which items should I mark down"
- "end of season clearance"
- "markdown recommendation"

## Core Tasks

### 1. Calculate Sell-Through Status
```text
GIVEN current inventory and sales history are available in D365
WHEN the agent evaluates a SKU or category
THEN calculate current sell-through rate: units sold / initial inventory
AND compare to the target sell-through curve for this week of the season
AND calculate the gap (percentage points behind or ahead of target)
AND project end-of-season inventory at current sell rate
AND classify urgency: ON TRACK, WATCH, ACTION REQUIRED, CRITICAL
```

### 2. Model Markdown Scenarios
```text
GIVEN a SKU is classified as ACTION REQUIRED or CRITICAL
WHEN the agent models markdown options
THEN calculate projected unit velocity at each markdown depth (10%, 20%, 30%, 50%)
AND calculate total recovery under each scenario: (units sold x price) + (remaining units x clearance value)
AND compare each scenario to the status quo (hold at full price)
AND identify the markdown depth that maximizes total recovery
AND factor in the cost of holding (storage, opportunity cost) vs acting now
```

### 3. Generate Markdown Ladder
```text
GIVEN a markdown is recommended
WHEN the agent creates the markdown plan
THEN determine initial markdown depth to start moving units
AND set evaluation checkpoints (e.g., after 2 weeks)
AND define escalation triggers (if sell-through doesn't improve, go deeper)
AND calculate final clearance price floor (minimum acceptable based on cost)
AND generate price change schedule for D365 Commerce implementation
```

### 4. Monitor Markdown Effectiveness
```text
GIVEN a markdown is live in D365 Commerce
WHEN the agent checks post-markdown performance
THEN compare actual sell rate after markdown vs modeled projection
AND flag SKUs where markdown is not generating expected response
AND recommend escalation (deeper discount) or accept model deviation
AND capture actual elasticity data to improve future markdown models
```

## Markdown Decision Framework

The agent evaluates three factors for each SKU:

**Factor 1: Sell-Through vs Target Curve**
```
Item: Women's Floral Blouse (SKU: WFB-442)
Initial inventory: 500 units
Units sold to date: 180 units
Current sell-through: 36%
Season benchmark at week 9: 60%
Gap: 24 percentage points BEHIND target
Urgency: ACTION REQUIRED
```

**Factor 2: Remaining Season**
```
Season end date: June 30
Current date: May 15
Weeks remaining: 6.5
Current weekly sell rate: 18 units/week
Projected additional units at current pace: 18 x 6.5 = 117 units
Projected total sell-through: (180 + 117) / 500 = 59.4%
Projected remaining at season end: 203 units (40.6% of inventory)
```

**Factor 3: Margin Trade-Off**
```
Current unit cost: $18.00
Full price: $49.99  (margin: 64%)

Status quo (no markdown):
  117 units at $49.99 = $5,849
  203 units cleared at $15.00 avg = $3,045
  Total recovery: $8,894

30% markdown ($34.99) now:
  Model projects +85 additional units sold = 265 x $49.99 + 118 x $34.99 = $17,437 blended
  After factoring remaining at end-season clearance = $10,212 total recovery
  Net improvement vs status quo: +$1,318

50% markdown ($24.99) now:
  Model projects +147 additional units = $9,841 total recovery
  Less improvement than 30% — diminishing returns at this stage

RECOMMENDATION: 30% markdown effective Friday May 17
```

## Markdown Ladder Strategy

Rather than one large markdown, ladder the discount to preserve margin while clearing inventory:

```
Week 9  (current): -20% off    Evaluate after 2 weeks
Week 11:           -30% off    If still behind target, evaluate
Week 13:           -40% off    Season ending in 3 weeks — clear harder
Week 14:           -50% off    Final clearance — minimize remaining units
```

The agent adjusts the ladder if actual sell-through responds differently than modeled. If 20% markdown exceeds projections, skip to week 13 schedule. If it underperforms, accelerate to 30% at week 10.

## SKU Prioritization for Markdown Review

Not all SKUs need the same attention. The agent prioritizes:

| Priority | Criteria | Action |
|----------|---------|--------|
| P1 - Urgent | More than 15pp behind target AND less than 4 weeks to season end | Markdown this week |
| P2 - Action | 10-15pp behind target OR high remaining units | Markdown within 2 weeks |
| P3 - Watch | 5-10pp behind target | Monitor weekly |
| P4 - On Track | Within 5pp of target | No action |

## Integration with D365 Commerce

The agent recommends; a merchandiser approves before any price change goes live.

```
Workflow:
  Agent generates markdown recommendations → Merchandiser review queue
  Merchandiser approves in D365 → Price change published
  Effective date: typically Thursday night for Friday implementation
  POS: picks up new price automatically at terminal refresh
  E-commerce: updated via D365 Commerce price API
  
Post-markdown tracking:
  Agent monitors daily sell-through vs projection
  Flags deviations within 5 days of markdown effective date
  Captures actual elasticity data per category for model improvement
```

## Common Scenarios

### Scenario 1: Category-Level Review
**User:** "Show me all the swimwear that needs to be marked down before Memorial Day weekend"
**Resolution:**
1. Pull all swimwear SKUs with current sell-through vs 12-week target curve
2. Classify each SKU: on track, watch, action required, critical
3. For action required and critical SKUs: run markdown scenario models
4. Generate prioritized markdown recommendation list sorted by units at risk
5. Format as merchandiser review queue with approve/modify/defer options

### Scenario 2: Post-Season Bulk Clearance
**User:** "Season is ending in 2 weeks — let's clear everything remaining"
**Resolution:**
1. Pull all in-season inventory with remaining units by SKU
2. Calculate cost floor for each SKU (minimum to recover cost)
3. Model 50% markdown vs 40% markdown for each SKU cluster
4. Recommend SKU-specific final clearance prices (not one blanket %)
5. For SKUs where even 50% doesn't clear profitably: recommend donation or liquidation path

### Scenario 3: Markdown Underperforming
**User:** "We put those jackets on 25% off two weeks ago and they're still not moving"
**Resolution:**
1. Pull sell-through data since markdown effective date
2. Compare actual velocity vs modeled velocity at 25% discount
3. Check: Is the price change actually live in all channels? (Confirm D365 price change status)
4. Check: Is this a display/placement issue or a price issue? (Pull planogram compliance data)
5. If price is confirmed live and display is correct: recommend escalation to 40% or SKU-level analysis of the specific barrier

## Troubleshooting Guide

### Sell-Through Calculation Differs from Merchandiser's Spreadsheet
**Cause:** Agent using D365 on-hand as initial inventory; merchandiser using buy quantity (before receipts); returns and transfers not treated consistently
**Fix:** Align on initial inventory definition: use first receipt date on-hand as baseline; apply consistent return treatment (returns add back to inventory, remove from sold units)

### Markdown Recommendations Triggering Too Early for Fashion Items
**Cause:** Seasonal target curve in Dataverse built on average category curves; fashion items have different velocity profiles (slow start, fast mid-season)
**Fix:** Build category-specific sell-through curves in Dataverse; separate fashion/trend items from basics; adjust urgency classification thresholds per curve

### Price Change Not Reflecting in E-Commerce After Approval
**Cause:** D365 Commerce price synchronization job to e-commerce channel not running on schedule; or price change effective date set to future date not yet reached
**Fix:** Check Commerce scheduler job status; confirm channel configuration for price sync frequency; verify effective date matches expected go-live

### Margin Floor Calculation Incorrect
**Cause:** Agent using list cost; actual landed cost (including freight, duties) is higher
**Fix:** Update margin floor calculation to use landed cost from InventCostTransEntity; ensure freight and duty allocation is included in cost basis

### Markdown Effectiveness Model Not Improving Over Time
**Cause:** Post-markdown actuals not being fed back into the elasticity model; model running on static historical assumptions
**Fix:** Implement monthly model refresh using last 12 months of markdown events and outcomes; capture actual elasticity per category and store cluster in Dataverse

## Related Skills

- `planogram-compliance-checker` (IV-RET-002) - Shelf compliance that affects markdown effectiveness
- `retail-agent-intro` (IV-RET-003) - Overview of retail AI agent use cases

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
