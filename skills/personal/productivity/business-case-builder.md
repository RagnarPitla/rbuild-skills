---
name: "Business Case Builder"
slug: "business-case-builder"
description: "Build a rigorous investment or project business case in 6 steps — ROI, payback period, risk assessment, and executive-ready output."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["business-case", "roi", "investment", "planning", "finance", "executive"]
version: "1.0.1"
icon_emoji: "📋"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Zain Haseeb — Business Case Builder (original concept)"
    url: "https://substack.com/@zainhaseeb"
requires: "None"
mcp_tools: []
---

# Business Case Builder

Business cases get rejected for two reasons: not rigorous enough, or so long nobody reads them. This skill builds the right version for your situation — from a quick 1-pager to a comprehensive investment case with NPV analysis.

## The 6-Step Framework

**Step 1: Frame the Decision**
What are you asking for? What problem does it solve? What happens if you do nothing?

**Step 2: Quantify Costs**
Implementation cost, ongoing cost, opportunity cost. Use ranges — not single numbers. (Ranges are more credible than false precision.)

**Step 3: Quantify Benefits**
Revenue gain, cost reduction, time saved × hourly cost, risk reduction, strategic value. Everything in dollars where possible.

**Step 4: Compare Alternatives**
Always include "do nothing" as an option. Include 2-3 real alternatives and explain why you rejected them. This is what skeptical finance teams look for.

**Step 5: Calculate Metrics**
- ROI = (Net Benefit / Total Cost) × 100
- Payback Period = Total Cost / Annual Net Benefit
- NPV = Present value of benefits − Present value of costs
- Use conservative / expected / optimistic scenarios

**Step 6: Assess Risks**
What could go wrong? How likely? What's the mitigation?

## Output Formats

Tell Claude which format:

**Quick (1-page):** For internal approvals, small budgets, fast decisions
**Standard (2-3 pages):** For mid-size investments, department budgets
**Comprehensive (5+ pages):** For major capital investments, board-level decisions

## Trigger Phrases

- "Build a business case for [project/investment]"
- "Help me justify [purchase/hire/project] to my leadership"
- "Create an ROI analysis for [thing]"
- "I need to get approval for [X] — help me build the case"
- "Business case — [describe what you want to do]"

## Example Prompt

```
Build a business case for hiring a data analyst ($95K salary + benefits). 
We're a 40-person SaaS company. Current situation: our marketing team spends 
15 hours/week on manual reporting at an effective cost of $150/hour. 
We're also making decisions without proper attribution data.
Format: Standard (2-3 pages). Audience: CFO.
```

## What It Produces

```
BUSINESS CASE: DATA ANALYST HIRE
Executive Summary: [3 sentences — the whole argument]

THE DECISION
Current state: [what's broken]
Proposed solution: [what you're asking for]
Do-nothing consequence: [cost of inaction]

COST ANALYSIS
Year 1 total cost: $127,000 (salary $95K + recruiting $18K + tools $14K)
Year 2+ annual cost: $109,000 (salary + tools)

BENEFIT ANALYSIS — Three Scenarios
Conservative: $148,000/year
Expected:     $212,000/year  
Optimistic:   $310,000/year

[Breakdown of each benefit with assumptions shown]

FINANCIAL METRICS
ROI (Expected): 95% Year 1, 194% Year 2+
Payback Period: 7.2 months
5-Year NPV (8% discount): $487,000

ALTERNATIVES CONSIDERED
[Why you rejected other options]

RISKS
[Table of risks, likelihood, mitigation]

RECOMMENDATION
[Clear ask + why now]
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Numbers feel made up | No real data provided | Start with what you know, Claude will flag assumptions |
| Too long for audience | Wrong format selected | Specify "1-page version only" |
| Missing alternatives | Didn't prompt for them | Ask: "Include 3 alternatives and why you rejected each" |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill with 6-step framework |
