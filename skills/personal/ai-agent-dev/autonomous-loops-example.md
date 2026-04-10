# Autonomous Loops — Example

## Scenario: D365 Purchase Requisition Escalation Agent

**Who:** Marcus Webb, Senior Developer at a construction company (D365 F&O, 800 users across procurement and finance)
**Where:** Azure Functions, D365 F&O OData API, Copilot Studio, Azure Service Bus, Power Automate
**The Problem:** Purchase requisitions older than 48 hours with no approver action are a compliance risk. The current process is manual — a procurement coordinator checks a D365 report every morning and sends escalation emails. It's inconsistent, the coordinator is on leave 20 days a year, and the legal team flagged 3 procurement audit findings last quarter tied to stale requisitions that slipped through.

**Prerequisites:** Azure Functions (Node.js 18+ or Python 3.11+), D365 F&O OData endpoint, Azure Service Bus namespace, Power Automate license for email/Teams notification actions.

---

### What You Say to the Agent

> "I need to build an autonomous agent that monitors D365 for overdue purchase requisitions every hour and automatically escalates them. It should be safe — no accidental double-escalations, handle D365 downtime gracefully, and give me an audit trail. Walk me through the architecture."

### What the Agent Does

1. **Designs the loop architecture:** Timer-triggered Azure Function on a cron schedule (`0 0 * * * *` = top of every hour). Function queries D365 OData: `GET /PurchReqTable?$filter=RequisitionStatus eq 'Draft' and CreatedDateTime lt [now-48h]&$select=RequisitionId,CreatorWorker,Department,TotalAmount`

2. **Implements idempotency guard:** Before escalating, checks Azure Table Storage for a `escalation_log` record keyed on `{RequisitionId}_{escalation_level}`. If the key exists, skips. This prevents double-escalation if the function runs twice due to Azure retry behavior. TTL on log entries: 30 days

3. **Adds circuit breaker for D365 downtime:** Wraps the OData call with exponential backoff (3 retries: 5s, 25s, 125s). If all retries fail, publishes a `d365_unreachable` event to Azure Service Bus dead-letter queue and sends a Teams alert to the ops channel. The loop stops gracefully instead of spamming failed escalation emails

4. **Implements escalation ladder:** Level 1 (48h): Email to direct approver via Power Automate. Level 2 (72h): Email to approver + manager. Level 3 (96h): Email to department head + auto-creates a D365 workflow task on the CFO's queue. Each level is logged with timestamp, actor, and requisition amount

5. **Adds safety kill switch:** An Azure App Configuration flag `escalation_loop_enabled` (bool). Function checks this at startup. If `false`, logs a skip and exits. Allows ops team to disable the loop during D365 maintenance windows without touching code

### The Business Impact

- **Zero missed escalations** in the first month post-deployment, vs. an average of 6 per month under the manual process
- **Procurement coordinator freed 2 hours/day** — the morning report review and manual email drafting were eliminated
- **Audit findings dropped to zero** in the following quarter — legal team accepted the automated audit trail in Azure Table Storage as evidence of process compliance

### Try It Yourself

> "The hourly escalation loop is working. Now I need to add an approval response handler — when an approver clicks 'Approve' in the email, it should call back into D365 to update the requisition status and log the approval in my audit table. How do I build that webhook pattern safely?"
