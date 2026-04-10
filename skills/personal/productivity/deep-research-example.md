# Deep Research — Example

## Scenario: Competitive Landscape for Enterprise AI Agent Platforms

**Who:** Ragnar Pitla, preparing for a customer briefing with a Fortune 500 retail enterprise exploring agentic AI platforms
**Where:** Pre-briefing research, outputs used in a comparison slide and a recommendation memo
**The Problem:** Ragnar has a customer briefing in four days with a retail enterprise that is evaluating three platforms: Microsoft Copilot Studio, Google Vertex AI Agents, and Salesforce Agentforce. He needs to walk in with a sharp point of view on where each platform is strong, where each is weak, and what the right choice looks like for a mid-market retailer already on Salesforce CRM. Generic research will get him generic answers. He needs depth on actual capabilities, pricing signals, integration stories, and recent product announcements.

**Prerequisites:** Web access via Firecrawl or Exa MCP. A clear research brief with the three questions you need answered.

---

### What You Say to the Agent

> "Deep research: competitive landscape for enterprise AI agent platforms — Copilot Studio, Vertex AI Agents, Salesforce Agentforce. Customer context: mid-market retailer, 800 employees, already on Salesforce CRM and Sales Cloud. Questions: (1) What can each platform actually do today (not roadmap)? (2) Where does each break down for a retail use case? (3) If they are already on Salesforce, what is the honest case for or against staying in that ecosystem? I need this in a structured briefing doc format."

### What the Agent Does

1. **Searches across sources** — product documentation, recent conference announcements (Build 2025, Google Cloud Next, Dreamforce), analyst notes, and practitioner LinkedIn posts and forums
2. **Builds a capability matrix** — each platform rated across: tool calling, multi-agent orchestration, human-in-the-loop, enterprise auth (SSO/RBAC), pricing model, and D365/Salesforce/SAP integration depth
3. **Produces a briefing document:**

```
PLATFORM BRIEFING: Enterprise AI Agent Platforms
Prepared for: [Retail Customer] briefing | April 2026

EXECUTIVE SUMMARY
For a Salesforce-native retailer, Agentforce is the lowest-friction path
to production. However, Copilot Studio leads on multi-agent orchestration
depth and the Niyam pattern gives it a structural advantage for
policy-governed workflows. Vertex AI Agents is the strongest on raw
model choice but weakest on enterprise workflow integration today.

COPILOT STUDIO
Strengths: Multi-agent orchestration, Dataverse-backed policies,
           D365 native connectors, Power Automate integration
Gaps: No native Salesforce connector (custom MCP server required),
      pricing can escalate fast at high message volumes
Recent: May 2025 — Agent builder GA, description-based routing improved

SALESFORCE AGENTFORCE
Strengths: Native CRM context, zero-friction for Salesforce shops,
           flows and Apex as action layer
Gaps: Limited to Salesforce data by design, weak on ERP integration,
      multi-agent patterns are early
Recent: Spring '26 — Einstein Copilot merged into Agentforce brand
...
```

4. **Adds a "Ragnar's take" section** — an opinionated recommendation grounded in the customer's actual stack, not a hedge

### The Business Impact

- **Briefing prep time cut from two days to three hours** — research, synthesis, and formatting in one session
- **Point of view walks in the room** — not "here are the options," but "here is what I recommend and why"
- **Sources cited** — customer's procurement team can verify claims without trusting a slide deck

### Try It Yourself

> "Take the Agentforce section and go deeper. I need to understand their pricing model for a 200-agent-user deployment, whether Flow actions count against API limits, and what the upgrade path looks like from a Salesforce Classic implementation."
