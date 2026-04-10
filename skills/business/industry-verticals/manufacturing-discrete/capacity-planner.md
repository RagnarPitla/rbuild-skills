---
name: Production Capacity Planner
slug: capacity-planner
description: AI agent for production capacity analysis — work center loads, bottleneck identification, and capacity leveling recommendations in D365.
tab: business
domain: industry-verticals
industry_vertical: manufacturing-discrete
difficulty: advanced
source_type: ragnar-custom
tags: "[\"manufacturing\", \"capacity\", \"production\", \"scheduling\", \"d365\"]"
version: 1.0.1
icon_emoji: ⚖️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Production Capacity Planning"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Production Capacity Planner

After master planning generates planned production orders, someone needs to check whether the work centers can actually handle the load. That's historically a manual, time-consuming process. This agent automates it.

## What the Agent Does

1. Reads planned/firm production orders from D365 for the next 4 weeks
2. For each order, reads the routing to identify which work centers are involved
3. Calculates total required hours per work center per day
4. Compares to available capacity (shifts, efficiency factors, planned downtime)
5. Identifies overloads (>100% capacity) and significant underloads (<60%)
6. Recommends: split orders, move start dates, use alternative work centers
7. Outputs a capacity exception report for the planning team

## D365 Data Required

| Data | D365 Source |
|---|---|
| Planned orders | ProdTableEntity (status = Planned) |
| Routing operations | ProdRouteEntity |
| Work center availability | WrkCtrTable + shift calendars |
| Work center efficiency | WrkCtrTable.Efficiency |
| Planned downtime | WrkCtrCapacity |

## Output Format

```
CAPACITY EXCEPTION REPORT — Week of [date]

OVERLOADED WORK CENTERS (action required):
Work Center: Assembly Cell A
  Monday: 142% load (11.4 hrs required / 8 hrs available)
  Contributing orders: PO-12345 (4h), PO-12367 (3.2h), PO-12401 (4.2h)
  Recommendation: Move PO-12401 start date to Tuesday (capacity available)

UNDERUTILIZED WORK CENTERS (opportunity):
Work Center: Painting Line 2
  Monday: 45% load (3.6 hrs required / 8 hrs available)
  Recommendation: Consider moving Painting operations from Line 1 overflow here
```

## Niyam Pattern Integration

Store capacity planning rules in Dataverse:
- Overload threshold (default: 100%)
- Alert threshold (default: 85%)
- Underload threshold (default: 60%)
- Allowed overtime % per work center
- Alternative work center mappings

When business rules change, update the Dataverse table — not the agent.

## Trigger Phrases

- "Help me with production capacity planner"
- "Production Capacity Planner"
- "How do I production capacity planner"

## Quick Example

> See `capacity-planner-example.md` in this folder for a full worked scenario with business impact.

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
