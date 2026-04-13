---
name: "d365-order-to-cash"
slug: "d365-order-to-cash"
description: "Configure Order to Cash (O2C) in D365 — customer setup, sales orders, pricing, invoicing, cash application, collections, and AI agent automation patterns. Use when user says \"order to cash in D365\", \"sales order process D365\", \"configure collections D365\", \"customer credit limit D365\", \"invoice a sales order\", \"cash application D365\", \"O2C process\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "d365", "order-to-cash", "accounts-receivable"]
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
2. **Packing slip:** When items are packed and ready to ship: **Sales order → Generate → Packing slip** — posts the packing slip, reducing inventory
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

## OData Queries for O2C

### Open Sales Orders by Customer
```
GET /data/SalesOrderHeadersV2?$filter=SalesOrderStatus eq 'Backorder'&$select=SalesOrderNumber,CustomerAccountNumber,RequestedShipDate,TotalAmount&$orderby=RequestedShipDate
```

### Overdue AR Balances
```
GET /data/CustomerTransactions?$filter=DueDate lt 2026-04-10 and AmountRemaining gt 0&$select=CustomerAccount,InvoiceId,DueDate,AmountRemaining,CurrencyCode
```

### Shipped but Not Invoiced
```
GET /data/SalesOrderLineEntity?$filter=DeliveredQuantity gt InvoicedQuantity&$select=SalesOrderNumber,ItemNumber,DeliveredQuantity,InvoicedQuantity,SalesPrice
```

### Customer Credit Utilization
```
GET /data/CustCreditMaxEntity?$select=CustomerAccount,CreditMaximum,AmountUsed,CurrencyCode
```

## Core Tasks

### 1. Sales Order Anomaly Detection
```text
GIVEN a batch of new sales orders
WHEN skill analyzes
THEN flag orders with price below configured threshold
AND flag orders with unusual quantities (>3 std deviations from customer history)
AND flag orders shipping to new addresses not in customer profile
AND return anomaly list with severity and reason
```

### 2. Credit Check
```text
GIVEN a new sales order
WHEN skill checks credit
THEN query customer's current AR balance
AND add open sales order values not yet invoiced
AND compare total exposure to credit limit
AND return: approved, warning, or hold with exposure detail
```

### 3. Collections Prioritization
```text
GIVEN overdue AR balances
WHEN skill prioritizes
THEN sort by: days overdue × amount × customer risk score
AND include last payment date and payment history pattern
AND suggest: call, letter, hold, or escalate for each customer
AND return prioritized action list for collections team
```

## Agent Patterns for O2C

**Sales order anomaly agent:** Flags orders with unusual quantities, pricing below threshold, ship-to addresses not matching customer profile. Routes to sales manager before confirming.

**Credit check agent:** When a new order is placed, agent checks current AR balance plus pending orders vs credit limit. Approves within limit, escalates exceptions with customer payment history context.

**Collections outreach agent:** For overdue invoices, agent drafts personalized collection emails based on customer relationship, invoice age, payment history. Collector reviews and sends with one click.

**Delivery status agent:** When customers ask "where is my order?", agent queries D365 pick/pack/ship status and carrier tracking — answers in natural language via Teams or web chat.

## Trigger Phrases

- "order to cash in D365"
- "sales order process D365"
- "configure collections D365"
- "customer credit limit D365"
- "invoice a sales order"
- "cash application D365"
- "O2C process"
- "overdue AR in D365"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Sales order stuck on credit hold | Customer balance exceeds credit limit | Review customer credit limit in AR → Customers → [customer] → Credit and collections tab; approve manually or increase limit |
| Packing slip cannot be posted | Inventory pick list not yet completed, or warehouse not confirmed | Complete the pick process in Warehouse management; confirm all pick lines before posting packing slip |
| Invoice posting fails with "posting profile not found" | Customer group has no AR posting profile assigned | Navigate to AR → Setup → Customer posting profiles; ensure the customer's group has a valid summary account |
| Revenue posting to wrong account | Item sales tax group or customer posting profile misconfigured | Check the posting profile summary account and item sales tax group on the sales order line |
| Payment cannot settle against invoice | Invoice and payment are in different legal entities | Confirm intercompany posting is configured; both entities must share the same customer account setup |
| Collection letter not generating | Customer account excluded from interest/collection letters, or letter sequence not configured | Check AR → Setup → Collections → Collection letter sequence; verify customer is not flagged "Exclude from collection letters" |
| Batch invoicing misses some orders | Packing slip not posted or order not in "Delivered" status | Verify packing slip status on sales order lines before running batch invoice |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — OData queries, GIVEN/WHEN/THEN tasks, D365-specific error table |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
