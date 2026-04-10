---
name: Markdown Advisor
slug: markdown-advisor
description: Recommend markdown timing and depth for slow-moving inventory — sell-through rate analysis, margin targets, and seasonal curve modeling.
tab: business
domain: industry-verticals
industry_vertical: retail
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"retail\", \"markdown\", \"pricing\", \"inventory\", \"merchandising\", \"margin\"]"
version: 1.0.1
icon_emoji: 🏷️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "D365 Commerce Pricing"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Markdown Advisor

Inventory that doesn't sell at full price must eventually be marked down. The question is when and how much — too early and you leave margin on the table; too late and you're stuck with unsellable stock at season end.

## Markdown Decision Framework

The agent evaluates three factors for each SKU:

**1. Sell-through rate:** What percentage of inventory has sold?
```
Item: Women's Floral Blouse (SKU: WFB-442)
Initial inventory: 500 units
Units sold: 180 units
Sell-through: 36%

Season benchmark: By week 8, goal is 60% sell-through
Current week: 9
Status: 24 percentage points BEHIND target
```

**2. Remaining season:** How many weeks left to sell at full price?
```
Season end date: June 30
Current date: May 15
Weeks remaining: 6.5
Weekly sell rate at current pace: 18 units/week
Expected sell-through in 6.5 weeks: 18 × 6.5 = 117 additional units
Projected total sell-through: (180 + 117) / 500 = 59.4%
Projected end-of-season inventory: 203 units remaining
```

**3. Margin at risk:** What's the cost of holding vs marking down?

```
Current: 203 units projected remaining
If kept at full price ($49.99): Sell 117, leave 203 → markdown or clear at $15 avg
If markdown to $34.99 (30% off) now: Model projects +85 units sold → leaves 118 remaining
If markdown to $24.99 (50% off) now: Model projects +147 units sold → leaves 56 remaining

Margin analysis:
  Status quo: (117 × $49.99) + (203 × $15.00) = $8,894 total recovery
  30% markdown now: (180 + 85) × $49.99 + (118 × $34.99) + ... = $10,212 total recovery
  50% markdown now: (180 + 147) × $49.99 + (56 × $24.99) + ... = $9,841 total recovery
  
RECOMMENDATION: 30% markdown effective this Friday
  Projected additional units sold: 85
  Net margin improvement vs status quo: +$1,318
  End-of-season remaining: ~118 units (manageable for end-season clearance)
```

## Markdown Ladder Strategy

Rather than one large markdown, ladder the discount:

```
Week 9:  -20% off → evaluate after 2 weeks
Week 11: -30% off if sell-through still behind → evaluate
Week 13: -40% off if season ending in 3 weeks
Week 14: -50% off for final clearance
```

The agent tracks effectiveness at each step and adjusts the ladder if sell-through responds differently than modeled.

## Integration with D365 Commerce

The agent recommends markdowns, but a merchandiser reviews and approves before the price change goes live. Once approved:
- Price change is created in D365 Commerce pricing management
- Effective date set (typically Thursday night for Friday implementation)
- POS terminals pick up the new price automatically
- E-commerce site updated via price API

The agent tracks post-markdown sell-through to improve future models.

## Trigger Phrases

- "Help me with markdown advisor"
- "Markdown Advisor"
- "How do I markdown advisor"

## Quick Example

> See `markdown-advisor-example.md` in this folder for a full worked scenario with business impact.

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
