---
name: Batch Order Manager
slug: batch-order-manager
description: Manage pharmaceutical and process manufacturing batch orders — potency adjustments, yield tracking, and GxP compliance checkpoints.
tab: business
domain: industry-verticals
industry_vertical: manufacturing-process
difficulty: advanced
source_type: ragnar-custom
tags: "[\"manufacturing-process\", \"batch\", \"pharmaceutical\", \"d365\", \"compliance\"]"
version: 1.0.1
icon_emoji: 🧫
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Process Manufacturing"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Batch Order Manager

Process manufacturing (pharmaceutical, chemical, food/beverage) has unique requirements: batch tracking, potency adjustments, regulatory compliance, and yield optimization. This agent handles the operational complexity.

## Key Differentiators: Process vs Discrete Manufacturing

| Aspect | Discrete Manufacturing | Process Manufacturing |
|---|---|---|
| Output | Countable units (cars, phones) | Variable quantities (liters, kg) |
| Formula | Fixed BOM | Variable formula (potency-adjusted) |
| Tracking | Serial/lot numbers | Batch numbers with genealogy |
| Compliance | Quality inspection | GxP compliance, batch records |
| Scrap | Discrete rejects | Yield and loss tracking |

## Agent Capabilities

### Batch Creation and Formula Adjustment
- Reads raw material CoA (Certificate of Analysis) for active ingredient potency
- Calculates adjusted quantities to hit target assay strength
- Creates batch order with adjusted formula in D365
- Documents the adjustment for batch record

### Batch Progress Monitoring
- Tracks each phase (dispensing → mixing → granulation → coating → packaging)
- Alerts on phase delays that risk batch quality
- Monitors in-process test results against specifications
- Flags out-of-spec results for QA intervention

### Yield Analysis
- Compares expected yield vs actual yield per batch
- Identifies yield deviation trends by product, work center, operator
- Generates yield investigation triggers when deviation exceeds threshold

### Batch Record Assembly
- Aggregates all batch data (materials used, equipment, operators, test results)
- Generates batch manufacturing record for QA review
- Identifies incomplete documentation before it causes a deviation

## Compliance Gate Checkpoints

Configure mandatory checkpoints in Dataverse policy table:
- Environmental monitoring required before dispensing
- In-process testing at [step X] before proceeding
- QA sign-off required before packaging
- Second operator verification required for controlled substances

Agent enforces these gates — production cannot advance until checkpoint is satisfied.

## Trigger Phrases

- "Help me with batch order manager"
- "Batch Order Manager"
- "How do I batch order manager"

## Quick Example

> See `batch-order-manager-example.md` in this folder for a full worked scenario with business impact.

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
