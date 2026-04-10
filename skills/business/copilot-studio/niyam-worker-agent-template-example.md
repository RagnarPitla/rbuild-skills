# Niyam Worker Agent Template — Example

## Scenario: Converting a Standard Child Agent into a Niyam Worker

**Who:** Daniel Ferreira, Copilot Studio Developer at a 2,500-person food and beverage company
**Where:** Copilot Studio, D365 F&O multi-agent system
**The Problem:** Daniel built a standard child agent for inventory management that the parent orchestrator calls when users ask about stock levels. The child agent works but it cannot be reused. Every time a different parent agent needs inventory capability, Daniel builds a new child from scratch. He now has 3 inventory-related child agents with duplicate logic, inconsistent outputs, and 3 different maintenance burdens. He needs to convert the inventory agent into a proper Worker that any parent can call with a structured task contract and get a predictable response back.

**Prerequisites:** Copilot Studio environment, VS Code extension, Dataverse, D365 F&O MCP server configured

---

### What You Say to the Agent

> "Convert my existing inventory child agent into a Niyam Worker agent. It should accept a structured task contract from any parent and return a consistent output. Right now I have 3 copies of the same logic."

### What the Agent Does

1. Reviews the existing child agent and identifies the 4 capabilities it handles: stock level lookup, reorder point check, warehouse location query, and low-stock alert. These become the 4 TaskType values the Worker contract supports
2. Defines the input contract: a JSON-structured task message with TaskType, EntityId (item number or warehouse), RequestingAgent, and ContextNotes. The Worker reads this contract from the parent's input variable instead of asking the user questions directly
3. Rewrites the agent system instructions to the Niyam Worker format: the agent is told it only acts on structured task contracts, never engages in freeform conversation, and always returns a structured WorkerResult with Status, Data, and ConfidenceScore
4. Updates the Dataverse inventory policy table to include a WorkerCapabilities row so the parent agent can query what this Worker can handle before invoking it, enabling capability-based routing instead of hardcoded child agent lists

### The Business Impact

- **3 duplicate child agents replaced by 1 reusable Worker** — inventory logic now lives in one place
- **Any new parent agent can invoke inventory capability in under 10 minutes** by sending the standard task contract
- **Output consistency improved from 60% to 100%** — all callers now receive the same structured WorkerResult format regardless of which parent invoked it

### Try It Yourself

> "I have a procurement child agent and a finance child agent that both need to look up vendor credit limits. How do I turn that into a shared Worker?"
