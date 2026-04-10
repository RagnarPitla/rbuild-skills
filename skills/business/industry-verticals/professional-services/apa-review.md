---
name: Project Quotation Validator
slug: apa-review
description: Validate professional services project quotations — margin analysis, resource fit, scope risk assessment, and approval routing.
tab: business
domain: industry-verticals
industry_vertical: professional-services
difficulty: advanced
source_type: ragnar-custom
tags: "[\"professional-services\", \"quotation\", \"project\", \"d365\", \"validation\"]"
version: 1.0.1
icon_emoji: 📋
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


# Project Quotation Validator

Professional services firms routinely under-price projects due to optimistic scope assumptions, inadequate risk buffers, and failure to check resource availability. This agent validates quotations before they're submitted.

## Validation Checks

### Financial Validation
- **Gross margin check:** Is the quoted margin above the minimum threshold? (From Niyam policy table by project type)
- **Billing rate validation:** Are the rates quoted within approved range for each role?
- **Discount authorization:** Does the discount level require additional approval?
- **Currency exposure:** For international projects, has currency risk been priced in?

### Resource Validation
- **Availability check:** Are the named resources available for the proposed timeline?
- **Skill fit:** Do the proposed resources have the required skills for this project type?
- **Utilization impact:** Does this project push any resource over the utilization threshold?
- **Key person risk:** Is the project dependent on 1-2 individuals? (Risk flag)

### Scope Risk Assessment
The agent reads the statement of work and flags common risk patterns:
- Open-ended deliverable language ("provide recommendations" vs "deliver X specific reports")
- Missing acceptance criteria
- Client dependency items (what happens if client doesn't deliver?)
- Technology risk (uses bleeding-edge tech with limited firm experience?)
- Timeline compression (does the timeline allow for rework and review?)

### Approval Routing

Based on validation results:
```
All checks pass, margin > 25% → Auto-approve
Any check fails OR margin 15-25% → Route to Practice Lead
Margin < 15% OR multiple failures → Route to Managing Director
Revenue > threshold → Route to CFO regardless of margin
```

## Output for the Pursuit Team

```
QUOTATION VALIDATION REPORT
Project: [Name] | Client: [Client] | Submitted by: [Person]

✅ APPROVED for submission

Issues identified (non-blocking):
⚠️ Resource availability: J. Smith has 85% utilization in month 2 — 
   consider backup resource or timeline shift
⚠️ Scope language: SOW section 3.2 uses open-ended language —
   recommend adding "up to 3 revision rounds" qualifier

Margin: 28% ✅ (minimum: 20%)
Discount: 5% ✅ (maximum without approval: 10%)
Approval level: Practice Lead required (margin 20-30%)
```

## D365 Project Operations Integration

Reads from:
- Project quotation lines (pricing, roles, hours)
- Resource bookings (availability)
- Skill catalog (resource qualifications)
- Historical project margins (for similar projects)
- Policy tables (Niyam pattern for thresholds)

## Trigger Phrases

- "Help me with project quotation validator"
- "Project Quotation Validator"
- "How do I project quotation validator"

## Quick Example

> See `apa-review-example.md` in this folder for a full worked scenario with business impact.

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
