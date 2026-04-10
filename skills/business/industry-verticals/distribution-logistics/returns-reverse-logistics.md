---
name: returns-reverse-logistics
description: Automate returns authorization, receipt inspection, disposition decisions, and refund/credit processing in D365 Commerce and SCM. Use when user says "return authorization", "returns processing", "reverse logistics", "RMA", "disposition decision", or "return merchandise authorization".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, logistics, returns, reverse-logistics]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Returns and Reverse Logistics

Returns processing is a high-touch, high-cost operation that most companies handle poorly: manual eligibility checks, inconsistent disposition decisions, slow credit issuance, and no visibility into why returns are happening. This agent streamlines every stage from authorization through financial settlement.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-LOG-002 |
| Name | returns-reverse-logistics |
| Category | Industry Vertical / Distribution-Logistics |
| Module | D365 Commerce, SCM, Accounts Receivable |
| Complexity | Intermediate |
| Prerequisites | Return policy in Dataverse (Niyam pattern), item returnability flags, disposition rules per product category |

## Description

Automates the full returns lifecycle: RMA authorization, receiving, inspection, disposition, and financial settlement. Disposition rules stored in Dataverse per product category using the Niyam pattern so policies can be updated without changing agent logic.

## Triggers

- "return authorization"
- "returns processing"
- "reverse logistics"
- "RMA"
- "disposition decision"
- "return merchandise authorization"
- "process a return"
- "credit for returned goods"
- "refund request"

## Returns Process Flow

```
Customer requests return
    |
Agent validates:
  - Within return window?
  - Item marked as returnable?
  - Original purchaser match?
  - Condition requirement met?
    |
Auto-approve (all checks pass) OR Route to CS manager (exception) OR Auto-deny
    |
RMA issued with pre-paid label (if policy provides)
    |
Customer ships back
    |
Receiving team records item condition in D365
    |
Agent applies disposition rules from Dataverse policy table
    |
Disposition executed: Restock / Refurbish / Scrap / Return to Vendor
    |
Credit memo or refund issued in D365 AR
    |
Inventory updated
```

## Core Tasks

### 1. Evaluate Return Eligibility
```text
GIVEN a customer submits a return request with order number and reason
WHEN the agent runs eligibility checks
THEN verify return is within the policy return window (days from purchase)
AND confirm item is flagged as returnable in product master
AND verify customer identity matches original purchaser on order
AND check if item condition requirement can be met (e.g., new-in-box only)
AND return AUTO_APPROVE, ROUTE_TO_MANAGER, or AUTO_DENY with specific reason
```

### 2. Issue Return Merchandise Authorization
```text
GIVEN a return is approved
WHEN the agent creates the RMA
THEN generate RMA number and link to original sales order
AND create return order in D365 with expected return date
AND issue return shipping label if policy provides pre-paid return
AND send RMA confirmation to customer with instructions
AND set inspection reminder for expected receipt date
```

### 3. Apply Disposition Rules
```text
GIVEN returned item is received and condition is recorded
WHEN the agent evaluates the disposition
THEN read applicable rule from Dataverse by product category and condition
AND determine disposition action (Restock, Refurbish, Scrap, Return to Vendor)
AND initiate disposition action in D365 (transfer order, work order, or inventory write-off)
AND calculate credit amount based on disposition outcome
```

### 4. Issue Credit or Refund
```text
GIVEN disposition is determined and credit amount is calculated
WHEN the agent creates the financial settlement
THEN create credit memo in D365 AR with correct amount and reason code
AND apply customer preference for refund vs credit (from customer master)
AND process refund to original payment method if applicable
AND send settlement confirmation to customer
```

## RMA Authorization Logic

```
Policy checks (from Dataverse policy table):
  Return window: Is return within [policy] days of purchase?
  Returnable item: Is this item marked as returnable in product master?
  Original purchaser: Does the customer match the original order?
  Condition requirement: New-in-box only? Any condition?

Decision rules:
  Auto-approve:  All policy checks pass
  Route to CS:   Any single policy exception (manager discretion)
  Auto-deny:     Outside return window AND no exception flag on customer account
```

## Disposition Rules (Niyam Pattern)

Store disposition rules in Dataverse by product category. Agent reads the applicable rule at inspection time.

| Category | Condition: Like New | Condition: Good | Condition: Damaged |
|----------|--------------------|-----------------|--------------------|
| Electronics | Restock Grade A | Refurbish | Scrap or Vendor Return |
| Clothing | Restock | Discount bin | Donate or Scrap |
| Consumables | Destroy (health/safety) | Destroy | Destroy |
| Capital Equipment | Inspect further | Service and restock | Repair assessment |
| Perishables | Reject (cannot return) | Reject | Reject |

## Financial Settlement by Disposition

| Disposition | Customer Credit | Calculation |
|-------------|----------------|-------------|
| Restock (Grade A) | Full credit | Original sale price |
| Refurbish | Partial credit | Sale price minus refurbishment cost (standard cost table) |
| Scrap | Partial credit | Sale price minus scrap deduction (policy table %) |
| Deny | No credit | Customer bears return shipping if sent anyway |
| Return to Vendor | Full credit | Vendor reclaims cost from supplier |

## Returns Analytics

Monthly agent report:

```
RETURNS ANALYTICS REPORT — April 2026

Return Rate by Category:
  Electronics:    8.2%  (threshold: 5%) ALERT
  Clothing:       12.4% (threshold: 15%) OK
  Consumables:    1.1%  (threshold: 3%) OK

Top Return Reasons:
  1. Item not as described (31%) — Review product content accuracy
  2. Wrong item received (18%) — Review picking error rate
  3. Changed mind (22%) — Normal; no action
  4. Defective/damaged (19%) — Alert quality team

Refurbishment Yield Rate:  71% (target: 75%)
Net Recovery per Returned Unit:  $34.20 (target: $40.00)
Cost of Returns Processing per RMA:  $12.80

Actions Recommended:
  Electronics return rate exceeds threshold — investigate top SKUs
  Refurbishment yield below target — review refurb process for Electronics category
```

## Common Scenarios

### Scenario 1: High-Value Item Return Exception
**User:** "Customer wants to return a $4,800 industrial scanner 45 days after purchase — our window is 30 days"
**Resolution:**
1. Confirm item is outside 30-day return window
2. Check customer account for exception flag or VIP status
3. Route to Customer Service Manager with customer history (purchase volume, years as customer)
4. Manager approves with 20% restocking fee
5. Agent creates RMA with non-standard terms and notifies customer

### Scenario 2: Bulk Return from B2B Customer
**User:** "Retailer is returning 200 units of seasonal product at end of season per our consignment agreement"
**Resolution:**
1. Verify consignment return clause in customer contract (from Dataverse)
2. Validate return quantities against original consignment order
3. Create bulk return order in D365
4. Schedule receiving appointment at warehouse
5. Apply disposition rule: condition-based split between Grade A restock and discount bin

### Scenario 3: Vendor Return for Defective Component
**User:** "We need to return a defective batch of components to Supplier ABC — 500 units"
**Resolution:**
1. Create vendor return order in D365 linked to original purchase order
2. Generate return authorization request to supplier
3. Print RMA label with supplier's return address
4. Track goods in transit
5. Receive supplier credit and apply to AP balance when confirmed

## Troubleshooting Guide

### RMA Not Creating in D365 After Approval
**Cause:** Sales order referenced in return request is invoiced in a closed period; D365 return order requires open period for credit posting
**Fix:** Open a prior-period posting exception or post credit in current period with correct reason code

### Disposition Rule Not Matching Returned Item
**Cause:** Product category not assigned to item, or item's category hierarchy not mapped to disposition table in Dataverse
**Fix:** Verify item category assignment in D365 product master; ensure Dataverse disposition table covers all active category nodes

### Credit Amount Incorrect
**Cause:** Original sale price not available on return order; agent falling back to current list price
**Fix:** Store original sale price in return order header from original sales order at RMA creation time; do not recalculate from current price book

### Refund to Original Payment Method Failing
**Cause:** Payment method details not retained past 90 days (PCI compliance purge)
**Fix:** If original payment method no longer available, agent should default to check or ACH with confirmation from customer; update settlement policy in Dataverse

### Returns Analytics Report Missing Reason Codes
**Cause:** Customer service team selecting "Other" instead of specific reason codes
**Fix:** Restrict reason code field to required selection; add training prompt for the most common reasons specific to product category

## Related Skills

- `carrier-relationship-management` (IV-LOG-001) - Managing return freight carriers
- `inventory-demand-planning` - Impact of returns on inventory levels and demand signals

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
