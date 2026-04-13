---
name: "regulatory-rate-calculator"
slug: "regulatory-rate-calculator"
description: "Calculate regulated utility rates against filed tariff schedules for billing validation, rate case modeling, and customer rate optimization. Use when user says \"utility rate analysis\", \"billing validation\", \"regulatory rate\", \"tariff calculation\", \"rate case\", or \"electricity bill check\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "energy-utilities"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "energy", "utility", "rate-calculation"]
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


# Regulatory Rate Calculator

Utility billing involves complex tariff structures: tiered rates, time-of-use pricing, demand charges, fuel adjustment clauses, and environmental surcharges. Manual billing validation is error-prone and time-consuming. This agent verifies billing accuracy against filed tariff schedules and identifies customers on sub-optimal rates.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-ENE-002 |
| Name | regulatory-rate-calculator |
| Category | Industry Vertical / Energy-Utilities |
| Module | D365 F&O (billing), Dataverse |
| Complexity | Advanced |
| Prerequisites | Interval meter data (15-min), filed tariff schedules in Dataverse, customer account-to-tariff mapping |

## Description

Used by utility companies and large energy buyers. Utilities use it to validate billing accuracy before bills go out. Large customers use it to verify they've been billed correctly. Both use it for rate optimization analysis.

## Triggers

- "utility rate analysis"
- "billing validation"
- "regulatory rate"
- "tariff calculation"
- "rate case"
- "electricity bill check"
- "wrong tariff"
- "rate optimization"
- "demand charge calculation"
- "fuel adjustment clause"

## Tariff Structure Reference

**Flat Rate:** Same price per kWh regardless of time or quantity. Simplest structure; rarely optimal for large users.

**Tiered Rate (Inclining Block):**
```
First 500 kWh   @ $0.08/kWh = $40.00
Next 500 kWh    @ $0.12/kWh = $60.00
Over 1,000 kWh  @ $0.18/kWh = varies
```
Incentivizes conservation; heavy users pay significantly more per unit.

**Time-of-Use (TOU):**
```
On-peak (2pm-8pm weekdays):  $0.28/kWh
Off-peak (all other times):  $0.09/kWh
```
Incentivizes load shifting away from grid stress periods.

**Demand Charge:**
```
Billed on the highest 15-minute interval of the month
Example: 125 kW peak demand x $18/kW = $2,250 demand charge
```
Can represent 30-50% of a commercial electricity bill.

**Fuel Adjustment Clause (FAC):** Variable monthly adder that passes fuel cost changes through to customers. Recalculated monthly by the utility; common source of billing errors.

**Riders:** Fixed dollar or percentage adders for specific programs: renewable energy, infrastructure, low-income assistance, storm cost recovery.

## Core Tasks

### 1. Validate Customer Bill
```text
GIVEN a customer bill and interval meter data are available
WHEN the agent validates billing accuracy
THEN read 15-minute interval usage data for the billing period
AND apply the customer's filed tariff rate to each time interval
AND calculate expected bill by component (energy, demand, FAC, riders)
AND compare calculated total to actual billed amount
AND flag any discrepancy exceeding the threshold in Dataverse policy table
AND generate an itemized variance report by rate component
```

### 2. Identify Billing Errors
```text
GIVEN a bill variance is flagged
WHEN the agent diagnoses the root cause
THEN check: is the customer on the correct tariff for their account class?
AND check: was the demand charge calculated on the correct interval?
AND check: are TOU period boundaries correct for daylight saving time?
AND check: are current rider rates applied (not prior period rates)?
AND check: is the FAC this month vs last month's rate?
AND classify the error type and calculate the correction amount
```

### 3. Model Rate Optimization for Customer
```text
GIVEN a customer is potentially on a sub-optimal tariff
WHEN the agent runs rate optimization analysis
THEN pull 12 months of interval consumption data
AND model annual cost under every available tariff for this customer class
AND rank tariffs by annual cost
AND identify operational changes (load shifting) that further reduce cost
AND generate rate change recommendation with projected savings
AND draft rate change application if customer wants to proceed
```

### 4. Support Rate Case Analysis
```text
GIVEN a utility is preparing a rate case filing
WHEN the agent analyzes revenue requirement vs billed revenue
THEN calculate current revenue collected per customer class under existing rates
AND model revenue under proposed rate structure
AND identify customer classes that would see bill increases vs decreases
AND generate cross-subsidization analysis
AND produce rate case exhibit data in regulatory filing format
```

## Billing Validation Process

```
Step 1: Load interval data
  Source: AMI (Advanced Metering Infrastructure) system
  Format: 15-minute kWh readings for each meter

Step 2: Identify applicable tariff
  Read customer-to-tariff mapping in D365 / utility billing system
  Load tariff rate schedule from Dataverse (with effective date)

Step 3: Apply rate components
  Energy charge: Sum (interval kWh x applicable rate for that time period)
  Demand charge: Max 15-min interval x demand charge rate
  Fixed charge: Monthly customer charge (flat per account)
  FAC: Consumption x current fuel adjustment factor
  Riders: Apply each applicable rider to the correct base

Step 4: Compare to billed amount
  Tolerance threshold from Dataverse policy (e.g., $5 or 0.5%, whichever is larger)
  Flag for review if calculated amount differs by more than threshold

Step 5: Report
  Billing accuracy rate (% of bills within threshold)
  Total overbill / underbill amount
  Error categories
```

## Rate Optimization Output Example

```
Customer: Contoso Manufacturing (Account #74821)
Current Tariff: General Service Large (GSL)
Analysis period: 12 months

Annual cost by tariff:
  GSL (current):                $284,000/year
  Industrial Interruptible:     $241,000/year  (-$43,000, -15%)
  Time-of-Use Large:            $251,000/year  (-$33,000, -12%)
  Real-Time Pricing:            $238,000/year  (-$46,000, -16%)  [higher risk]

RECOMMENDATION: Industrial Interruptible
  Annual savings: $43,000
  Requirement: Must accept up to 6 interruptions/year (avg 4 hours each)
  Operational impact: Operations can accommodate with 1-hour notice
    (per demand response policy stored in Dataverse)
  
  Alternative: TOU Large ($33K savings, no interruption risk)
    Requires shifting 18% of load from peak to off-peak hours

Rate change application: Generated — review with account manager before filing
```

## Common Scenarios

### Scenario 1: Customer Billing Dispute
**User:** "Customer says their bill is $3,200 higher than expected this month — is it correct?"
**Resolution:**
1. Pull interval meter data for the billing period
2. Apply customer's current tariff (GSL) to calculate expected bill
3. Check if peak demand this month was significantly higher than prior month
4. Verify FAC rate applied is current month's published rate
5. If overbill confirmed: calculate correction amount and initiate bill adjustment

### Scenario 2: Rate Change After Daylight Saving Time Error
**User:** "We think our TOU billing is wrong in March — the clocks changed"
**Resolution:**
1. Pull interval data for the billing period spanning the DST change
2. Apply TOU rate with DST-adjusted peak/off-peak boundaries
3. Recalculate bill with correct time period assignments
4. Compare to original bill
5. Common finding: 1 hour of off-peak usage billed at peak rate due to DST not applied to tariff engine

### Scenario 3: Rate Case Revenue Impact Analysis
**User:** "We're filing for a 6% rate increase — model the impact by customer class"
**Resolution:**
1. Pull current billing data by customer class for the test year
2. Apply proposed rate increase (6%) to each rate component
3. Calculate bill impact per customer class (residential, small commercial, large commercial, industrial)
4. Identify customer classes facing above-average increases
5. Generate regulatory exhibit with revenue requirement reconciliation

## Troubleshooting Guide

### Calculated Bill Significantly Lower Than Actual
**Cause:** New rider added to tariff not yet loaded in Dataverse rate table; agent not applying the new charge
**Fix:** Implement automated tariff update process when utility files rate changes; reconcile Dataverse rate tables to utility's published tariff book quarterly

### Demand Charge Calculation Discrepancy
**Cause:** Agent using 30-minute demand intervals; utility bills on 15-minute intervals (or vice versa depending on jurisdiction)
**Fix:** Verify regulatory requirement for demand interval in this jurisdiction; update interval aggregation in calculation engine to match

### TOU Boundary Errors in Summer vs Winter Schedules
**Cause:** Utility has seasonal TOU schedules (different peak hours in summer vs winter) but Dataverse only has one schedule loaded
**Fix:** Load seasonal rate schedules separately with effective dates; agent must select correct schedule based on billing date

### Rate Optimization Model Not Reflecting Operational Constraints
**Cause:** TOU optimization assumes full flexibility to shift load; actual facility has fixed production schedule that limits flexibility
**Fix:** Add operational constraint parameters to Dataverse; agent should model rate savings net of operational constraint (e.g., only 40% of load is shiftable)

### FAC Variance Each Month
**Cause:** FAC is recalculated monthly by the utility; Dataverse is not updated promptly when utility publishes new FAC
**Fix:** Establish automated FAC update from utility's published rate bulletin; run validation against prior month's factor first of month

## Related Skills

- `energy-procurement` (IV-ENE-001) - Energy procurement strategy and contract timing
- `encumbrance-manager` (IV-PS-001) - Budget tracking for government utility accounts

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
