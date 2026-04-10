---
name: accrual-estimator
description: Estimates and calculates accruals for period-end closing, uninvoiced receipts, expense accruals, and revenue recognition
metadata:
  author: Ragnar Pitla
  version: 1.0.0
  category: horizontal
  requires: D365 ERP MCP Server
---

# Accrual Estimator (H038)

## Skill Metadata
| Field | Value |
|-------|-------|
| Skill ID | H038 |
| Name | accrual-estimator |
| Category | Horizontal / Finance |
| Module | General Ledger / Accounts Payable / Accounts Receivable |
| Complexity | High |
| Prerequisites | GL access, understanding of accrual accounting |

## Description

Estimates and calculates accruals for period-end closing in D365 F&O. Identifies uninvoiced receipts, calculates expense accruals, estimates revenue recognition amounts, and generates accrual journal entries with proper reversals.

## Triggers

- "calculate accruals"
- "estimate accruals"
- "period-end accruals"
- "uninvoiced receipts"
- "purchase accrual"
- "expense accrual"
- "revenue accrual"
- "deferred revenue"
- "accrual journal"
- "accrual reversal"
- "GRIR reconciliation"
- "unbilled receivables"

## Key Entities

### Primary Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| VendPackingSlipJour | Product receipts | PackingSlipId, InvoiceDate, SumLineDisc |
| VendPackingSlipTrans | Receipt details | ItemId, Qty, PurchPrice |
| VendInvoiceJour | Vendor invoices | InvoiceId, InvoiceDate |
| PurchLine | Purchase order lines | ItemId, ReceivedQty, InvoicedQty |
| LedgerJournalTrans | Accrual journals | Voucher, AmountCurDebit, AmountCurCredit |
| SubledgerJournalAccountEntry | Subledger entries | AccountingCurrencyAmount, LedgerAccount |

### Data Entities
| Entity Name | Purpose |
|-------------|---------|
| VendorProductReceiptLineEntity | Uninvoiced receipts |
| PurchaseOrderLineEntity | PO line details |
| GeneralJournalLineEntity | Accrual postings |

## Core Tasks

### 1. Calculate Purchase Accruals
```text
GIVEN user needs AP accruals
WHEN skill calculates
THEN find all product receipts without matching invoice
AND value at receipt price
AND consider price variances
AND generate accrual amount by account
```

### 2. Calculate Expense Accruals
```text
GIVEN user needs expense accruals
WHEN skill estimates
THEN identify recurring expenses without invoice
AND estimate based on contract/history
AND calculate proration for period
AND create accrual entry
```

### 3. Calculate Revenue Accruals
```text
GIVEN user needs revenue accruals
WHEN skill calculates
THEN find shipped but unbilled orders
AND calculate revenue amount
AND consider percentage of completion
AND generate unbilled receivable entry
```

### 4. Manage Accrual Reversals
```text
GIVEN accruals need reversal
WHEN skill creates reversals
THEN identify prior period accruals
AND create reversal entries
AND ensure proper dating
AND validate net zero in new period
```

## Accrual Types

### Accounts Payable Accruals
| Type | Trigger | Calculation |
|------|---------|-------------|
| GR/IR | Product receipt | Receipt qty x PO price |
| Services | Service completion | Contract amount x % complete |
| Utilities | Usage period | Estimated usage x rate |
| Rent | Lease period | Monthly amount proration |

### Accounts Receivable Accruals
| Type | Trigger | Calculation |
|------|---------|-------------|
| Unbilled Revenue | Service delivered | Contract value x % complete |
| Accrued Interest | Time passage | Principal x rate x time |
| Milestone Revenue | Milestone achieved | Milestone value |

### Expense Accruals
| Type | Trigger | Calculation |
|------|---------|-------------|
| Payroll | Pay period cutoff | Days worked x rate |
| Bonus | Period end | Target x achievement % |
| Vacation | Balance accumulation | Hours x rate |

## OData Queries

### Get Uninvoiced Receipts
```
GET /data/VendorProductReceiptLineEntity?$filter=IsInvoiced eq false&$select=VendorAccount,ItemId,QuantityReceived,PurchasePrice,ProductReceiptDate
```

### Get Received vs Invoiced Variance
```
GET /data/PurchaseOrderLineEntity?$filter=ReceivedQuantity ne InvoicedQuantity&$select=PurchaseOrderNumber,ItemId,ReceivedQuantity,InvoicedQuantity,UnitPrice
```

### Get Shipped Not Invoiced
```
GET /data/SalesOrderLineEntity?$filter=DeliveredQuantity gt InvoicedQuantity&$select=SalesOrderNumber,ItemId,DeliveredQuantity,InvoicedQuantity,SalesPrice
```

## Common Scenarios

### Scenario 1: Month-End Purchase Accrual
**User:** "What's our purchase accrual for month-end?"
**Resolution:**
1. Query all product receipts in period without invoice
2. Calculate: SUM(Receipt Qty x PO Unit Price)
3. Adjust for any known price variances
4. Generate journal entry:
   - Debit: Expense/Inventory
   - Credit: GR/IR Clearing

### Scenario 2: Revenue Accrual for Services
**User:** "Calculate accrued revenue for consulting"
**Resolution:**
1. Get all active service contracts
2. Determine % complete for each
3. Calculate: Contract Value x % Complete - Billed Amount
4. Generate journal entry:
   - Debit: Unbilled AR
   - Credit: Deferred Revenue/Revenue

### Scenario 3: Payroll Accrual
**User:** "Estimate payroll accrual for period"
**Resolution:**
1. Determine pay period cutoff vs month-end
2. Calculate days worked after last paycheck
3. Estimate: Days x Daily Rate x Headcount
4. Add employer taxes and benefits
5. Generate accrual entry

## Accrual Journal Entry Templates

### Purchase Accrual (GR/IR)
```
Date: Last day of period
Debit:  Inventory/Expense     $XX,XXX
Credit: GR/IR Accrual          $XX,XXX

Reversal: First day of next period (auto-reverse)
```

### Unbilled Revenue
```
Date: Last day of period
Debit:  Unbilled Receivables  $XX,XXX
Credit: Revenue                $XX,XXX

Reversal: When invoice is generated
```

### Expense Accrual
```
Date: Last day of period
Debit:  Expense Account       $XX,XXX
Credit: Accrued Expenses       $XX,XXX

Reversal: First day of next period (auto-reverse)
```

## Accrual Accuracy Checklist

- [ ] All product receipts identified
- [ ] Receipt prices match PO prices
- [ ] Currency conversion applied correctly
- [ ] Tax handling considered
- [ ] Intercompany transactions included
- [ ] Service contracts reviewed
- [ ] Percentage completion estimated
- [ ] Prior period reversals processed
- [ ] Accrual accounts reconciled
- [ ] Documentation retained

## Troubleshooting Guide

### Accrual Balance Growing
**Cause:** Reversals not processing or invoices delayed
**Fix:** Review old accruals, investigate invoice delays

### GR/IR Out of Balance
**Cause:** Receipt and invoice in different periods/amounts
**Fix:** Reconcile receipt to invoice, adjust variances

### Revenue Recognized Twice
**Cause:** Manual accrual not reversed when billed
**Fix:** Implement auto-reversal, reconcile monthly

### Wrong Accrual Account
**Cause:** Posting profile misconfiguration
**Fix:** Review posting profile setup for GR/IR accounts

## Configuration for Accruals

### Posting Profile Setup
- Configure Purchase expenditure, un-invoiced account
- Set up Sales, Packing slip (unbilled revenue if needed)
- Define accrual expense accounts

### Journal Name Setup
- Create accrual journal name
- Enable auto-reversal option
- Set default reversal date offset

### Period Controls
- Define accrual posting period
- Set cutoff dates
- Configure approval workflow

## Related Skills

- `ledger-journal-validator` (H026) - Accrual journal validation
- `posting-profile-explainer` (H027) - Accrual posting setup
- `fiscal-calendar-checker` (H029) - Period-end timing
- `transaction-trace-analyzer` (H034) - Tracing accrual postings

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-25 | Initial skill definition |
