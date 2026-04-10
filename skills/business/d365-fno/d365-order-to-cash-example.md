# D365 Order to Cash — Example

## Scenario: Sales Order Stuck After Packing Slip, Customer Invoice Not Generated

**Who:** Maria Contreras, Controller, mid-size electronics distributor
**Where:** D365 F&O Sales and Marketing module; end of month; a key customer is on the phone asking for their invoice
**The Problem:** Sales order SO-00412 for customer TechRetail Inc. was shipped and packing slip posted 4 days ago. The customer's payment terms are Net 30, so they need the invoice to start the clock. But the invoice has not been generated. The sales order status shows "Delivered" not "Invoiced." The customer's finance team is holding payment and escalating.

**Prerequisites:** D365 F&O access with AR/billing permissions; sales order SO-00412 visible in the system.

---

### What You Say to the Agent

> "Sales order SO-00412 for TechRetail Inc. shows 'Delivered' but no invoice has been generated after 4 days. Customer is asking for the invoice. Packing slip was posted. What's blocking the invoice and how do I fix it?"

### What the Agent Does

1. Identifies the 4 most common reasons a sales order stays in "Delivered" status after packing slip posting in D365 F&O:
   - Invoice posting blocked by a credit limit hold on the customer account (check: Accounts Receivable, Customers, TechRetail Inc., Credit and Collections tab — look for credit limit exceeded flag)
   - Sales order line has a partial delivery quantity dispute — if the quantity delivered doesn't match what was ordered and the order is set to "Backorder" remainder policy, D365 waits for the backorder before invoicing
   - Invoice journal batch job not running — if automatic invoice posting is configured via a batch job, check whether the batch job failed or is paused (System Administration, Batch Jobs, filter for "Post invoices")
   - Manual invoice required — the sales order's invoice account is different from the customer account and requires manual matching before posting

2. Provides the diagnostic navigation: go to Sales Order SO-00412, Action Pane, Invoice tab — if the "Invoice" button is greyed out, hover over it to see the blocking reason tooltip; if the button is available, the block is elsewhere

3. Walks through the fix for the most likely cause (credit limit hold): navigate to AR, Customers, TechRetail Inc., Action Pane, Sell tab, Credit Limit Override — enter the authorization reason, post the override, return to the sales order and post the invoice

4. If the invoice posts successfully, confirms the next steps: send the posted invoice to the customer via the Print Management setup, confirm the invoice date matches today (which starts their Net 30 clock correctly), and update the customer on the expected payment due date

5. Flags the systemic issue for month-end: if this customer has a recurring credit limit problem, Maria should review their credit limit against current outstanding balance and request a credit limit increase before the next order cycle

### The Business Impact

- **Invoice posted same day** customer called, Net 30 clock starts correctly
- **Customer payment received** on time rather than delayed by an additional 4 days waiting for the invoice date to be set
- **$47,200 receivable** moves from overdue-pending to invoiced-on-time on the AR aging report
- **Systemic fix initiated** — credit limit reviewed and increased before the next order, preventing the same blockage next month

### Try It Yourself

> "I have 8 sales orders showing 'Delivered' status at month end and none of them have been invoiced. They're all for different customers. What's the fastest way to diagnose why each one is stuck and get them all invoiced before the period closes?"
