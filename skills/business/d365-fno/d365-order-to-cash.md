---
name: D365 Order to Cash
slug: d365-order-to-cash
description: Configure O2C in D365 — customer setup, sales orders, pricing, invoicing, collections, and AI agent automation patterns.
tab: business
domain: d365-fno
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"d365-fno\", \"order-to-cash\", \"sales\", \"accounts-receivable\", \"collections\"]"
version: 1.0.1
icon_emoji: 💰
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: d365-fno-path
learning_path_position: 4
prerequisites: "[\"d365-navigation-fundamentals\"]"
references:
  - "title: "D365 Sales and Marketing"
  - "title: "Accounts receivable in D365 Finance"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
---


# D365 Order to Cash

Order to Cash (O2C) covers the revenue cycle: customer places an order, you fulfill it, invoice it, and collect payment. In D365, this spans Sales and Marketing, Accounts Receivable, and Collections.

## O2C Process Flow

```
Customer inquiry / quotation
    ↓
Sales order created
    ↓
Credit check (automatic)
    ↓
Order confirmed
    ↓
Pick → Pack → Ship (Warehouse Management)
    ↓
Packing slip posted (inventory reduction, revenue recognition trigger)
    ↓
Invoice generated and sent to customer
    ↓
Payment received and applied
    ↓
Collections if overdue
```

## Customer Master Setup

**Accounts receivable → Customers → All customers → New**

Key fields:
- **Customer group** — determines posting profile and default terms
- **Terms of payment** — Net 30, COD, etc.
- **Credit limit** — maximum outstanding balance allowed
- **Credit group** — for managing credit across related customers
- **Salesperson** — for commission and reporting
- **Delivery terms** — FOB, CIF, etc. (affects revenue recognition)
- **Price group** — which price list applies to this customer

## Sales Orders

**Sales and marketing → Sales orders → All sales orders → New**

Header:
- Customer account, requested ship date, delivery address
- Price group, discount (if overriding defaults)
- Payment terms, delivery terms

Lines:
- Item number, quantity, unit price
- Requested delivery date per line (for ATP check)
- Discount %, charges

**Available to Promise (ATP):** D365 checks on-hand inventory and planned receipts to confirm whether you can deliver on the requested date. Sales → Sales order line → Product and supply → Delivery date control.

**Sales quotation:** Before creating a firm order, create a quotation. Convert to order when customer accepts.

## Pricing and Discounts

D365 has a powerful pricing engine:

**Sales and marketing → Prices and discounts → Sales price**

Price types:
- **Base price** — default price on item master
- **Sales price agreement** — customer-specific or price group-specific prices
- **Trade discount** — percentage discount by customer/item combination
- **Multiline discount** — discount based on total order value

The system selects the best price automatically based on the priority you configure.

## Picking, Packing, and Shipping

After order confirmation:

1. **Pick list:** Warehouse management → Outbound → Pick routes — generate pick list for warehouse staff
2. **Packing slip:** When items are packed and ready to ship — **Sales order → Generate → Packing slip** — posts the packing slip, reducing inventory
3. **Shipment:** Records actual ship date, carrier, tracking number

**Packing slip posting is the inventory moment.** Revenue is not yet recognized — that happens at invoicing (or when control transfers, per IFRS 15/ASC 606 configuration).

## Invoicing

**Sales and marketing → Sales orders → [order] → Invoice → Invoice**

Or batch-invoice all shipped orders:
**Accounts receivable → Orders → Invoicing → Invoice**

Invoice posting creates:
- AR transaction (customer owes you)
- Revenue recognition (GL: DR Accounts Receivable / CR Revenue)
- Tax transaction (if applicable)
- Invoice document (PDF for email to customer)

**Electronic invoicing:** D365 supports EDI invoice transmission for large customers who require it.

## Cash Application (Payment Collection)

When customer pays:

**Accounts receivable → Payments → Customer payment journal → Lines → Settlement**

- Apply payment to specific invoices
- Handle partial payments (D365 tracks remaining balance)
- Record early payment discounts taken by customer
- Handle overpayments (credit memo or refund)

**Automatic bank reconciliation:** If connected to bank feed, D365 can auto-match incoming payments to open AR invoices.

## Collections

**Credit and collections → Collections → Collections**

The collections workspace shows:
- Customers with overdue balances
- Days overdue, amount overdue
- Collection history and notes
- Promise-to-pay dates entered by collections team

**Collection letters:** Automated dunning letters at configurable intervals (30, 60, 90 days overdue) with escalating tone.

**Interest calculation:** D365 can calculate and post interest charges on overdue balances per your credit terms.

## Agent Patterns for O2C

**Sales order anomaly agent:** Flags orders with unusual quantities, pricing below threshold, ship-to addresses not matching customer profile. Routes to sales manager before confirming.

**Credit check agent:** When a new order is placed, agent checks current AR balance + pending orders vs credit limit. Approves within limit, escalates exceptions with customer payment history context.

**Collections outreach agent:** For overdue invoices, agent drafts personalized collection emails based on customer relationship, invoice age, payment history. Collector reviews and sends with one click.

**Delivery status agent:** When customers ask "where is my order?", agent queries D365 pick/pack/ship status and carrier tracking — answers in natural language via Teams or web chat.

## Trigger Phrases

- "How do I d365 order to cash"
- "Help me with d365 order to cash in D365"
- "Check d365 order to cash"
- "Analyze d365 order to cash"
- "Show me d365 order to cash status"

## Quick Example

> See `d365-order-to-cash-example.md` in this folder for a full worked scenario with business impact.

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
