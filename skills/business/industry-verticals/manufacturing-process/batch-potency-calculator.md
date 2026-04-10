---
name: batch-potency-calculator
description: Calculates active ingredient potency adjustments for pharmaceutical batch manufacturing by reading CoA values, adjusting formula quantities, and updating D365 batch records. Use when user says "potency calculation", "CoA potency adjustment", "API potency", "batch formula adjustment", "active ingredient quantity", "potency compensation", or "adjust for assay result".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, manufacturing, potency, pharmaceutical]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Batch Potency Calculator

Pharmaceutical and specialty chemical manufacturers use active ingredients that vary in potency from lot to lot. A CoA (Certificate of Analysis) might show an API at 97.3% rather than the nominal 100%. The batch formula must be adjusted to compensate — otherwise the finished product won't meet specifications.

## The Calculation

```
Base formula: 500g API per batch (at 100% potency)
CoA shows: API Lot #ABC-2026-01 = 97.3% potency

Adjusted quantity = Base quantity / (Actual potency / 100)
                  = 500g / (97.3 / 100)
                  = 500g / 0.973
                  = 514.0g API required

The extra 14g compensates for the lower potency.
```

For multiple potency-adjusted components, calculate each independently.

## Agent Workflow

**Step 1: Receive/read the CoA**
- Agent reads CoA PDF (via document intelligence) or structured CoA data from LIMS
- Extracts assay result for each active ingredient

**Step 2: Validate CoA**
- Confirms supplier is on approved vendor list
- Confirms lot number matches purchase order
- Confirms CoA signature and date meet GxP requirements
- Flags any result outside specification (batch on hold until resolved)

**Step 3: Calculate adjusted quantities**
- For each potency-variable component, calculates adjusted weight
- Documents the calculation with formula, CoA reference, and result
- Rounds to appropriate significant figures per SOP

**Step 4: Update D365 batch record**
- Creates the adjusted formula in D365 process manufacturing
- Links to the CoA document for traceability
- Generates dispensing tickets with adjusted quantities for warehouse

**Step 5: Audit documentation**
- Records the calculation in the batch manufacturing record
- Stores CoA reference for lot genealogy
- Generates QA review task for second-person verification (per GMP requirements)

## Validation Requirements

All potency calculations in regulated manufacturing require:
- **Second-person verification:** A second qualified person independently verifies the calculation
- **System validation:** The calculation algorithm must be validated per 21 CFR Part 11
- **Change control:** Any change to the calculation method requires formal change control

The agent supports this by generating a calculation report that a second pharmacist/chemist can review and electronically sign in D365.

## Error Prevention

Common potency calculation errors the agent prevents:
- Using nominal potency instead of actual CoA potency
- Using wrong units (% w/w vs % w/v)
- Not adjusting for water content (anhydrous vs hydrate)
- Calculation in wrong direction (dividing instead of multiplying)
- Using outdated CoA (not the lot being dispensed)

## Trigger Phrases

- "potency calculation"
- "CoA potency adjustment"
- "API potency"
- "batch formula adjustment"
- "active ingredient quantity"
- "potency compensation"
- "adjust for assay result"
- "formula quantity from CoA"

## Quick Example

> See `batch-potency-calculator-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Adjusted quantity is less than the base formula quantity | Potency entered as a decimal (0.973) instead of a percentage (97.3) | Confirm the CoA potency value is entered as a percentage between 0 and 100; the formula divides by (potency / 100), so a decimal input inverts the calculation |
| CoA validation failing for an approved supplier | Supplier code in D365 does not exactly match the approved vendor list entry in Dataverse | Check the vendor account format; ensure the Dataverse approved vendor table uses the same D365 vendor account identifier, including leading zeros if applicable |
| Dispensing ticket shows wrong unit of measure | CoA expresses potency on a w/v basis but formula uses w/w | Explicitly define the potency basis (w/w or w/v) in the item's potency configuration; flag mismatches as a validation error before the calculation proceeds |
| Second-person verification task not generating | Electronic signature workflow not configured for the calculation document type | Enable the D365 electronic signature requirement for potency calculation records; assign the QA reviewer role to the second-verification signature group |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
