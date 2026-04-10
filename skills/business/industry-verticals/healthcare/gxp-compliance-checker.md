---
name: gxp-compliance-checker
description: Validates manufacturing and quality records against GxP requirements for batch release, deviation detection, and audit readiness. Use when user says "GMP compliance", "batch release", "deviation report", "CAPA for GxP", "audit readiness", "OOS investigation", or "21 CFR Part 11 audit trail".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, healthcare, gxp, compliance]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# GxP Compliance Checker

Good Manufacturing Practice (GMP), Good Laboratory Practice (GLP), and Good Clinical Practice (GCP) — collectively GxP — set the regulatory standards for pharmaceutical, medical device, and biotech manufacturing. Non-compliance risks product recalls, warning letters, and import bans.

## Pre-Batch Release Validation

Before a batch can be released for distribution, the agent checks:

**Documentation completeness:**
- [ ] All batch manufacturing records filled out (no blank fields)
- [ ] Electronic signatures applied by all required personnel
- [ ] All in-process test results recorded
- [ ] Any deviations documented with root cause and CAPA
- [ ] Equipment calibration current for all instruments used
- [ ] Environmental monitoring within specifications for the manufacturing period

**Specification compliance:**
- [ ] All finished product test results within specification
- [ ] Analytical method used is the approved/validated method
- [ ] Results reviewed and approved by QC manager
- [ ] Retain samples logged and stored

**Audit trail integrity (21 CFR Part 11):**
- [ ] All electronic records have complete audit trail
- [ ] No unauthorized modifications to batch records
- [ ] System access restricted to authorized personnel during batch execution

## Deviation Detection

The agent monitors for GxP deviations in real time:

**Out-of-specification (OOS) results:** Any test result outside the specification triggers an automatic OOS investigation workflow. The agent:
- Locks the batch from release
- Generates OOS investigation form pre-filled with batch data
- Assigns to QC chemist for Phase 1 investigation
- Tracks investigation timeline against regulatory requirements

**Equipment calibration lapse:** If any instrument used in testing or manufacturing has an expired calibration:
- Flags all batches processed with that instrument since last calibration
- Initiates risk assessment for each affected batch

**Environmental monitoring excursion:** Temperature, humidity, or microbial count exceedance in a manufacturing area:
- Flags batches manufactured in that area during the excursion window
- Triggers environmental investigation

## Audit Readiness Report

Before a regulatory inspection, the agent generates:

1. **Batch record completeness:** % of records with no open deficiencies
2. **Deviation closure rate:** % of deviations closed within required timeframe
3. **CAPA effectiveness:** % of CAPAs with documented effectiveness checks
4. **Change control status:** All pending changes with approval status
5. **Training compliance:** All personnel current on required training
6. **Equipment maintenance status:** All equipment with current calibration and PM

Regulators look for exactly these data points. Having them ready instantly demonstrates control.

## Trigger Phrases

- "GMP compliance"
- "batch release"
- "deviation report"
- "CAPA for GxP"
- "audit readiness"
- "OOS investigation"
- "21 CFR Part 11 audit trail"
- "pre-batch release checklist"

## Quick Example

> See `gxp-compliance-checker-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Batch release checklist shows incomplete but all records are signed | Electronic signature not captured in the correct field for the agent to read | Confirm the audit trail query is reading from the correct 21 CFR Part 11 signature table; check that the D365 electronic signature configuration is active for the relevant document type |
| OOS investigation not automatically triggered after result entry | Out-of-specification threshold not configured for this test method | Add the specification limits to the Dataverse test method policy table; the agent compares results against these limits to determine OOS status |
| Audit readiness report shows stale CAPA data | CAPA closure dates not updated in D365 quality management | Run the CAPA status sync to pull current closure dates from D365 quality orders; verify QA team is closing CAPAs in the system, not just on paper |
| Environmental monitoring excursion not linking to affected batches | Batch manufacturing timestamps not stored with room/location reference | Require room assignment on production orders; use the Dataverse location table to link environmental records to production events by time window and location |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
