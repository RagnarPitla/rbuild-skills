---
name: "Summarize Anything"
slug: "summarize-anything"
description: "Get the key points from any long content — articles, reports, meeting transcripts, books, papers — in the format that's most useful to you."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["summary", "reading", "productivity", "research", "tldr", "digest"]
version: "1.0.1"
icon_emoji: "⚡"
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

# Summarize Anything

Long report you don't have time to read. Meeting transcript from a call you missed. Industry paper you need to understand quickly. Paste it, get what matters.

## What It Handles

- Articles and blog posts
- PDF reports (paste the text)
- Meeting transcripts and call recordings (paste the transcript)
- Research papers
- Legal documents (contracts, terms of service)
- Books and long-form content (paste sections)
- Email threads
- Slack/Teams conversation exports
- YouTube transcripts

## How to Use

**Basic summary:**
```
Summarize this: [paste content]
```

**Directed summary (best results):**
```
Summarize this for me as a [your role].
I care most about: [what matters to you]
Format: [bullet points / paragraph / exec brief]
Length: [one paragraph / under 100 words / 5 bullets]

[paste content]
```

## Output Formats

Tell Claude which format:

**TL;DR** — 1-2 sentences. The whole thing in a breath.

**Exec brief** — 3-5 bullets, each with a clear takeaway

**Key points** — numbered list, ranked by importance to you

**Action items** — only the things that require action

**Q&A format** — Claude asks and answers the questions you'd want answered

**Decision brief** — what's the decision being asked, what are the options, what's the recommendation

## Directed Summary Examples

```
"Summarize this investor report as a startup founder.
I care about: market size data, competitor mentions, and any risks.
Format: 5 bullets, under 150 words."
```

```
"Summarize this meeting transcript.
I missed the call. Extract: decisions made, 
action items with owners, and anything that 
requires my input by Friday."
```

```
"TL;DR this research paper for someone who 
understands AI but not academic ML jargon."
```

## Trigger Phrases

- "Summarize this: [paste]"
- "TL;DR: [paste]"
- "Key points from this article: [paste]"
- "What are the action items in this transcript?"
- "Summarize for [role/audience]: [paste]"
- "Give me the 3 most important things from this"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Too generic | No focus specified | Add "Focus on [specific aspect]" |
| Missing what matters | Claude doesn't know your role | Add "I'm a [role] making a decision about [X]" |
| Too long | No length constraint | Add "under [N] words" or "3 bullets only" |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
