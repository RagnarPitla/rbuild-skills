---
name: public-sector-compliance-agent
description: Continuous compliance monitoring for government and public sector covering procurement regulations, fund accounting rules, and audit trail generation. Use when user says "government compliance", "procurement compliance", "vendor debarment", "public sector audit", "fund accounting compliance", or "competitive bidding".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, public-sector, compliance, procurement]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Public Sector Compliance Agent

Government organizations operate under strict procurement rules, fund accounting requirements, and audit obligations that commercial entities do not face. This agent monitors compliance continuously so issues are caught before the audit, not during it.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-PS-002 |
| Name | public-sector-compliance-agent |
| Category | Industry Vertical / Public Sector |
| Module | D365 Finance (Public Sector), Procurement, Accounts Payable |
| Complexity | Advanced |
| Prerequisites | D365 Public Sector configured, procurement rules in Dataverse, vendor master with compliance flags |

## Description

Covers three compliance domains: procurement compliance (bidding thresholds, debarment checks, local preference), fund accounting compliance (appropriation verification, grant restrictions, carry-forward), and audit preparation (continuous audit file, documentation completeness, auditor response support).

## Triggers

- "government compliance"
- "procurement compliance"
- "vendor debarment"
- "public sector audit"
- "fund accounting compliance"
- "competitive bidding"
- "sole source justification"
- "grant compliance"
- "audit preparation"
- "appropriation authority"

## Core Tasks

### 1. Monitor Procurement Compliance
```text
GIVEN a purchase order or contract is submitted
WHEN the agent runs compliance checks
THEN compare PO total to competitive bidding threshold in Dataverse (by jurisdiction)
AND flag purchases that require formal bid process but lack bid documentation
AND check vendor against federal SAM.gov and state debarment lists
AND verify any sole-source justification is documented and within policy limits
AND check local preference requirements are met or documented exception exists
AND return COMPLIANT, REQUIRES_DOCUMENTATION, or BLOCKED with specific finding
```

### 2. Monitor Fund Accounting Compliance
```text
GIVEN expenditure transactions are posted
WHEN the agent validates fund compliance
THEN verify each transaction is charged to an authorized appropriation
AND check that grant expenditures match the approved spending plan categories
AND flag transactions that appear to cross-fund appropriations
AND verify that restricted funds are not spent on unauthorized purposes
AND track cumulative grant spending vs grant period expenditure plan
```

### 3. Maintain Continuous Audit File
```text
GIVEN transactions are processed continuously
WHEN the agent maintains audit readiness
THEN link each transaction to its supporting documentation in D365
AND flag transactions missing required approvals or supporting documents
AND run weekly completeness check: bid tabulation, award justification, contract, delivery confirmation
AND maintain transaction sample population for auditor selection
AND generate documentation completeness score by department
```

### 4. Respond to Auditor Inquiries
```text
GIVEN an auditor submits a specific question or requests documentation
WHEN the agent processes the inquiry
THEN search for all relevant transactions matching the auditor's criteria
AND pull supporting documentation links for each transaction
AND generate a structured response with evidence package
AND flag any transactions in the auditor's sample that have documentation gaps
AND route gaps to the responsible department for immediate resolution
```

## Procurement Compliance Rules

Public sector procurement rules differ significantly from commercial:

### Competitive Bidding Thresholds

Thresholds stored in Dataverse by jurisdiction and procurement category:

| Purchase Amount | Required Process |
|----------------|-----------------|
| Below $5,000 | Petty cash / direct purchase (record required) |
| $5,000 - $25,000 | Informal quotes (minimum 3) |
| $25,000 - $100,000 | Informal competitive bids (written) |
| Above $100,000 | Formal competitive bid (public notice required) |
| Above $500,000 | Full RFP process with evaluation committee |

*Thresholds are configurable in Dataverse per jurisdiction.*

### Sole-Source Justification Requirements

Sole-source purchases bypass competitive bidding. Compliance requires documented justification:
- Proprietary technology with no equivalent
- Emergency purchases (documented urgency with timeline)
- Single available source (market research documented)
- Follow-on to existing competitive contract (within scope)

The agent flags any sole-source designation without corresponding justification documentation.

### Vendor Debarment Checks

```
Before every payment (not just at vendor setup):
  1. Check SAM.gov Excluded Parties List (federal)
  2. Check state debarment list (if applicable)
  3. Check any agency-specific vendor holds in D365

If vendor found on debarment list:
  - BLOCK payment immediately
  - Alert AP supervisor and procurement officer
  - Hold vendor account in D365
  - Initiate vendor relationship review process
```

## Fund Accounting Compliance

Government accounting requires segregation of funds and spending within authorized purposes:

### Appropriation Verification
Every expenditure is checked against authorizing appropriation before posting:
- Does an active appropriation exist for this fund/dept/account combination?
- Does the appropriation have sufficient available balance?
- Is the appropriation in the correct fiscal period?

### Grant Fund Compliance

```
Grant: FHWA Federal Highway Grant #2024-HW-8821
Period: Oct 1, 2024 - Sept 30, 2026
Total award: $4,200,000

Approved spending categories:
  Construction materials:  $3,000,000  (71.4%)
  Project management:        $420,000  (10.0%)
  Engineering services:      $630,000  (15.0%)
  Administrative overhead:   $150,000   (3.6%)

Agent monitoring:
  - Every expenditure coded to this grant is checked against approved categories
  - Alert when any category approaches 90% of its sub-limit
  - Flag any administrative overhead approaching the indirect cost rate cap
  - Generate monthly grant financial report in FHWA reporting format
```

## Audit File Completeness Requirements

For each procurement transaction, the agent checks:

| Document Type | Required For |
|--------------|-------------|
| Bid solicitation notice | All competitive procurements |
| Bid tabulation | All competitive procurements |
| Award justification | All procurements |
| Signed contract | Purchases above threshold |
| Delivery confirmation | All goods purchases |
| Invoice with PO reference | All payments |
| Approval signatures | All payments above $X |
| Conflict of interest certification | All contracts above threshold |

The agent calculates a documentation completeness score per department and flags departments below the required threshold in Dataverse.

## Common Scenarios

### Scenario 1: Pre-Audit Compliance Sweep
**User:** "Our state auditors arrive in 3 weeks — are we ready?"
**Resolution:**
1. Run documentation completeness check across all transactions in the audit period
2. Generate list of transactions with missing documents, sorted by dollar amount
3. Identify which departments have the highest gap rates
4. Calculate projected findings based on gaps found
5. Prioritize documentation recovery by materiality; generate corrective action plan

### Scenario 2: Emergency Procurement
**User:** "We need to buy generators immediately after the storm — can we bypass the bid process?"
**Resolution:**
1. Confirm emergency declaration is in place (required for emergency procurement exemption)
2. Document the emergency circumstances, date, and timeline
3. Issue emergency PO within policy limits
4. Create sole-source justification documentation automatically
5. Flag for post-emergency review and documentation completion within 30 days per policy

### Scenario 3: Grant Drawing Request
**User:** "We need to submit our quarterly federal grant draw request"
**Resolution:**
1. Pull all expenditures in the grant period charged to the grant fund
2. Verify each expenditure is in an approved spending category
3. Reconcile to grant financial records
4. Generate SF-270 (Request for Advance or Reimbursement) format or equivalent
5. Flag any expenditures that need reclassification before submission

## Troubleshooting Guide

### Debarment Check Not Running for All Vendors
**Cause:** Debarment check configured only at vendor setup, not at payment; new debarments after setup not caught
**Fix:** Implement payment-time debarment check via Power Automate flow triggered on AP payment journal posting; run against live SAM.gov API, not cached list

### Sole-Source Flag Not Triggering
**Cause:** Procurement type set to "Sole Source" in D365 but field not connected to compliance workflow
**Fix:** Map D365 procurement type field to compliance workflow trigger in Dataverse; any sole-source type requires documentation check before PO confirmation

### Audit File Missing Documents for Old Transactions
**Cause:** Documents were filed in paper or in a separate document system not linked to D365
**Fix:** Conduct retrospective document linking exercise for the audit period; prioritize high-value transactions; set up SharePoint integration for future transactions

### Grant Category Overspend Not Caught in Time
**Cause:** Alert threshold at 90% triggered only after overspend occurred; spend rate was too fast
**Fix:** Add velocity-based alert: if current month spend rate would exhaust category in less than 2 months, alert regardless of current % consumed

### Competitive Bidding Threshold Check Wrong Amount
**Cause:** Multi-year contracts checked against annual value; should be checked against total contract value
**Fix:** Update compliance check to use total contract value (including options and extensions), not annual value; this is the standard for federal procurement thresholds

## Related Skills

- `encumbrance-manager` (IV-PS-001) - Budget encumbrance tracking that works alongside compliance monitoring

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
