# Topic Design Patterns — Example

## Scenario: Unmaintainable Topic with 6 Nested Condition Branches

**Who:** Amara Osei, Copilot Studio Developer at a 1,800-person healthcare supply company
**Where:** Copilot Studio, Teams-deployed agent for order management
**The Problem:** Amara built a single order status topic that started simple but grew into 6 nested condition branches covering order type, payment method, fulfillment region, customer tier, and backorder status. The topic is now 140 nodes deep. When business requirements change, Amara cannot safely edit it because changing one branch breaks another. Two junior developers have refused to touch it. A new requirement to add emergency order handling would make it even worse. The topic takes 45 seconds to load in the editor.

**Prerequisites:** Copilot Studio environment, VS Code extension

---

### What You Say to the Agent

> "I have an order status topic with 6 nested condition branches, 140 nodes, and it's impossible to maintain. I need to redesign it using proper patterns without breaking users."

### What the Agent Does

1. Analyses the 6 branches and identifies that 4 of them (payment method, fulfillment region, customer tier, and backorder) are not routing decisions but data enrichment steps. Only 2 branches (order type and emergency flag) are genuine conversation forks that warrant separate paths
2. Recommends the Slot-Fill and Delegate pattern: the main topic collects the order number, calls a Power Automate action to fetch all enrichment data in one request, and stores results in variables. The single nested condition tree collapses from 6 levels to 2
3. Splits the emergency order path into a separate topic with its own trigger phrases, reducing the main topic from 140 nodes to 38. The emergency topic can now be owned and updated independently without touching the main flow
4. Adds a topic comment node at the top of each remaining branch with the business rule it implements, so the next developer can understand intent without reading 40 nodes of conditions

### The Business Impact

- **Topic reduced from 140 nodes to 38** without changing any user-facing behavior
- **Emergency order requirement added in 20 minutes** as a standalone topic, instead of being impossible to add safely
- **Load time in editor dropped from 45 seconds to under 5 seconds** — both junior developers can now work on it independently
- **Zero regression in tested conversation flows** — slot-fill refactor preserved all existing routing behavior

### Try It Yourself

> "I have 3 topics that all start by asking for an order number. How do I share that slot-fill logic so I'm not duplicating it?"
