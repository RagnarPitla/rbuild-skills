---
name: "planogram-compliance-checker"
slug: "planogram-compliance-checker"
description: "Verify store shelf planogram compliance from image data and generate corrective action reports with prioritized fixes ranked by sales impact. Use when user says \"planogram compliance\", \"shelf compliance\", \"store layout\", \"shelf audit\", \"facing count\", or \"product placement\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "retail"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "retail", "planogram", "compliance"]
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


# Planogram Compliance Checker

Planogram compliance directly impacts sales. Misplaced products, empty shelves, and wrong facings cost revenue every day. Traditional store audits are expensive and infrequent. This agent makes compliance monitoring continuous by processing shelf photos and generating prioritized, actionable corrective reports for store managers.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-RET-002 |
| Name | planogram-compliance-checker |
| Category | Industry Vertical / Retail |
| Module | D365 Commerce, Azure AI Vision, Dataverse |
| Complexity | Intermediate |
| Prerequisites | Planogram database with shelf layout specs per store format, Azure AI Vision or equivalent image recognition service, sales velocity data from D365 POS |

## Description

Takes shelf photos as input (from store staff app or shelf cameras), identifies product positions using image recognition, compares actual positions to planogram specification, and outputs a prioritized corrective action report ranked by revenue impact.

## Triggers

- "planogram compliance"
- "shelf compliance"
- "store layout"
- "shelf audit"
- "facing count"
- "product placement"
- "store audit"
- "shelf photo"
- "compliance score"

## Core Tasks

### 1. Process Shelf Image
```text
GIVEN a store staff member submits shelf photos via mobile app
WHEN the agent processes the images
THEN run image recognition to identify product labels and positions
AND map identified products to item master records using barcode/label matching
AND build an actual shelf layout map for the captured section
AND calculate confidence score for each product identification
AND flag low-confidence identifications for human review
```

### 2. Compare to Planogram Specification
```text
GIVEN actual shelf layout is extracted from images
WHEN the agent compares to the planogram database
THEN retrieve the approved planogram for this store format and section
AND identify discrepancies: missing products, wrong positions, wrong facing count
AND calculate section compliance score: (correct positions / total positions) x 100
AND flag price tag issues where visible
```

### 3. Prioritize Corrective Actions
```text
GIVEN compliance gaps are identified
WHEN the agent ranks the findings
THEN retrieve sales velocity and margin data for each out-of-compliance product
AND calculate estimated daily sales impact for each gap
AND rank findings by revenue impact (highest impact = fix first)
AND separate into: fix today (high impact) vs fix at next restock (routine)
AND check inventory system to confirm back stock availability before assigning fix
```

### 4. Generate Store Manager Report
```text
GIVEN prioritized findings are ready
WHEN the agent produces the output
THEN format findings as a prioritized corrective action list
AND include specific actions (replenish from back stock, move from position X to Y)
AND create task entries in store task management system
AND set completion deadline per urgency level
AND schedule follow-up photo verification after completion
```

## How It Works

```
Input:
  Shelf photos submitted by store staff (mobile app)
  OR automated capture from shelf camera system

Image Processing:
  Step 1: Product identification via Azure AI Vision
    - Reads barcode labels, product packaging, brand colors
    - Maps to item master in D365 Commerce
    - Confidence threshold: 85% minimum (configurable in Dataverse)

  Step 2: Position mapping
    - Identifies shelf sections (top shelf, eye level, bottom shelf, end cap)
    - Maps each identified product to a shelf position grid
    - Notes facing count (how many units wide is the product displayed)

  Step 3: Planogram comparison
    - Retrieves approved planogram for this store ID and section
    - Compares actual positions to required positions
    - Identifies: missing products, wrong positions, wrong facing count, price tag gaps

  Step 4: Impact scoring
    - Pulls 30-day average daily sales rate per SKU from D365 POS
    - Multiplies missing/wrong units by daily sales rate
    - Estimates daily revenue impact of each compliance gap

Output:
  Compliance report with:
    - Overall section score (%)
    - Prioritized action list (P1 = fix today, P2 = next restock)
    - Estimated revenue impact per gap
    - Back stock availability check results
```

## Compliance Report Example

```
PLANOGRAM COMPLIANCE REPORT
Store: Downtown #247
Section: Beverages Aisle 3, Positions 1-24
Score: 74% (14 of 18 positions compliant)
Submitted by: R. Johnson | April 10, 2026 9:14am

FIX TODAY (high sales impact):

1. Coca-Cola 12-pack (positions 4-6): OUT OF STOCK
   Estimated daily revenue impact: $180/day
   Back stock: 2 cases confirmed in receiving area
   Action: Replenish now — 2 cases should fill positions 4-6

2. Pepsi and Dr Pepper positions switched
   Pepsi is in positions 10-12, should be 7-9
   Dr Pepper is in positions 7-9, should be 10-12
   Sales impact: Lower — brand adjacency violation
   Action: Swap positions at next employee pass

FIX AT NEXT RESTOCK (routine):

3. Sprite facing count: 2 actual, 3 required (positions 13-15)
   Action: Add 1 facing at next restock
   
4. Price tag missing: Gatorade 32oz Blue (position 18)
   Action: Print and post price tag from POS system
   
5. Mountain Dew 2L not on shelf (positions 20-21)
   Back stock: 0 units — out of stock system-wide
   Action: No fix available; flag for replenishment order

Compliance target: 90% | Current score: 74%
Status: BELOW TARGET — P1 fixes will raise score to 87%
```

## Integration Points

| System | Data |
|--------|------|
| Planogram database | Approved shelf layout per store format and section |
| D365 Commerce POS | Daily sales velocity by SKU and store |
| D365 SCM Inventory | On-hand quantity at store and back-of-store |
| Azure AI Vision | Image recognition processing |
| D365 item master | Product information, barcode lookup |
| Store task management | Task creation and completion tracking |

## ROI

Retail industry studies consistently show 1-3% sales lift from improved planogram compliance. For a store doing $10M/year, that is $100K-$300K in recovered revenue from better shelf execution. The cost of deploying this agent across a store estate is typically recovered in under 60 days at that revenue lift rate.

## Common Scenarios

### Scenario 1: Morning Shelf Check Before Store Opens
**User:** "Show me which aisles need attention before we open"
**Resolution:**
1. Process overnight shelf photos from fixed shelf cameras (if available) or prompt staff to do quick walk
2. Identify any out-of-stocks from last night's sales that weren't replenished
3. Prioritize by sales velocity: carbonated beverages and snacks first, specialty items second
4. Generate opening task list for morning shift with bay assignments and time estimates

### Scenario 2: New Product Launch Compliance
**User:** "Verify that the new protein bar launch is correctly placed across all 50 stores"
**Resolution:**
1. Request shelf photos from all 50 stores via store manager app
2. Process each submission and compare to the launch planogram
3. Calculate compliance rate per store and region
4. Identify the 10 stores with lowest compliance for immediate follow-up
5. Generate area manager report showing compliance map by store

### Scenario 3: Post-Promotional Reset
**User:** "We just ran a end-cap promotion — confirm stores have reset back to normal planogram"
**Resolution:**
1. Identify affected end-cap positions across store estate
2. Request photos from high-volume stores (top 20% by revenue)
3. Verify end-cap positions have been reset per standard planogram
4. Flag stores where promotional signage is still in place after campaign end
5. Report reset compliance rate to national retail operations

## Troubleshooting Guide

### Image Recognition Confidence Below Threshold
**Cause:** Poor lighting in store, glare on shelving, products turned at angle, or new product packaging not yet in training set
**Fix:** Retrain image recognition model with new packaging images; store staff should use good lighting and capture from straight angle; add low-confidence items to human review queue

### Planogram Database Not Matching Store Format
**Cause:** Store was recently remodeled or changed format category but planogram database not updated
**Fix:** Maintain planogram database with store format version and effective dates; when store format changes, trigger planogram review process before compliance monitoring resumes

### Back Stock Check Showing Wrong Availability
**Cause:** D365 inventory showing back-of-store units that have been allocated to another channel (e-commerce fulfillment) but not yet physically moved
**Fix:** Filter inventory query to exclude units with active pick reservations; only count truly available (unreserved) back-of-store units

### Compliance Score Not Improving Despite Fixes
**Cause:** Follow-up photo not captured after corrections; agent using same pre-fix photo to calculate score
**Fix:** Require staff to submit post-fix photo before marking task complete; agent recalculates score from the post-fix image only

### Product Recognition Failing for Private Label Items
**Cause:** Private label packaging not included in image recognition training data; model only trained on national brands
**Fix:** Include private label product images in recognition model training set; these are often the highest-margin items and most important to get right

## Related Skills

- `markdown-advisor` (IV-RET-001) - Markdown recommendations where planogram compliance affects sell-through
- `retail-agent-intro` (IV-RET-003) - Retail AI agent overview and where to start

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
