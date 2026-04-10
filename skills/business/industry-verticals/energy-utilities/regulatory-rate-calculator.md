---
name: Regulatory Rate Calculator
slug: regulatory-rate-calculator
description: Calculate regulated utility rates against filed tariff schedules — billing validation, rate case modeling, and customer rate optimization.
tab: business
domain: industry-verticals
industry_vertical: energy-utilities
difficulty: advanced
source_type: ragnar-custom
tags: "[\"energy\", \"utilities\", \"tariff\", \"regulatory\", \"billing\", \"rates\"]"
version: 1.0.1
icon_emoji: ⚡
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "FERC Electric Rate Filing"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Regulatory Rate Calculator

Utility billing involves complex tariff structures — tiered rates, time-of-use pricing, demand charges, fuel adjustment clauses, environmental surcharges. Manual billing validation is error-prone. This agent verifies billing accuracy and optimizes customer rate selection.

## Tariff Structure Types

**Flat Rate:** Same rate per kWh regardless of time or quantity. Simplest, but rarely optimal.

**Tiered Rate (Inclining Block):**
- First 500 kWh @ $0.08/kWh
- Next 500 kWh @ $0.12/kWh
- Over 1,000 kWh @ $0.18/kWh

**Time-of-Use (TOU):**
- Peak hours (2pm-8pm weekdays): $0.28/kWh
- Off-peak (all other times): $0.09/kWh
Incentivizes shifting load away from peak periods.

**Demand Charge:**
Billed on the highest 15-minute interval of the month
Example: 125 kW peak demand × $18/kW = $2,250 demand charge

**Fuel Adjustment Clause (FAC):** Variable adder that passes fuel cost changes through to customers monthly.

**Riders:** Fixed $ or % adders for specific programs (renewable energy, infrastructure, low-income assistance).

## Billing Validation

For each customer bill, the agent:
1. Reads interval meter data (15-minute usage readings)
2. Applies the customer's filed tariff rate structure
3. Calculates expected bill under each rate component
4. Compares to the actual billed amount
5. Flags discrepancies over threshold (from Dataverse policy table)

**Common billing errors detected:**
- Wrong tariff applied (customer should be on commercial, billed as industrial)
- Demand charge calculated on wrong interval
- Wrong TOU period boundaries applied (daylight saving time errors)
- Rider percentages not updated after rate case

## Rate Optimization

For customers on incorrect or sub-optimal rates, the agent:
1. Models the customer's actual consumption pattern against all available tariffs
2. Calculates annual cost under each tariff
3. Recommends the optimal tariff and quantifies the savings
4. Generates rate change application

**Example output:**
```
Customer: Contoso Manufacturing (Account #74821)
Current Rate: General Service Large (GSL)

Analysis of last 12 months consumption:
  GSL (current): $284,000/year
  Industrial Interruptible: $241,000/year (-$43,000, -15%)
  Time-of-Use Large: $251,000/year (-$33,000, -12%)

RECOMMENDATION: Switch to Industrial Interruptible
  Annual savings: $43,000
  Requirement: Must accept 6 interruptions/year (avg 4 hours each)
  Historical impact: Operations can accommodate interruptions with
  1-hour notice (per demand response policy in Dataverse)
```

## Trigger Phrases

- "Help me with regulatory rate calculator"
- "Regulatory Rate Calculator"
- "How do I regulatory rate calculator"

## Quick Example

> See `regulatory-rate-calculator-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
