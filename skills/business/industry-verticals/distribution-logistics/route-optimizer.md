---
name: Route Optimizer
slug: route-optimizer
description: Optimize delivery routes against vehicle capacity, time windows, driver hours, and cost objectives — with D365 Transportation integration.
tab: business
domain: industry-verticals
industry_vertical: distribution-logistics
difficulty: advanced
source_type: ragnar-custom
tags: "[\"logistics\", \"routing\", \"delivery\", \"d365\", \"transportation\"]"
version: 1.0.1
icon_emoji: 🗺️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Transportation Management"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Route Optimizer

Last-mile delivery is expensive. Route optimization directly reduces mileage, fuel cost, and driver time — often by 15-25% vs manually planned routes.

## Optimization Inputs

The agent collects from D365 and Dataverse:

| Input | Source |
|---|---|
| Delivery stops (addresses, time windows) | Sales orders in D365 |
| Vehicle capacity (weight, volume, pallets) | Fleet table in Dataverse |
| Driver shift hours | Driver schedule |
| Current vehicle locations | GPS/telematics feed |
| Traffic conditions | External traffic API |
| Priority deliveries | Order priority flag in D365 |

## Optimization Constraints

**Hard constraints (must be satisfied):**
- Vehicle capacity cannot be exceeded
- Deliveries must occur within customer time windows
- Driver hours regulations cannot be violated
- Refrigerated cargo must stay on refrigerated vehicles

**Soft constraints (minimize violations):**
- Prefer early delivery windows when possible
- Minimize total driving distance
- Balance workload across drivers
- Minimize late deliveries (penalized, not prohibited)

## Algorithm Approach

For practical fleet sizes (5-50 vehicles, 100-500 stops), the agent uses:
1. **Nearest neighbor heuristic** for initial route construction
2. **2-opt improvement** to remove route crossings
3. **Or-opt improvement** to relocate stops to better positions

For large fleets or complex constraints, call an external route optimization API (Google OR-Tools, HERE Routing, OptimoRoute).

## D365 Integration

After optimization:
- Creates load records in D365 Transportation Management
- Assigns orders to loads based on the optimized route
- Generates driver route cards with turn-by-turn stops
- Creates delivery manifests per vehicle

Updates during execution:
- Receives completion scans from drivers
- Identifies routes running late, reschedules remaining stops
- Generates real-time ETAs for customer service team

## Typical Results

| Metric | Typical Improvement |
|---|---|
| Total distance | -15 to -25% |
| Fuel cost | -12 to -20% |
| Deliveries per driver/day | +15 to +30% |
| On-time delivery rate | +5 to +15% |
| Driver hours | -10 to -20% |

Results vary significantly by starting point. Companies with manual routing see larger gains.

## Trigger Phrases

- "Help me with route optimizer"
- "Route Optimizer"
- "How do I route optimizer"

## Quick Example

> See `route-optimizer-example.md` in this folder for a full worked scenario with business impact.

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
