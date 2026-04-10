---
name: "Podcast Production"
slug: "podcast-production"
description: "End-to-end podcast workflow — episode planning, Ragnar/Tina lane splits, show notes from transcripts, and clip extraction for social."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["podcast", "content-creation", "show-notes", "planning", "in-our-ai-era"]
version: "1.0"
icon_emoji: "🎙️"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "In Our AI Era — YouTube Channel"
    url: "https://www.youtube.com/@RagnarPitla"
  - title: "Ragnar Pitla LinkedIn"
    url: "https://www.linkedin.com/in/ragnarpitla/"
---

# Podcast Production

Built around the "In Our AI Era" format — co-hosted with Tina van Heerden, 25-35 minutes, video podcast, fun/educational/opinionated. But the workflow applies to any technical podcast.

## Episode Planning Framework

### Lane Split (Ragnar + Tina Format)

Every episode has two lanes that complement each other:

**Ragnar's lane — Builder/Architect:**
- Real implementations ("here's how I actually built it")
- MCP, Niyam pattern, Copilot Studio technical deep-dives
- D365 specifics, configuration details
- "Here's what I'd do differently next time"
- Decision frameworks for technical choices

**Tina's lane — Strategist/Researcher:**
- Industry context and why this matters now
- Research-backed frameworks and data
- Common mistakes companies make (pattern recognition)
- Analogies that make technical concepts accessible
- Grounding the hype with real-world constraints

**Good episode:** Both lanes tell the same story from different angles. Tina explains why the industry is moving toward agentic ERP. Ragnar shows the specific Copilot Studio + D365 implementation that proves it.

### Episode Brief Template

```
Episode: [Number] — [Working Title]

Core question: What does the listener walk away knowing/able to do?

Ragnar's angle: [specific technical thing to show/explain]
Tina's angle: [strategic/research context]

Opening hook (30 sec): [specific contrarian or surprising statement]

Segment 1 (~8 min): Why this matters right now
  - Ragnar:
  - Tina:

Segment 2 (~12 min): How it works / The build
  - Ragnar:
  - Tina:

Segment 3 (~8 min): What to do next / Common mistakes
  - Ragnar:
  - Tina:

Close (~3 min): Key takeaway + next episode teaser

Demo planned: [yes/no — what specifically]
Guest: [if any]
```

### Topic Selection Criteria

Strong episode topics:
- **Contrarian:** "Everyone thinks X, but we've found Y in real deployments"
- **Timely:** Something that just happened (product launch, industry news) that we can put context around
- **Specific:** "How we built the invoice matching agent for a 50K-employee manufacturer" not "AI in manufacturing"
- **Actionable:** Listener can do something different after watching

Weak topics (avoid):
- Too broad ("The future of AI in enterprise")
- Too theoretical (no real implementation examples)
- Already covered well by others (add something new or don't do it)

## Show Notes from Transcript

After recording, generate show notes in this format:

### Show Notes Template

```markdown
# [Episode Title]
**Episode [Number]** | [Duration] | [Date]

## What We Cover
[2-3 sentence summary of the core topic]

## Key Insights
- [Ragnar insight 1]
- [Tina insight 2]
- [Key framework or concept introduced]
- [Common mistake discussed]

## Chapters
00:00 — Intro and hook
02:30 — [Topic of segment 1]
10:45 — [Topic of segment 2]
22:00 — [Topic of segment 3]
30:15 — Key takeaway and close

## Resources Mentioned
- [Link 1]
- [Link 2]

## Connect
- Ragnar: linkedin.com/in/ragnarpitla
- Tina: [Tina's LinkedIn]
- Subscribe: [channel link]
```

## Clip Extraction for Social

After each episode, extract 3-5 clips for LinkedIn and YouTube Shorts:

**What makes a good clip:**
- A single clear insight (not a conversation — a statement)
- 45-90 seconds for LinkedIn, 60 seconds for Shorts
- Has a clear beginning and end (doesn't feel cut off)
- Standalone — understandable without the full episode context

**Clip types that perform:**
1. **The counterintuitive statement:** Ragnar or Tina says something surprising
2. **The specific example:** "At one client, we reduced invoice processing from 5 days to 4 hours by..."
3. **The framework moment:** When a clear 3-step or 2x2 framework gets explained
4. **The hot take:** A strong opinion on where the industry is going

**Clip caption formula:**
```
[Hook — the most interesting line from the clip]

[1-2 sentences of context]

Full episode: [link]

#AI #EnterpriseAI #[relevant topic tags]
```

## Pre-Recording Checklist

- [ ] Episode brief shared with Tina 48 hours before
- [ ] Demo environment set up and tested (D365, Copilot Studio, Claude Code)
- [ ] Recording software open (Riverside, Zoom, etc.)
- [ ] Good lighting, clean background
- [ ] Microphone checked
- [ ] No notifications during recording
- [ ] Water nearby

## Post-Recording Workflow

1. Upload raw recording → get transcript (Riverside auto-transcribes, or use Whisper)
2. Generate show notes from transcript using this skill
3. Identify clip timestamps from transcript
4. Edit full episode (or send to editor)
5. Export clips
6. Schedule: full episode + 3 clips across LinkedIn and YouTube
