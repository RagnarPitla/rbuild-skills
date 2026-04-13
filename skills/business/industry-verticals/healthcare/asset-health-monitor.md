---
name: "asset-health-monitor"
slug: "asset-health-monitor"
description: "Monitors medical equipment health, maintenance schedules, and calibration compliance in healthcare and life sciences settings. Use when user says \"equipment calibration due\", \"asset maintenance\", \"equipment qualification\", \"MTBF analysis\", \"overdue calibration\", \"medical device maintenance\", or \"equipment downtime tracking\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "healthcare"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "healthcare", "asset-management", "gmp"]
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



# Medical Asset Health Monitor

Medical equipment requires rigorous maintenance and calibration tracking. Regulatory compliance (FDA, ISO 13485) mandates documented maintenance records. This agent keeps equipment compliant and available.

## What the Agent Monitors

**Preventive maintenance due dates**
- Reads equipment maintenance schedules from D365 Asset Management
- Alerts maintenance teams 2 weeks before due date
- Escalates overdue maintenance to department heads
- Generates work orders automatically for scheduled tasks

**Calibration compliance**
- Tracks calibration certificates and expiry dates per instrument
- Alerts lab managers 30 days before expiry
- Flags equipment where calibration has lapsed (critical: should not be used)
- Integrates with calibration service provider scheduling

**Equipment utilization**
- Identifies underutilized equipment (candidates for redeployment or disposal)
- Identifies over-utilized equipment (candidates for backup/redundancy)

**Downtime tracking**
- Records unplanned downtime events
- Calculates Mean Time Between Failures (MTBF) per equipment type
- Flags equipment with deteriorating reliability for engineering review

## Regulatory Integration

For FDA 21 CFR Part 11 compliant environments, all agent actions are logged with:
- Timestamp
- User identity (electronic signature)
- Action taken
- Reason for action

Store compliance configuration in Dataverse: which equipment classes require which compliance level, calibration frequency, documentation requirements.

## Trigger Phrases

- "equipment calibration due"
- "asset maintenance schedule"
- "equipment qualification"
- "MTBF analysis"
- "overdue calibration"
- "medical device maintenance"
- "equipment downtime tracking"
- "calibration certificate expired"

## Quick Example

> See `asset-health-monitor-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Calibration alert not firing before expiry | Advance notice window not configured for this equipment class | Set the calibration alert lead time (default 30 days) in the Dataverse compliance configuration table for the relevant equipment class |
| Equipment shows as compliant but calibration certificate is expired | Certificate expiry date not updated after last calibration service | Update the certificate expiry date in D365 Asset Management after each calibration; use the agent's calibration update workflow to automate this |
| MTBF calculation appears incorrect for new equipment | Insufficient failure history (fewer than 3 failure events) | MTBF requires at least 3 data points to be statistically meaningful; flag the equipment as "insufficient data" and rely on manufacturer MTBF until history accumulates |
| Work orders not generating automatically for PM due dates | Automatic work order creation not enabled for the asset type | Enable the automatic work order creation flag in D365 Asset Management for the relevant maintenance plan and functional location |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
