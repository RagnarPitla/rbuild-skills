---
name: Energy Procurement Advisor
slug: energy-procurement
description: Optimize electricity and gas procurement — tariff analysis, demand charge management, contract timing, and renewable certificate tracking.
tab: business
domain: industry-verticals
industry_vertical: energy-utilities
difficulty: advanced
source_type: ragnar-custom
tags: "[\"energy\", \"procurement\", \"utilities\", \"tariff\", \"sustainability\"]"
version: 1.0.1
icon_emoji: ⚡
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references: "[]"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Energy Procurement Advisor

Energy is a significant cost for manufacturing, data centers, and large commercial facilities. This agent analyzes consumption, optimizes procurement strategy, and tracks sustainability commitments.

## Key Capabilities

### Tariff Analysis and Optimization
- Compares current tariff against available alternatives
- Calculates annual cost under each tariff structure (demand charges, time-of-use rates, flat rates)
- Models impact of load-shifting strategies on total energy cost
- Recommends tariff structure best suited to the facility's consumption pattern

### Demand Charge Management
Demand charges (billed on peak 15-minute interval) can represent 30-50% of commercial electricity bills.

The agent:
- Monitors real-time demand approaching billing period peak
- Alerts operations when demand is approaching a new peak
- Recommends which loads to shed or shift to avoid setting a new peak
- Tracks demand charge exposure for the current billing month

### Contract Timing Intelligence
- Monitors forward energy prices (gas, power)
- Alerts when prices are in favorable range for fixing/hedging
- Provides procurement window recommendations based on price trends
- Tracks contract expiration dates and starts re-procurement process

### Renewable Energy Certificate (REC) Tracking
- Tracks REC inventory vs sustainability commitments
- Projects REC needs for remainder of compliance year
- Identifies optimal procurement window for additional RECs
- Generates sustainability reporting data for ESG reporting

## Integration Data Sources

| Data | Source |
|---|---|
| Consumption data | Smart meters / utility bills |
| Current tariff rates | Utility rate schedules |
| Forward prices | Energy market data feed |
| REC inventory | REC registry account |
| Sustainability targets | Dataverse policy table |
| Facility schedules | ERP / facility management system |

## Trigger Phrases

- "Help me with energy procurement advisor"
- "Energy Procurement Advisor"
- "How do I energy procurement advisor"

## Quick Example

> See `energy-procurement-example.md` in this folder for a full worked scenario with business impact.

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
