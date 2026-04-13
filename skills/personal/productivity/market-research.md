---
name: "market-research"
slug: "market-research"
description: "Conducts competitive analysis, investor due diligence, and industry intelligence using SEC filings, LinkedIn, Crunchbase, and industry reports, synthesized into structured briefings. Use when user says 'market research', 'competitive analysis', 'research competitors', 'industry report', 'due diligence on', 'market landscape'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "productivity", "market-research", "competitive-analysis"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Exa MCP, Firecrawl MCP"
mcp_tools: []
---


# Market Research

Structured market and competitive intelligence for enterprise technology decisions, investor due diligence, and strategic planning. Produces briefings you can act on, not raw data dumps.

## Trigger Phrases

- "market research on"
- "competitive analysis of"
- "research competitors"
- "industry report on"
- "due diligence on"
- "market landscape for"
- "who are the players in"
- "investor research on"

## Research Types

### Competitive Analysis
**Purpose:** Understand the competitive landscape for a product, service, or market category.
**Sources:** Company websites, product docs, pricing pages, LinkedIn (team size, growth), G2/Gartner reviews, GitHub repos, job postings (signals on direction)
**Output:** Competitor matrix with capabilities, positioning, pricing, and strategic intent

### Investor Due Diligence
**Purpose:** Research a company before a meeting, investment, or partnership.
**Sources:** SEC filings (EDGAR for public companies), Crunchbase, PitchBook, LinkedIn, press releases, founder backgrounds, tech stack signals
**Output:** Company brief with funding, team, product, traction, and red flags

### Industry Landscape
**Purpose:** Map a market space: players, trends, analyst views, customer behavior.
**Sources:** Gartner reports, Forrester, IDC, industry newsletters, conference talks, community forums (Reddit, Discord, Slack), academic research
**Output:** Market map with segments, key players, growth drivers, and white space

### Technology Assessment
**Purpose:** Evaluate whether a technology is ready for enterprise adoption.
**Sources:** GitHub activity, official docs, community size, production case studies, analyst coverage
**Output:** Maturity assessment with adoption risks and enterprise readiness score

## Research Workflow

### Step 1: Define the Research Brief

Before starting, answer:
- What decision will this research inform?
- Who is the audience for the output?
- What's the time horizon? (current state vs. 3-year outlook)
- What format does the output need to take?

### Step 2: Source Matrix

| Layer | Source | Tool |
|---|---|---|
| Web presence | Company site, blog, press | Firecrawl |
| News and mentions | Recent coverage | Exa semantic search |
| Community signals | Reddit, Discord, forums | Exa + manual |
| Financial signals | Crunchbase, SEC EDGAR | Firecrawl + manual |
| Technical signals | GitHub, docs, APIs | Exa + Firecrawl |
| People signals | LinkedIn | Manual (no API) |

### Step 3: Competitive Matrix Template

```markdown
## Competitive Matrix: [Market Category]
Research date: [Date]

| Company | Product | Pricing | Target Customer | Key Differentiator | Weakness |
|---|---|---|---|---|---|
| [Name] | [Core product] | [Model + range] | [ICP] | [Main edge] | [Gap] |
...

## Strategic Observations
1. [Pattern across competitors]
2. [White space or underserved segment]
3. [Threat or disruption signal]

## Sources
[List with dates]
```

### Step 4: Company Due Diligence Brief Template

```markdown
## Company Brief: [Company Name]
Research date: [Date]

**Founded:** | **HQ:** | **Size:** | **Stage:**

**What they do:** [2-sentence plain language summary]

**Funding:** [Round, amount, investors, date]

**Revenue signals:** [Any public indicators: ARR, customer count, growth rate]

**Team:** [Key leaders, backgrounds, notable hires/departures]

**Technology:** [Stack signals from job postings, GitHub, docs]

**Customers:** [Named references, case studies, industries served]

**Red flags:**
- [Anything that requires more digging]

**Confidence level:** High / Medium / Low
**Sources:** [list]
```

## Analyst Sources by Topic

| Topic | Key Sources |
|---|---|
| Enterprise AI / Agents | Gartner Magic Quadrant, Forrester Wave, IDC MarketScape |
| ERP / D365 | Microsoft analyst briefings, Nucleus Research, Panorama Consulting |
| Cloud / Azure | Synergy Research, Canalys, 451 Research |
| AI infrastructure | The Information, SemiAnalysis, Interconnects |

## Job Posting Intelligence

Job postings are an underrated competitive intelligence source:
- **Hiring for X role** = building X capability
- **Many open roles** = growth phase or high churn
- **No open roles** = plateau or stealth mode
- **Tech stack in JDs** = their actual infrastructure

Search pattern: `site:greenhouse.io [company] OR site:lever.co [company]`

## Quick Example

> See `market-research-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Research too broad | No decision-framing upfront | Restate the research question as "I need to decide X, so I need to know Y" |
| Competitor data stale | No date filter on sources | Always filter Exa searches to last 6 months for competitive intel |
| Can't access paywalled reports | Gartner/Forrester require login | Use executive summaries, press releases, and analyst blog posts as proxies |
| Output is a data dump | No synthesis or conclusions | Finish every section with a "What this means" paragraph tied back to the original decision |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
