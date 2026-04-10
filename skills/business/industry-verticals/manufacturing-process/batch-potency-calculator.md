---
name: "Batch Potency Calculator"
slug: "batch-potency-calculator"
description: "Calculate active ingredient potency adjustments for pharmaceutical batch manufacturing — CoA reading, formula adjustment, and D365 batch record update."
tab: "business"
domain: "industry-verticals"
industry_vertical: "manufacturing-process"
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["manufacturing-process", "pharma", "potency", "batch", "formula", "gmp"]
version: "1.0"
icon_emoji: "⚗️"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "FDA Pharmaceutical Manufacturing — Process Controls"
    url: "https://www.fda.gov/drugs/pharmaceutical-quality-resources/pharmaceutical-cgmps-21st-century-risk-based-approach"
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
