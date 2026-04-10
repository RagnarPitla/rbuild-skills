---
name: Podcast Production
slug: podcast-production
description: End-to-end podcast workflow for In Our AI Era — episode planning, lane splits, show notes from transcripts, and clip extraction.
tab: personal
domain: content-creation
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"podcast\", \"content\", \"show-notes\", \"in-our-ai-era\", \"video\"]"
version: 1.0.1
icon_emoji: 🎙️
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "In Our AI Era — YouTube"
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---


# Podcast Production

Built for "In Our AI Era" — co-hosted with Tina van Heerden, 25-35 minutes, video podcast format. But the workflow applies to any technical podcast.

## Episode Brief Template

```
Episode: [N] — [Working Title]
Date: [Recording date]

Core question: What does the listener understand/can do after watching?

RAGNAR'S LANE (Builder/Architect):
  - Technical topic: [what to build/show]
  - Demo: [yes/no + what specifically]
  - Key insight: [the practitioner take]

TINA'S LANE (Strategist/Researcher):
  - Context: [why this matters now]
  - Research: [data, frameworks, industry context]
  - Common mistake: [what most people get wrong]

Structure:
  Hook (0-1 min): [specific opening statement]
  Segment 1 - Why this matters (1-9 min): [outline]
  Segment 2 - How it works (9-21 min): [outline]
  Segment 3 - What to do (21-30 min): [outline]
  Close (30-33 min): Key takeaway + next episode

Resources to mention: [links]
```

## Lane Splits

**Ragnar's lane:**
- Real implementations ("Here's what I built for a 50K-employee client")
- MCP, Niyam pattern, Copilot Studio specifics
- Decision frameworks for technical choices
- "What I'd do differently next time"

**Tina's lane:**
- Industry context and why this matters now
- Research-backed frameworks
- Analogies that make technical concepts accessible
- Common mistakes enterprises make
- Grounding the hype with real constraints

Good episode = both lanes tell the same story from different angles.

## Show Notes Generator

After recording, provide the transcript and generate:

```
# [Episode Title]
**Ep. [N]** | [Duration] | [Date]

## What We Cover
[2-3 sentence summary]

## Key Insights
- [Ragnar insight]
- [Tina insight]
- [Core framework introduced]

## Chapters
00:00 Intro
[timestamps]

## Resources
[all links mentioned]

## Connect
Ragnar: linkedin.com/in/ragnarpitla | youtube.com/@RagnarPitla
```

## Clip Extraction

After each episode, identify 3-5 clips:

**Good clip criteria:**
- 45-90 seconds (LinkedIn), 60 seconds (Shorts)
- Standalone — makes sense without full episode context
- A clear beginning and end (doesn't feel cut mid-thought)
- Contains one clear insight or counterintuitive statement

**Clip types that perform:**
1. The surprising stat: "97% of agents fail for the same reason..."
2. The practitioner take: "At one client we..."
3. The framework moment: "There are exactly three types of..."
4. The hot take: "Everyone says X. They're wrong because..."

**LinkedIn caption formula:**
```
[Most interesting line from clip]

[2-sentence context]

Full episode: [link]
#AI #EnterpriseAI #[topic]
```

## Trigger Phrases

- "Help me with podcast production"
- "Podcast Production"
- "How do I podcast production"

## Quick Example

> See `podcast-production-example.md` in this folder for a full worked scenario with business impact.

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
