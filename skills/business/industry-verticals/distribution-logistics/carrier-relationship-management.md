---
name: carrier-relationship-management
description: Manage carrier portfolios, rate negotiations, performance tracking, and carrier selection optimization in D365 Transportation. Use when user says "carrier scorecard", "freight rate negotiation", "carrier performance", "carrier selection", "approved carrier list", or "rate negotiation".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, logistics, carrier, freight]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Carrier Relationship Management

Managing a carrier portfolio means constant balancing: rate competitiveness, service reliability, capacity availability, and relationship health. This agent handles the data analysis layer so logistics managers can focus on strategy and negotiation rather than spreadsheet assembly.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-LOG-001 |
| Name | carrier-relationship-management |
| Category | Industry Vertical / Distribution-Logistics |
| Module | D365 Transportation Management |
| Complexity | Advanced |
| Prerequisites | D365 TMS configured, shipment history, carrier master data |

## Description

Builds and maintains rolling carrier performance scorecards, prepares negotiation packages at contract renewal, and recommends optimal carrier selection for each shipment based on rate, performance, and capacity.

## Triggers

- "carrier scorecard"
- "freight rate negotiation"
- "carrier performance"
- "carrier selection"
- "approved carrier list"
- "rate negotiation"
- "carrier renewal"
- "freight contract"
- "carrier capacity"

## Core Tasks

### 1. Generate Carrier Performance Scorecard
```text
GIVEN a logistics manager requests carrier performance review
WHEN the agent aggregates shipment data for the period
THEN calculate on-time delivery rate per carrier
AND calculate freight claim rate ($ claims / $ freight spend)
AND compare carrier rates vs market benchmark for key lanes
AND calculate transit time accuracy (actual vs quoted)
AND calculate invoice accuracy (% invoices matching quoted rate)
AND produce weighted composite score with performance band rating
```

### 2. Prepare Rate Negotiation Package
```text
GIVEN a carrier contract is approaching expiration (within 90 days)
WHEN the agent assembles the renewal package
THEN pull volume and revenue by lane for the full contract period
AND calculate scorecard performance over the contract period
AND retrieve current market rates for the top 10 lanes by volume
AND assess leverage (our % of carrier's volume on these lanes)
AND generate suggested rate targets per lane with volume commitment ranges
```

### 3. Recommend Carrier for Shipment
```text
GIVEN a new shipment needs a carrier assignment
WHEN the agent evaluates options
THEN filter approved carriers for the origin-destination pair
AND retrieve current contract rates from D365 rate tables
AND check carrier performance score (exclude carriers on performance plan)
AND apply any special requirements (temperature control, hazmat, white glove)
AND return ranked carrier list with rate, estimated transit time, and performance score
```

### 4. Monitor Carrier Compliance
```text
GIVEN carriers must maintain insurance and compliance certifications
WHEN the agent runs its weekly compliance scan
THEN check expiration dates on carrier insurance certificates
AND verify carriers remain in good standing with FMCSA (federal safety rating)
AND flag any carrier with upcoming certification expiration within 60 days
AND alert logistics manager before expiration causes an approved list removal
```

## Carrier Performance Scorecard

| Metric | Calculation | Weight |
|--------|------------|--------|
| On-time delivery | % shipments delivered on promised date | 35% |
| Claim rate | $ claims / $ freight spend | 25% |
| Rate competitiveness | Carrier rate vs market benchmark | 20% |
| Transit time accuracy | Actual vs quoted transit days | 10% |
| Invoice accuracy | % invoices matching quoted rate | 10% |

**Score Bands:**

| Band | Score | Status |
|------|-------|--------|
| A | 85-100 | Preferred carrier, priority capacity allocation |
| B | 70-84 | Approved carrier, standard use |
| C | 55-69 | Performance improvement plan required |
| D | Below 55 | Review for removal from approved list |

## Rate Negotiation Framework

When a carrier contract comes up for renewal:

```
1. Volume history
   Pull actual shipments and spend by lane for the contract period
   Identify growth lanes (our volume increased) and shrink lanes

2. Performance summary
   Scorecard over the full contract period
   Highlight months where carrier missed targets

3. Market rate comparison
   Current market rates for the top 10 lanes by volume
   Source: rate intelligence feed integrated to Dataverse

4. Leverage analysis
   Our share of carrier's total volume on these lanes
   Alternative carrier availability and rate delta

5. Negotiation targets
   Lane-specific rate ask based on volume commitment
   Tiered rate structure: base rate + volume bonus tiers
```

## Carrier Selection Logic

```
Inputs:
  Origin / destination pair
  Weight, dimensions, commodity type
  Required delivery date (calculates latest ship date)
  Special requirements (temperature, hazmat, white glove, signature)

Agent evaluation order:
  1. Filter carriers by lane coverage and special capability
  2. Remove carriers on performance plan (Score < C) unless no alternative
  3. Retrieve contracted rates from D365 TMSRateEngine
  4. Rank by: (Rate 40%) + (Performance score 40%) + (Transit time 20%)
  5. Flag capacity constraints if carrier has current capacity restrictions

Output: Top 3 carrier recommendations with rate, transit time, score
```

## Integration Points

| Data | Source |
|------|--------|
| Shipment history | D365 TMS ShipmentEntity |
| Carrier master | D365 TMS CarrierEntity |
| Rate tables | D365 TMS RateMasterEntity |
| Claims data | Claims management system / Dataverse |
| Market benchmarks | External rate intelligence service |
| FMCSA ratings | FMCSA Safety Measurement System API |

## Common Scenarios

### Scenario 1: Quarterly Business Review with Carrier
**User:** "Prepare a QBR summary for our top 5 carriers"
**Resolution:**
1. Calculate composite scorecard for each carrier for the quarter
2. Pull volume and revenue vs prior quarter comparison
3. Identify top 3 lanes per carrier with performance breakdown
4. Flag any lanes where this carrier is underperforming vs alternatives
5. Generate structured QBR document per carrier with negotiation talking points

### Scenario 2: Carrier on Performance Plan
**User:** "XYZ Freight has been missing their delivery commitments — what do we do?"
**Resolution:**
1. Generate detailed performance report for XYZ Freight for last 90 days
2. Identify which lanes and shipment types have the worst performance
3. Calculate cost impact of late deliveries (expedite costs, customer penalties)
4. Draft performance improvement plan with 30/60/90 day targets
5. Identify backup carriers for XYZ's lanes during the PIP period

### Scenario 3: New Lane Carrier Selection
**User:** "We're shipping to Phoenix for the first time next month — which carrier should we use?"
**Resolution:**
1. Identify all approved carriers with coverage on origin-Phoenix lane
2. Pull rates from each carrier's rate table for the expected weight range
3. Check carrier performance scores (exclude any D-rated carriers)
4. Recommend top 2 carriers with rate comparison and performance data
5. Flag if no approved carrier covers this lane and trigger carrier onboarding request

## Troubleshooting Guide

### Scorecard Showing No Data for a Carrier
**Cause:** Shipments not linked to carrier master in D365 TMS, or carrier assigned at load level rather than shipment level
**Fix:** Review TMS configuration for carrier assignment point; ensure carrier is mapped per shipment, not just per load

### Rate Negotiation Package Missing Lanes
**Cause:** Shipments moved under spot rates (not contracted lanes) not included in lane analysis
**Fix:** Pull both contracted and spot shipments; separate them in analysis but include spot volume as uncommitted volume in negotiation

### Market Benchmark Comparison Out of Date
**Cause:** External rate intelligence feed not refreshed, or only covering major lanes
**Fix:** Verify rate intelligence data feed frequency; for thin lanes, use DAT or Truckstop.com API for spot market comparison

### Carrier Approval Check Blocking Valid Carrier
**Cause:** Insurance certificate expired in system but carrier submitted renewal; processing lag in Dataverse
**Fix:** Implement a 7-day grace period flag that allows use while certificate is being processed; alert carrier relations team immediately

### Invoice Accuracy Metric Incorrect
**Cause:** Rate master not updated after contract amendment; invoices compared against pre-amendment rates
**Fix:** Ensure rate master effective date is aligned with contract amendment date; check rate version history in TMSRateEntity

## Related Skills

- `returns-reverse-logistics` (IV-LOG-002) - Returns and inbound freight management
- `logistics-exception-management` - Freight exception handling when carrier issues cause delays

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
