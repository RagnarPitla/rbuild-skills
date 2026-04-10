---
name: D365 Source to Pay
slug: d365-source-to-pay
description: Configure S2P in D365 — vendor onboarding, purchase requisitions, POs, invoice matching, payment runs, and agent automation patterns.
tab: business
domain: d365-fno
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"d365-fno\", \"source-to-pay\", \"procurement\", \"accounts-payable\", \"purchasing\"]"
version: 1.0.1
icon_emoji: 🛒
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: d365-fno-path
learning_path_position: 3
prerequisites: "[\"d365-navigation-fundamentals\"]"
references:
  - "title: "D365 Supply Chain — Procurement"
  - "title: "Accounts payable in D365 Finance"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
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

**Invoice matching policy:** Configure in Accounts payable → Setup → Accounts payable parameters → Invoice validation. Set price tolerance (e.g., ±3% price variance auto-approved) and quantity tolerance.

Matching discrepancies that exceed tolerance → workflow routes to AP manager for approval.

## Payment Runs

**Accounts payable → Payments → Vendor payment journal → Lines → Settlement → Settle transactions**

Payment run process:
1. Select invoices due for payment (filtered by due date, vendor, payment method)
2. Generate payment file (EFT NACHA file, check print file, wire instructions)
3. Post the payment journal (creates GL entry: DR Accounts Payable / CR Bank)
4. Send payment to bank

**Early payment discounts:** D365 calculates discounts automatically if within the discount period. 2/10 Net 30: pay within 10 days → take 2% off.

## Agent Patterns for S2P

**Invoice matching agent:** Receives invoice (email/EDI), extracts data, matches to open POs in D365 via MCP, identifies mismatches, routes exceptions with full context to AP team. Handles 90%+ of invoices automatically.

**PO status tracker:** When a requester asks "where is my order?", agent queries D365 PO status, receipt status, invoice status — answers in natural language.

**Vendor onboarding agent:** Guides new vendor through data collection (bank account, tax ID, W-9), validates completeness, routes to AP for approval. Reduces onboarding from weeks to days.

**Payment forecast agent:** Reads upcoming payment runs from D365, cash position from treasury, and recommends which invoices to pay early (to capture discounts) vs defer (when cash is tight).

## Trigger Phrases

- "How do I d365 source to pay"
- "Help me with d365 source to pay in D365"
- "Check d365 source to pay"
- "Analyze d365 source to pay"
- "Show me d365 source to pay status"

## Quick Example

> See `d365-source-to-pay-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
