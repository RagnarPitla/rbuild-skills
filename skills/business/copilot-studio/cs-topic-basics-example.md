# CS Topic Basics — Example

## Scenario: Invoice Lookup Topic with D365 Validation and Status Routing

**Who:** Lena Hoffmann, Copilot Studio Developer at a 2,000-person logistics company
**Where:** Copilot Studio, D365 F&O via MCP
**The Problem:** Lena needs to build a topic that captures an invoice number from the user, validates it exists in D365, and then routes to different conversation flows depending on the invoice status: paid, pending approval, or overdue. She has built basic topics before but has never done dynamic routing based on an external system lookup. She is unsure how to store the D365 result in a variable and then branch on it cleanly.

**Prerequisites:** Copilot Studio environment, VS Code extension, D365 F&O MCP server configured

---

### What You Say to the Agent

> "Build a topic that asks for an invoice number, checks if it exists in D365, and then routes the user to different responses based on whether the invoice is paid, pending approval, or overdue."

### What the Agent Does

1. Creates the topic with a question node using the Invoice entity type, so the agent validates number format before making the D365 call, catching typos like "INV 1234" vs "INV-1234" before they hit the API
2. Inserts a D365 MCP action node that queries the invoice by number and maps 4 return fields into topic variables: InvoiceStatus, DueDate, VendorName, and ApprovalStage
3. Adds a condition node with 3 branches keyed on InvoiceStatus ("Paid", "PendingApproval", "Overdue"), each routing to a distinct message node with context-aware responses. The "Overdue" branch includes DueDate in the message so the user gets actionable information immediately
4. Adds a 4th branch for "not found" to handle the case where the invoice number does not exist in D365, returning a helpful message rather than a blank response

### The Business Impact

- **Topic built and tested in 35 minutes** — including D365 integration and 4-way branching
- **Zero manual lookups** — AP staff get invoice status, due date, vendor, and approval stage in one message
- **Fallback branch caught 14% of queries in the first week** — invoice numbers entered without the "INV-" prefix, which would have silently failed without the not-found branch

### Try It Yourself

> "How do I build a topic that asks for a vendor name, looks up their open POs in D365, and shows the results as a list?"
