---
name: "automotive-dealer-ops"
slug: "automotive-dealer-ops"
description: "AI agent patterns for automotive dealer operations covering parts inventory, service scheduling, warranty claims, and customer follow-up. Use when user says \"dealer operations\", \"parts inventory\", \"service bay\", \"dealer network performance\", \"dealer agent\", or \"automotive CRM\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "automotive"
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "automotive", "dealer", "operations"]
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


# Automotive Dealer Operations Agent

Automotive dealers operate at the intersection of parts management, service scheduling, sales, and customer relationships. Each area generates high-frequency decisions that an agent can handle faster and more consistently than manual processes.

## Skill Metadata

| Field | Value |
|-------|-------|
| Skill ID | IV-AUTO-001 |
| Name | automotive-dealer-ops |
| Category | Industry Vertical / Automotive |
| Module | D365 Commerce, SCM, CRM, Service |
| Complexity | Intermediate |
| Prerequisites | DMS API access or D365 integration, Dataverse policy tables |

## Description

Dealer operations involve hundreds of daily decisions: which parts to reorder, which service bay to assign a vehicle, which warranty claims to submit, which customers to follow up with. This agent handles that decision layer so service managers and parts advisors can focus on the customer.

## Triggers

- "dealer operations"
- "parts inventory"
- "service bay scheduling"
- "dealer network performance"
- "dealer agent"
- "automotive CRM"
- "reorder parts"
- "service scheduling"
- "customer follow-up"
- "dealer scorecard"

## High-Value Agent Use Cases

### Parts Inventory Advisor

```text
GIVEN a parts advisor needs to manage reorder decisions
WHEN the agent scans current inventory against reorder points
THEN identify all fast-moving parts below reorder threshold
AND calculate fill rate impact of each stockout
AND suggest emergency transfer from nearest dealer location with stock
AND generate supplier order recommendation with quantities
```

Key tables:
- `InventOnHandV2` (on-hand quantities per warehouse)
- `InventItemOrderSetup` (reorder points, lead times)
- `WHSInventReservHierarchy` (reservation structure)

### Service Bay Scheduler

```text
GIVEN a service advisor receives a new repair order
WHEN the agent evaluates available capacity
THEN match the repair type to technicians with the required skill certification
AND optimize bay assignment to balance workload across the day
AND proactively notify customer if expected wait exceeds original quote
AND escalate vehicles requiring additional authorization to the service manager
```

Skill certifications stored in Dataverse worker competency table. Agent reads current bay load from D365 Production (if using D365 as DMS) or DMS API.

### Warranty Claim Processor

```text
GIVEN a repair order closes with a warranty-eligible repair
WHEN the agent evaluates claim eligibility
THEN validate coverage period, component coverage, and maintenance compliance
AND auto-code the failure with Fault Code, Cause Code, and Corrective Action Code
AND prepare claim submission package for OEM reimbursement portal
AND track claim status and flag rejections with the rejection reason and resolution path
```

### Customer Follow-Up Agent

```text
GIVEN a vehicle service is marked complete in the DMS
WHEN the agent triggers follow-up logic
THEN send a follow-up message at the optimal timing window (24-48 hours post-service)
AND route any negative sentiment response to the service manager before it reaches a review site
AND flag customers past their scheduled maintenance interval for proactive outreach
```

## Data Sources in Dealer DMS

Most dealer management systems (CDK, Reynolds and Reynolds, DealerSocket) provide APIs. For D365-integrated dealers:

| Data | D365 Entity |
|------|-------------|
| Parts inventory | InventOnHandV2 |
| Customer records | CustomersV3 + CRM customer entity |
| Service records | Custom Dataverse tables or DMS API |
| Warranty terms | Custom policy table (Niyam pattern) |
| Technician skills | HcmWorkerSkillEntity |
| Vehicle history | Custom vehicle service history table |

## Dealer Network Performance Monitoring

The agent tracks KPIs across dealer locations:

| KPI | Formula | Alert Threshold |
|-----|---------|----------------|
| Parts fill rate | Orders filled same day / total orders | Below 90% |
| Bay utilization | Productive labor hours / available hours | Below 75% |
| Warranty approval rate | Claims approved / claims submitted | Below 85% |
| Service CSI score | Customer survey average | Below 4.2/5.0 |
| Gross profit per RO | (Parts + labor revenue - cost) / RO count | Below target |

## Common Scenarios

### Scenario 1: Parts Stockout Alert
**User:** "Which parts are we going to run out of this week?"
**Resolution:**
1. Query InventOnHandV2 for current stock at dealer location
2. Calculate daily usage rate from last 30 days of repair orders
3. Project days-of-supply for each part number
4. Flag parts with less than 3 days of supply
5. Check sister dealer stock for emergency transfer candidates

### Scenario 2: Service Advisor Handoff
**User:** "Which vehicles are waiting longer than their estimated time?"
**Resolution:**
1. Pull all open repair orders with promised time
2. Compare promised completion vs current time
3. Identify vehicles past promised time or within 30 minutes of it
4. Generate customer notification drafts for service advisor review
5. Flag vehicles needing authorization increase

### Scenario 3: Monthly Warranty Review
**User:** "What's our warranty rejection rate this month?"
**Resolution:**
1. Query all warranty claims submitted in the period
2. Calculate approval rate overall and by claim type
3. Identify top rejection reasons
4. Flag technicians with high rejection rates for coaching
5. Identify missed recovery opportunities from uncoded repairs

## Troubleshooting Guide

### Parts Agent Not Finding Reorder Candidates
**Cause:** Reorder point not set in InventItemOrderSetup, or inventory dimension mismatch
**Fix:** Verify reorder point is configured per site and warehouse, not just at item level

### Wrong Technician Assignment
**Cause:** Skill certification table not updated after training completion
**Fix:** Review HcmWorkerSkillEntity for technician certifications, update competency records

### Warranty Claim Submission Failures
**Cause:** Missing or incorrect Fault Code / Cause Code / Corrective Action Code combination
**Fix:** Validate against OEM code library; agent should flag invalid combinations before submission, not after

### Service Bay Utilization Showing 0%
**Cause:** Production scheduling module not connected or labor routings not configured
**Fix:** Confirm D365 Production is in use for labor tracking, or connect to DMS API for bay data

### Customer Follow-Up Not Triggering
**Cause:** Repair order status not transitioning correctly to "complete" in Dataverse
**Fix:** Review Power Automate flow trigger condition, confirm status field mapping from DMS to Dataverse

## Related Skills

- `vin-configuration-validator` (IV-AUTO-002) - Validates vehicle configuration before production
- `warranty-claim-analyzer` (IV-AUTO-003) - Deep warranty claim analytics and supplier recovery

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
