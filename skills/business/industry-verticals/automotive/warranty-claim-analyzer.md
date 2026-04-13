---
name: "warranty-claim-analyzer"
slug: "warranty-claim-analyzer"
description: "Analyze automotive warranty claims against coverage policies, validate eligibility, and generate supplier chargeback requests. Use when user says \"warranty claim\", \"claim eligibility\", \"supplier chargeback\", \"recall analysis\", \"warranty rejection\", or \"warranty recovery\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "automotive"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "automotive", "warranty", "claims"]
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


# Warranty Claim Analyzer

Warranty claims are a major cost center for automotive manufacturers and dealers. Manual claim processing is slow, inconsistent, and leaves money on the table through both missed supplier recoveries and improper denials. This agent standardizes and accelerates the entire warranty lifecycle.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-AUTO-003 |
| Name | warranty-claim-analyzer |
| Category | Industry Vertical / Automotive |
| Module | D365 SCM, Accounts Payable, Dataverse |
| Complexity | Intermediate |
| Prerequisites | Warranty policy table in Dataverse (Niyam pattern), supplier agreements, vehicle service history |

## Description

The agent validates claim eligibility, assigns failure codes, calculates recoverable amounts from suppliers, and generates analytics to identify systemic quality issues. Works across dealer warranty claims submitted to OEM and OEM claims submitted to component suppliers.

## Triggers

- "warranty claim"
- "claim eligibility"
- "supplier chargeback"
- "recall analysis"
- "warranty rejection"
- "warranty recovery"
- "failure code"
- "warranty cost analysis"
- "claim submission"

## Core Tasks

### 1. Validate Claim Eligibility
```text
GIVEN a technician submits a warranty claim for a repair
WHEN the agent evaluates eligibility
THEN check coverage period (months and mileage from vehicle delivery date)
AND verify the failed component is covered under the applicable warranty type
AND confirm required maintenance intervals were completed for powertrain claims
AND apply exclusion rules (wear items, accident damage, neglect indicators)
AND return ELIGIBLE, INELIGIBLE, or NEEDS_REVIEW with specific reason
```

### 2. Auto-Code Failure
```text
GIVEN a technician's repair description is available
WHEN the agent reads the description text
THEN match to Fault Code from OEM code library using semantic matching
AND assign Cause Code (manufacturing defect, design defect, customer misuse, etc.)
AND assign Corrective Action Code matching the repair performed
AND flag any code combination that has historically high rejection rate
```

### 3. Initiate Supplier Recovery
```text
GIVEN a warranty claim is confirmed as manufacturing or component defect
WHEN the agent identifies the responsible supplier
THEN trace the failed component to the supplier of record at vehicle assembly date (from BOM snapshot)
AND verify supplier warranty agreement exists in Dataverse
AND calculate recoverable amount (parts + labor per agreement terms)
AND generate chargeback request packet with supporting documentation
AND route to warranty administrator for review before submission
```

### 4. Generate Warranty Analytics
```text
GIVEN end-of-month warranty review is requested
WHEN the agent aggregates claim data
THEN calculate claims by component family with trend vs prior period
AND calculate warranty cost per unit produced (CPPU)
AND calculate supplier recovery rate by supplier
AND flag repair facility anomalies (same repair, same tech, high frequency)
AND identify potential recall candidates where failure rate exceeds threshold
```

## Claim Eligibility Matrix

| Warranty Type | Coverage Period | Covered Components | Key Exclusions |
|--------------|----------------|-------------------|----------------|
| Bumper-to-Bumper | 36 months / 36K miles | All components | Wear items, accident damage |
| Powertrain | 60 months / 60K miles | Engine, transmission, drivetrain | Maintenance neglect |
| Emissions | 96 months / 80K miles | Emissions control systems | Modifications |
| Corrosion | 60 months, unlimited miles | Body panels (perforation) | Surface rust, damage |
| Roadside Assistance | 36 months / 36K miles | Towing, battery, lockout | None |

## Failure Code Structure

Each warranty repair requires three codes:

**Fault Code (What failed):** Identifies the component and failure mode
Example: FC-2341 = Transmission, slipping under load

**Cause Code (Why it failed):** Root cause classification
- MFG = Manufacturing defect
- DES = Design defect
- MAT = Material defect
- CUS = Customer misuse
- WER = Normal wear

**Corrective Action Code (What was done):** Repair performed
Example: CA-112 = Replaced assembly

The OEM uses these codes for both statistical tracking and determining supplier responsibility. Wrong codes result in claim rejection or missed supplier recovery.

## Supplier Recovery Process

```
Step 1: Identify failed component
  Agent reads repair order > part number replaced

Step 2: Trace to assembly BOM
  Agent queries BOM snapshot at vehicle production date
  Identifies supplier of record for that part number

Step 3: Check supplier warranty agreement
  Agent reads SupplierWarrantyAgreement table in Dataverse
  Confirms coverage type, recoverable rates, submission requirements

Step 4: Calculate recovery amount
  Parts: Dealer cost of failed component
  Labor: Hours claimed x rate per supplier agreement
  Consequential: Any agreed consequential damage rates

Step 5: Generate chargeback packet
  Repair order (with photos if available)
  Failure analysis report
  BOM traceability documentation
  Supplier agreement reference

Step 6: Submit and track
  Log submission date, reference number
  Flag if no response in 30 days
  Track approval/rejection with reason code
```

## Common Scenarios

### Scenario 1: High-Volume Failure Pattern
**User:** "We're seeing a lot of transmission claims this quarter — is this a recall candidate?"
**Resolution:**
1. Pull all transmission claims in the period by Fault Code
2. Calculate failure rate per 1,000 vehicles in service (VIS)
3. Compare to OEM recall trigger threshold (from Dataverse policy table)
4. Identify if failure concentrated in specific production date range or plant
5. If threshold exceeded, generate NHTSA-format preliminary investigation report

### Scenario 2: Claim Denied by OEM
**User:** "OEM rejected 15 claims this month — what went wrong?"
**Resolution:**
1. Pull all rejected claims with rejection reason codes
2. Categorize rejections: wrong failure codes, outside coverage, missing documentation, excluded component
3. Identify which service advisors or technicians have the highest rejection rates
4. Generate re-submission packets for claims rejected due to coding errors (not coverage)
5. Flag coaching needed for specific technicians or code categories

### Scenario 3: Year-End Supplier Recovery Audit
**User:** "What did we leave on the table in supplier chargebacks this year?"
**Resolution:**
1. Pull all warranty claims where Cause Code = MFG, DES, or MAT
2. Cross-reference against submitted chargebacks
3. Identify claims with no corresponding chargeback submission
4. Calculate uncaptured recovery value
5. Prioritize for retroactive submission within supplier agreement window

## Troubleshooting Guide

### Eligibility Check Returning Incorrect Coverage Period
**Cause:** Vehicle delivery date not captured correctly, or warranty start date set to production date instead of retail delivery date
**Fix:** Verify WarrantyStartDate field on vehicle record; for pre-owned sales, check if warranty transferred correctly per transfer policy

### Failure Code Suggestions Not Matching OEM Code Library
**Cause:** OEM may have updated code library after last Dataverse sync; semantic matching model not trained on new codes
**Fix:** Refresh OEM code library in Dataverse; review and update matching keywords for new failure mode descriptions

### Supplier Not Found in BOM Snapshot
**Cause:** BOM snapshot not captured at vehicle production date, or component sourced through spot buy without proper supplier assignment
**Fix:** Implement automated BOM snapshot capture at production order completion; for spot buys, require supplier assignment before goods receipt

### Chargeback Submission Failing Supplier Portal Validation
**Cause:** Supplier agreement specifies required fields or documentation that the agent packet does not include
**Fix:** Review supplier agreement terms per supplier; update chargeback packet template per supplier requirements in Dataverse

### Analytics Showing Duplicate Claims
**Cause:** Same repair order submitted multiple times (re-submission after rejection) counted as separate claims
**Fix:** Deduplicate by original repair order number, not claim submission number; track re-submissions as status updates on original claim

## Related Skills

- `automotive-dealer-ops` (IV-AUTO-001) - Dealer operations context
- `vin-configuration-validator` (IV-AUTO-002) - Pre-production validation that prevents some warranty issues

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
