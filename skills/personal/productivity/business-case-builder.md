---
name: "business-case-builder"
slug: "business-case-builder"
description: "Guides the user through building a complete 6-section business case for any investment, project, or initiative. Produces a structured document with problem statement, solution options, ROI calculation, risks, and recommendation. Use when user says 'build a business case', 'help me write a business case', 'ROI analysis', 'justify this investment', 'I need approval for', 'make the case for'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "universal", "business", "strategy", "roi"]
version: "1.0.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---


# Business Case Builder

## What This Skill Does

You describe what you want to invest in, and the agent guides you through building a complete, credible business case. It asks the right questions first, then produces a structured document with a problem statement, current costs, proposed solution, investment required, ROI calculation, payback period, and risk assessment. The output is ready to present to a manager, VP, or finance team.

## Triggers

- "build a business case"
- "help me write a business case"
- "ROI analysis"
- "justify this investment"
- "I need approval for"
- "make the case for"

## How It Works

### Step 1: Start the Discovery

Tell the agent what you want to invest in. Don't worry about having all the numbers yet.

Example opener:
```
I need to build a business case for a new project management tool 
for our team of 12 people. Current cost is around $85 per seat 
per month but I think there's a better option.
```

The agent will ask 5-7 discovery questions to fill in the gaps. Common questions:
- What is the current situation costing you in time, money, or risk?
- What happens if you do nothing for another year?
- Who is the decision-maker, and what do they care about most?
- What alternatives did you consider?
- What is your timeline and budget range?

Answer honestly, including with rough estimates. The agent will mark assumptions clearly so your approver knows what's verified vs estimated.

### Step 2: Build the 6 Sections

The agent structures the business case into 6 sections:

**Section 1: Problem Statement**
What is broken or suboptimal? What is it costing? What is the risk of doing nothing? This is the opening argument.

**Section 2: Current State Cost**
The full cost of the status quo. This includes direct costs (what you spend now), indirect costs (time lost, errors made, manual effort), and risk exposure (what goes wrong when things fail).

**Section 3: Proposed Solution**
What you are proposing, how it works, and why it is better than the alternatives you considered.

**Section 4: Investment Required**
Total cost broken into: upfront cost, ongoing annual cost, and implementation effort. Ranges are better than single numbers. Range shows rigor, not uncertainty.

**Section 5: ROI and Payback Period**
ROI = (Annual Benefit minus Annual Cost) divided by Total Investment, multiplied by 100.
Payback Period = Total Investment divided by Annual Net Benefit.
The agent calculates conservative, expected, and optimistic scenarios.

**Section 6: Risks and Mitigation**
What could go wrong? How likely is each risk? What is the plan if it happens? A business case without a risk section looks naive.

### Step 3: Choose Your Format

Tell the agent which format you need:

**1-page version** — for internal approvals, small budgets, fast decisions. Everything on one page.

**Standard 2-3 page version** — for mid-size investments, department budgets, or any decision requiring formal sign-off.

**Comprehensive 5-page version** — for major capital investments, board-level decisions, or any case that will face serious scrutiny.

## Output

A complete, formatted business case document in plain text, ready to paste into Word, Google Docs, or a presentation. Includes all 6 sections with your actual numbers, clear assumptions called out, and a recommendation that names the ask explicitly.

## Checklist
- [ ] Answered the discovery questions honestly, including rough estimates
- [ ] Current state cost calculated (time and money)
- [ ] At least 2 alternatives considered and rejected
- [ ] ROI calculated for all 3 scenarios (conservative, expected, optimistic)
- [ ] Risk section included
- [ ] Format chosen based on audience

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Numbers feel made up | No real data provided yet | Start with what you know, say "estimate" where you're guessing, and have the agent flag assumptions |
| Too long for the audience | Wrong format selected | Ask for "1-page version only, single recommendation" |
| Missing alternatives | Did not prompt for them | Ask: "Include 3 alternatives considered and why you rejected each" |
| Finance team skeptical | Benefits not quantified | Trace every benefit back to a dollar amount, even roughly |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
