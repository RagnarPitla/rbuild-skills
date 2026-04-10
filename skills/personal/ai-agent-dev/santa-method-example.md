# Santa Method — Example

## Scenario: D365 Go-Live Readiness Checklist With a Single Reviewer Missing Things

**Who:** Aisha Patel, Implementation Project Manager at a D365 FastTrack partner (managing a D365 F&O go-live for a retail client, 1,200 users)
**Where:** Claude API, Python orchestration script, D365 F&O go-live checklist (150 items across 8 modules)
**The Problem:** The current go-live validation process has one senior consultant review the readiness checklist. In the last three go-lives, post-launch issues traced back to items that were marked "complete" but hadn't been properly validated: a tax configuration that passed UAT but failed in production due to a state-level exception, a batch job schedule set to the wrong timezone, and a payment journal approval workflow missing a backup approver. A single reviewer gets too close to the material and misses things.

**Prerequisites:** Claude API access (claude-opus-4-5 recommended for both agents), Python 3.11+, the go-live checklist as a structured JSON or markdown document. The Santa Method requires two independent agent runs before a convergence check.

---

### What You Say to the Agent

> "I'm using Claude to validate D365 go-live readiness checklists. A single reviewer keeps missing things that cause post-launch issues. I want to implement the Santa Method so two independent agents check the list and I only sign off when both agree. Walk me through the implementation."

### What the Agent Does

1. **Sets up the two-agent architecture:** Creates Agent A (Reviewer) and Agent B (Challenger). Both receive the same go-live checklist and the same base context (D365 module configurations, test results, environment details). Critically, they are run in separate API calls with no shared conversation history — true independence

2. **Prompts Agent A as the optimistic validator:** System prompt: "You are a D365 go-live validation expert. Review this checklist and identify any items that appear complete but may have hidden risks. Focus on: configuration dependencies that weren't tested together, missing fallback procedures, and timezone/locale edge cases."

3. **Prompts Agent B as the adversarial challenger:** System prompt: "You are a D365 go-live risk auditor. Your job is to find reasons the go-live should be delayed. Assume optimistic reviewers have missed at least 3 critical items. Look for: single points of failure, items marked complete without evidence, and integration touchpoints between modules." Agent B receives Agent A's findings as additional context and is explicitly asked to challenge each "low risk" determination

4. **Implements the convergence loop:** Python script compares outputs. Items where both agents agree are "safe" move to the approved list. Items where they disagree trigger a round 2 — both agents receive the disputed item and each other's reasoning and must re-evaluate. The loop runs until convergence or 3 rounds maximum. After 3 rounds without convergence, the item is flagged for mandatory human escalation

5. **Generates a structured sign-off report:** Output includes three sections: APPROVED (both agents agree, 134 items), REQUIRES ATTENTION (one or both agents flagged, with specific risk notes, 12 items), MUST RESOLVE BEFORE GO-LIVE (convergence failed after 3 rounds, 4 items). The 4 unresolved items are automatically added to a JIRA sprint for the day before go-live

### The Business Impact

- **4 critical items surfaced in the first real run** — a batch job using UTC instead of CST for nightly close, a missing credit management hold bypass for the executive account, a payment format code not mapped for the client's second bank, and a missing posted sales tax authority posting profile
- **Go-live delay cost avoided** — fixing those 4 items pre-launch vs. post-launch saved an estimated 3 days of emergency support effort ($18,000 at consulting rates)
- **Process adopted firm-wide** — the Santa Method validation script is now the standard pre-go-live gate for all 14 active implementation projects at the firm

### Try It Yourself

> "The two-agent Santa Method is working well for the go-live checklist. I want to extend it to post-go-live hypercare — running daily for the first 2 weeks to check for performance degradation, batch job failures, and integration errors. How do I adapt the convergence loop to handle continuous monitoring with a rolling 24-hour window?"
