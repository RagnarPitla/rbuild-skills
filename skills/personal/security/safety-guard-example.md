# Safety Guard — Example

## Scenario: Copilot Studio Agent Starts Deleting Open Purchase Orders on a Tester's Prompt

**Who:** Michael Torres, AI Engineer, procurement automation team
**Where:** Copilot Studio, D365 F&O, Power Automate, production-adjacent test environment
**The Problem:** Michael's Copilot Studio agent can delete D365 records based on natural language requests. During testing, a tester typed "delete all open purchase orders" to see what would happen. The agent parsed the intent, called the D365 deletion tool, and started executing. The test environment had 400 open purchase orders, many shared with other teams. There were no confirmation steps, no scope limits, and no way to stop the execution mid-run.

**Prerequisites:** Copilot Studio agent with write/delete access to D365. Power Automate flow as the execution layer. The safety guard patterns apply to any agent with destructive capabilities.

---

### What You Say to the Agent

> "During testing, a tester said 'delete all open purchase orders' and the agent started executing. We caught it in time but we have no safety mechanisms. Help me add a proper safety layer before this goes to production."

### What the Agent Does

1. **Identifies the three missing safety layers:** No intent confirmation before destructive operations, no scope limiting (the agent accepted "all" as a valid scope), and no operation audit trail. Any one of these would have prevented the test incident.

2. **Adds a confirmation gate for destructive intents:** Designs a Copilot Studio topic that intercepts any tool call tagged as `destructive: true`. Before executing, the agent presents an Adaptive Card confirmation:
   - Shows the operation description: "Delete 400 purchase orders in status Open"
   - Shows the exact scope: "Vendor: All, Status: Open, Date range: All"
   - Requires the user to type "CONFIRM DELETE" (not click a button) to proceed
   - The type-to-confirm pattern is intentionally friction — buttons can be clicked accidentally

3. **Adds scope limiting to the deletion tool:** The D365 delete tool previously accepted unbounded queries. Adds a `maxRecords: 10` default parameter with an explicit override requiring manager approval (via Power Automate approval flow) for operations affecting more than 10 records. "Delete all" scoped to 400 records now routes to an approval flow, not direct execution.

4. **Catches a privilege escalation gap:** The agent was using a service account with D365 System Administrator role. The agent only needed permission to delete purchase orders in Pending status from a specific vendor group. The agent flags this as a least-privilege violation. Recommends creating a dedicated Dataverse application user with a custom security role scoped to the exact tables and operations needed.

5. **Adds an operation log to Dataverse:** Every destructive operation the agent executes (or attempts) is written to a `cr023_agent_operations` table with: timestamp, user, intent, scope, records affected count, confirmation status, and execution result. This table feeds a Power BI alert if more than 50 records are deleted in any 1-hour window.

### The Business Impact

- **Accidental bulk deletion prevented** — the type-to-confirm gate alone would have stopped the test incident; the scope limiter ensures an attacker or confused user cannot bypass it with a rephrased prompt
- **Privilege attack surface reduced by 90%** — the System Administrator service account replaced with a scoped application user with 3 specific table permissions
- **Audit trail established** — the operations log surfaced two other unintended deletion attempts from different testers in the same week that had gone unnoticed

### Try It Yourself

> "My Copilot Studio agent can also update vendor payment terms in bulk. Add the same safety pattern to the update operation — a confirmation gate, a record count limit with approval workflow for bulk operations, and audit logging. The update should also show a preview of what will change before confirmation."
