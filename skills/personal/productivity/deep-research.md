---
name: "Deep Research"
slug: "deep-research"
description: "Multi-source research workflow using Claude Code with Exa and Firecrawl MCPs — from question to cited, synthesized report."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["research", "web-search", "synthesis", "exa", "firecrawl", "citations"]
version: "1.0"
icon_emoji: "🔬"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Exa Neural Search"
    url: "https://exa.ai"
  - title: "Firecrawl — Web Scraping for LLMs"
    url: "https://firecrawl.dev"
---

# Deep Research

Deep research is not just running a web search. It's a structured workflow that produces a synthesized, cited report you can act on. Here's how to do it properly with Claude Code and MCP tools.

## When to Use Deep Research

**Use deep research for:**
- Competitive analysis (what are competitors doing?)
- Technical landscape research (what tools exist?)
- Market research (what do people say about X?)
- Due diligence (what's the real story on this company?)
- Research a problem domain before building a solution

**Use basic web search for:**
- "What is the syntax for X?"
- "What's the price of Y?"
- Quick fact checks

Deep research takes 5-15 minutes. Don't use it for quick lookups.

## Step 1: Frame the Question Precisely

Vague question → vague research. Specific question → actionable findings.

```
Vague: "Research AI agents for enterprise"

Specific: "What are the top 5 platforms for deploying AI agents in 
enterprise ERP systems as of 2026? For each, what are: pricing model, 
D365 integration approach, multi-agent capabilities, and customer references?"
```

Break compound questions into sub-questions. Each sub-question becomes a separate research thread.

## Step 2: Source Identification Strategy

Different sources for different question types:

| Question Type | Best Sources |
|---|---|
| Technical capabilities | Official docs, GitHub repos, technical blogs |
| Market landscape | Industry reports, analyst blogs, community forums |
| Recent news/events | News search, X/Twitter, Reddit |
| People/companies | LinkedIn, Crunchbase, company websites |
| Academic/research | arXiv, Google Scholar, research blogs |

## Step 3: Exa for Semantic Search

Exa uses neural search — it understands meaning, not just keywords. Better than Google for research:

```
# In Claude Code with Exa MCP configured:
Use exa_search to find: "enterprise AI agent platforms D365 integration 2026"
Focus on: vendor documentation, comparison articles, technical reviews
Exclude: marketing/sales content
```

Exa is better than web search for:
- Finding similar content to an example you have
- Searching by concept rather than keyword
- Finding recent content on fast-moving topics

## Step 4: Firecrawl for Full Content

When search results give you URLs, use Firecrawl to extract the full content:

```
# Extract full page content for synthesis
Use firecrawl to extract: [URL from search results]
Target: main article content, pricing tables, feature lists
```

Firecrawl handles JavaScript-heavy pages, cleans up navigation/footer noise, and returns clean markdown.

## Step 5: Synthesis Structure

Don't just dump what you found. Synthesize:

```markdown
## Executive Summary
[2-3 sentence answer to the research question]

## Key Findings
1. Finding one [source]
2. Finding two [source]
3. Finding three [source]

## Detailed Analysis
[By sub-topic or by source, with specific data points]

## Conflicting Information
[Where sources disagree and why]

## Confidence Level
High/Medium/Low — based on source quality and consistency

## Sources
- [Title](URL) — accessed [date]
```

## Handling Conflicting Sources

When sources disagree:
1. Check the publication date — newer is usually more accurate for fast-moving topics
2. Check the source credibility — primary sources (vendor docs) beat secondary (blog summaries)
3. Note the conflict explicitly — don't silently pick one

"Source A says X, while Source B (published 6 months later) says Y. The discrepancy likely reflects a product update."

## Trigger Phrases for This Skill

Use this workflow when you say:
- "Research X for me"
- "What do people say about Y?"
- "Do a competitive analysis of Z"
- "What's the landscape for [topic]?"
- "I need a briefing on [subject] before my meeting"
