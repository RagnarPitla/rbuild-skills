# CS First Agent — Example

## Scenario: First-Time Builder Creates an IT Helpdesk Agent

**Who:** Marcus Chen, IT Analyst at a 500-person professional services firm
**Where:** Copilot Studio (trial environment), Microsoft Teams
**The Problem:** Marcus's manager asked him to build an IT helpdesk agent by end of week. Marcus has never opened Copilot Studio before. He watched two YouTube videos and is now staring at a blank canvas, unsure whether to start with a topic, a knowledge source, or system instructions. He is worried about publishing something broken to the whole company.

**Prerequisites:** Copilot Studio environment, VS Code extension

---

### What You Say to the Agent

> "I've never built a Copilot Studio agent before. I need to build an IT helpdesk agent for my company. It should answer questions about password resets, VPN setup, and how to request new software. Where do I start?"

### What the Agent Does

1. Starts with system instructions, not topics: creates a focused identity prompt that scopes the agent to IT support only, preventing it from answering off-topic questions that would embarrass Marcus in front of colleagues
2. Builds the 3 highest-value topics first (password reset, VPN setup, software request), each with 5 trigger phrases and a clean message node, so the agent works end-to-end before Marcus adds anything else
3. Adds a fallback topic that tells users "I don't know that one yet, try the IT ticket portal" rather than giving a confusing AI-generated non-answer
4. Walks Marcus through publishing to a test channel in Teams, so he can share a private link for feedback before going company-wide

### The Business Impact

- **First working agent in 45 minutes** — from blank canvas to Teams test link, following the exact path with no dead ends
- **3 topics covering 80% of common IT requests** — password, VPN, and software requests handled without escalation
- **Zero embarrassing moments** — fallback topic and scoped instructions prevent the agent from hallucinating answers about HR or finance

### Try It Yourself

> "I built my first agent but it keeps answering questions I didn't set up topics for. How do I stop it from going off-script?"
