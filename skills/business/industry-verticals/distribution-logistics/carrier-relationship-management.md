---
name: "Carrier Relationship Management"
slug: "carrier-relationship-management"
description: "Manage carrier portfolios, rate negotiations, performance tracking, and carrier selection optimization in D365 Transportation."
tab: "business"
domain: "industry-verticals"
industry_vertical: "distribution-logistics"
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["logistics", "carrier", "freight", "d365", "transportation"]
version: "1.0"
icon_emoji: "🚛"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "D365 Transportation Management"
    url: "https://learn.microsoft.com/en-us/dynamics365/supply-chain/transportation/transportation-management-overview"
---

# Carrier Relationship Management

Managing a carrier portfolio means constant balancing: rate competitiveness, service reliability, capacity availability, and relationship management. This agent handles the data analysis so logistics managers can focus on the strategy.

## Carrier Performance Scorecard

The agent calculates rolling performance metrics per carrier:

| Metric | Calculation | Weight |
|---|---|---|
| On-time delivery | % shipments delivered on promised date | 35% |
| Claim rate | $ claims / $ freight spend | 25% |
| Rate competitiveness | Carrier rate vs market benchmark | 20% |
| Transit time accuracy | Actual vs quoted transit days | 10% |
| Invoice accuracy | % invoices matching quoted rate | 10% |

**Score bands:**
- A (85-100): Preferred carrier, priority capacity allocation
- B (70-84): Approved carrier, standard use
- C (55-69): Performance improvement plan required
- D (<55): Review for removal from approved list

## Rate Negotiation Prep

When a carrier contract comes up for renewal, the agent prepares:

1. **Volume history:** Actual shipments and revenue over contract period by lane
2. **Performance summary:** Scorecard over the contract period
3. **Market rate comparison:** Current market rates for key lanes
4. **Leverage analysis:** What % of this carrier's volume are we? What's our alternative?
5. **Negotiation targets:** Suggested rate ask per lane based on volume commitment

## Carrier Selection for Shipments

For each shipment, the agent recommends the optimal carrier:

```
Inputs:
- Origin/destination
- Weight, dimensions, commodity
- Required delivery date
- Special requirements (temperature, hazmat, white glove)

Agent checks:
1. Approved carriers for this lane
2. Current rates from rate management system
3. Carrier capacity availability
4. Current carrier performance score
5. Applies any blackouts (carrier on performance plan)

Output: Ranked carrier recommendations with rate and estimated transit time
```

## Integration Points

- D365 Transportation Management: shipment history, carrier master, rate tables
- Carrier APIs: real-time rate quotes (where available)
- Claims system: damage and shortage claim data
- Market rate benchmarks: external rate intelligence service
