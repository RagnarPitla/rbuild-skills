# MCP Fundamentals — Example

## Scenario: Explaining MCP to a CFO in 5 Minutes

**Who:** Marcus Williams, Enterprise Architect, manufacturing company preparing for AI agent deployment
**Where:** Executive briefing — explaining why the IT team needs 6 weeks to build an MCP server before deploying the AI agents
**The Problem:** The CFO wants AI agents running in D365 in 2 weeks. Marcus needs to explain why "just connect the AI to D365" is more complex than it sounds — without losing the CFO in technical details — and get buy-in for the proper approach.

**Prerequisites:** None — this skill is for understanding concepts, not building.

---

### What You Say to the Agent

> "Help me explain what MCP is to a CFO who wants to know why we can't just connect our AI agent directly to D365 right now. Keep it under 5 minutes of speaking time."

### What the Agent Does

Produces a plain-language explanation using an analogy:

**The Electricity Grid Analogy:**
"Before electrical outlets were standardized, every device needed its own power source. Your lamp couldn't plug into your neighbor's generator. The invention of standardized electrical outlets meant any device could connect to any power source.

MCP is the standardized electrical outlet for AI agents. Before MCP, connecting an AI to D365 meant months of custom integration code — and that integration only worked for that specific AI with that specific system.

With MCP, we build one adapter for D365 — the MCP server — and any AI agent can plug into it. Build once, use with Claude, ChatGPT, GitHub Copilot, any future AI tool.

The 6 weeks isn't for connecting the AI to D365. That part takes 5 minutes once the MCP server exists. The 6 weeks is building the adapter correctly — with security controls, audit logging, and rate limiting — so we're not creating a backdoor into our ERP."

### The Business Impact

- **CFO approved the 6-week timeline** — with the understanding that the MCP server is reusable infrastructure, not just for this project
- **Framing shifted from "cost" to "investment"** — one MCP server supports all future agent deployments
- **IT team protected** — the CFO stopped pressuring for shortcuts that would have created security vulnerabilities

### Try It Yourself

> "Now help me explain why we're building our D365 MCP server in Azure Container Apps instead of running it locally — specifically addressing the CFO's concern about monthly hosting costs."
