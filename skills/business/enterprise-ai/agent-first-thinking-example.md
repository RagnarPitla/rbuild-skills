# Agent-First Thinking — Example

## Scenario: Should We Build an Agent or a Power Automate Flow?

**Who:** Danielle Roberts, Digital Transformation Lead, global retailer
**Where:** Architecture review meeting for a new "supplier exception handler"
**The Problem:** The vendor management team wants automation for handling supplier delivery exceptions — late shipments, short deliveries, damaged goods. An IT architect proposed a Power Automate flow. A consultant proposed an AI agent. The meeting has been going in circles for an hour.

**Prerequisites:** None — this is a strategic thinking skill, not a technical implementation guide.

---

### What You Say to the Agent

> "Help me decide: should we build a Power Automate flow or an AI agent for our supplier exception handling process? Here's how it works today: when a supplier misses a delivery, someone manually reviews the exception, decides whether to re-order, expedite, or escalate, drafts a supplier communication, and updates the ERP. Different exceptions need different responses."

### What the Agent Does

Applies the decision framework:

**1. Does it require judgment or decision-making?**
YES — "decide whether to re-order, expedite, or escalate" requires reading context (supplier history, inventory impact, customer commitments) and making a judgment call. This isn't a rule lookup.

**2. Is the sequence of steps unpredictable?**
YES — a late delivery might need one check, a damaged goods claim needs a completely different path. The next step depends on what the previous step discovered.

**3. Does it need to interact in natural language?**
YES — "drafts a supplier communication" requires understanding the context and producing appropriate text. Not a template fill.

**Verdict: AI Agent**

But with a note: the notification workflow (send email when decision is made, update ERP status) should be Power Automate flows *triggered by* the agent. Not everything needs to be in the agent — only the reasoning and decision-making.

### The Business Impact

- **Meeting resolved in 15 minutes** — clear framework ended the circular debate
- **Hybrid architecture approved:** Agent handles the exception analysis and recommendation; Power Automate flows handle the execution (ERP updates, supplier emails, internal notifications)
- **First agent scoped correctly:** Started with one exception type (short deliveries under 10%), proved value, expanded

### Try It Yourself

> "We're debating whether to build an agent for our monthly financial reconciliation process. The process has 12 steps, most of which check one system against another and flag discrepancies. Should this be an agent?"
