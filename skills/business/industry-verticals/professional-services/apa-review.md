---
name: apa-review
description: Mercedes-Benz MBTI Angebots-Prufungs Agent (APA) for validating D365 project quotations against pricing policies, discount thresholds, and margin requirements. Use when user says "quote review", "APA review", "Angebots-Prufungs", "proposal validation", "discount approval", or "quotation margin check".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, professional-services, quote-review, mercedes-benz]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# APA Review (Angebots-Prufungs Agent)

The Angebots-Prufungs Agent (APA) is the Mercedes-Benz MBTI quote validation agent. It validates project quotations created in D365 Project Operations against pricing policies, discount thresholds, margin requirements, and resource availability before quotes are submitted to customers. Invalid quotes are caught before submission, not after the customer accepts.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-PS-001 |
| Name | apa-review |
| Category | Industry Vertical / Professional Services |
| Module | D365 Project Operations, Dataverse |
| Complexity | Advanced |
| Prerequisites | Pricing policy table in Dataverse (Niyam pattern), D365 Project Operations quotation module, resource skill catalog |

## Description

The APA validates every quotation against a set of rules stored in Dataverse policy tables. Rules cover financial thresholds (margin, discount level, billing rates), resource checks (availability, skill fit, utilization impact), and scope risk flags. Output is a structured approval/rejection decision with specific findings and routing to the correct approver level.

## Triggers

- "quote review"
- "APA review"
- "Angebots-Prufungs"
- "proposal validation"
- "discount approval"
- "quotation margin check"
- "review my quote"
- "validate quotation"
- "margin approval"

## Core Tasks

### 1. Validate Financial Terms
```text
GIVEN a project quotation is submitted for review
WHEN the agent evaluates financial compliance
THEN calculate gross margin: (Revenue - Cost) / Revenue
AND compare margin to minimum threshold in Dataverse by project type
AND verify all billing rates are within approved range per role
AND check discount percentage against authorization limits
AND flag currency risk for international projects (has risk buffer been applied?)
AND return PASS, FLAG, or BLOCK for each financial check
```

### 2. Validate Resource Availability
```text
GIVEN resource assignments are named in the quotation
WHEN the agent checks resource feasibility
THEN query D365 resource bookings for each named resource in the proposed timeline
AND calculate utilization impact (does this project push resource over threshold?)
AND verify each resource has required skills/certifications for this project type
AND flag key person risk if project depends on fewer than 2 resources for critical phases
AND identify potential alternatives if named resources are unavailable
```

### 3. Assess Scope Risk
```text
GIVEN statement of work or scope description is provided
WHEN the agent analyzes scope language
THEN flag open-ended deliverable language without quantified outputs
AND identify missing acceptance criteria sections
AND flag client dependency items without escalation provisions
AND check if technology stack includes components with limited firm experience
AND assess timeline compression risk (inadequate buffer for rework and review cycles)
AND return risk rating: LOW, MEDIUM, or HIGH with specific findings
```

### 4. Route for Approval
```text
GIVEN all validation checks are complete
WHEN the agent determines the approval path
THEN apply routing rules from Dataverse policy table
AND identify the required approval level based on margin, discount, and revenue amount
AND notify the appropriate approver with the validation summary
AND set approval deadline per policy (e.g., 48 hours for standard, 24 hours for urgent)
AND escalate to next level if approval not received by deadline
```

## Validation Policy Table (Niyam Pattern)

Stored in Dataverse `apa_policy` table with effective date versioning:

| Check | Threshold | Action |
|-------|-----------|--------|
| Gross margin minimum | 20% (standard), 15% (strategic) | Block if below 15% |
| Discount maximum without approval | 10% | Flag for Practice Lead |
| Discount maximum with Practice Lead | 20% | Flag for Managing Director |
| Revenue threshold for CFO review | Per policy | Always route to CFO |
| Billing rate variance | +/- 10% from rate card | Flag for approval |
| Resource utilization ceiling | 90% in any given month | Flag for resourcing review |
| Key person risk threshold | Less than 2 senior resources | Flag as risk |

## Approval Routing Matrix

```
All checks pass, margin > 25%           → Auto-approve (no human required)
Any check flagged, margin 20-25%        → Route to Practice Lead
Margin 15-20% OR multiple flags         → Route to Managing Director
Margin < 15%                            → Block; requires exceptional approval + CFO
Revenue > threshold (per policy)        → Always route to CFO regardless of margin
Scope risk = HIGH                       → Route to Risk Committee
```

## Output Format

```
APA VALIDATION REPORT
Quote: Q-2026-0847
Project: D365 Finance Implementation Phase 2
Client: Contoso Automotive GmbH
Submitted by: M. Bauer | Sales Engineer
Date: April 10, 2026

DECISION: APPROVED — Route to Practice Lead

Financial Checks:
  Gross Margin: 23.4%  PASS (minimum: 20%)
  Billing Rates: All within approved range  PASS
  Discount: 8%  PASS (maximum without approval: 10%)
  Currency risk buffer: EUR/USD buffer included  PASS

Resource Checks:
  T. Hoffmann (Senior Architect): Available  PASS
  K. Mueller (Lead Consultant): 87% utilization in Month 2  FLAG
    Recommendation: Identify backup resource or shift timeline by 2 weeks

Scope Review:
  Risk Rating: MEDIUM
  FLAG: SOW Section 3.2 — deliverable language open-ended ("provide recommendations")
    Recommendation: Add "up to 3 written recommendations with executive summary"
  FLAG: Timeline assumes client data is clean; no contingency for data cleansing
    Recommendation: Add 5-day data preparation contingency to project schedule

Approval Required: Practice Lead (margin 20-25%, no blocking issues)
Approval Deadline: April 12, 2026 17:00 CET
```

## Integration with D365 Project Operations

| D365 Entity | What Agent Reads |
|-------------|-----------------|
| ProjQuotationTable | Quote header: total revenue, discount, currency |
| ProjQuotationSalesLine | Line items: roles, hours, billing rates |
| BookableResourceBooking | Resource schedule and availability |
| HcmWorkerSkillEntity | Resource skills and certifications |
| ProjQuotationEntity | Historical margins for similar projects |
| Dataverse apa_policy | Thresholds, routing rules, approval levels |

## Common Scenarios

### Scenario 1: Price War Situation
**User:** "We need to drop the margin to 12% to win this deal — can you approve it?"
**Resolution:**
1. Agent flags: margin 12% is below 15% hard floor
2. Auto-block issued; cannot auto-approve or route to standard approvers
3. Agent generates exceptional approval request package for CFO with:
   - Strategic value of the account
   - 3-year revenue projection if deal is won
   - Comparison to historical margins for this client
4. CFO has the data to make an informed exception decision

### Scenario 2: Rush Quote Before Month-End
**User:** "We need to get this quote approved by end of day — it's month-end"
**Resolution:**
1. Agent runs all validation checks (takes under 2 minutes vs manual review of 2+ hours)
2. Identifies one issue: one resource double-booked in month 3
3. Flags with specific alternative resource who is available and skill-matched
4. Routes to Practice Lead with urgency flag set
5. Practice Lead reviews the clear, structured summary and approves in 15 minutes

### Scenario 3: Systematic Rate Card Drift
**User:** "Are our quotes consistently pricing below the rate card?"
**Resolution:**
1. Agent pulls all quotes submitted in last 90 days
2. Calculates rate card variance per role per quote
3. Identifies that Senior Consultant rates are on average 8% below card
4. Traces to a rate card not updated in D365 after the annual rate increase
5. Flags for rate card update; estimates revenue leakage from the discrepancy

## Troubleshooting Guide

### Agent Not Finding Quotation in D365
**Cause:** Quote created in draft status; agent only reads quotes in "In Review" or "Submitted" status
**Fix:** Update D365 workflow to transition quote to "In Review" status when submitted for APA review; or expand agent query to include draft status

### Margin Calculation Differs from Sales Team's Calculation
**Cause:** Agent calculating margin on project cost (including overhead allocation); sales team calculating on direct cost only
**Fix:** Align margin definition in Dataverse policy table; specify whether margin is calculated on fully-loaded cost or direct cost; agent must use the same basis as the policy threshold

### Resource Availability Check Returning Incorrect Results
**Cause:** Tentative bookings not included in availability calculation; agent only seeing hard bookings
**Fix:** Update resource query to include tentative bookings with a utilization weight (e.g., tentative = 50% capacity consumed); align with project resourcing policy

### Approval Routing to Wrong Level
**Cause:** Revenue threshold for CFO review not updated after policy change; old threshold in Dataverse
**Fix:** Implement effective-date versioning in apa_policy table; agent always selects the policy row with the latest effective date before or on the quote submission date

### Scope Risk Flag Not Triggering on Known Risk Phrases
**Cause:** Semantic matching model not covering industry-specific risk language (e.g., "to be determined by client" or "mutually agreed milestones")
**Fix:** Maintain a domain-specific risk phrase library in Dataverse; update quarterly with new patterns identified from project post-mortems

## Related Skills

- `utilization-optimizer` (IV-PS-002) - Resource utilization management that feeds availability data to APA

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Rewritten as Mercedes-Benz MBTI APA agent; improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
