# Multi-Agent Orchestration — Example

## Scenario: Parent Agent Keeps Routing PO Approvals to the Wrong Child

**Who:** Tomasz Wierzbicki, Senior Copilot Studio Architect at a 6,000-person European manufacturing enterprise
**Where:** Copilot Studio, enterprise multi-agent system with 7 child agents covering Finance, Procurement, AP, Inventory, HR, Logistics, and Compliance
**The Problem:** The parent orchestrator routes "approve this PO" to the AP child agent instead of the Procurement child. AP has no approval capability, so users hit a dead end. Tomasz has checked the trigger phrases on both children and they look correct. The issue has been escalating for 2 weeks and is blocking UAT sign-off. Without routing working correctly, the enterprise go-live is at risk.

**Prerequisites:** Copilot Studio environment, VS Code extension

---

### What You Say to the Agent

> "My parent agent routes 'approve this PO' to the AP child instead of the Procurement child. Triggers look fine on both sides. What am I missing?"

### What the Agent Does

1. Asks to see the agent descriptions (not the topics) for both child agents, and finds the AP child description reads: "Handles vendor invoices, purchase orders, and payment processing." The phrase "purchase orders" in the AP description is causing the routing model to prefer it for PO-related queries
2. Explains that description-based routing in Copilot Studio uses the entire agent description as the routing signal, not just topic triggers. Topic triggers within a child agent are irrelevant to how the parent chooses which child to invoke
3. Rewrites the AP description to: "Handles vendor invoice processing, payment runs, and remittance advice. Scope: invoices only, not purchase orders." Rewrites the Procurement description to explicitly claim PO creation, approval, amendment, and cancellation
4. Identifies 4 additional borderline phrases ("cancel this order", "change PO quantity", "vendor setup", "goods receipt") that would likely misroute with the current descriptions, and resolves all 4 in the rewrite

### The Business Impact

- **UAT blocker resolved in 40 minutes** after 2 weeks of stalled debugging on trigger phrases
- **Routing accuracy from 58% to 99%** for PO-related queries across 6 tested variants
- **4 additional routing risks prevented** before they surfaced in production testing

### Try It Yourself

> "How do I write child agent descriptions for a 5-agent D365 finance system so the parent never misroutes between AP, Procurement, and Finance?"
