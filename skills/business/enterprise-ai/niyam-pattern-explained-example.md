# Niyam Pattern Explained — Example

## Scenario: Procurement Thresholds Change Three Times in One Quarter

**Who:** James Okafor, D365 Solution Architect at a global manufacturing company (14,000 employees, D365 deployed in 22 countries)
**Where:** Copilot Studio agent deployment — Procurement Assistant Agent
**The Problem:** The CFO changed the auto-approve threshold from $5,000 to $10,000 in January, then to $7,500 in February after an audit, then back to $10,000 in March when the audit cleared. Each time, James had to edit the agent instructions, re-test, and republish. The republish cycle took 2-3 days including UAT. The business stopped trusting the agent because it was always "being updated."

**Prerequisites:** Copilot Studio agent deployed, Power Platform environment with Dataverse, basic familiarity with Dataverse table creation.

---

### What You Say to the Agent (during build)

> "I need to build a procurement approval agent where business users can change approval thresholds and vendor rules without IT republishing the agent. Show me how to set up the Niyam pattern for this."

### What the Agent Does

1. Creates the `cr023_pr_threshold` Dataverse table with columns: `cr023_policy_key` (alternate key), `cr023_policy_value`, `cr023_description`, `cr023_effective_date`, `cr023_is_active`
2. Seeds the table with initial values: `auto_approve_threshold = 10000`, `manager_approval_max = 50000`, `preferred_vendors = ["VEND001","VEND002"]`
3. Builds a Power Automate flow "Get Policy Value" that takes a `policy_key` input and returns the current active value from Dataverse
4. Updates the agent system instructions to say: "Before processing any approval, call the Get Policy Value flow to read the current threshold. Never use a hardcoded threshold."
5. Builds a Model-Driven App over the policy table so business users can edit thresholds directly

### The Business Impact

- **Threshold changes from 3-day IT cycle to 30-second business operation** — the finance director now updates approval thresholds herself in the Model-Driven App
- **Zero republishes** in Q2 despite three policy changes — the agent reads from Dataverse at runtime, not from its instructions
- **Audit trail built-in** — Dataverse tracks every policy change with timestamp and user, making compliance reporting straightforward
- **Pattern reused across 4 more agents** — once the architecture was proven, James applied the same Niyam pattern to vendor onboarding, expense approvals, and inventory adjustment agents

### Try It Yourself

> "Build a Niyam policy table for expense report approval thresholds, with separate limits for: individual contributors ($500), managers ($2,000), directors ($5,000), and VP+ (unlimited). Include effective date so Q4 holiday policies auto-activate on December 1st."
