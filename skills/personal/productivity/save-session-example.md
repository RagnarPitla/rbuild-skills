# Save Session — Example

## Scenario: Preserving a Multi-Agent Architecture Design Before Context Runs Out

**Who:** Ragnar Pitla, deep in a Claude Code session designing a new multi-agent system
**Where:** Claude Code, 3 hours into an architecture design session with growing context pressure
**The Problem:** Ragnar has spent 3 hours with Claude Code designing the architecture for a multi-agent procurement system: a parent orchestrator, three child agents (PO Validator, Budget Checker, Vendor Compliance), a shared Dataverse policy table, and an MCP server bridging D365. Decisions have been made about table schemas, agent routing logic, and the handoff protocol between agents. The session is getting long. If context gets compacted or Ragnar starts fresh tomorrow, all of these micro-decisions disappear and he wastes the first hour of the next session reconstructing them.

**Prerequisites:** None. Run this skill at any natural pause point in a long design or build session.

---

### What You Say to the Agent

> "Save session. We've been designing a multi-agent procurement system for the last 3 hours. Capture everything that would be painful to re-derive tomorrow: architecture decisions, schema definitions, open questions, and where we stopped."

### What the Agent Does

1. **Scans the conversation** for decisions, code snippets, schema definitions, and open threads
2. **Writes a structured session file** to disk at a predictable path:

```
SESSION SAVED: 2026-04-10-procurement-agent-architecture.md

WHAT WE BUILT TODAY
Multi-agent procurement system for agentic ERP demo.
Parent: Procurement Orchestrator (Copilot Studio)
Children: PO Validator, Budget Checker, Vendor Compliance Agent

ARCHITECTURE DECISIONS MADE
1. Routing: description-based routing on parent agent. Each child agent
   has a single-sentence description that routes intent accurately.
   Decision: no topic triggers on parent — description routing only.

2. Dataverse schema: single policy table `cr023_proc_policy` with columns:
   policy_id, policy_type (enum), rule_text, severity, active_flag.
   Decision: one table for all three policy types (not separate tables).

3. Handoff protocol: child agents return structured JSON to parent.
   Format: { status, result_summary, flags[], recommended_action }
   Decision: parent never calls two children in parallel in v1.

4. MCP server: Node.js, exposes 4 tools: get_po_details, check_budget,
   get_vendor_status, submit_approval. SSE transport for Copilot Studio.

OPEN QUESTIONS (unresolved)
- Budget Checker: does it call D365 directly or read a cached Dataverse
  snapshot? Performance vs freshness tradeoff not resolved.
- Vendor Compliance: what happens when the MCP call times out? No error
  handling pattern defined yet.

WHERE WE STOPPED
Finished the Dataverse schema. About to start the MCP server tool
definitions. Next session: start at mcp-server-patterns skill,
build get_po_details tool first.

RESUME PROMPT
"Resume from saved session 2026-04-10-procurement-agent-architecture.
We're building the MCP server tool definitions. Start with get_po_details."
```

3. **Confirms save location** and offers to generate the exact resume prompt for the next session

### The Business Impact

- **Zero ramp-up time next session** — Ragnar opens the session file, pastes the resume prompt, and is building in 90 seconds
- **Decision log prevents re-litigation** — "wait, why did we use one policy table?" has a written answer
- **Open questions surfaced explicitly** — the Budget Checker caching question does not silently become a bug three weeks later

### Try It Yourself

> "Load the last saved session and give me a one-paragraph summary of where we are, then ask me which open question I want to resolve first before we continue building."
