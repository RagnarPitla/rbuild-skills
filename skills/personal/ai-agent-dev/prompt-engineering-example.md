# Prompt Engineering — Example

## Scenario: D365 Agent That Fails on Multi-Step Process Questions

**Who:** James Okafor, Developer at a professional services firm (D365 F&O implementation partner, builds agents for clients)
**Where:** Copilot Studio, Azure OpenAI GPT-4o, D365 F&O OData, custom knowledge base
**The Problem:** James built a D365 process advisor agent. It answers simple questions like "What is the status of PO-00842?" correctly. But when users ask multi-step process questions like "A vendor invoice came in but the PO is partially received and the remaining quantity is on backorder. What should the AP clerk do?" — the agent gives incomplete, shallow answers that skip critical steps. Users with real AP experience say the answers miss the 3-way match exception handling entirely.

**Prerequisites:** Copilot Studio with a configured knowledge base, Azure OpenAI GPT-4o deployment, familiarity with Copilot Studio system prompt (agent instructions).

---

### What You Say to the Agent

> "My D365 agent gives good answers on simple one-step questions but fails completely on multi-step process questions. The AP team says it misses critical exception handling steps. I want to implement chain-of-thought and few-shot prompting in the agent instructions to fix this."

### What the Agent Does

1. **Diagnoses the shallow reasoning pattern:** Reviews 15 failed conversation logs. Finds the agent is giving final answers without reasoning through the process. The system prompt currently says "Help users with D365 processes" — no instruction to think step-by-step or check preconditions before answering

2. **Implements chain-of-thought in the system prompt:** Adds an explicit reasoning directive: "Before answering any process question, first identify: (1) What D365 module does this involve? (2) What is the current state of the record? (3) What are the possible exception paths? (4) What is the correct process path given the stated conditions? Then provide your answer." This alone improves completeness scores from 3.1/5 to 4.0/5 on the eval set

3. **Adds 3 few-shot examples directly in agent instructions:** Each example shows a complex process question followed by a structured answer with explicit "Exception check:" and "Recommended action:" sections. The AP 3-way match example includes the specific D365 path: "Accounts Payable > Vendor Invoices > [Invoice ID] > Match details tab > Check tolerance thresholds"

4. **Implements a process decomposition prefix:** For questions containing keywords like "but," "however," "partially," or "backorder," prepends: "This question has an exception condition. I will handle the standard path first, then address the exception." This signals to the model that two reasoning paths are needed

5. **Tests with adversarial examples:** Runs 20 multi-step process questions against the updated agent, including 5 intentional edge cases (conflicting statuses, cross-module dependencies). Scores each on completeness (are all required steps present?) and accuracy (are the steps correct for D365 F&O 10.0.2+?). Completeness improves from 58% to 91%

### The Business Impact

- **AP team satisfaction score went from 2.8 to 4.3 out of 5** after the chain-of-thought and few-shot changes (measured via in-conversation thumbs up/down over 2 weeks)
- **Escalations to senior AP staff dropped 60%** — the agent now handles exception scenarios that previously required a human expert
- **Implementation replicable across clients** — James packaged the few-shot examples as a reusable prompt template for all D365 agent deployments at his firm

### Try It Yourself

> "The chain-of-thought prompting is working well for AP processes. But the agent is now verbose on simple questions — it goes through the full reasoning framework even when a user just asks 'what is the vendor number for Contoso?' How do I add conditional reasoning depth so it only uses chain-of-thought when the question is genuinely complex?"
