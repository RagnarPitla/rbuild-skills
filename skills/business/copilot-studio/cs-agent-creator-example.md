# CS Agent Creator — Example

## Scenario: Rapid Supplier Invoice Query Agent for a Manufacturing Customer

**Who:** Priya Nambiar, Copilot Studio Developer at a 3,000-person manufacturing company
**Where:** Copilot Studio, connected to D365 F&O via MCP
**The Problem:** A customer needs an agent that lets their AP team ask questions about supplier invoices, such as payment status, overdue amounts, and pending approvals. Priya has the Copilot Studio environment ready but is unsure how to structure the agent, which topics to build first, and how to connect it to D365 without writing custom connectors. Going live is 2 weeks away.

**Prerequisites:** Copilot Studio environment, VS Code extension, D365 F&O MCP server configured

---

### What You Say to the Agent

> "Build me a Copilot Studio agent for supplier invoice queries. The AP team needs to ask about payment status, overdue invoices, and approval backlogs. It connects to D365 F&O."

### What the Agent Does

1. Diagnoses the problem scope: identifies 3 intent clusters (payment status lookup, overdue report, approval queue), and recommends a single-agent design with 4 topics rather than a multi-agent setup at this scale
2. Creates the agent scaffold: system prompt positioning the agent as an AP assistant with D365 context, tone set to professional and concise
3. Builds the invoice status topic with trigger phrases covering 12 natural language variants, a question node to capture invoice number or vendor name, and a D365 MCP action call to pull payment status, due date, and approval stage in one round trip
4. Flags that the overdue report intent should use a generative answer node backed by a Power Automate flow rather than a topic, because the result set is dynamic and varies by user

### The Business Impact

- **2 weeks cut to 3 days** — agent scaffold, 4 topics, and D365 MCP wiring all created from a single prompt
- **Zero custom connectors needed** — D365 MCP handles all ERP reads, keeping the solution supportable
- **AP team deflection rate of 70%** — routine invoice queries no longer reach the finance team by email

### Try It Yourself

> "My customer needs an agent for their procurement team to check PO approval status in D365. What topics do I need and how do I connect it?"
