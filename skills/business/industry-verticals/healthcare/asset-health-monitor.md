---
name: Medical Asset Health Monitor
slug: asset-health-monitor
description: Monitor medical equipment health, maintenance schedules, and calibration compliance in healthcare and life sciences settings.
tab: business
domain: industry-verticals
industry_vertical: healthcare
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"healthcare\", \"asset-management\", \"medical-equipment\", \"maintenance\", \"compliance\"]"
version: 1.0.1
icon_emoji: 🏥
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Asset Management"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
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

- "Help me with medical asset health monitor"
- "Medical Asset Health Monitor"
- "How do I medical asset health monitor"

## Quick Example

> See `asset-health-monitor-example.md` in this folder for a full worked scenario with business impact.

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
