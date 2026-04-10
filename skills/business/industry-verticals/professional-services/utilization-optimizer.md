---
name: utilization-optimizer
description: Analyze consultant utilization rates and recommend reallocation to hit target utilization, maximize billability, and identify resource conflicts. Use when user says "project utilization", "billable hours", "resource allocation", "bench time", "utilization report", or "consultant availability".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, professional-services, utilization, billable-hours]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Utilization Optimizer

Utilization — the percentage of time consultants spend on billable work — is the primary profitability driver in professional services. A 5% improvement in utilization across a 100-person firm at $200/hour represents $2M in additional billable revenue annually. This agent monitors actual vs target, surfaces under and over-utilization, and recommends specific reallocation actions.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-PS-002 |
| Name | utilization-optimizer |
| Category | Industry Vertical / Professional Services |
| Module | D365 Project Operations |
| Complexity | Intermediate |
| Prerequisites | D365 Project Operations with timesheet actuals, resource bookings, and skill catalog |

## Description

Produces weekly utilization dashboards by consultant and practice, identifies consultants in critical (under 50%) and overloaded (over 95%) ranges, recommends specific project assignments based on skill match and availability, and flags conflicts before they impact delivery.

## Triggers

- "project utilization"
- "billable hours"
- "resource allocation"
- "bench time"
- "utilization report"
- "consultant availability"
- "resource conflict"
- "utilization target"
- "who is on bench"

## Core Tasks

### 1. Calculate Utilization by Consultant
```text
GIVEN timesheet actuals are available in D365 Project Operations
WHEN the agent calculates utilization for the period
THEN pull billable hours, non-billable project hours, and bench time per consultant
AND calculate billable utilization: billable hours / total available hours
AND calculate resource utilization: (billable + non-billable project) / total available
AND compare to target utilization from Dataverse policy table (typically 75-85%)
AND flag consultants below critical threshold and above overload threshold
```

### 2. Identify Reallocation Opportunities
```text
GIVEN under-utilized consultants are identified
WHEN the agent looks for open demand
THEN find open project resource requests that match the consultant's skill profile
AND check project start dates and durations against consultant's availability window
AND calculate the utilization improvement from each potential assignment
AND rank recommendations by fit score (skill match x availability alignment)
AND present top 3 assignments per under-utilized consultant to practice leader
```

### 3. Detect Resource Conflicts
```text
GIVEN forward resource bookings exist in D365
WHEN the agent scans for conflicts in the next 12 weeks
THEN identify consultants booked over 100% in any week
AND flag key person dependencies (project requires one specific consultant who is near full capacity)
AND identify upcoming skill gaps (projects starting that require skills with no available resource)
AND calculate business impact of each conflict (revenue at risk, project delay probability)
```

### 4. Notify Bench Availability to Sales
```text
GIVEN a consultant has significant bench time opening in the next 2-4 weeks
WHEN the agent detects the availability window
THEN identify the consultant's skill profile and industry experience
AND notify the sales team and account managers who work in relevant industries
AND generate an availability summary card with skills, availability dates, and rate
AND track whether the availability window is filled from the notification
```

## Utilization Calculations

```
Available hours = Working days in period x 8 hours
(Excludes approved vacation, public holidays, approved leave)

Billable utilization = Billable project hours / Available hours
Resource utilization = (Billable + non-billable project hours) / Available hours
Bench time = Available hours - (Billable + non-billable project hours) - training

Example:
  Consultant: Sarah Chen, April 2026
  Available hours:      168 (21 working days x 8 hours)
  Billable hours:       112
  Non-billable (proposals, training): 24
  Bench time (unallocated): 32

  Billable utilization:  112/168 = 66.7%  (TARGET: 78%)
  Resource utilization:  136/168 = 81.0%
  Gap to target:         11.3 pp = 19 hours of unbooked billable capacity
```

## Weekly Utilization Dashboard

```
UTILIZATION REPORT — Week of April 7, 2026
Practice: Enterprise Cloud | 24 consultants

CRITICAL (below 50% utilization — immediate action needed):
  James Kim     — 32%  Project ended Apr 1, no new assignment
  Maria Santos  — 41%  Client reduced scope on active engagement

BELOW TARGET (50-70% utilization):
  David Park    — 65%  Partially on bench due to project delay
  [3 more consultants]

ON TARGET (70-90%):
  [17 consultants]

OVERLOADED (above 95% — burnout risk):
  Lisa Chen     — 108%  Two full projects plus proposal support
  [1 more]

RECOMMENDATIONS:
  1. Assign James Kim to Project Contoso (8 hrs/week needed, skill match: high)
  2. Reduce Lisa Chen's proposal involvement — delegate to Rachel Park (65% utilization)
  3. Maria Santos: Available for Project Delta starting Apr 15 (profile match confirmed)
```

## Utilization Bands and Actions

| Band | Utilization | Status | Action |
|------|-------------|--------|--------|
| Critical low | Below 50% | Bench risk | Immediate reallocation; check pipeline |
| Below target | 50-69% | Partial bench | Find additional assignment or project extensions |
| On target | 70-90% | Healthy | Monitor; no action needed |
| High | 91-95% | Watch zone | Flag if sustained more than 2 weeks |
| Overloaded | Above 95% | Burnout risk | Reduce non-billable commitments; add resource |

Target utilization in Dataverse policy table. Standard professional services targets: 75-85% billable for delivery staff, 50-65% for managers and practice leads.

## Resource Conflict Detection

```
Double-booking:
  Consultant allocated to Project A (50%) + Project B (80%) in same week = 130%
  Action: Which project gives? Escalate to both PMs to negotiate

Key person dependency:
  Project requires J. Smith for architecture review (only qualified resource)
  J. Smith is already at 90% next month
  Action: Either reserve capacity now or identify and upskill backup resource

Skill gap:
  New D365 Finance project starts June 1 needing 2 certified resources
  Only 1 certified D365 Finance resource available in practice
  Action: Source from another practice, hire contract resource, or defer project start
```

## Integration with D365 Project Operations

| Data | Source |
|------|--------|
| Resource bookings | BookableResourceBookingEntity (hard and soft bookings) |
| Timesheet actuals | TSTimesheetLineEntity |
| Project forecasts | ProjForecastEmplEntity |
| Resource skills | HcmWorkerSkillEntity |
| Available resources | BookableResourceEntity |
| Utilization targets | Dataverse policy table |

## Common Scenarios

### Scenario 1: Practice Leader Monday Review
**User:** "Show me this week's utilization across my team"
**Resolution:**
1. Pull all resource bookings and timesheet actuals for the practice for current week
2. Calculate billable utilization per consultant
3. Generate tiered report: critical, below target, on target, overloaded
4. For each critical consultant: show next open demand that matches their profile
5. For each overloaded consultant: show which project or task can be delegated

### Scenario 2: Sales Won a New Project
**User:** "We just won Project Aurora — 3 consultants for 6 months starting May 1. Who do we assign?"
**Resolution:**
1. Pull project requirements from the quote (roles, skills, weeks)
2. Search for consultants with matching skills and availability starting May 1
3. Check that assignment does not push any consultant above utilization ceiling
4. Run APA-style conflict check for the proposed assignments
5. Generate resourcing proposal for practice leader approval

### Scenario 3: End of Quarter Utilization Shortfall
**User:** "We're tracking below our utilization target for Q2 — what happened?"
**Resolution:**
1. Pull actual billable hours vs available hours by week for Q2
2. Identify which consultants or weeks drove the gap
3. Trace root cause: project delays, scope reductions, bench buildup, high non-billable?
4. Calculate revenue impact of the utilization miss vs target
5. Identify actions for Q3: pipeline focus, bench projects, non-billable reduction

## Troubleshooting Guide

### Utilization Report Showing Zero for Consultants Who Are Working
**Cause:** Timesheets not submitted or approved in D365; agent reads approved timesheet lines only
**Fix:** Run timesheet compliance report separately; agent should flag unapproved timesheets as a data quality issue in the dashboard

### Reallocation Recommendations Not Matching Practice's Priorities
**Cause:** Agent matching on skills only, not on client relationship history or strategic account status
**Fix:** Add account priority flag to Dataverse; agent should prefer assignments on strategic accounts over standard accounts when skill match is equal

### Double-Booking Not Detected
**Cause:** One booking is a soft (tentative) booking; agent only counting hard bookings in utilization
**Fix:** Include soft bookings at configurable weight (e.g., 50% of hours in utilization count); set in Dataverse policy

### Utilization Target Showing Wrong Threshold
**Cause:** Target differs by consultant level (Associate vs Senior vs Manager) but Dataverse has a single flat target
**Fix:** Update Dataverse policy table with utilization targets by career level; align with workforce management policy

### Bench Availability Notification Sent Too Early
**Cause:** Agent alerting sales when availability window is 6+ weeks out; too early for actionable pipeline
**Fix:** Set notification lead time in Dataverse policy (e.g., alert when bench time opens within 3 weeks); keep a secondary 8-week heads-up for senior/specialized resources

## Related Skills

- `apa-review` (IV-PS-001) - Quote validation that uses resource availability data from this agent

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
