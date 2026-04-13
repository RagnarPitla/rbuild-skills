# Claude Code Subagents — Example

## Scenario: Running a Security Audit Agent in Parallel While Implementing a New Feature

**Who:** Yuki Tanaka, Tech Lead, shipping a new payments integration for an enterprise SaaS product
**Where:** Claude Code on a Node.js/TypeScript API repository handling sensitive financial data
**The Problem:** Every time the team ships a payments feature, the security review happens after the code is written. Security issues found late cost 3-5x more to fix than if caught during development. Yuki wants a security audit running in parallel with implementation, not after, so findings can influence the code as it is being written.

**Prerequisites:** Claude Code installed, `.claude/agents/` directory created, security-auditor agent definition written

---

### What You Say to the Agent

> "While I build the Stripe webhook handler, spawn a security auditor subagent to review what I'm writing in real time. The auditor should have read-only access only. After I finish the implementation, show me the auditor's findings before I commit."

### What the Agent Does

1. Reads the existing `.claude/agents/security-auditor.md` definition (or creates one with Read, Glob, Grep tools only and a comprehensive security checklist)
2. Spawns the security auditor as a subagent with restricted tool access: Read, Glob, Grep, and read-only Bash commands
3. Begins implementing the Stripe webhook handler in the main session: creates `src/webhooks/stripe-handler.ts`, validates signatures, processes events, updates the database
4. After each major implementation milestone, the parent session signals the security auditor to scan the new code
5. The security auditor checks for: missing signature validation, hardcoded Stripe keys, missing idempotency key handling, insufficient error logging, exposed internal error details in responses
6. Surfaces two findings: one HIGH (webhook events processed without checking if the event was already handled, missing idempotency), one MEDIUM (internal Stripe error details exposed in the API response)
7. Parent session incorporates both fixes before the final commit

### The Business Impact

- **Shift-left security** — vulnerabilities caught during coding, not in a post-merge security review
- **Zero rework** — the idempotency bug, which would have caused duplicate charges in production, is fixed before the feature is even committed
- **Audit trail** — security findings and resolutions are documented as part of the implementation session

### Try It Yourself

> "Create a code-reviewer subagent definition in .claude/agents/ that checks for logic errors, missing tests, and TypeScript strict violations. Then spawn it to review my last 5 commits."
