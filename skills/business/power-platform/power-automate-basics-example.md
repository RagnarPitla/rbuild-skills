# Power Automate Basics — Example

## Scenario: Building a Write-Back Flow for a Copilot Studio Purchase Approval Agent

**Who:** Leila Azari, Copilot Studio Developer, building procurement agents for a manufacturing company
**Where:** Copilot Studio, Power Automate, D365 Finance and Operations
**The Problem:** Leila's procurement approval agent in Copilot Studio can converse with users, evaluate purchase requisitions against policy, and decide to approve or reject. The problem: Copilot Studio agents can't directly write back to D365 F&O. When the agent approves a requisition, nothing actually happens in D365 — the approval has to be manually entered by someone. Leila needs a Power Automate flow that the agent calls via HTTP action to write the approval status back to D365 and trigger the next workflow step. She's set up basic Power Automate flows before, but never built one that serves as an agent's write-back mechanism.

**Prerequisites:** Copilot Studio agent built and publishing to Teams. D365 F&O environment with purchase requisition workflow enabled. Power Automate premium license (HTTP trigger requires premium). power-automate-basics skill loaded.

---

### What You Say to the Agent

> "My Copilot Studio procurement agent approves purchase requisitions but can't write back to D365. I need a Power Automate flow the agent can call with the requisition ID and approval decision. The flow should update the requisition status in D365 and send a confirmation back to the agent. Walk me through building this."

### What the Agent Does

1. Outlines the architecture: Copilot Studio calls Power Automate via the "Call an action" node, Power Automate receives the requisition ID and decision, updates D365, and returns a confirmation message
2. Defines the flow structure:

```
TRIGGER: When an HTTP request is received (premium)
  Input schema:
  {
    "requisitionId": "string",    // D365 purchase requisition number
    "decision": "string",          // "Approved" or "Rejected"
    "approverComments": "string",  // optional, from agent conversation
    "agentSessionId": "string"     // for correlation/logging
  }

ACTION 1: Scope — Validate inputs
  Condition: requisitionId is not empty AND decision is "Approved" or "Rejected"
  On fail: Respond with error body { "status": "error", "message": "Invalid input" }

ACTION 2: D365 F&O — Update purchase requisition status
  Connection: D365 F&O connector
  Action: Update record in PurchReqTable
  RequisitionId: triggerBody()?['requisitionId']
  ApprovalStatus: triggerBody()?['decision']
  ApproverComments: triggerBody()?['approverComments']

ACTION 3: D365 F&O — Trigger next workflow step
  Action: Submit to workflow (uses D365 workflow API)
  Requisition: triggerBody()?['requisitionId']

ACTION 4: Compose response
  Body: { "status": "success", "requisitionId": "...", "newStatus": "Approved", "timestamp": "..." }

RESPOND: Return HTTP response to Copilot Studio
```

3. Shows the Copilot Studio "Call an action" node configuration: maps the agent variable `Topic.RequisitionId` and `Topic.Decision` to the flow's input schema
4. Adds error handling: if the D365 update fails, the flow returns `status: "error"` and the agent responds "I wasn't able to update the requisition — please contact procurement directly"
5. Tests with a sample requisition: PO-REQ-2024-8812, decision "Approved"

### The Business Impact

- **Agent approval decisions now take effect in D365 automatically** — no manual data entry by procurement staff
- **Requisition approval time reduced from 4 hours to 8 minutes** — agent evaluates policy, decides, writes back, all in one conversation
- **Full audit trail** — every agent decision logged in the Power Automate run history with requisition ID, decision, and timestamp
- **Pattern reused across 3 agents** — the same HTTP trigger write-back pattern was applied to the travel expense agent and vendor onboarding agent within 2 weeks

### Try It Yourself

> "Now add a step to the flow that sends an email to the requisition requester confirming the decision, with the approver's comments included. Use the Office 365 Outlook connector."
