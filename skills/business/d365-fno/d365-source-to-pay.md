---
name: "d365-source-to-pay"
slug: "d365-source-to-pay"
description: "Configure Source to Pay (S2P) in D365 — vendor onboarding, purchase requisitions, purchase orders, product receipt, invoice matching, payment runs, and agent automation patterns. Use when user says \"source to pay in D365\", \"purchase order process D365\", \"vendor invoice matching D365\", \"AP payment run D365\", \"purchase requisition D365\", \"three-way match D365\", \"S2P process\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "d365", "source-to-pay", "procurement"]
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


# D365 Source to Pay

Source to Pay (S2P) covers the full procurement cycle: identifying a need, finding a vendor, placing an order, receiving goods, and paying the vendor. In D365, this spans Procurement and Sourcing, Accounts Payable, and Vendor Collaboration modules.

## S2P Process Flow

```
Need identified
    ↓
Purchase Requisition created and approved
    ↓
Request for Quotation (optional, for new vendors/large spend)
    ↓
Purchase Order created
    ↓
PO confirmed and sent to vendor
    ↓
Goods/services received (Product Receipt)
    ↓
Vendor invoice received and matched to PO
    ↓
Invoice approved and posted
    ↓
Payment run → Vendor paid
```

## Vendor Master Setup

Before purchasing, vendors must be set up in the system.

**Accounts payable → Vendors → All vendors → New**

Key fields:
- **Vendor group** — determines default posting profile (which GL accounts)
- **Terms of payment** — Net 30, Net 60, 2/10 Net 30 (2% discount if paid in 10 days)
- **Method of payment** — Check, EFT, Wire
- **Currency** — for international vendors
- **1099/Tax reporting** — for US vendors subject to 1099 reporting
- **Bank account** — required for EFT payments

**Vendor approval workflow:** Most organizations require a workflow before new vendors can be used for purchasing. Configure in Procurement and sourcing → Setup → Procurement and sourcing workflows.

## Purchase Requisitions

Purchase requisitions (PRs) are internal requests for goods or services before a PO is created.

**Procurement and sourcing → Purchase requisitions → All purchase requisitions → New**

Workflow typical steps:
1. Requester creates PR with item, quantity, needed-by date
2. Manager approves (workflow configured by approval amount)
3. Purchasing receives approved PR, converts to PO

**Converting PR to PO:** Procurement and sourcing → Purchase requisitions → Purchase orders → Release approved purchase requisitions → Select lines → Create PO

## Purchase Orders

**Procurement and sourcing → Purchase orders → All purchase orders → New**

Key PO sections:
- **Header:** Vendor, delivery date, warehouse, currency
- **Lines:** Item number or procurement category, quantity, unit price
- **Charges:** Freight, handling fees added to the PO
- **Financial dimensions:** Cost center, department, project for the expense

**PO Confirmation:** Sends the PO to the vendor (email, print, EDI). After confirmation, the PO is legally binding.

**PO Change Management:** If you need to change a confirmed PO, D365 creates a change order that requires re-confirmation. Audit trail is maintained automatically.

## Product Receipt (Receiving)

When goods arrive:

**Procurement and sourcing → Purchase orders → [open PO] → Receive → Product receipt**

- Enter the product receipt number (packing slip number from vendor)
- Confirm quantity received
- System creates inventory transaction (goods now in stock)
- System records the receipt against the PO line (for 3-way matching)

**Partial receipts:** You can receive partial quantities. The PO remains open until fully received.

## Invoice Matching

Three-way matching: Invoice vs PO vs Product Receipt.

**Accounts payable → Vendor invoices → Open vendor invoices → New**

Match types:
- **2-way:** Invoice matches PO (quantity and price)
- **3-way:** Invoice matches PO AND product receipt
- **Charge matching:** Freight/handling charges match

**Invoice matching policy:** Configure in Accounts payable → Setup → Accounts payable parameters → Invoice validation. Set price tolerance (e.g., plus/minus 3% price variance auto-approved) and quantity tolerance.

Matching discrepancies that exceed tolerance → workflow routes to AP manager for approval.

## Payment Runs

**Accounts payable → Payments → Vendor payment journal → Lines → Settlement → Settle transactions**

Payment run process:
1. Select invoices due for payment (filtered by due date, vendor, payment method)
2. Generate payment file (EFT NACHA file, check print file, wire instructions)
3. Post the payment journal (creates GL entry: DR Accounts Payable / CR Bank)
4. Send payment to bank

**Early payment discounts:** D365 calculates discounts automatically if within the discount period. 2/10 Net 30: pay within 10 days → take 2% off.

## OData Queries for S2P

### Open Purchase Orders Awaiting Receipt
```
GET /data/PurchaseOrderHeaderV2?$filter=PurchaseOrderStatus eq 'Confirmed'&$select=PurchaseOrderNumber,VendorAccountNumber,DeliveryDate,TotalInvoiceAmount&$orderby=DeliveryDate
```

### Vendor Invoices Pending Approval
```
GET /data/VendorInvoiceHeadersV2?$filter=ApprovalStatus eq 'InReview'&$select=InvoiceNumber,VendorAccountNumber,InvoiceDate,TotalInvoiceAmount,PurchaseOrderNumber
```

### Invoice Matching Discrepancies
```
GET /data/VendorInvoiceLineEntity?$filter=MatchingStatus eq 'Failed'&$select=InvoiceNumber,ItemNumber,InvoicedQuantity,PurchaseOrderQuantity,UnitPrice,PurchaseUnitPrice
```

### Invoices Due for Payment This Week
```
GET /data/VendTransactionEntity?$filter=DueDate le 2026-04-17 and AmountRemaining lt 0&$select=VendorAccount,InvoiceId,DueDate,AmountRemaining,CurrencyCode&$orderby=DueDate
```

### Early Payment Discount Opportunities
```
GET /data/VendTransactionEntity?$filter=CashDiscountDate ge 2026-04-10 and CashDiscountAmount lt 0&$select=VendorAccount,InvoiceId,CashDiscountDate,CashDiscountAmount,AmountRemaining
```

## Core Tasks

### 1. Invoice Matching Automation
```text
GIVEN a vendor invoice (from email or EDI)
WHEN skill processes invoice
THEN extract: vendor, invoice number, date, line items, amounts
AND find matching open PO in D365 via MCP
AND compare invoice lines to PO lines (quantity, unit price)
AND compare to product receipt lines
AND return: matched (auto-approve), discrepancy detail (route to AP), no PO found (route for manual handling)
```

### 2. PO Status Tracker
```text
GIVEN a purchase order number or requester query
WHEN skill checks status
THEN query PO header status (Draft, Confirmed, Received, Invoiced)
AND query receipt status by line (quantity ordered vs received)
AND query invoice status (not invoiced, partially invoiced, fully invoiced)
AND return natural-language status summary
```

### 3. Payment Forecast
```text
GIVEN upcoming AP payment obligations
WHEN skill forecasts
THEN query invoices due in next 30 days by due date
AND identify early payment discount opportunities expiring soon
AND compare total due to available cash balance
AND return: pay now (capture discount), pay on due date, defer recommendation per invoice
```

## Agent Patterns for S2P

**Invoice matching agent:** Receives invoice (email/EDI), extracts data, matches to open POs in D365 via MCP, identifies mismatches, routes exceptions with full context to AP team. Handles 90%+ of invoices automatically.

**PO status tracker:** When a requester asks "where is my order?", agent queries D365 PO status, receipt status, invoice status — answers in natural language.

**Vendor onboarding agent:** Guides new vendor through data collection (bank account, tax ID, W-9), validates completeness, routes to AP for approval. Reduces onboarding from weeks to days.

**Payment forecast agent:** Reads upcoming payment runs from D365, cash position from treasury, and recommends which invoices to pay early (to capture discounts) vs defer (when cash is tight).

## Trigger Phrases

- "source to pay in D365"
- "purchase order process D365"
- "vendor invoice matching D365"
- "AP payment run D365"
- "purchase requisition D365"
- "three-way match D365"
- "S2P process"
- "vendor onboarding D365"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Invoice matching fails: "No product receipt found" | Goods have not been received in D365, or receipt was posted against wrong PO | Confirm product receipt is posted against the correct PO; if goods are received physically, post the product receipt before re-processing the invoice |
| PO price tolerance exceeded | Vendor invoiced at a different price than the PO | Check if vendor price change was authorized; update PO price if authorized, or reject the invoice and request a corrected invoice from vendor |
| Payment run generates no payments | Invoice due dates are in the future, or invoices are not fully approved | Check invoice approval status; confirm "From date" and "To date" on the payment proposal include the target invoices |
| Vendor bank account not found on payment file | Vendor bank account not set up or linked to method of payment | Navigate to AP → Vendors → [vendor] → Bank accounts; add bank account and link to the correct method of payment |
| Vendor invoice workflow stuck | Approver is out of office or workflow has no escalation configured | Use the workflow history to identify the stuck step; re-assign manually in the workflow viewer or configure an escalation path |
| Duplicate invoice warning | Same invoice number from same vendor was already entered | D365 checks for duplicates by vendor + invoice number; if it is a legitimate duplicate (e.g., credit and re-invoice), adjust the invoice number to distinguish it |
| 1099 amount incorrect on year-end report | Payments were posted to non-1099 accounts or vendor 1099 box not configured | Check vendor 1099 configuration (AP → Vendors → [vendor] → Tax 1099 tab); verify all payments used 1099-reportable accounts |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — OData queries, GIVEN/WHEN/THEN tasks, D365-specific error table |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
