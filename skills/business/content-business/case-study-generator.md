---
name: case-study-generator
description: Write compelling customer case studies from project data. Pain points, solution architecture, measurable outcomes, and Microsoft story format. Use when user says "write a customer case study", "help me document this project", "create a customer success story", "before and after AI agent deployment", "Microsoft customer story format", "document our D365 implementation results".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, content, case-study, writing]
---


# Case Study Generator

A well-crafted case study does more than document what happened. It tells the story of a transformation: where the customer was, what changed, and why it mattered. This is the format that wins deals.

## Triggers

- "write a customer case study"
- "help me document this project"
- "create a customer success story"
- "before and after AI agent deployment"
- "Microsoft customer story format"
- "document our D365 implementation results"
- "case study generator"
- "write a case study for my AI agent project"

## The Story Arc

Every case study follows the same structure:

**1. The Customer** (1 paragraph)
Who they are, their industry, their scale. Enough context for the reader to see themselves in the customer.

**2. The Challenge** (2-3 paragraphs)
The specific problem. Not "they needed digital transformation." What specifically was breaking? What was the business impact of the problem? Use numbers where possible: "3,000 invoices processed manually each week," "AP team of 8 spending 70% of their time on matching."

**3. The Solution** (3-4 paragraphs)
What was built and how. Include: technology stack, key architectural decisions, implementation approach. This is where you mention D365, Copilot Studio, the Niyam pattern, MCP. Specific, technical, credible.

**4. The Results** (2-3 paragraphs)
Measurable outcomes. Quantify everything possible:
- Time saved (hours/week, days reduced to hours)
- Cost reduction (FTE equivalent, error reduction)
- Volume handled (transactions automated, coverage percentage)
- User adoption (number of users, satisfaction score)

**5. The Quote** (1 quote)
One powerful quote from a senior customer stakeholder. Should capture the emotional impact, not just the technical outcome: "I used to dread month-end. Now my team focuses on analysis, not data entry."

## Data Collection Checklist

Before writing, gather this data:

```
Customer profile:
- Industry, company size, geography
- Key stakeholders (name, title, for attribution)

Problem data:
- What process was broken/slow/manual?
- How many people were involved?
- How long did it take? (per transaction, per week)
- What did it cost? (time, money, error rate)
- What was the strategic impact of the problem?

Solution data:
- What was built? (technology stack: D365, Copilot Studio, MCP, etc.)
- How long did implementation take?
- What was the implementation approach?
- Key architectural decisions and why

Results data:
- Before and after metrics (same measurement method)
- Time to value (how quickly did results appear?)
- Adoption metrics (how many users, usage frequency)
- Qualitative outcomes (employee satisfaction, confidence)
- Future plans ("Next they're expanding to...")
```

## Microsoft Story Format

For Microsoft customer stories, follow this structure:

**Headline:** [Customer] [achieves specific outcome] with [Microsoft technology]

**Subhead:** One sentence expanding on the headline with a key metric.

**Key Stats box:** 3 metrics in large format
- "97% of invoices processed automatically"
- "8 hours → 20 minutes for month-end close"
- "3 FTEs redeployed to higher-value work"

**Body:** Problem → Solution → Results narrative

**Products mentioned:** D365 Finance, Copilot Studio, Azure OpenAI, Power Automate

## Writing Principles

- **Lead with outcomes, not technology.** "Contoso reduced invoice processing time by 85%" not "Contoso implemented an AI agent using Copilot Studio."
- **Specific over general.** "Invoice matching dropped from 3 days to 4 hours" beats "dramatically faster processing."
- **Customers speak for themselves.** Weave in quotes throughout, not just at the end.
- **Avoid jargon.** "The agent reads policies from a database" not "The Niyam pattern leverages Dataverse CRM tables for dynamic policy resolution."
- **Never use em dashes.** Use commas or periods to separate clauses.

## Case Study Templates

### Short Format (Social / One-Pager, approx. 300 words)

```
[Company Name], a [industry] company with [scale], was struggling with
[specific problem]. [Impact of the problem in concrete terms].

They deployed a [description of solution] using [technology stack].
[1-2 sentences on the key architectural decision that made it work].

The results: [Metric 1]. [Metric 2]. [Metric 3].

"[Quote from stakeholder]" - [Name, Title]

[1 sentence on what they're doing next with AI.]
```

### Standard Format (Blog / Customer Story, 800 to 1,200 words)

```
## [Compelling headline with specific outcome]

### The Customer
[Company profile, 1 paragraph]

### The Challenge
[The problem, 2 paragraphs with specific numbers]
[Business impact of the problem, 1 paragraph]

### The Solution
[What was built, 2 paragraphs]
[Technology and architecture, 1 paragraph, accessible language]
[Implementation approach, 1 paragraph]

### The Results
[Quantified outcomes, 2 paragraphs]
[Quote from senior stakeholder]

### What's Next
[1 paragraph on the customer's AI roadmap]
```

## Before/After Comparison Table

Include this in every case study with an AI agent story:

| Dimension | Before | After |
|---|---|---|
| Process | [Manual steps, people involved] | [Agent-handled steps] |
| Time per transaction | [X minutes/hours] | [Y minutes/hours] |
| Human involvement | [N people, N hours/week] | [N people on exceptions only] |
| Error rate | [X% or X errors/week] | [Y%] |
| Capacity | [N transactions/day] | [N transactions/day] |
| Employee experience | ["Tedious, repetitive"] | ["Focus on real decisions"] |

## Length Guidelines

| Format | Word Count | Use Case |
|---|---|---|
| Key stats card | 50-100 | Slide deck, banner |
| Social media post | 200-300 | LinkedIn, X |
| One-pager / card | 400-600 | Sales collateral |
| Full customer story | 800-1,200 | Blog, Microsoft Story Hub |
| Long-form article | 1,500-2,500 | Deep technical story |

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Customer won't share metrics | Confidentiality concerns or data not tracked | Offer ranges ("reduced by 70-90%"), use process improvement language, or focus on qualitative outcomes and quotes |
| Story sounds generic despite real project | Metrics exist but story lacks specificity | Add the "week in the life before/after": describe a specific day/scenario in concrete terms |
| Technical details overwhelm non-technical readers | Written for engineers, not decision-makers | Lead every section with business outcome, put technical architecture in a sidebar or appendix |
| Hard to get stakeholder quote approved | Legal/PR review process | Draft 3 quote options in the stakeholder's voice, get informal verbal approval first, then start formal review on the one they liked |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
