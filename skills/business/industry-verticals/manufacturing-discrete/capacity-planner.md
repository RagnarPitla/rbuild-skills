---
name: "capacity-planner"
slug: "capacity-planner"
description: "Analyzes production capacity in D365 by calculating work center loads, identifying bottlenecks, and recommending capacity leveling actions. Use when user says \"capacity planning\", \"work center utilization\", \"overloaded work center\", \"capacity exception\", \"production scheduling\", \"bottleneck analysis\", or \"available capacity\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "manufacturing-discrete"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "manufacturing", "capacity", "planning"]
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

- "capacity planning"
- "work center utilization"
- "overloaded work center"
- "capacity exception"
- "bottleneck analysis"
- "available capacity"
- "production scheduling capacity"
- "shift capacity load"

## Quick Example

> See `capacity-planner-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Work center shows 0% load even though production orders are planned | Routing operations not linked to the work center in D365 | Verify the route version is active and the operation resource requirement points to the correct work center; run the route scheduling job after updating |
| Capacity report shows overload but work center is actually idle | Efficiency factor set incorrectly (e.g., 10% instead of 100%) | Check the WrkCtrTable efficiency field for the affected work center; correct the efficiency percentage so available hours calculate correctly |
| Alternative work center recommendations not appearing | Alternative resource mappings not configured in Dataverse policy table | Add the alternative work center relationships to the Dataverse capacity policy table; map primary to secondary with applicable product families |
| Planned downtime not reducing available capacity | Downtime entered in the wrong calendar or not linked to the work center | Create the planned downtime record directly on the work center calendar in D365; confirm the date range and shift assignments are correct |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
