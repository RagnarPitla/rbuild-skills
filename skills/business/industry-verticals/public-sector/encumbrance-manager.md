---
name: "encumbrance-manager"
slug: "encumbrance-manager"
description: "Track budget encumbrances against appropriations in D365 Public Sector — flag over-encumbrances, generate status reports, and support year-end carry-forwards. Use when user says \"encumbrance accounting\", \"budget commitment\", \"appropriation balance\", \"fund accounting\", \"PO encumbrance\", or \"budget carry-forward\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "public-sector"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "public-sector", "encumbrance", "fund-accounting"]
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


# Encumbrance Manager

In government fund accounting, an encumbrance is a reservation of budget funds when a purchase order is issued, before the invoice is paid. Encumbrances prevent over-spending by reducing available budget at commitment time, not at payment time. This agent monitors encumbrance balances, prevents over-encumbrances, and manages year-end carry-forward workflows.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-PS-001 |
| Name | encumbrance-manager |
| Category | Industry Vertical / Public Sector |
| Module | D365 Finance (Public Sector), Budget Control |
| Complexity | Intermediate |
| Prerequisites | D365 Public Sector budget control configured, fund accounting structure, appropriation hierarchy |

## Description

D365 Finance has built-in budget control for public sector. This agent extends it with proactive alerts, natural language budget status queries, consolidated department reporting, and year-end carry-forward workflow automation.

## Triggers

- "encumbrance accounting"
- "budget commitment"
- "appropriation balance"
- "fund accounting"
- "PO encumbrance"
- "budget carry-forward"
- "available budget"
- "encumbrance report"
- "year-end encumbrance"
- "over-encumbrance"

## How Encumbrances Work

```
Appropriation:              $500,000   (authorized to spend this fiscal year)

PO #1 issued (furniture)  - $45,000   ENCUMBERED
PO #2 issued (IT equip)   - $120,000  ENCUMBERED

Available budget:           $335,000   (appropriation - encumbrances)

When furniture invoice arrives:
  PO #1 encumbrance released: -$45,000 (no longer reserved)
  Actual expenditure added:   +$45,000 (actual spend recorded)
  Net effect on available:    $0 (available unchanged, but now actual vs reserved)
```

Encumbrances live in the space between "PO issued" and "invoice paid." The agent tracks that space in real time.

## Core Tasks

### 1. Report Real-Time Budget Status
```text
GIVEN a department manager asks about their budget status
WHEN the agent queries D365 Public Sector budget control
THEN pull appropriation amount for the fund/department/account combination
AND pull actual expenditures (invoiced and paid)
AND pull open encumbrances (purchase orders not yet invoiced)
AND calculate available budget = appropriation - actual - encumbrances
AND project end-of-year balance based on current burn rate
AND flag if available balance is insufficient for remaining fiscal year
```

### 2. Validate PO Before Encumbrance
```text
GIVEN a purchase order is submitted for approval
WHEN the agent pre-validates budget availability
THEN calculate total PO amount
AND check available unencumbered budget for the fund and account code
AND check for any pending POs not yet encumbered that may reduce available funds
AND return APPROVED (sufficient budget), FLAG (near budget limit), or BLOCK (insufficient budget)
AND if blocked, generate options for the requestor: amendment, deferral, offset, or reduce scope
```

### 3. Monitor Appropriation Health
```text
GIVEN budget thresholds are defined in Dataverse policy table
WHEN the agent runs its daily monitoring scan
THEN calculate current spend rate (actual expenditures by week/month)
AND project end-of-year balance at current burn rate
AND flag any appropriation where projected year-end balance is negative
AND flag any appropriation where actual + encumbrances exceed 90% of total (configurable)
AND alert the budget officer with a summary of at-risk appropriations
```

### 4. Manage Year-End Carry-Forward
```text
GIVEN fiscal year-end is approaching (within 60 days)
WHEN the agent analyzes open encumbrances
THEN identify all open purchase orders with undelivered goods or services
AND classify each by carry-forward eligibility rules from Dataverse
AND generate carry-forward request document for legislative/executive approval
AND track approval status per encumbrance
AND process carry-forward in D365 for approved items when new fiscal year opens
```

## Real-Time Budget Status Output

```
Department: Public Works — Road Maintenance
Fund: General Fund | Fiscal Year 2026

Appropriation:               $2,400,000
Actual Expenditures:           $890,000  (37.1%)
Open Encumbrances (POs):       $640,000  (26.7%)
Available Balance:             $870,000  (36.2%)

Fiscal year elapsed:          58% (7 months of 12)
Monthly burn rate (actual):   $89,000/month
Projected end-of-year balance: $177,500

ALERT: Three pending purchase orders ($285,000) in approval workflow.
If approved, available balance drops to $585,000.
At current burn rate, this leaves $0 buffer with 7.5 months remaining.

RECOMMENDATION: Prioritize the largest pending PO for deferral to FY2027
OR request a $200,000 budget amendment through the Council.
```

## Over-Encumbrance Prevention

```
Proposed PO: $180,000 for paving equipment
Available budget: $155,000

BLOCKED: Insufficient budget authority
  Appropriation: $2,400,000
  Actual expended: $890,000
  Open encumbrances: $1,355,000
  Available: $155,000
  Requested: $180,000
  Shortfall: $25,000

Options for the requesting department:
  1. Budget amendment: Request $25,000 increase from City Council
  2. Defer to FY2027: Equipment purchase delayed to next fiscal year
  3. Reduce scope: Can equipment be phased? Phase 1 = $155,000 this year
  4. Identify offset: Are there other encumbrances that can be released?
     (PO #PW-2026-041 for supplies — vendor failed to deliver, PO can be cancelled)
```

## Year-End Carry-Forward Analysis

```
Open Encumbrances at Year-End Analysis — June 30, 2026

Total open encumbrances:  $1,247,000  across 34 purchase orders

Carry-forward eligible (goods/services on order, delivery confirmed):
  12 POs — $634,000  — Recommend carry-forward
  Examples:
    PO-2026-089: Paving contract, 60% complete  $245,000  CARRY FORWARD
    PO-2026-112: IT equipment, delivery Sept  $89,000   CARRY FORWARD

Carry-forward borderline (work not started):
  8 POs — $312,000  — Requires department justification
  Examples:
    PO-2026-145: Training services, not yet scheduled  $28,000  JUSTIFY
    PO-2026-156: Consulting study, not started  $85,000  JUSTIFY

Not eligible (lapsed, should be cancelled):
  14 POs — $301,000  — Cancel and release encumbrance
  Examples:
    PO-2026-067: Vendor unresponsive, 8 months old  $45,000  CANCEL

Action required by: Department directors by July 5, 2026
Council approval needed: Yes, for carry-forwards exceeding $500,000 total
```

## D365 Public Sector Configuration

D365 Finance budget control module handles:
- Appropriation setup by fund, department, and account
- Automatic encumbrance creation when PO is confirmed
- Automatic encumbrance liquidation when invoice is posted
- Budget check at PO confirmation (hard or soft stop)

The agent adds to this foundation:
- Proactive alerts before balances become critical (not just after-the-fact blocking)
- Natural language budget status for department directors who don't live in D365
- Multi-department consolidated reporting for the budget office
- Year-end workflow automation that coordinates across departments

## Common Scenarios

### Scenario 1: Department Director Budget Check
**User:** "How much budget do I have left in my parks and recreation account?"
**Resolution:**
1. Pull appropriation balance for Parks and Recreation fund/account
2. Calculate: appropriation minus actuals minus open encumbrances
3. Show breakdown by major category (personnel, supplies, services, capital)
4. Project year-end balance at current run rate
5. Highlight if any category is at risk of over-spending before year-end

### Scenario 2: Emergency Purchase Over Budget
**User:** "We have a water main emergency — need to issue a $500,000 emergency PO but we only have $320,000 available"
**Resolution:**
1. Confirm available budget is $320,000 (insufficient for full PO)
2. Check if emergency procurement policy in Dataverse allows limited override
3. Flag for emergency budget amendment authorization
4. Issue partial PO for $320,000 to begin work immediately
5. Initiate emergency Council resolution workflow for remaining $180,000

### Scenario 3: Grant Fund Monitoring
**User:** "We need to spend all of our federal highway grant by September 30 or lose the funds"
**Resolution:**
1. Pull grant fund appropriation and remaining balance
2. Calculate monthly spend rate needed to exhaust by September 30
3. Pull open project commitments funded by the grant
4. Identify if open commitments are sufficient to exhaust the grant
5. Flag if gap exists between projected spend and required spend; recommend accelerating specific projects

## Troubleshooting Guide

### Available Budget Showing Negative When It Should Not
**Cause:** Duplicate encumbrance entries from system errors or manual journal adjustments that bypassed the encumbrance module
**Fix:** Run BudgetControlStatistics reconciliation report in D365; identify duplicate encumbrances and process reversals through proper journal

### Encumbrance Not Released After Invoice Posted
**Cause:** Invoice was posted to a different account code than the original purchase order; D365 cannot automatically match and release the encumbrance
**Fix:** Post a budget transfer to align the account codes, or manually liquidate the encumbrance with a budget control journal; review PO-to-invoice account matching rules

### Carry-Forward Report Missing Open POs
**Cause:** POs in "Draft" or "In Review" status not included in encumbrance report; only confirmed POs create encumbrances
**Fix:** Run a separate report for draft POs near year-end; prompt departments to either confirm or cancel draft POs before fiscal year close

### Budget Alert Threshold Triggering Too Late
**Cause:** Alert set at 90% consumed but department burn rate means 90% is reached only 2 weeks before year-end
**Fix:** Add a burn-rate-adjusted alert: flag when projected year-end balance is negative given current spend rate, regardless of % consumed

### Year-End Processing Errors in D365
**Cause:** Carry-forward entries failing because new year appropriations not yet established in D365
**Fix:** Process new year appropriation setup before initiating carry-forward; carry-forward requires a receiving appropriation to post against

## Related Skills

- `public-sector-compliance-agent` (IV-PS-002) - Procurement compliance monitoring that complements budget control
- `accrual-estimator` (H038) - Accrual accounting for uninvoiced expenditures against encumbrances

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
