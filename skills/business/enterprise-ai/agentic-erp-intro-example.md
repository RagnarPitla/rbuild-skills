# Agentic ERP Intro — Example

## Scenario: Explaining Agentic ERP to a CFO

**Who:** Marcus Webb, IT Director, Precision Parts Manufacturing, 850 employees, mid-market D365 F&O customer
**Where:** Preparing for a 30-minute executive briefing; the CFO asked the direct question: "What is agentic ERP and do we actually need it?"
**The Problem:** Marcus understands the technology but struggles to explain it in business terms without it sounding like vendor hype. The CFO has been burned by two failed AI pilots and is skeptical. Marcus needs a concrete example from their actual D365 F&O environment that shows the difference between what they have today and what agentic ERP would look like.

**Prerequisites:** D365 F&O is live; the company runs Source to Pay and Plan to Produce processes in D365.

---

### What You Say to the Agent

> "Help me explain agentic ERP to our CFO in plain business terms. She's skeptical of AI hype after two failed pilots. We run D365 F&O for manufacturing — Source to Pay and Plan to Produce are our core processes. I need a concrete example from our world, not a generic tech explanation."

### What the Agent Does

1. Reframes the definition around business behavior, not technology: "Agentic ERP means your ERP system has AI agents that participate in business processes the way a knowledgeable employee would — they notice things, make decisions within defined limits, and take action — rather than waiting to be told what to do."

2. Pulls a concrete D365 F&O example the CFO can recognize: today, when a production order is firmed and the materials aren't available in the warehouse, D365 creates a planned purchase order and stops. Someone has to notice the shortage report, review lead times, check vendor availability, calculate the impact on the production schedule, and decide whether to expedite. That typically takes 4-8 hours and often happens after the production window has already been missed.

3. Shows what the same scenario looks like with an agentic ERP layer: the agent monitors material availability against firmed production orders, detects the gap 72 hours before it becomes critical, checks vendor lead times via the MCP connection to D365, identifies that Vendor A can expedite at a 12% premium while Vendor B has a 5-day lead time, surfaces a recommended action to the planner with the cost/schedule trade-off already calculated, and waits for approval before creating the purchase order.

4. Packages the answer for the CFO in one sentence: "Agentic ERP doesn't replace D365. It adds a reasoning layer that closes the gap between what D365 knows and what your people currently have to figure out manually."

5. Addresses the two failed pilots directly: "The pilots failed because they tried to automate without a policy layer — agents had no guardrails. Agentic ERP with proper policy tables in Dataverse means every agent action is governed, auditable, and within defined thresholds."

### The Business Impact

- **CFO briefing lands** with a concrete example from their own processes, not a whiteboard concept
- **Skepticism addressed directly** by connecting failed pilots to missing governance, not bad technology
- **Decision accelerated** from "we'll look into it" to "pilot it on the materials shortage process" in one meeting
- **IT Director credibility built** by speaking in business outcomes, not technical architecture

### Try It Yourself

> "Our CEO just asked me what the difference is between AI in ERP and agentic ERP. We use SAP and have Copilot Studio licenses. Give me a two-paragraph answer I can send via email tonight."
