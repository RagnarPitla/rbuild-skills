---
name: "safety-guard"
slug: "safety-guard"
description: "Prevent destructive operations in AI agent workflows with confirmation patterns, double-confirmation for high-risk operations, and audit log patterns. Use when user says 'safety guard', 'prevent destructive operations', 'confirm before delete', 'dangerous operation check', 'bulk update safety', 'irreversible action'."
tab: "personal"
domain: "security"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "security", "safety", "destructive-ops"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Safety Guard

AI agents that can write to systems need guardrails. The cost of a destructive operation that succeeds silently is always higher than the cost of one extra confirmation step. Build the guardrails in, not as an afterthought.

## Risk Classification

Classify every operation before executing:

| Risk Level | Operations | Protocol |
|---|---|---|
| Safe | Read-only, non-destructive | Execute immediately |
| Low | Create new records, reversible updates | Execute with summary |
| Medium | Update existing records, bulk creates | Single confirmation required |
| High | Delete records, bulk updates, status changes | Double confirmation required |
| Critical | Purge data, cascade deletes, production config changes | Double confirmation + explicit text entry |

## Confirmation Pattern

For operations requiring confirmation, always show:
1. What will happen (the action)
2. What will be affected (scope and count)
3. Whether it can be undone

```
CONFIRMATION REQUIRED — Medium Risk

Action: Update order status
Records affected: 147 orders (status: pending -> processing)
Reversible: Yes (can be reverted)

Type YES to confirm or NO to cancel:
```

## Double Confirmation for High-Risk

```
DOUBLE CONFIRMATION REQUIRED — High Risk

Action: Delete all orders for customer ID CUS-4821
Records to be deleted: 23 orders, 89 order lines
Reversible: NO — this action cannot be undone

Step 1/2: Type CONFIRM to proceed to final confirmation
> CONFIRM

Step 2/2: To confirm deletion, type the customer ID exactly:
Expected: CUS-4821
> CUS-4821

Executing deletion... Done. 23 orders deleted.
Audit log entry created: DEL-2026041001-4821
```

## Implementation Pattern

```typescript
// Risk assessment for any write operation
function assessRisk(operation: Operation): RiskLevel {
  if (operation.type === 'DELETE') {
    return operation.cascade ? 'CRITICAL' : 'HIGH';
  }
  if (operation.type === 'UPDATE' && operation.recordCount > 1) {
    return 'MEDIUM';
  }
  if (operation.type === 'UPDATE' && operation.isStatusChange) {
    return 'MEDIUM';
  }
  if (operation.type === 'CREATE') {
    return 'LOW';
  }
  return 'SAFE';
}

// Confirmation gate
async function executeWithGuard(
  operation: Operation,
  confirm: (message: string) => Promise<boolean>
): Promise<OperationResult> {
  const risk = assessRisk(operation);
  
  if (risk === 'SAFE' || risk === 'LOW') {
    return execute(operation);
  }

  const summary = buildSummary(operation);
  
  if (risk === 'MEDIUM') {
    const confirmed = await confirm(summary);
    if (!confirmed) return { status: 'cancelled' };
    return execute(operation);
  }

  // HIGH or CRITICAL: double confirmation
  const step1 = await confirm(`${summary}\n\nType CONFIRM to proceed:`);
  if (!step1) return { status: 'cancelled' };

  const step2 = await confirm(`Final confirmation: type "${operation.identifier}" exactly:`);
  if (!step2) return { status: 'cancelled' };

  const result = await execute(operation);
  await auditLog(operation, result);
  return result;
}
```

## Audit Log Pattern

Every destructive operation should create an immutable audit record:

```typescript
interface AuditEntry {
  id: string;               // Unique audit ID (e.g., DEL-20260410-001)
  timestamp: string;        // ISO 8601
  operation: string;        // What happened
  actor: string;            // Who/what triggered it (agent ID, user ID)
  target: {
    type: string;           // Table/entity
    ids: string[];          // Affected record IDs
    count: number;
  };
  before: Record<string, unknown>; // State before operation
  after: Record<string, unknown>;  // State after (null for deletes)
  reversible: boolean;
  reversalId?: string;      // Points to reversal operation if it exists
}
```

Audit logs must be:
- **Append-only:** Never delete or modify audit records
- **Complete:** Capture state before and after
- **Accessible:** Retrievable for compliance and debugging

## Trigger Phrases

- "safety guard"
- "prevent destructive operations"
- "confirm before delete"
- "dangerous operation check"
- "bulk update safety"
- "irreversible action"
- "audit log"
- "agent safety rails"

## Quick Example

> See `safety-guard-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent bypassing safety checks | Risk assessment returning wrong level | Audit the risk classification logic; add tests for edge cases like cascade deletes and bulk operations |
| Too many confirmations slowing down users | Every operation classified as high risk | Calibrate risk levels; read operations and single-record creates should not require confirmation |
| Audit log growing too large | Logging all operations including reads | Log only write operations (CREATE, UPDATE, DELETE); use log rotation with minimum 90-day retention |
| Cannot reverse a destructive operation | No before-state captured in audit | Always capture `before` state in the audit entry before executing; enables point-in-time recovery |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
