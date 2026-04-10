---
name: Utilization Optimizer
slug: utilization-optimizer
description: Analyze consultant utilization rates and recommend reallocation to hit target utilization, maximize billability, and identify resource conflicts.
tab: business
domain: industry-verticals
industry_vertical: professional-services
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"professional-services\", \"utilization\", \"resource-management\", \"d365\", \"project\"]"
version: 1.0.1
icon_emoji: 📈
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Project Operations"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Utilization Optimizer

Utilization — the percentage of time consultants spend on billable work — is the primary profitability driver in professional services. A 5% improvement in utilization across a 100-person firm at $200/hour represents $2M in additional billable revenue annually.

## Utilization Metrics

**Billable utilization:** Billable hours / Total available hours
**Resource utilization:** (Billable + non-billable project hours) / Total available hours
**Target:** Typically 75-85% billable utilization for delivery staff

```
Consultant: Sarah Chen
Available hours this month: 168
Billable hours: 112
Non-billable (proposals, training): 24
Bench time (unallocated): 32

Billable utilization: 112/168 = 66.7% (TARGET: 78%)
Gap: 11.3 percentage points = 19 hours
```

## Weekly Utilization Dashboard

The agent produces a weekly report for practice leaders:

```
UTILIZATION REPORT — Week of April 7, 2026
Practice: Enterprise Cloud | 24 consultants

CRITICAL (< 50% utilization, immediate action needed):
  James Kim      — 32% (project ended Apr 1, no assignment)
  Maria Santos   — 41% (client engagement reduced scope)

BELOW TARGET (50-70% utilization):
  David Park     — 65% (partially on bench due to project delay)
  [3 more]

ON TARGET (70-90%):
  [17 consultants]

OVERLOADED (> 95%, burnout risk):
  Lisa Chen      — 108% (two full-time projects + proposal support)
  [1 more]

RECOMMENDATIONS:
  1. Assign James Kim to Project Contoso (8 hrs/week needed, skill match: ✓)
  2. Reduce Lisa Chen's proposal involvement — delegate to junior consultant
  3. Maria Santos: Available for new project, matches Contoso Phase 2 profile
```

## Resource Conflict Detection

The agent identifies conflicts before they become problems:

**Double-booking:** Consultant allocated 120% in a future week — which project gives?

**Key person dependency:** Project requires one specific consultant who is already 90% allocated — create backup plan.

**Skill gap:** Upcoming project needs a D365 Finance expert but none are available — hire or subcontract.

## Integration with D365 Project Operations

Data sources:
- Resource bookings (confirmed and tentative)
- Timesheet actuals (for historical utilization)
- Project forecasts (upcoming demand)
- Resource skill catalog (for matching)
- Bench tracking (available resources)

Actions the agent can trigger:
- Notify practice lead of under/over utilization
- Send availability alerts to sales when bench time opens
- Generate "available for assignment" notifications for specific skill combinations

## Trigger Phrases

- "Help me with utilization optimizer"
- "Utilization Optimizer"
- "How do I utilization optimizer"

## Quick Example

> See `utilization-optimizer-example.md` in this folder for a full worked scenario with business impact.

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
