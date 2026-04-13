---
name: "quality-nonconformance"
slug: "quality-nonconformance"
description: "NCR workflow, root cause analysis (5-Why, fishbone), corrective and preventive actions (CAPA), and D365 quality management integration. Use when user says \"nonconformance report\", \"NCR\", \"quality hold\", \"root cause analysis\", \"CAPA\", \"corrective action\", \"5-Why\", \"quality order\", \"inspection failure\"."
tab: "business"
domain: "supply-chain"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "supply-chain", "quality", "ncr"]
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


# Quality Nonconformance

Quality nonconformances are not just a quality department problem. They tie up inventory, delay production, create customer risk, and consume significant time in investigation. The NCR process is high-value for AI agents because it is repetitive, documentation-heavy, and follows a structured decision tree.

## NCR Workflow: Detection to Close

### Stage 1: Detection
Nonconformances are detected at multiple points:
- Incoming inspection (supplier material fails receiving inspection)
- In-process inspection (defect found during production)
- Final inspection (finished product fails quality check)
- Customer complaint (defect reached the customer)
- Audit finding (system or process nonconformance)

### Stage 2: Containment
Before investigation: stop the bleeding.

1. Place affected material on quality hold in D365
2. Identify all potentially affected inventory (same lot, same supplier, same production run)
3. Prevent further use/shipment of affected items
4. If customer-shipped: assess recall/field action requirement

D365 quality hold:
```
Inventory management > Inquiries > Quality management > Nonconformances
Create nonconformance > Select item, quantity, problem type
Set status: Open
System blocks the inventory from use
```

### Stage 3: Classification
Classify the nonconformance to route it correctly:

| Type | Description | D365 Type |
|------|-------------|-----------|
| Incoming | Supplier material issue | Vendor |
| In-process | Discovered during manufacturing | Production |
| Finished goods | Found at final inspection | Sales order |
| Customer return | Defect reported by customer | Customer |
| Internal audit | Process or system finding | Internal |

**Problem type** drives the investigation owner. Vendor nonconformances go to procurement. Production issues go to manufacturing engineering.

### Stage 4: Root Cause Analysis

#### 5-Why Analysis
Start with the symptom and ask "Why?" five times to reach the systemic root cause.

```
Problem: Bracket dimension out of tolerance

Why 1: Why was the dimension out of tolerance?
  - CNC machine produced parts outside spec

Why 2: Why did the CNC machine produce out-of-spec parts?
  - Tool was worn beyond acceptable limits

Why 3: Why was the tool used beyond acceptable limits?
  - Tool change interval was overdue

Why 4: Why was the tool change interval overdue?
  - Preventive maintenance schedule was not being followed

Why 5: Why was the PM schedule not being followed?
  - PM system was not integrated with production schedule; operators unaware

Root Cause: PM system not integrated with production planning
```

**5-Why rules:**
- Ask "Why?" not "Who?" — focus on systems, not blame
- Each answer becomes the input to the next "Why?"
- Stop when you reach a cause that is systemic and actionable
- Verify each step: if you eliminated this cause, would the problem go away?

#### Fishbone Diagram (Ishikawa)
Use when the root cause is not obvious and multiple causes may contribute. Categorize potential causes into:

| Category | Examples |
|----------|---------|
| Man (People) | Training gap, error in procedure, fatigue |
| Machine | Worn tooling, calibration drift, maintenance |
| Method | Wrong procedure, process step skipped |
| Material | Wrong specification, supplier variability |
| Measurement | Gauge error, measurement inconsistency |
| Environment | Temperature, humidity, vibration |

Brainstorm causes in each category. Use data to identify which cause(s) actually explain the defect.

### Stage 5: Corrective and Preventive Actions (CAPA)

#### Corrective Action (CA)
Addresses the specific root cause to prevent recurrence of this nonconformance.

| Field | Description |
|-------|-------------|
| Action description | Specific change to be made |
| Owner | Person responsible for implementation |
| Due date | When it will be completed |
| Verification method | How you will confirm it worked |
| Verification date | When you will check effectiveness |

#### Preventive Action (PA)
Extends the learning to prevent similar issues from occurring elsewhere.

Example: If a tooling PM failure caused a quality issue on Line 1, the preventive action is to audit and fix the PM process on Lines 2, 3, and 4 before they also fail.

### Stage 6: Effectiveness Verification
After the CAPA is implemented, verify it worked:
- Run X production units / receive X supplier shipments
- Measure the same characteristic that failed
- If defect rate is back to acceptable: close the NCR
- If defect recurs: reopen and escalate root cause analysis

## D365 Quality Management

### Quality Orders
D365 quality orders trigger inspection when certain conditions are met:
- Receiving a purchase order from a specific vendor
- Completing a production order
- After specific inventory transactions

Quality order setup:
```
Inventory management > Setup > Quality management > Quality associations

Specify:
- Reference type (Purchase order, Production order, etc.)
- Item sampling (every receipt? % of quantity?)
- Test group (what tests to perform)
- Quality specifications (acceptable ranges)
```

### Nonconformance Records in D365
```
Inventory management > Periodic tasks > Quality management > Nonconformances

Fields:
- Nonconformance type (Vendor, Production, Customer, etc.)
- Problem type
- Item, quantity, site, warehouse
- Diagnostic: what was found
- Tag number: physical label for the held inventory
```

### Corrective Actions in D365
Link CAPA to the nonconformance record:
```
Nonconformance record > Related operations > Corrections
Add correction action:
- Correction type
- Responsible worker
- Notes
- Due date
```

## Supplier Nonconformance Management

Track supplier quality trends to drive sourcing decisions:

| Metric | Formula | Target |
|--------|---------|--------|
| Supplier defect rate (PPM) | (Defective units / Total units received) x 1,000,000 | < 1,000 PPM for critical |
| Incoming rejection rate | Rejected lots / Total lots received | < 2% |
| CAPA response time | Days from NCR to CAPA submitted | < 5 business days |
| CAPA effectiveness rate | CAs verified effective / Total CAs | > 90% |

Store supplier quality data in Dataverse (`cr023_supplier_quality`) for agent access.

## Disposition Decisions

When material is nonconforming, a disposition decision is required:

| Disposition | When to Use | D365 Action |
|-------------|-------------|-------------|
| Accept as-is (use as is) | Defect does not affect function/safety | Release from hold |
| Rework | Defect can be corrected | Create rework order |
| Return to vendor | Supplier responsible for defect | Create RMA / return PO |
| Scrap | Material cannot be recovered | Scrap journal in D365 |
| Accept with deviation | Non-critical deviation from spec | Document and release |

Disposition must be approved by the right level of authority (quality engineer, quality manager, or customer, depending on contract requirements).

## Trigger Phrases

- "nonconformance report"
- "NCR"
- "quality hold"
- "root cause analysis"
- "CAPA"
- "corrective action"
- "5-Why analysis"
- "inspection failure"

## Quick Example

> See `quality-nonconformance-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Quality holds not blocking material from being picked or shipped | Quality hold status not linked to inventory blocking or security permission allows override | Verify that the nonconformance record correctly blocks inventory in D365; check that warehouse workers do not have permission to override holds; confirm hold is applied to correct site/warehouse/location |
| Root cause analysis cycling without finding real cause | 5-Why stopping at symptoms rather than systemic causes | Push each "Why" to a systemic level: not "the part was wrong" but "why was the wrong part allowed to be shipped by the supplier's quality system?" — keep going until you reach a process or system failure |
| CAPA actions not being completed on time | No visibility into overdue actions across the organization | Build a Power Automate flow that checks CAPA due dates daily and sends reminders to owners; create a Dataverse view of overdue CAPAs surfaced in the agent |
| Recurring nonconformances on the same item or supplier | CAPAs are addressing symptoms, not root causes; or effectiveness verification skipped | Require effectiveness verification before closing NCRs; if same defect recurs, escalate to supplier corrective action request (SCAR) with formal response requirement |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
