---
name: energy-procurement
description: Optimize electricity and gas procurement covering tariff analysis, demand charge management, contract timing, and renewable certificate tracking. Use when user says "energy procurement", "electricity tariff", "demand charge", "power purchase agreement", "REC tracking", or "utility cost optimization".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, energy, procurement, tariff]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Energy Procurement Advisor

Energy is a significant and often poorly managed cost for manufacturing, data centers, and large commercial facilities. This agent analyzes consumption patterns, optimizes procurement strategy, and tracks sustainability commitments to reduce energy spend and meet ESG targets.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-ENE-001 |
| Name | energy-procurement |
| Category | Industry Vertical / Energy-Utilities |
| Module | D365 F&O (cost management), Dataverse |
| Complexity | Advanced |
| Prerequisites | Smart meter data feed, utility rate schedules, forward price feed (for contract timing), REC registry access |

## Description

Covers tariff analysis and optimization, demand charge management, contract timing intelligence, and Renewable Energy Certificate tracking. Works for large commercial and industrial energy buyers, not utility companies themselves.

## Triggers

- "energy procurement"
- "electricity tariff"
- "demand charge"
- "power purchase agreement"
- "REC tracking"
- "utility cost optimization"
- "energy contract"
- "demand management"
- "load shifting"
- "sustainability energy"

## Core Tasks

### 1. Analyze and Optimize Tariff
```text
GIVEN a facility's 12-month consumption history is available
WHEN the agent performs tariff analysis
THEN calculate annual cost under the current tariff structure
AND model annual cost under each available alternative tariff
AND identify load-shifting opportunities that reduce total cost
AND recommend the tariff structure best suited to consumption pattern
AND quantify switching savings with confidence range
```

### 2. Manage Demand Charges
```text
GIVEN real-time demand data is flowing from smart meters
WHEN demand approaches billing period peak
THEN calculate exposure to new demand charge peak
AND alert operations team with specific loads to shed or shift
AND recommend curtailment sequence by load (least operational impact first)
AND track demand charge exposure for the current billing month
AND report projected demand charge vs prior month
```

### 3. Time Energy Contract Decisions
```text
GIVEN forward energy prices are available for the next 24 months
WHEN the agent monitors price levels against policy thresholds
THEN alert when forward prices are in the favorable range for fixing
AND provide procurement window recommendation based on price trend
AND calculate hedge ratio recommendation (% of load to fix vs leave floating)
AND track contract expiration dates and start re-procurement process 60 days out
```

### 4. Track Renewable Energy Certificates
```text
GIVEN sustainability commitments are defined in Dataverse policy table
WHEN the agent calculates REC position for the compliance year
THEN compare REC inventory vs commitment target (MWh)
AND project remaining REC needs based on consumption forecast
AND identify optimal procurement window for additional RECs
AND generate sustainability reporting data for ESG disclosure
```

## Tariff Structure Reference

| Structure | How It Works | Best For |
|-----------|-------------|----------|
| Flat rate | Same price per kWh regardless of time | Simple, predictable; rarely optimal for large users |
| Tiered (inclining block) | Higher rate as usage increases | Incentivizes efficiency; penalties heavy users |
| Time-of-Use (TOU) | Peak vs off-peak pricing | Facilities that can shift loads away from 2pm-8pm |
| Demand charge | Monthly charge on highest 15-min interval | Requires active demand management to control |
| Real-Time Pricing | Hourly price reflects wholesale market | Advanced users with automated load control |
| Power Purchase Agreement | Long-term fixed price from specific generator | Sustainability commitments; price certainty |

## Demand Charge Management

Demand charges (billed on the peak 15-minute interval of the month) represent 30-50% of commercial electricity bills at many facilities.

```
Example:
  Peak demand this month: 450 kW (set on Tuesday at 3:15pm during a heat wave)
  Demand charge rate: $18/kW
  Demand charge for the month: 450 x $18 = $8,100

  If operations had shed 50 kW during that 15-minute window:
  Revised peak: 400 kW
  Revised demand charge: 400 x $18 = $7,200
  Savings: $900 for the entire month from ONE 15-minute action
```

The agent monitors real-time demand and sends alerts when approaching a new monthly peak. Alert threshold is configurable in Dataverse (e.g., 90% of prior month peak).

## Contract Timing Intelligence

```
Procurement windows:
  Fix price when:
    Forward prices are at/below 12-month trailing average
    AND price trend is rising (lock in before it goes higher)
    AND at least 30% of current hedged contract rolling off in next 12 months

  Stay floating when:
    Forward prices are above 12-month trailing average
    AND price trend is falling
    AND current contract covers near-term exposure

  Hedge in tranches when:
    High price uncertainty (prices near 12-month average with no clear trend)
    AND exposure is large enough that full-float risk is unacceptable
```

## REC Tracking

```
REC Inventory Status — April 2026

Sustainability commitment: 100% renewable electricity (calendar year 2026)
Estimated annual consumption: 48,000 MWh

RECs purchased and retired:  16,200 MWh  (Jan-Mar)
RECs in inventory:             4,800 MWh  (purchased, not yet retired)
Total covered:                21,000 MWh  (43.8% of annual target)

Remaining need:               27,000 MWh  (56.2%)
Months remaining:             8.75 months
Monthly purchase target:       3,086 MWh/month

Current REC price:            $2.40/MWh
Projected remaining cost:     $64,800

RECOMMENDATION: Procure 9,000 MWh now (3-month buffer) at current prices
  Rationale: Summer months historically see REC price increases
  Cost: $21,600 at current price
```

## Integration Data Sources

| Data | Source |
|------|--------|
| Interval consumption (15-min) | Smart meters / AMI system |
| Current tariff rates | Utility rate schedule database |
| Available tariffs | Utility tariff filing (filed with regulator) |
| Forward energy prices | Energy market data feed |
| REC inventory | REC registry account (e.g., WREGIS, NEPOOL GIS) |
| Sustainability targets | Dataverse policy table |
| Facility operating schedule | ERP calendar or facility management system |

## Common Scenarios

### Scenario 1: Annual Energy Cost Review
**User:** "Our energy bill went up 18% this year — where is the increase coming from?"
**Resolution:**
1. Pull 24 months of utility bills and break into components (energy, demand, riders)
2. Identify which component drove the increase (price increase? Higher usage? Higher peak demand?)
3. Compare consumption pattern changes (new equipment? Extended hours?)
4. Model cost under prior year's consumption at current rates vs current consumption
5. Identify top 3 cost reduction opportunities with estimated annual savings

### Scenario 2: New Facility Energy Setup
**User:** "We're opening a new manufacturing facility — what energy tariff should we sign up for?"
**Resolution:**
1. Request projected operational profile: shift hours, major equipment, peak production periods
2. Model cost under each available tariff using the operational profile
3. Identify if TOU rates create an incentive to shift production to off-peak
4. Recommend tariff with expected annual cost range
5. Flag whether demand management investment would be worthwhile given demand charge structure

### Scenario 3: PPA vs Market Decision
**User:** "Should we sign a 10-year Power Purchase Agreement at $55/MWh?"
**Resolution:**
1. Pull current forward curve for 10-year period from market data feed
2. Calculate NPV of fixed PPA at $55 vs expected market cost at forward prices
3. Apply Dataverse policy: our sustainability commitment requires 50% renewable by 2030
4. Model PPA as both economic and sustainability instrument
5. Provide recommendation with NPV range, break-even price, and sustainability credit value

## Troubleshooting Guide

### Demand Alert Not Firing at Correct Threshold
**Cause:** Alert threshold in Dataverse set against rated capacity, not prior month's actual peak
**Fix:** Update alert threshold policy to reference prior-month actual demand, not nameplate capacity; add seasonal adjustment factor

### Tariff Comparison Showing Wrong Savings
**Cause:** Available tariff list in Dataverse not updated after utility filed new rates with regulator
**Fix:** Implement quarterly update cycle for utility rate schedules; source from utility's tariff management system or public rate filing database

### REC Tracking Position Incorrect
**Cause:** REC retirements processed in registry not reflected in Dataverse; manual reconciliation lag
**Fix:** Automate REC registry data pull via API (WREGIS, NEPOOL GIS, etc.); reconcile Dataverse inventory against registry monthly

### Forward Price Feed Stale
**Cause:** Energy market data subscription lapsed or API credential expired
**Fix:** Monitor data feed health with daily freshness check; alert energy manager if prices not updated in 24 hours

### Load Curtailment Recommendations Operationally Infeasible
**Cause:** Curtailment sequence in Dataverse not aligned with current facility operations (equipment added or processes changed)
**Fix:** Conduct annual review of curtailment sequence with operations team; store as versioned policy in Dataverse with effective dates

## Related Skills

- `regulatory-rate-calculator` (IV-ENE-002) - Utility billing validation and rate optimization
- `production-scheduling` - Coordinating production schedule with energy demand management

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
