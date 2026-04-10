# Tamagotchi Worker Agent Template — Example

## Scenario: Autonomous Invoice Processor Gets Stuck in a Loop

**Who:** Yuki Tanaka, AI Platform Engineer at a 7,000-person global logistics company
**Where:** Copilot Studio, Dataverse, D365 F&O via MCP
**The Problem:** Yuki built an autonomous agent that processes D365 vendor invoices: it validates three-way match, routes to the correct approval workflow, and posts confirmed invoices. The agent works for straightforward invoices but gets stuck in an infinite retry loop when D365 returns a partial match error. The loop runs until the session times out, leaving the invoice in an unknown state with no log of what happened. Finance cannot audit what the agent did or where it failed. The agent processes 200 invoices per day and any loop is a risk.

**Prerequisites:** Copilot Studio environment, VS Code extension, Dataverse, D365 F&O MCP server configured, existing Niyam Worker agent

---

### What You Say to the Agent

> "My autonomous invoice processing agent gets stuck in a retry loop when D365 returns a partial match error. Convert it to the Tamagotchi pattern with checkpoints so it recovers itself and logs what happened."

### What the Agent Does

1. Maps the existing agent's processing logic into 5 named steps: Validate Invoice, Check Three-Way Match, Determine Approval Route, Post to D365, and Confirm Completion. Each step becomes a checkpoint row in Dataverse with a StepStatus, AttemptCount, LastError, and Timestamp column
2. Inserts a health check before every D365 MCP call: if StepStatus is "Stuck" (AttemptCount greater than 2 with no progress), the agent moves to the Recovery step instead of retrying the same call again
3. Builds the Recovery step with 3 resolution paths: auto-resolve for known D365 partial match error codes (handles 7 specific error patterns Yuki identifies), escalate-to-human for unknown errors, and abandon-with-audit for system unavailability. Each path writes a detailed AuditEntry to Dataverse before exiting
4. Adds a Power Automate monitoring flow that queries Dataverse every 30 minutes for invoices stuck longer than 2 hours, and sends a Teams alert to the finance team with the invoice number, last step reached, and error code

### The Business Impact

- **Zero infinite loops** since converting to Tamagotchi pattern, across 200 daily invoice processing runs
- **7 known D365 partial match errors now auto-resolved** without human intervention, covering 85% of historical failure cases
- **Full audit trail for every invoice** — finance can see exactly which step failed, how many attempts were made, and what resolution path was taken

### Try It Yourself

> "My autonomous agent processes sales orders but sometimes the D365 availability check returns a timeout. How do I add checkpoint recovery so it doesn't lose the order when that happens?"
