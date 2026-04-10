---
name: "SEO Content Optimizer"
slug: "seo-optimizer"
description: "Paste your article and get a complete SEO analysis — keyword density, heading structure, meta description, and an optimized version that still sounds like you."
tab: "personal"
domain: "content-creation"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["seo", "content", "writing", "search", "google", "optimization", "traffic"]
version: "1.0.1"
icon_emoji: "🔍"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Google Search Central — SEO Starter Guide"
    url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
  - title: "Wyndo — SEO Optimizer Skill (original concept)"
    url: "https://substack.com/@wyndo"
requires: "Exa MCP or Firecrawl (optional — for live keyword research)"
mcp_tools: ["exa-mcp", "firecrawl-mcp"]
---

# SEO Content Optimizer

Your content is good. But if Google can't understand what it's about, nobody finds it.

This skill analyzes your article for SEO issues and produces an optimized version — without stripping out your voice or adding keyword-stuffed garbage.

## What You Give It

```
Optimize this article for SEO. Target keyword: [main keyword].
Secondary keywords: [2-3 related terms].
Keep my voice intact — don't make it sound robotic.

[paste your article]
```

## The SEO Analysis

```
SEO AUDIT — [Article Title]

TARGET KEYWORD: [keyword]
Current density: [X%] — Target: 1-2%
Status: ⚠ Under-optimized / ✅ Good / ❌ Over-stuffed

TITLE TAG
Current: [your H1]
Issues: [too long / missing keyword / not compelling]
Suggested: [improved version]

META DESCRIPTION
Current: [if you have one]
Suggested: [150-160 chars, includes keyword, drives clicks]

HEADING STRUCTURE
H1: ✅ / ⚠ / ❌
H2s: ✅ [good] / ⚠ [missing keyword opportunities]
H3s: ✅ / ⚠

KEYWORD PLACEMENT
✅ In title: Yes/No
✅ In first paragraph: Yes/No
✅ In at least one H2: Yes/No
✅ In meta description: Yes/No

MISSING ELEMENTS
- [ ] Internal links (link to 2-3 related articles)
- [ ] External links to authoritative sources
- [ ] Image alt text
- [ ] FAQ section (featured snippet opportunity)

QUICK WINS
1. [Specific change that will have biggest impact]
2. [Second quick win]
3. [Third quick win]
```

## What It Optimizes

**Without killing your voice:**
- Adds keyword naturally where it's currently missing
- Improves heading hierarchy
- Strengthens the intro paragraph (most important for Google)
- Adds transition sentences that include semantic keywords
- Suggests a meta description you can copy-paste

**What it won't do:**
- Stuff keywords where they don't belong
- Add generic filler content to hit a word count
- Remove your personality or unique phrasing

## Trigger Phrases

- "Optimize this for SEO: [paste article]"
- "SEO analysis of my article"
- "Keyword optimization — target keyword: [keyword]"
- "Check my SEO on this post"
- "What's missing for SEO on this article?"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Optimized version sounds robotic | Keyword forced in unnaturally | Add "Maintain my voice — only add keyword where it fits naturally" |
| Wrong target keyword | You didn't specify | Add "Target keyword: [exact phrase]" |
| Suggestions too generic | No context given | Add "This article targets [audience] searching for [intent]" |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
