# Agent Requirements Planner — Example

## Scenario: Scoping a Quality Management Agent for a Pharma Company

**Who:** Priya Nair, Senior Copilot Studio Consultant, Microsoft partner firm
**Where:** Pre-sprint discovery for a new Copilot Studio agent; pharma client runs quality management in D365 F&O with heavy paper-based deviation tracking
**The Problem:** The pharma client wants an AI agent to help quality managers handle deviations, CAPAs (Corrective and Preventive Actions), and batch release decisions. Priya has two weeks before the development sprint starts and needs structured requirements — not just a wish list. The client has 6 stakeholders, each with a different view of what the agent should do, and no one has documented the current process in years.

**Prerequisites:** Access to the client's quality team for a 2-hour discovery session; D365 F&O is live with quality management module.

---

### What You Say to the Agent

> "I'm scoping a Copilot Studio agent for a pharma client's quality management process. They handle deviations, CAPAs, and batch release decisions in D365 F&O. 6 stakeholders with conflicting priorities, no process documentation, sprint starts in 2 weeks. Help me run a structured requirements discovery and produce a requirements brief I can hand to the development team."

### What the Agent Does

1. Opens the structured discovery with 5 clarifying questions before writing anything:
   - What triggers the process today? (Who initiates a deviation record, and from where?)
   - What decisions require human judgment versus rule-based lookup?
   - What systems does the agent need to read from or write to?
   - What are the regulatory constraints? (FDA 21 CFR Part 11, GMP audit trail requirements)
   - What does "done" look like for the agent — recommendation only, or does it take action?

2. Based on the discovery answers, maps the agent scope into three tiers: In Scope (deviation intake and classification, CAPA status lookup, batch release checklist verification against D365 quality orders), Out of Scope for v1 (automated CAPA closure, integration with LIMS systems), Parking Lot (regulatory submission drafting — validate feasibility in Sprint 3)

3. Produces the requirements brief with 8 user stories in the format the development team can work from directly, including acceptance criteria, D365 data entities involved, and policy rules for the Dataverse policy table

4. Flags the top 3 risks: audit trail requirements mean every agent action must be logged to a Dataverse table with timestamp, user, and action taken; 21 CFR Part 11 requires electronic signature for batch release — agent can recommend, human must approve with credentials; stakeholder alignment on deviation severity classification needs a decision before sprint day 1

### The Business Impact

- **2-week discovery compressed to 2 days** using structured agent-guided questions instead of scattered stakeholder interviews
- **8 sprint-ready user stories** with acceptance criteria, replacing the typical half-baked requirements document
- **3 risks surfaced before sprint starts** preventing mid-sprint blockers that would have cost 2 weeks of rework
- **Regulatory compliance built in** from requirements stage, not bolted on after the client's QA team reviews the build

### Try It Yourself

> "I need to scope a Copilot Studio agent for a manufacturing client's safety incident reporting process. They're currently using paper forms and emailing the safety manager. What questions should I ask in discovery, and what does a good requirements brief look like for this kind of agent?"
