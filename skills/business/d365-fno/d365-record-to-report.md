---
name: "D365 Record to Report"
slug: "d365-record-to-report"
description: "Configure the R2R process in D365 Finance — chart of accounts, journal posting, period close, financial reporting, and agent patterns."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["d365-fno", "record-to-report", "finance", "general-ledger", "period-close"]
version: "1.0"
icon_emoji: "📒"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: "d365-fno-path"
learning_path_position: 2
prerequisites: ["d365-navigation-fundamentals"]
references:
  - title: "D365 Finance — General Ledger"
    url: "https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/general-ledger"
  - title: "Financial period close in D365"
    url: "https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/financial-period-close-workspace"
---

# D365 Record to Report

Record to Report (R2R) is the financial backbone of D365 Finance. It covers everything from chart of accounts setup through financial statement generation. This is the process most finance teams interact with daily.

## R2R Process Flow

```
Transaction occurs
    ↓
Journal entry created (manual or automated)
    ↓
Journal validated and posted to General Ledger
    ↓
Sub-ledgers reconciled (AP, AR, Fixed Assets, Inventory)
    ↓
Period-end adjustments (accruals, prepayments, depreciation)
    ↓
Period closed (prevent further posting)
    ↓
Financial reports generated (Trial Balance, P&L, Balance Sheet)
    ↓
Consolidation (if multi-entity)
```

## Chart of Accounts

The chart of accounts is the foundation. In D365, it's shared across legal entities via the **Shared chart of accounts** or configured per entity.

**Key setup areas:**
- **General ledger → Chart of accounts → Accounts** — define main accounts
- **Account type** — Balance sheet (Asset, Liability, Equity) or Income statement (Revenue, Expense)
- **Financial dimensions** — Business unit, Department, Cost center, Project attached to transactions
- **Account structures** — Which dimensions are valid for which accounts

**Best practice:** Design your chart of accounts before configuration. Changing account structures after transactions exist is painful.

## Journal Posting

D365 has multiple journal types for different purposes:

| Journal Type | Purpose |
|---|---|
| General journal | Manual GL entries, accruals, corrections |
| Accounts payable journal | Vendor invoices and payments |
| Accounts receivable journal | Customer invoices and receipts |
| Fixed assets journal | Asset acquisitions, disposals, depreciation |
| Inventory adjustment | Manual inventory value corrections |
| Project journal | Project hour and expense entries |

**Posting a general journal:**
1. General ledger → Journal entries → General journals
2. New → Select journal name (each journal name has a default account type)
3. Add lines: debit account, credit account, amount, dimensions
4. Validate → Post

**Validation rules catch:** missing dimensions, out-of-balance entries, blocked accounts, period not open.

## Period Close Workspace

General ledger → Period close → Financial period close workspace

This is the command center for month-end. It shows:
- Open tasks assigned to each team member
- Completion status by task
- Blocking dependencies (can't close GL until sub-ledgers reconciled)

**Configure your period close template:**
1. Create task areas (AP close, AR close, Fixed assets, GL close)
2. Add tasks with responsible users, due dates, dependencies
3. Assign the template to your fiscal calendar periods

## Sub-Ledger Reconciliation

Before closing the GL period, reconcile all sub-ledgers:

**Accounts Payable:** Accounts payable → Inquiries → Vendor transaction summary — ensure AP balance matches GL vendor summary account

**Accounts Receivable:** Accounts receivable → Inquiries → Customer transaction summary — ensure AR balance matches GL customer summary account

**Fixed Assets:** Fixed assets → Inquiries → Asset balances — ensure FA net book value matches GL fixed asset accounts

**Inventory:** Inventory management → Inquiries → Inventory value — ensure inventory balance matches GL inventory accounts

## Common Period-End Journals

```
Accruals:
  DR: Expense account
  CR: Accrued liabilities (balance sheet)
  [Reverse next period]

Prepayments:
  DR: Prepaid expense (balance sheet)
  CR: Cash / Vendor
  [Amortize monthly via recurring journal]

Depreciation:
  Runs automatically via Fixed Assets module
  DR: Depreciation expense
  CR: Accumulated depreciation
```

## Closing the Period

General ledger → Period close → Ledger calendar

1. Set period status to **On hold** (allows posting by controllers only)
2. Run final reconciliations
3. Post period-end adjustments
4. Set period status to **Closed** (no further posting)
5. Open next period

## Agent Patterns for R2R

R2R is rich territory for AI agents:

**Journal validation agent:** Before a user posts a journal, agent checks: are all dimensions complete? Does the entry balance? Are accounts appropriate for the transaction type? Surfaces errors before posting rather than after.

**Period-close checklist agent:** Monitors the close workspace, sends proactive reminders to task owners, flags blocking items, escalates overdue tasks to the controller.

**Variance analysis agent:** After period close, compares actuals vs budget vs prior period. Highlights top variances, generates natural-language explanations for management reporting.

**Anomaly detection agent:** Scans posted journals for unusual entries — large amounts, unusual account combinations, entries posted outside business hours. Flags for controller review.

## Key Reports

| Report | Location | Purpose |
|---|---|---|
| Trial balance | General ledger → Inquiries → Trial balance | All account balances |
| Balance sheet | Financial reporting | Assets, liabilities, equity |
| Income statement | Financial reporting | Revenue and expenses by period |
| Cash flow | Financial reporting | Cash sources and uses |
| Budget vs actual | Budgeting module | Variance reporting |
