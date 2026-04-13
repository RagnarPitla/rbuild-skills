---
name: "d365-solution-builder"
slug: "d365-solution-builder"
description: "End-to-end D365 F&O and Power Platform solution design from business requirements — module selection, integration architecture (MCP, OData, Power Automate), security model, data migration strategy, and go-live checklist. Use when user says \"design a D365 solution\", \"build a D365 agent solution\", \"D365 implementation architecture\", \"what modules do I need in D365\", \"D365 integration design\", \"D365 security model\", \"D365 go-live checklist\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "d365", "solution-design", "architecture"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
---


# D365 Solution Builder

Build complete D365 F&O and Power Platform solutions from requirements. This skill covers the full architecture: scope definition, module selection, integration design, security model, data migration strategy, agent architecture, and go-live readiness.

## Solution Design Framework

Every D365 solution follows the same five-layer design:

```
Layer 1: Business Requirements
    ↓
Layer 2: Module and Feature Selection (what D365 capabilities solve the problem)
    ↓
Layer 3: Integration Architecture (how D365 connects to the rest of the enterprise)
    ↓
Layer 4: Security Model (who can see and do what)
    ↓
Layer 5: Data Strategy (migration, ongoing data quality, reporting)
```

Skip a layer and you will rebuild it later — usually under pressure.

## Layer 1: Scope Definition

Before any architecture work, lock down the scope. Use the D365 business process hierarchy:

| Process | Module | Scope Decision |
|---|---|---|
| Record to Report (R2R) | Finance → General Ledger | Required for all implementations |
| Source to Pay (S2P) | Procurement and Sourcing, Accounts Payable | Required if purchasing from vendors |
| Order to Cash (O2C) | Sales and Marketing, Accounts Receivable | Required if selling to customers |
| Plan to Produce (P2P) | Production Control, Master Planning | Required if manufacturing |
| Acquire to Dispose (A2D) | Fixed Assets | Required if tracking assets |
| Inventory to Deliver (I2D) | Warehouse Management, Transportation | Required if managing complex warehousing |
| Hire to Retire (H2R) | Human Resources | Optional — often separate HRIS |
| Project to Invoice | Project Management and Accounting | Required if project-based billing |

**Scope rule:** Be explicit about what is in scope AND what is out of scope. Out-of-scope decisions are as important as in-scope ones.

## Layer 2: Module Selection

### Finance Module Stack
Always required:
- **General Ledger** — chart of accounts, journals, period close
- **Accounts Payable** — vendor invoices, payment runs
- **Accounts Receivable** — customer invoices, cash application
- **Cash and Bank Management** — bank accounts, reconciliation

Optional based on scope:
- **Budgeting** — budget vs actual tracking
- **Fixed Assets** — depreciation, disposals
- **Tax** — sales tax, VAT, withholding tax

### Supply Chain Module Stack
For procurement and inventory:
- **Procurement and Sourcing** — purchase orders, vendor management
- **Inventory Management** — stock tracking, adjustments
- **Warehouse Management (WMS)** — advanced wave/pick/pack (only if needed)
- **Transportation Management (TMS)** — carrier management, freight (only if needed)

For manufacturing:
- **Production Control** — production orders, shop floor
- **Master Planning** — MRP, demand planning
- **Quality Management** — inspections, non-conformance

### Agent-Specific Stack (Niyam Pattern)
For building policy-driven agents:
- **Dataverse** — policy tables (table prefix: `cr023_` + domain)
- **Copilot Studio** — agent orchestration
- **Power Automate** — write-back flows requiring approval
- **D365 F&O MCP Server** — OData-based tool exposure to agents

## Layer 3: Integration Architecture

D365 F&O connects to the enterprise via three primary patterns:

### Pattern 1: OData / MCP (Read-heavy agent access)
Best for: AI agents querying D365 for decisions and recommendations

```
Agent (Copilot Studio)
    ↓
D365 F&O MCP Server
    ↓
D365 OData endpoint (/data/EntityName)
    ↓
D365 Data Entities
```

Key OData patterns:
```
GET /data/SalesOrderHeadersV2?$filter=...&$select=...&$expand=...
GET /data/VendorInvoiceHeadersV2?$filter=ApprovalStatus eq 'Pending'
POST /data/LedgerJournalHeaderEntity (for write-backs)
```

### Pattern 2: Power Automate (Write-backs with approval)
Best for: Actions that change D365 data and require human approval

```
Agent recommends action
    ↓
Power Automate flow triggered (approval step)
    ↓
Human approves in Teams / email
    ↓
Power Automate calls D365 via connector or OData
    ↓
D365 updated
```

### Pattern 3: Azure Logic Apps / Service Bus (High-volume integration)
Best for: ERP-to-ERP integrations, high-volume data sync, event-driven processing

```
Source system event
    ↓
Azure Service Bus (message queue)
    ↓
Azure Logic App / Function
    ↓
D365 Data Management API (DIXF) or OData batch
    ↓
D365 F&O
```

### Integration Architecture Checklist
- [ ] Identified all external systems that need to exchange data with D365
- [ ] Defined direction (inbound, outbound, bidirectional) for each integration
- [ ] Selected integration pattern for each (OData/MCP, Power Automate, Service Bus)
- [ ] Defined error handling and retry logic for each integration
- [ ] Documented data volume per integration (records/day, peak load)

## Layer 4: Security Model

D365 F&O uses a role-based access control model:

```
User
    ↓ assigned to
Role (e.g., "Accounts payable clerk")
    ↓ contains
Duties (e.g., "Maintain vendor invoices")
    ↓ contains
Privileges (e.g., "View VendInvoiceInfoTable", "Create VendInvoiceInfoTable")
    ↓ grants access to
Forms, Data entities, Reports
```

### Security Design Steps

1. **Identify user personas** — who uses the system and what do they do?
2. **Map personas to standard D365 roles** — D365 ships with 100+ pre-built roles
3. **Identify gaps** — what do standard roles not cover?
4. **Create custom roles** — extend or combine standard roles for gaps
5. **Apply data security (legal entity)** — which legal entities can each user access?
6. **Apply row-level security (if needed)** — Organizational hierarchy, dimension-based filters

### Standard Role Examples
| Role | Module | What They Can Do |
|---|---|---|
| Accounts payable clerk | AP | Enter and process vendor invoices |
| Accounts payable manager | AP | Approve invoices, run payment runs |
| Controller | GL | Post journals, close periods |
| Purchasing agent | Procurement | Create and confirm purchase orders |
| Warehouse worker | WMS | Complete picks and pack operations |

### Agent Security
For Copilot Studio agents accessing D365 via MCP:
- Create a dedicated service account with minimum required permissions
- Assign only the data entity privileges the agent needs (read-only for read operations)
- Audit agent access via D365 security logs monthly

## Layer 5: Data Strategy

### Migration Strategy
Follow the migration dependency order:
```
1. Reference data (payment terms, currencies, UOM, tax codes)
2. Master data (customers, vendors, items, chart of accounts)
3. Opening balances (GL, AR, AP, inventory)
4. Open transactions (open POs, open sales orders, open invoices)
```

See the `d365-data-migration` skill for detailed entity mapping and validation patterns.

### Ongoing Data Quality
- **Duplicate detection rules** — prevent duplicate customers and vendors
- **Data validation workflows** — approve new master data before activation
- **Periodic reconciliation** — monthly subledger-to-GL reconciliation
- **Archive strategy** — when to close old transactions vs keep live

## Agent Architecture (Niyam Pattern)

For agent-driven D365 solutions, use the Niyam pattern:

```
Copilot Studio Agent
    ↓
Reads policy from Dataverse policy tables (cr023_* prefix)
    ↓
Queries D365 F&O via MCP Server
    ↓
Applies policy rules to D365 data
    ↓
Recommends action or escalates
    ↓
Write-back via Power Automate (if action approved)
```

**Dataverse policy table structure:**
| Field | Type | Purpose |
|---|---|---|
| `cr023_policyname` | Text | Human-readable policy name |
| `cr023_condition` | Text | When this policy applies |
| `cr023_action` | Text | What the agent should do |
| `cr023_threshold` | Decimal | Numeric threshold (e.g., approval limit) |
| `cr023_active` | Boolean | Is this policy currently enforced? |

## Core Tasks

### 1. Requirements to Module Map
```text
GIVEN a list of business requirements
WHEN skill maps to D365
THEN identify which D365 module handles each requirement
AND flag requirements that have no standard D365 coverage (need customization or ISV)
AND produce: module selection matrix with scope decision for each
```

### 2. Integration Architecture Design
```text
GIVEN a list of external systems to integrate
WHEN skill designs integration
THEN recommend pattern (OData/MCP, Power Automate, Service Bus) for each
AND define direction and data volume
AND identify which D365 data entities serve each integration
AND produce: integration architecture diagram description and entity list
```

### 3. Go-Live Readiness Assessment
```text
GIVEN a D365 implementation nearing go-live
WHEN skill assesses readiness
THEN check: all required configuration complete
AND check: number sequences configured and tested
AND check: security roles assigned and tested by persona
AND check: data migration completed and validated
AND check: integration tests passed
AND check: user acceptance testing sign-off obtained
AND return: go/no-go assessment with open items
```

## Go-Live Checklist

### Configuration
- [ ] All legal entities configured
- [ ] Chart of accounts finalized and account structures set
- [ ] Fiscal calendar open for go-live period
- [ ] Number sequences configured for all document types
- [ ] Posting profiles configured for all customer/vendor/item groups
- [ ] Payment terms and methods configured

### Data Migration
- [ ] Reference data imported and validated
- [ ] Master data imported and validated (customer count matches, vendor count matches)
- [ ] Opening balances imported and reconciled to source
- [ ] Open transactions imported and validated

### Integration
- [ ] All integrations tested end-to-end in production environment
- [ ] Error handling tested (what happens when source system sends bad data)
- [ ] Monitoring alerts configured

### Security
- [ ] All user accounts created and roles assigned
- [ ] Security tested by each user persona (can they access what they need? are they blocked from what they shouldn't see?)
- [ ] Service accounts for integrations and agents created with minimum permissions

### Training and Cutover
- [ ] End user training completed
- [ ] Cutover runbook documented and rehearsed
- [ ] Rollback plan documented
- [ ] Hypercare support plan in place (first 30 days post go-live)

## Trigger Phrases

- "design a D365 solution"
- "build a D365 agent solution"
- "D365 implementation architecture"
- "what modules do I need in D365"
- "D365 integration design"
- "D365 security model"
- "D365 go-live checklist"
- "D365 solution blueprint"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Scope creep after architecture is locked | Requirements were not fully captured before design started | Hold a formal scope change review; assess impact on timeline, cost, and dependencies before accepting new scope |
| Integration fails at go-live | Integration was only tested in UAT, not in production with real data volumes | Always integration-test in the production environment with a subset of real data before go-live |
| Users cannot complete their job in D365 | Security roles were designed by module, not by business process | Map security to end-to-end process flows, not just individual forms; test each persona by running through their full daily workflow |
| Opening balances do not reconcile to source | Migration was run before all configuration (posting profiles, dimensions) was finalized | Complete all configuration before running the final mock cutover; never migrate data before configuration is signed off |
| Agent makes wrong decisions | Policy tables in Dataverse are incomplete or have overlapping conditions | Review and deduplicate policy entries; add explicit priority ranking to resolve conflicts; test agent with known edge cases |
| Custom workflow approvals not triggering | Workflow is configured but not activated, or the triggering condition is wrong | Navigate to the workflow configuration form; check the activation status and condition threshold; re-activate after changes |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — full solution design framework, integration patterns, Niyam pattern, go-live checklist, security model |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
