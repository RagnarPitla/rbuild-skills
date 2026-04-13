---
name: "batch-order-manager"
slug: "batch-order-manager"
description: "Manages pharmaceutical and process manufacturing batch orders including potency adjustments, yield tracking, and GxP compliance checkpoint enforcement. Use when user says \"batch order\", \"create batch\", \"batch yield\", \"batch progress\", \"process manufacturing compliance\", \"batch record assembly\", or \"GxP checkpoint\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "manufacturing-process"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "manufacturing", "batch-order", "process-manufacturing"]
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

- "batch order"
- "create batch"
- "batch yield"
- "batch progress tracking"
- "process manufacturing compliance"
- "batch record assembly"
- "GxP checkpoint"
- "batch phase monitoring"

## Quick Example

> See `batch-order-manager-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Batch order formula quantity not adjusting for potency | Potency adjustment flag not enabled on the formula line for active ingredients | Set the "Potency" flag on the relevant formula line in D365 Process Manufacturing; link the item to the potency attribute and specify the target potency |
| Yield deviation not triggering investigation | Yield threshold not configured for this product in Dataverse policy table | Add the acceptable yield range (e.g., 95-102%) to the Dataverse batch policy table for the product; the agent compares actual yield against this range |
| Compliance checkpoint blocking production advance with no clear reason | Checkpoint condition logic evaluates to null rather than pass or fail | Review the checkpoint condition in Dataverse; ensure all required input fields (e.g., environmental monitoring result) have data before the checkpoint evaluates |
| Batch record assembly missing equipment usage records | Equipment usage not recorded at the work center during batch execution | Require equipment ID entry at each production phase in D365; use the agent's batch record gap detection to identify which phases are missing equipment references before QA review |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
