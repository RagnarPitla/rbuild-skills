# MCP D365 Connector — Example

## Scenario: Querying D365 Vendor Invoice Status from a Copilot Studio Agent

**Who:** Elena Marchetti, Integration Developer, Microsoft partner
**Where:** Building the backend MCP layer for a Copilot Studio accounts payable agent; the agent needs real-time vendor invoice status from D365 F&O
**The Problem:** The Copilot Studio AP agent is live and answering general AP questions, but when vendors ask "what is the status of invoice INV-2024-08847?" the agent can't answer — it has no connection to D365. Elena needs to build the MCP connector that exposes D365 OData invoice endpoints as callable tools, without exposing the full D365 API surface or service account credentials to the agent.

**Prerequisites:** Copilot Studio agent deployed; D365 F&O OData endpoint live; Azure AD app registration with VendorInvoiceHeaderEntity read access.

---

### What You Say to the Agent

> "I need to build an MCP connector so my Copilot Studio AP agent can query D365 vendor invoice status in real time. The agent needs to look up invoices by invoice number and by vendor account. The D365 OData endpoint is available. Help me design and build the connector with the right security model."

### What the Agent Does

1. Defines the three tools the connector needs to expose:
   - `get_invoice_by_number` — inputs: `invoiceId` (string), returns: invoice number, vendor name, invoice date, amount, currency, approval status, payment status, due date
   - `get_invoices_by_vendor` — inputs: `vendorAccountNumber` (string), `statusFilter` (enum: "Open" | "Approved" | "Paid" | "OnHold"), returns: list of matching invoices with key fields
   - `get_invoice_line_items` — inputs: `invoiceId`, returns: line-level detail including item, quantity, unit price, procurement category

2. Maps each tool to the correct D365 OData entity: `VendorInvoiceHeaderV2` for header data, `VendorInvoiceLinesV2` for line detail, with the exact `$filter` and `$select` OData query syntax for each

3. Implements the security model: the MCP server holds the D365 service account credentials, the Copilot Studio agent calls the MCP tool via HTTPS, and the MCP server's `.env` keeps credentials server-side — the agent never sees the D365 token or service account password

4. Adds a response normalization layer that translates D365's internal status codes (e.g., `ApprovalStatus: 3`) into human-readable strings ("Pending CFO Approval") so the Copilot Studio agent can surface meaningful answers without business logic in the agent itself

5. Writes the Copilot Studio connector configuration — the HTTP action definition pointing to the MCP server endpoint, with the tool input/output schema the agent needs to wire the action correctly

### The Business Impact

- **Agent answers "what's the status of INV-2024-08847?" in under 3 seconds** instead of the vendor waiting on hold while someone opens D365
- **Credentials never exposed to the agent layer** — the MCP server is the only component that touches D365 authentication
- **3 tools cover 80% of vendor invoice queries** identified in the requirements discovery
- **Copilot Studio agent adoption jumps** when vendors get real answers instead of "I'll look into that and get back to you"

### Try It Yourself

> "My Copilot Studio agent handles customer service for an order management team. I want it to be able to look up sales order status and shipment tracking from D365. What tools should my MCP connector expose, and what D365 OData entities should I target?"
