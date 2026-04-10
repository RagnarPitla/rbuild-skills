# Niyam Agent Template — Example

## Scenario: Procurement Compliance Agent Using the Niyam Pattern

**Who:** Riya Desai, AI Solutions Architect at a 5,000-person pharmaceutical company
**Where:** Copilot Studio, Dataverse, D365 F&O via MCP, Power Automate
**The Problem:** The procurement team needs an agent that enforces three-way match rules before releasing payment on vendor invoices. The rules change quarterly and are currently maintained in a Word document that nobody reads. Finance is approving invoices that violate the rules because there is no enforcement layer. Riya needs an agent that reads current compliance rules at runtime, checks the invoice against them, and blocks or flags non-compliant payments. Hardcoding rules into the agent is not acceptable because policy changes would require redeployment.

**Prerequisites:** Copilot Studio environment, VS Code extension, Dataverse environment, D365 F&O MCP server configured, Power Automate premium license

---

### What You Say to the Agent

> "Build a Niyam pattern procurement compliance agent. It needs to enforce three-way match rules stored in Dataverse, check invoices in D365 via MCP, and trigger a Power Automate hold flow if the invoice fails compliance."

### What the Agent Does

1. Creates the Dataverse policy table (cr023_pc_policy) with 6 columns: PolicyCode, PolicyName, Threshold, EnforcementLevel (Advisory/Hard Stop), EffectiveDate, and LastModifiedBy. Seeds it with the 3 three-way match rules Riya provides
2. Builds the agent system instructions using the Niyam prompt structure: the agent's identity is a Procurement Compliance Officer, and it is instructed to always fetch current policies from Dataverse before evaluating any invoice, never relying on training data for business rules
3. Wires up the D365 MCP read action to pull invoice header, line amounts, PO reference, and goods receipt status in one call, mapping results into named variables the compliance evaluation step can reference
4. Creates the Power Automate enforcement flow that receives the invoice number and a FailureReason output from the agent, sets the invoice to Hold status in D365, and emails the approver with the specific policy code that was violated
5. Adds an audit log write back to Dataverse so every compliance check (pass or fail) is recorded with a timestamp, policy version, and agent decision for quarterly reporting

### The Business Impact

- **100% of invoices checked against current policy** before payment release, replacing the unread Word document
- **Policy updates take 5 minutes** — finance team edits the Dataverse table directly, no redeployment needed
- **3 non-compliant invoices caught in the first week**, totaling $47,000 in payments that would have violated procurement policy

### Try It Yourself

> "Build a Niyam agent for accounts payable that enforces vendor payment terms from Dataverse and blocks early payments unless a finance manager overrides."
