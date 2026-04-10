---
name: "Lease Accounting Assistant"
slug: "lease-accounting-assistant"
description: "Calculate lease liability and ROU asset values under IFRS 16 and ASC 842 — amortization schedules, journal entries, and remeasurement."
tab: "business"
domain: "industry-verticals"
industry_vertical: "financial-services"
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["financial-services", "lease-accounting", "ifrs16", "asc842", "d365", "compliance"]
version: "1.0"
icon_emoji: "📑"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "IFRS 16 Leases"
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/"
  - title: "ASC 842 Lease Accounting — FASB"
    url: "https://fasb.org/page/PageContent?pageId=/standards/asu-2016-02.html"
---

# Lease Accounting Assistant

IFRS 16 and ASC 842 fundamentally changed lease accounting. What was previously kept off-balance-sheet (operating leases) now appears on the balance sheet. Companies with large real estate or equipment lease portfolios need systematic processes to stay compliant.

## Key Concepts

**Right-of-Use (ROU) Asset:** The asset representing your right to use the leased item.
**Lease Liability:** The present value of your future lease payment obligations.

At commencement:
```
ROU Asset = Lease Liability + Initial Direct Costs + Prepaid Lease Payments
Lease Liability = PV of future lease payments at the Incremental Borrowing Rate
```

## Lease Calculation (IFRS 16 / Finance Lease)

```
Lease: Office space, 5 years, $10,000/month, IBR = 5%

Step 1: Calculate PV of lease payments
  Monthly payment: $10,000
  Periods: 60 months
  Monthly rate: 5% / 12 = 0.4167%
  
  PV = $10,000 × [(1 - (1.004167)^-60) / 0.004167]
  PV = $10,000 × 52.9907
  Lease Liability at commencement = $529,907

Step 2: Initial journal entry
  DR Right-of-Use Asset    $529,907
  CR Lease Liability       $529,907

Step 3: Monthly amortization (Month 1)
  Interest = $529,907 × 0.4167% = $2,208
  Principal = $10,000 - $2,208 = $7,792
  
  DR Lease Liability       $7,792  (principal reduction)
  DR Interest Expense      $2,208  (interest component)
  CR Cash                  $10,000 (payment made)
  
  DR Depreciation Expense  $8,832  ($529,907 / 60 months)
  CR Accumulated Depreciation $8,832
```

## Remeasurement Events

Lease liability must be remeasured when:
- Lease term changes (exercised or abandoned extension option)
- Variable payments change (index-based rents)
- Purchase option assessment changes
- Modification of lease terms

The agent detects remeasurement triggers from the lease register and recalculates affected leases.

## D365 Integration

D365 Finance has a built-in Asset Leasing module. The agent:
- Creates lease records from imported lease register data
- Validates D365 calculations against independent calculations
- Flags discrepancies for review
- Generates the required IFRS 16 / ASC 842 disclosure data for financial reporting

## IFRS 16 vs ASC 842 Differences

| Aspect | IFRS 16 | ASC 842 |
|---|---|---|
| Operating lease on balance sheet | Always | Yes (but P&L treatment differs) |
| Short-term lease exemption | <12 months | <12 months |
| Low-value asset exemption | Yes (≈$5K) | No explicit threshold |
| Finance lease P&L | Front-loaded (interest + depreciation) | Front-loaded |
| Operating lease P&L | Front-loaded (IFRS 16) | Straight-line (ASC 842) |

This difference means the same lease looks different on an IFRS vs US GAAP income statement — something the agent flags when producing reports for multi-jurisdiction entities.
