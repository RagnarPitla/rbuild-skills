# CS Multi-Agent Orchestration — Example

## Scenario: Parent Agent Routing Procurement Queries to the Wrong Child

**Who:** James Okafor, Copilot Studio Developer at a 3,000-person manufacturing company
**Where:** Copilot Studio, D365 F&O multi-agent system with 5 child agents (Procurement, Accounts Payable, Inventory, Finance, HR)
**The Problem:** The parent orchestrator keeps routing purchase order approval queries to the Accounts Payable child agent instead of the Procurement child agent. Users ask "approve this PO for vendor Contoso" and land in AP, where the agent has no PO approval capability. The Procurement child handles PO approvals but it almost never gets invoked. James has checked the topic triggers on both child agents and cannot figure out why the routing is broken.

**Prerequisites:** Copilot Studio environment, VS Code extension

---

### What You Say to the Agent

> "My parent agent keeps routing PO approval queries to the Accounts Payable child instead of the Procurement child. How do I fix the routing?"

### What the Agent Does

1. Pulls the agent descriptions for both child agents and immediately spots the issue: the Accounts Payable child description includes the phrase "purchase orders and vendor payments", which is semantically close to "PO approval", causing the LLM-based router to prefer it
2. Rewrites the Procurement child description to explicitly own PO lifecycle events: creation, approval, amendment, and cancellation, using language that mirrors how procurement users actually phrase requests
3. Rewrites the AP child description to scope it narrowly to invoice processing, payment runs, and vendor remittances, removing any purchase order language
4. Recommends adding 3 canonical example phrases to each child agent description so the parent router has ground truth for borderline queries, reducing ambiguous routing from 8 identified phrases to 1

### The Business Impact

- **Routing accuracy improved from 62% to 97%** for PO-related queries after description rewrites
- **4 hours of debugging resolved in 15 minutes** — the fix was in agent descriptions, not topic triggers
- **Zero code changes required** — description-based routing fixed entirely through agent instruction updates

### Try It Yourself

> "I have a parent agent with a Finance child and a Procurement child. How do I write their descriptions so the parent always routes correctly?"
