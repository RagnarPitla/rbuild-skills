---
name: vin-configuration-validator
description: Validate VIN-based vehicle configuration rules in D365 against BOM and option constraints before production order release. Use when user says "VIN validation", "vehicle configuration", "option compatibility", "production order release", "VIN check", or "BOM completeness".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, automotive, vin, validation]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# VIN Configuration Validator

Automotive manufacturers configure vehicles to specific customer orders covering engine, transmission, color, and option packages. These configurations must be valid against engineering constraints before the production order is firmed. Invalid configurations discovered after production starts are extremely costly to unwind.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-AUTO-002 |
| Name | vin-configuration-validator |
| Category | Industry Vertical / Automotive |
| Module | D365 Production Control, Product Configuration, Inventory |
| Complexity | Intermediate |
| Prerequisites | Product configuration model in D365, Dataverse option compatibility matrix |

## Description

This agent validates a vehicle configuration against engineering constraints, market compliance rules, BOM completeness, and lead time feasibility before the production order is released to the shop floor. Catches issues that would stop production or trigger costly rework.

## Triggers

- "VIN validation"
- "vehicle configuration"
- "option compatibility"
- "production order release"
- "VIN check"
- "BOM completeness"
- "validate VIN"
- "configuration conflict"
- "market compliance check"

## VIN Decoding

A standard 17-character VIN encodes the vehicle's configuration:

| Position | Characters | Meaning |
|----------|-----------|---------|
| 1-3 | WMI | World Manufacturer Identifier |
| 4-8 | VDS | Vehicle Descriptor Section (model, body, engine) |
| 9 | Check digit | Fraud/error detection |
| 10 | Model year | Year code per NHTSA table |
| 11 | Plant | Manufacturing plant code |
| 12-17 | Sequence | Production sequence number |

The check digit (position 9) is calculated using a standard algorithm: assign numeric values to each character, multiply by position weights (8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2), sum the products, divide by 11, and take the remainder. Remainder 10 = X.

## Core Tasks

### 1. Validate VIN Check Digit
```text
GIVEN a VIN is submitted for validation
WHEN agent calculates the expected check digit
THEN apply the NHTSA check digit algorithm
AND compare calculated vs position 9 character
AND flag mismatch as data entry error or potential fraud
AND proceed with configuration validation only if check digit passes
```

### 2. Validate Option Compatibility
```text
GIVEN a vehicle has a set of configured options
WHEN agent evaluates the option combination
THEN read compatibility matrix from Dataverse policy table
AND identify any option pairs that conflict (cannot be combined)
AND classify each conflict as BLOCKER or WARNING
AND provide resolution suggestion for each conflict
```

### 3. Validate Market Compliance
```text
GIVEN a vehicle is configured for a specific ship-to country
WHEN agent checks regulatory compliance
THEN read approved configuration list for that market from Dataverse
AND flag any options not approved for the destination market
AND include regulatory reference for each failed check
```

### 4. Validate BOM Completeness
```text
GIVEN a vehicle variant is confirmed as valid
WHEN agent checks D365 BOM for completeness
THEN confirm all required component lines exist for this product variant
AND flag any missing BOM lines with component description
AND report total component count for audit
```

### 5. Validate Lead Time Feasibility
```text
GIVEN BOM is complete and options are compatible
WHEN agent checks procurement lead times
THEN identify all option-specific components (not standard production stock)
AND compare component lead time vs production schedule date
AND flag components where lead time exceeds time to production start
AND recommend expedite or reschedule for each at-risk component
```

## Integration with D365

| D365 Area | What Agent Reads |
|-----------|-----------------|
| Product configuration model | Valid option combinations, constraint rules |
| BOM (Prod BOM) | Component existence for variant |
| Production order | Firmed planned order date |
| Inventory transactions | On-hand and incoming supply |
| Purchase orders | Lead times for option-specific parts |
| Dataverse compatibility matrix | Market rules, option conflict pairs |

## Output Format

```
VIN: 1HGCM82633A123456
Configuration: Accord EX-L V6 | Silver | Leather | Sunroof | Navigation
Ship-to: USA (Market: NAFTA)

VALIDATION RESULT: 2 ISSUES FOUND

BLOCKER: Option conflict
  Sunroof (Option 4A) incompatible with Light Bar Package (Option 7C)
  Constraint source: Compatibility Matrix rule CM-0042
  Resolution: Remove one option before releasing to production

WARNING: Lead time risk
  Navigation system (Part NV-8942) has 14-day lead time
  Production scheduled in 8 days
  Resolution: Expedite order OR reschedule production start by 6 days

CHECK DIGIT: Valid (calculated: 3, VIN position 9: 3)
MARKET COMPLIANCE (USA/NAFTA): All 12 options approved
BOM COMPLETENESS: All 847 components found in D365
```

## Common Scenarios

### Scenario 1: Fleet Order with Market Conflict
**User:** "Validate VIN batch from the export order to Germany"
**Resolution:**
1. Decode each VIN in the batch
2. Check each configuration against EU/WVTA approval list
3. Flag configurations with US-only options (e.g., specific emission calibrations)
4. Output per-VIN results with specific EU regulation references
5. Generate remediation list for sales team to address with customer

### Scenario 2: Last-Minute Customer Change
**User:** "Customer wants to add a towing package to their order — is it still valid?"
**Resolution:**
1. Load current configuration for the VIN
2. Add towing package (Option 8B) to the option set
3. Run compatibility check: towing + sport suspension is a known conflict
4. Alert production coordinator before change is applied
5. Present customer with compatible alternatives

### Scenario 3: BOM Gap Before Production
**User:** "Release production batch for this week's orders"
**Resolution:**
1. Validate all VINs in the production batch
2. Identify two VINs with missing BOM lines (a new option package not yet added to BOM)
3. Hold those two orders pending BOM update
4. Release the remaining valid orders
5. Notify manufacturing engineering of BOM gap with part numbers

## Troubleshooting Guide

### Check Digit Validation Failing for Legitimate VINs
**Cause:** Non-standard VINs from some European manufacturers use different encoding
**Fix:** Apply ISO 3779 check digit rules for non-US VINs; NHTSA algorithm is US-specific (49 CFR Part 565)

### Compatibility Matrix Not Catching Known Conflicts
**Cause:** New option combination not yet added to the Dataverse compatibility policy table
**Fix:** Review compatibility matrix table for completeness; maintain it as a living document with each new option launch

### BOM Completeness Check Returns False Positives
**Cause:** Product variant dimension mismatch between the order and the BOM version
**Fix:** Confirm BOM version is active and aligned to the correct product variant; check approved route version date

### Lead Time Calculation Incorrect
**Cause:** Purchase order lead time field not updated after supplier renegotiation
**Fix:** Sync lead times from supplier master data; agent should read from InventItemVendorEntity, not static item setup

### Market Compliance List Out of Date
**Cause:** Regulatory updates not reflected in Dataverse policy table
**Fix:** Implement quarterly review cycle for market compliance table; version-control the table with effective dates

## Related Skills

- `automotive-dealer-ops` (IV-AUTO-001) - Dealer operations including warranty and parts
- `warranty-claim-analyzer` (IV-AUTO-003) - Post-production warranty analysis

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
