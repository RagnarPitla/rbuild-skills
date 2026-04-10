---
name: deep-research
description: Multi-source research workflow using Claude Code with Exa and Firecrawl MCPs, producing cited synthesized reports. Use when user says 'deep research', 'research a topic', 'research this for me', 'competitive analysis', 'what do people say about', 'briefing on'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, productivity, research, synthesis]
requires: Exa MCP, Firecrawl MCP
mcp_tools:
  - "exa-mcp"
  - "firecrawl-mcp"
---

# Deep Research

Deep research is not just running a web search. It's a structured workflow that produces a synthesized, cited report you can act on. Here's how to do it properly with Claude Code and MCP tools.

## Trigger Phrases

- "deep research on"
- "research a topic"
- "research this for me"
- "competitive analysis of"
- "what do people say about"
- "I need a briefing on"
- "investigate"
- "landscape for"

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

Exa uses neural search. It understands meaning, not just keywords. Better than Google for research:

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
High/Medium/Low, based on source quality and consistency

## Sources
- [Title](URL), accessed [date]
```

## Handling Conflicting Sources

When sources disagree:
1. Check the publication date. Newer is usually more accurate for fast-moving topics.
2. Check the source credibility. Primary sources (vendor docs) beat secondary (blog summaries).
3. Note the conflict explicitly. Don't silently pick one.

"Source A says X, while Source B (published 6 months later) says Y. The discrepancy likely reflects a product update."

## Quick Example

> See `deep-research-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Results too broad | Research question is vague | Rewrite the question with specific constraints: platform, date range, audience |
| Exa returns irrelevant results | Keywords too generic | Switch to concept-based query or add domain qualifiers ("enterprise", "D365", "production") |
| Firecrawl fails on a page | Page uses heavy JS or anti-bot protection | Try the cached version via Exa or use a different source URL for the same content |
| Report not actionable | Synthesis lists facts without conclusions | Always end synthesis with: "What does this mean for [specific decision]?" |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
