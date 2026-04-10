---
name: podcast-production
description: End-to-end podcast workflow for In Our AI Era, covering episode planning, lane splits, show notes from transcripts, and clip extraction. Use when user says 'podcast episode', 'episode brief', 'show notes', 'clip from podcast', 'In Our AI Era', 'plan an episode'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, content, podcast, production]
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---

# Podcast Production

Built for two-host technical podcasts — 25-35 minutes, video podcast format. The workflow applies to any technical podcast with complementary host lanes.

## Trigger Phrases

- "podcast episode"
- "episode brief"
- "plan an episode"
- "show notes from transcript"
- "clip from podcast"
- "In Our AI Era episode"
- "extract clips"
- "podcast outline"

## Episode Brief Template

```
Episode: [N]: [Working Title]
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

**Host A lane (Builder/Architect):**
- Real implementations ("Here's what I built for a 50K-employee client")
- MCP, Niyam pattern, Copilot Studio specifics
- Decision frameworks for technical choices
- "What I'd do differently next time"

**Host B lane (Strategist/Researcher):**
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
- [Host A insight]
- [Host B insight]
- [Core framework introduced]

## Chapters
00:00 Intro
[timestamps]

## Resources
[all links mentioned]

## Connect
Host A: [LinkedIn] | youtube.com/@RagnarPitla
```

## Clip Extraction

After each episode, identify 3-5 clips:

**Good clip criteria:**
- 45-90 seconds (LinkedIn), 60 seconds (Shorts)
- Standalone: makes sense without full episode context
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

## Quick Example

> See `podcast-production-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Episode feels like two separate talks | Lane split not aligned to one core question | Define the core question first, then assign each host a perspective on the same question |
| Show notes are too long | Trying to summarize everything | Show notes should surface the 3 insights a viewer can apply, not recap the full episode |
| Clips don't stand alone | Cut mid-sentence or mid-argument | Each clip needs its own mini-setup and landing. Add 5-10 seconds of context before the insight. |
| Episode runs long | Segments not time-boxed during planning | Block each segment in the brief with explicit time targets before recording |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
