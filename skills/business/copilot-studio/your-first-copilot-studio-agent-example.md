# Your First Copilot Studio Agent — Example

## Scenario: From "We Should Have an AI Agent" to Live in 30 Minutes

**Who:** Priya Sharma, Operations Manager, mid-size logistics company (400 employees)
**Where:** Power Platform environment, copilotstudio.microsoft.com
**The Problem:** Priya's team fields the same 12 questions every single day — "Where is my shipment?", "What's the cutoff for same-day delivery?", "How do I request a pickup?". Two admins spend half their day answering these. Her IT team quoted 6 weeks and $40,000 for a custom chatbot. Her manager said "just try Copilot Studio."

**Prerequisites:** Power Platform environment (free Developer tier works). No coding experience required.

---

### What You Say to the Agent (building session)

> "Help me build my first Copilot Studio agent for our logistics company. It should handle basic customer service questions about shipments, delivery cutoffs, and pickup requests. I want it live today."

### What the Agent Does

1. Opens the agent creation flow and names it "Logistics Assistant"
2. Writes system instructions scoped to logistics: role, what it handles, what it escalates, and tone
3. Creates a **Greeting topic** with a friendly welcome and a quick list of what the agent can help with
4. Creates a **Shipment Status topic** with a Question node (asks for tracking number), a connector action (queries the shipment API), and a message node that returns formatted status
5. Creates a **Fallback topic** that gracefully redirects to human support with a specific email and phone number
6. Tests all three topics in the test canvas and confirms behavior
7. Publishes to the demo website URL for immediate sharing

### The Business Impact

- **Agent live in 47 minutes** — from blank canvas to published, shareable URL
- **First week:** 156 conversations handled, 89% resolved without human intervention
- **Admin time reclaimed:** 6 hours/week freed from repetitive Q&A — admins shifted to exception handling and proactive customer outreach
- **Zero IT spend** — built entirely within the Power Platform environment Priya's company already licensed

### Try It Yourself

> "I've published my agent. Now add a knowledge source — point it at our public FAQ page at [URL] — so it can answer questions about our policies and services without me creating individual topics for each question."
