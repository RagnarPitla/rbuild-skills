# Meeting Notes Processor — Example

## Scenario: Customer Discovery Call with a Retail Enterprise

**Who:** Ragnar Pitla, post a 90-minute discovery call with a Director of IT and VP of Operations at a mid-market retail enterprise (800 employees, Salesforce CRM, no current ERP agent deployment)
**Where:** Microsoft Teams call, auto-transcript available but raw and messy (speakers mislabeled, filler words, tangents)
**The Problem:** The transcript is 14,000 words of honest but unfiltered conversation. There are three distinct pain points buried in the first 40 minutes, a half-confirmed budget signal at minute 67 that Ragnar needs to follow up on, and four action items that were stated casually and never written down. The VP said something at 54:12 that is a perfect customer quote for a case study. If Ragnar processes this manually, it takes 45 minutes and he will still miss something.

**Prerequisites:** The meeting transcript (Teams, Zoom, or Otter.ai format all work). Participant names for speaker attribution.

---

### What You Say to the Agent

> "Process this 90-minute customer discovery call transcript. Participants: me (Ragnar), Sarah Chen (Director of IT), Marcus Webb (VP Operations). Extract: the top 3 pain points they described in their words, all action items with owner and implied deadline, the budget signal at around minute 67, any quotes worth keeping for a case study, and a follow-up email I can send today. My tone in the email: warm, specific, no generic 'great meeting today.'"

### What the Agent Does

1. **Parses the transcript** — corrects speaker attribution errors, strips filler words, identifies thematic segments
2. **Extracts structured outputs:**

```
PAIN POINTS (in customer's words)
1. "We have agents running in Salesforce but the moment they need
   inventory data they just... stop. They can't see D365 at all."
   (Sarah Chen, 14:22) — Root cause: no ERP connectivity layer

2. "Our warehouse team gets 40 exception emails a day. Nobody reads
   them anymore. We need something that acts on them, not just sends
   them." (Marcus Webb, 31:45) — Root cause: alert fatigue, no
   agentic exception handling

3. "IT is the bottleneck for every AI project. The business units
   want to move fast but they need us to build connectors." (Sarah Chen,
   42:08) — Root cause: no self-service agent tooling

BUDGET SIGNAL
At 67:14, Marcus said: "We've got a line item in Q3 for 'AI infrastructure'
that hasn't been allocated yet. Ballpark is $150-200K." Not confirmed as
the budget for this engagement — requires follow-up to clarify scope.

ACTION ITEMS
- Ragnar: Send MCP + D365 architecture one-pager by EOW
- Sarah: Share current Salesforce agent inventory (internal doc)
- Marcus: Connect Ragnar with their D365 partner (name: TechNorth)
- All: Reconvene in 2 weeks for technical deep-dive

CASE STUDY QUOTE (Sarah Chen, 54:12)
"The agents are smart enough. The problem is they're blind to half
the business. That's not an AI problem — that's a plumbing problem."
```

3. **Drafts the follow-up email** — specific references to what Sarah and Marcus said, no generic pleasantries, concrete next step in the subject line

### The Business Impact

- **Zero missed action items** — all four captured with owner and timeframe
- **Budget signal flagged explicitly** — not buried in paragraph 8 of notes where it gets forgotten
- **Follow-up email sent same day** — while the conversation is fresh for the customer

### Try It Yourself

> "Take the three pain points from this call and map them to the Niyam pattern components. For each pain point, describe which part of the Niyam stack addresses it and what the agent would actually do."
