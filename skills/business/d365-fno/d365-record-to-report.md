---
name: "d365-record-to-report"
slug: "d365-record-to-report"
description: "Configure the Record to Report (R2R) process in D365 Finance — chart of accounts, journal posting, period close, financial reporting, subledger reconciliation, and agent patterns. Use when user says \"record to report in D365\", \"period close D365\", \"general ledger D365\", \"chart of accounts D365\", \"close the books D365\", \"journal posting D365\", \"financial reporting D365\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "d365", "record-to-report", "general-ledger"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
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

## OData Queries for R2R

### Check Period Status
```
GET /data/FiscalCalendarPeriods?$filter=FiscalCalendarId eq 'FY2026'&$select=PeriodName,StartDate,EndDate,Status&$orderby=StartDate
```

### Trial Balance Snapshot
```
GET /data/LedgerAccountStatementEntity?$filter=AccountNumber ge '100000' and AccountNumber le '699999'&$select=AccountNumber,AccountName,OpeningBalance,PeriodDebits,PeriodCredits,ClosingBalance
```

### Unposted Journals (not yet validated)
```
GET /data/LedgerJournalTable?$filter=Posted eq false&$select=JournalBatchNumber,JournalName,Description,CreatedDateTime,CreatedBy
```

### Large Unusual Journal Entries
```
GET /data/LedgerJournalTrans?$filter=AmountCurDebit gt 1000000 or AmountCurCredit gt 1000000&$select=JournalBatchNumber,Voucher,AccountDisplayValue,AmountCurDebit,AmountCurCredit,TransDate,CreatedBy
```

### Sub-Ledger vs GL Reconciliation Check (AP)
```
GET /data/VendTransactionSummaryEntity?$select=VendorAccount,SummaryBalance,CurrencyCode
```

## Core Tasks

### 1. Journal Validation Before Posting
```text
GIVEN a journal batch ready to post
WHEN skill validates
THEN check all lines have required financial dimensions populated
AND check debit total equals credit total (journal is balanced)
AND check all account numbers exist and are not blocked
AND check fiscal period on TransDate is open
AND return: pass or list of validation failures with line numbers
```

### 2. Period-Close Status Monitor
```text
GIVEN the period close workspace template
WHEN skill checks status
THEN query all tasks for the current close period
AND identify overdue tasks (due date passed, not complete)
AND identify blocking tasks that prevent downstream tasks from starting
AND return: dashboard with task owner, due date, status, and blocking impact
```

### 3. Variance Analysis
```text
GIVEN current period actuals and prior period or budget
WHEN skill analyzes variances
THEN calculate variance by account and dimension
AND rank accounts by absolute variance amount
AND generate plain-language explanation for top 10 variances
AND flag variances exceeding configured threshold as requiring controller sign-off
```

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

## Trigger Phrases

- "record to report in D365"
- "period close D365"
- "general ledger D365"
- "chart of accounts D365"
- "close the books D365"
- "journal posting D365"
- "financial reporting D365"
- "month-end close D365"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Journal cannot post: "Period is not open" | The fiscal period for the journal date is Closed or On Hold | Navigate to General ledger → Period close → Ledger calendar; open the period or change journal date to an open period |
| Journal validation error: "Account does not allow dimension" | Account structure does not permit the dimension combination on the journal line | Check General ledger → Chart of accounts → Structures; update allowed dimension segments or correct the journal line |
| Sub-ledger balance does not match GL | Transactions posted directly to GL summary account outside the subledger, or posting profile misconfigured | Run reconciliation report for the module; identify direct GL postings; correct with adjusting journal or fix posting profile |
| Period close task stuck in "In progress" | Responsible user did not mark task complete, or a dependency task is still open | Open the period close workspace; mark the task complete manually or resolve the blocking dependency |
| Batch depreciation did not run | Batch job for fixed asset depreciation failed or was not scheduled | Navigate to System administration → Batch jobs; check for failed depreciation batch; re-run the depreciation proposal in Fixed assets |
| Financial report shows incorrect period | Report definition uses wrong period date filter or column definition is misconfigured | Review the report definition in Financial reporting designer; verify row and column date filters match the intended period |
| Consolidation journal imbalanced | Intercompany elimination entries are missing or currency translation adjustment not posted | Run the consolidation wizard; check intercompany matching accounts; post the CTA journal before finalizing consolidation |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — OData queries, GIVEN/WHEN/THEN tasks, D365-specific error table |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
