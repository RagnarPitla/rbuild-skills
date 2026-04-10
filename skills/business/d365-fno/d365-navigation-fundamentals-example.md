# D365 Navigation Fundamentals — Example

## Scenario: Finding Vendor Invoice Approval on Day One

**Who:** Sophie Andersen, AP Coordinator, recently joined a manufacturing company that runs D365 F&O
**Where:** First week on the job; the controller has asked her to approve a vendor invoice before end of day; she has never used D365 before
**The Problem:** Sophie logged into D365 and is looking at the home screen with no idea where to go. Her previous company used SAP. She knows what she needs to do (find and approve a pending vendor invoice) but the D365 navigation is unfamiliar. The invoice is from vendor Contoso Ltd, approximately $8,400, and it was apparently sent to her queue for approval.

**Prerequisites:** D365 F&O login with AP Coordinator role; the invoice is already in the system and routed to her for approval.

---

### What You Say to the Agent

> "I'm new to D365 and I need to find and approve a vendor invoice. It's from Contoso Ltd, around $8,400, and I think it's in my queue waiting for approval. Where do I go?"

### What the Agent Does

1. Gives Sophie the fastest path first, not the complete navigation overview: "Check your workflow notifications first. Look at the top right of the screen — there should be a bell icon or a message center notification saying you have a pending approval. Click that and it takes you directly to the invoice."

2. Provides the manual navigation path as the backup: Accounts Payable, then Invoices, then Pending Vendor Invoices — this shows all invoices waiting for action in the company, where she can filter by vendor name "Contoso" to find her specific invoice

3. Explains the 3 things Sophie needs to check before approving: the invoice matches a purchase order (3-way match status shown on the invoice header — she should see a green indicator or "Matched" status), the amount matches what Contoso submitted, and the invoice is posted to the correct legal entity (visible in the top company selector bar)

4. Walks through the approval action step by step: once on the invoice, she'll see a "Workflow" button in the action pane at the top; clicking it shows "Approve," "Reject," or "Delegate"; she selects Approve, adds a comment if required, and submits — D365 then routes the invoice to the next approval step or posts it if she's the final approver

5. Explains the notification she'll see confirming the action worked: a green toast message at the top of the screen saying "Your response was submitted." The invoice disappears from her pending queue.

### The Business Impact

- **Invoice approved within 10 minutes** of asking the question, before end-of-day deadline met
- **New user confident** in the system after one successful task — avoids the frustration of not finding the right screen and asking colleagues to do it for them
- **Controller doesn't have to chase** Sophie for the approval status
- **First D365 task completed correctly** with the right checks done (3-way match confirmed) rather than approved blindly

### Try It Yourself

> "I'm new to D365 F&O. My manager asked me to check why a sales order for customer Northwind Traders hasn't been shipped yet. The order number is SO-00847. Where do I find it and what should I look for to understand the hold-up?"
