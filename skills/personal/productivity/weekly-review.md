---
name: "Weekly Review"
slug: "weekly-review"
description: "Structured end-of-week review — what you shipped, what slipped, lessons learned, and a clear focus for next week. Done in 10 minutes."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["productivity", "weekly-review", "planning", "reflection", "goals"]
version: "1.0.1"
icon_emoji: "📅"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---

# Weekly Review

Friday afternoons used to end in a blur. What did I actually do this week? What carries into next week? What's the priority?

This skill turns that blur into a 10-minute structured reflection that closes the week cleanly and opens the next one with clarity.

## How to Use

At end of week, dump everything you remember into Claude:

```
Weekly review time. Here's my dump:

Shipped: [list what you finished]
In progress: [what's still going]
Didn't get to: [what you planned but skipped]
Random stuff: [anything else from the week]

Goals I set last Monday: [if you have them]
Next week's big thing: [if you know]
```

Claude structures it, finds patterns, and helps you think about next week.

## What the Review Covers

**1. Wins (what actually shipped)**
Specific completions, not "worked on X." Done means done.

**2. Progress (meaningful forward movement)**
Big projects that moved even if not finished.

**3. Slippage (what didn't happen)**
Without blame. Just facts. Why did it slip?

**4. Patterns (the meta-learning)**
- What kept getting pushed? (Recurring avoidance = important signal)
- What took longer than expected? (Calibration issue)
- What felt energizing vs draining?

**5. Next week priority stack**
Top 3. Not 10. The 3 things that must happen.

**6. The one thing**
If you could only do one thing next week, what would it be?

## Output Format

```
WEEK OF [DATES] — REVIEW

WINS
✅ [Shipped item 1]
✅ [Shipped item 2]

PROGRESS
→ [Project A]: [What moved forward]
→ [Project B]: [What moved forward]

SLIPPAGE
⚠ [Item that didn't happen] — [Why]

PATTERNS THIS WEEK
• [Observation about how the week went]
• [What kept getting avoided]

NEXT WEEK — TOP 3
1. [Most important thing]
2. [Second priority]
3. [Third priority]

THE ONE THING
[If I only do one thing next week, it's: X]
```

## Trigger Phrases

- "Weekly review time"
- "Help me close out this week"
- "End of week review"
- "What should I reflect on this week?"
- "Weekly planning"
- "Friday review"

## Versions of This Review

**5-minute version:** Just wins + next week top 3
**Full version:** Everything above
**Team version:** Add "Team" and get a format suitable for a manager's weekly status update

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Review feels generic | No personal context | Add your goals and role to the prompt |
| Too long | Overthinking it | Ask for "5-minute version only" |
| Patterns not useful | Too little data | After 4 weeks, patterns become much clearer |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
