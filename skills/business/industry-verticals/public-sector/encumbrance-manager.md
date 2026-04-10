---
name: "Encumbrance Manager"
slug: "encumbrance-manager"
description: "Track budget encumbrances against appropriations in D365 Public Sector — flag over-encumbrances, generate status reports, and support year-end carry-forwards."
tab: "business"
domain: "industry-verticals"
industry_vertical: "public-sector"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["public-sector", "encumbrance", "budget", "appropriations", "government", "d365"]
version: "1.0"
icon_emoji: "🏛️"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "D365 Public Sector — Budget Control"
    url: "https://learn.microsoft.com/en-us/dynamics365/finance/public-sector/budget-control-overview"
---

# Encumbrance Manager

In government fund accounting, an encumbrance is a reservation of budget funds against a purchase order before the invoice is paid. Encumbrances prevent over-spending before commitments become actual expenditures.

## How Encumbrances Work

```
Budget appropriation:    $500,000  (authorized to spend)
                         
PO issued for office furniture → $45,000 encumbered
PO issued for IT equipment    → $120,000 encumbered
                         
Available budget:        $500,000 - $45,000 - $120,000 = $335,000

When furniture invoice paid → $45,000 encumbrance released, $45,000 actual expenditure
```

Encumbrance management prevents departments from making commitments they can't honor.

## Agent Monitoring Functions

### Real-Time Budget Status

For each appropriation, the agent tracks:
```
Department: Public Works — Road Maintenance
Fiscal Year 2026

Appropriation:           $2,400,000
Expended (actual):         $890,000  (37.1%)
Encumbered (POs):          $640,000  (26.7%)
Available:                 $870,000  (36.2%)

Remaining fiscal year: 7.5 months
Monthly burn rate (actual): $89,000
Projected end-of-year balance: $177,500 (assuming steady burn rate)

ALERT: Three pending POs ($285,000) awaiting approval.
If approved, available balance drops to $585,000 with 7.5 months remaining.
Recommend: Review and prioritize approval of these POs.
```

### Over-Encumbrance Prevention

Before approving a purchase order, the agent validates that sufficient unencumbered budget remains:

```
Proposed PO: $180,000 for paving equipment
Available budget: $155,000

❌ BLOCKED: Insufficient budget authority
   Available: $155,000
   Requested: $180,000
   Shortfall: $25,000

Options:
  1. Request budget amendment from City Council (+$25,000)
  2. Defer to next fiscal year
  3. Reduce scope of purchase
  4. Identify offset savings in same fund
```

### Year-End Encumbrance Report

At fiscal year-end, some encumbrances can be carried forward to the new year. The agent generates:

**Carry-forward eligibility analysis:**
- Open POs with goods/services not yet received → eligible for carry-forward
- Open POs where work hasn't started → typically must be re-appropriated
- Grant-funded encumbrances → check grant terms for carry-forward rules

**Carry-forward request documentation:**
- List of encumbrances requested for carry-forward
- Justification for each (project status, delivery expectations)
- Estimated carry-forward completion dates
- Required legislative/executive approval level per your jurisdiction

## D365 Public Sector Configuration

D365 Finance has built-in budget control for public sector. The agent extends it with:
- Proactive alerts (not just after-the-fact blocking)
- Natural language budget status queries
- Consolidated department reporting
- Year-end workflow automation
