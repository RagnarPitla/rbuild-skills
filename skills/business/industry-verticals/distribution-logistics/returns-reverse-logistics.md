---
name: Returns & Reverse Logistics
slug: returns-reverse-logistics
description: Automate returns authorization, receipt inspection, disposition decisions, and refund/credit processing in D365 Commerce and SCM.
tab: business
domain: industry-verticals
industry_vertical: distribution-logistics
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"logistics\", \"returns\", \"reverse-logistics\", \"d365\", \"commerce\"]"
version: 1.0.1
icon_emoji: ↩️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Sales Returns"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Returns & Reverse Logistics

Returns processing is a high-touch, high-cost operation that most companies handle poorly. The agent streamlines authorization, disposition, and financial settlement.

## Returns Process Flow

```
Customer requests return
    ↓
Agent validates: Is it within return window? Is it a returnable item?
    ↓
Return Merchandise Authorization (RMA) issued automatically (if eligible)
    ↓
Customer ships back
    ↓
Receiving team inspects — records condition in D365
    ↓
Agent applies disposition rules (from Niyam policy table)
    ↓
Disposition executed: Restock / Refurbish / Scrap / Return to vendor
    ↓
Credit memo or refund issued
    ↓
Inventory updated
```

## RMA Authorization Logic

The agent evaluates return eligibility automatically:

```
Policy checks (from Dataverse policy table):
- Return window: Is return within [policy] days of purchase?
- Returnable item: Is this item marked as returnable?
- Original purchaser: Does the customer match the original order?
- Condition requirement: New-in-box only? Any condition?

Auto-approve if: All policy checks pass
Route to CS manager if: Any policy exception
Auto-deny if: Outside return window AND no exception policy applies
```

## Disposition Rules (Niyam Pattern)

Store disposition rules in Dataverse by product category:

| Category | Condition: Like New | Condition: Good | Condition: Damaged |
|---|---|---|---|
| Electronics | Restock (Grade A) | Refurbish | Scrap or vendor |
| Clothing | Restock | Discount bin | Donate/scrap |
| Consumables | Destroy (health/safety) | Destroy | Destroy |
| Capital Equipment | Inspect further | Service and restock | Repair assess |

Agent reads the applicable rule and initiates the disposition action in D365.

## Financial Settlement

After disposition:
- **Restock:** Full credit to customer
- **Refurbish:** Credit minus refurbishment cost (from standard cost table)
- **Scrap:** Credit minus scrap deduction (from policy table percentage)
- **Deny:** No credit, return shipping at customer expense

Agent creates the credit memo in D365 AR with the correct amount and reason code. For refunds vs credits: reads customer preference or applies business rule.

## Returns Analytics

Monthly agent report:
- Return rate by product category (flag categories over threshold)
- Top return reasons (quality issues? Sizing? Buyer's remorse?)
- Refurbishment yield rate
- Net recovery rate per returned unit
- Cost of returns processing per RMA

## Trigger Phrases

- "Help me with returns & reverse logistics"
- "Returns & Reverse Logistics"
- "How do I returns & reverse logistics"

## Quick Example

> See `returns-reverse-logistics-example.md` in this folder for a full worked scenario with business impact.

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
