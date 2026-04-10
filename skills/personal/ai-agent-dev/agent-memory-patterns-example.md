# Agent Memory Patterns — Example

## Scenario: Copilot Studio Customer Support Agent That Forgets Everything

**Who:** Daniel Reyes, Power Platform Developer at a telecom company (B2C, 2M customers)
**Where:** Copilot Studio, Dataverse, Azure Functions, D365 Customer Service
**The Problem:** The customer support agent keeps asking users for their account number every time they switch topics mid-conversation. A user asks about their bill, gives their account number, then asks about a service outage — and the agent asks for the account number again. Users are abandoning conversations at a 34% rate, and the support team is getting escalations specifically about "the bot that forgets everything."

**Prerequisites:** Copilot Studio with Dataverse environment, global variables configured, basic familiarity with Power Automate flows triggered from Copilot Studio topics.

---

### What You Say to the Agent

> "Our Copilot Studio customer support agent keeps asking for the account number every time a user switches topics. I need to implement proper conversation memory so account details persist across the whole session. Walk me through the right pattern."

### What the Agent Does

1. **Diagnoses the architecture gap:** Identifies that account number is stored as a topic-scoped variable (`Topic.AccountNumber`) inside the billing topic. When the user moves to a new topic, that variable is out of scope. The fix requires promoting it to a global variable (`Global.AccountNumber`)

2. **Implements the capture-once pattern:** Modifies the account verification topic to set `Global.AccountNumber`, `Global.CustomerName`, and `Global.AuthStatus` (enum: `Verified`, `Guest`, `Failed`) immediately after successful lookup. Adds a condition check at the start of every downstream topic: "If `Global.AccountNumber` is empty, redirect to account verification"

3. **Adds session context object:** Creates a Dataverse table `cr023_session_context` with columns for session_id, account_number, customer_name, auth_timestamp, conversation_summary. Azure Function writes a summary every 3 turns using a Claude claude-haiku-4-5 summarization call (cost: $0.0003 per summary)

4. **Implements cross-session memory for returning users:** When a session starts, checks Dataverse for prior sessions by phone number or email. If a session exists from the past 7 days, pre-populates global variables and greets with "Welcome back, [Name]. Last time you asked about [last_topic]."

5. **Adds memory decay:** Sessions older than 7 days require re-verification. Auth tokens are cleared automatically via a scheduled Power Automate flow running nightly

### The Business Impact

- **Abandonment rate dropped from 34% to 11%** — measured over 10,000 sessions in the first week after deployment
- **Average session length increased 40%** — users now resolve 2.3 issues per session instead of 1.4 (they no longer give up after re-authentication friction)
- **Escalations about "the forgetful bot" dropped to zero** — now the escalation queue shows substantive product complaints instead of UX frustrations

### Try It Yourself

> "The global variable pattern is working great within a session. But we want the agent to remember a user's preferred contact method and language preference across sessions permanently, not just 7 days. How do I implement a persistent user profile in Dataverse that survives session resets?"
