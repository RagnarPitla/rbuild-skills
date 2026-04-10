---
name: YouTube Script
slug: youtube-script
description: Write YouTube scripts for tech thought leadership — the hook formula, 3-shift structure, B-roll cues, and what makes AI topics click.
tab: personal
domain: content-creation
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"youtube\", \"script\", \"content-creation\", \"video\", \"thought-leadership\"]"
version: 1.0.1
icon_emoji: 🎬
is_coming_soon: false
is_featured: true
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "Ragnar's YouTube Channel"
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---


# YouTube Script

Every great YouTube video has the same underlying structure. Here's the formula I use for every AI and enterprise tech video.

## The Hook (First 30 Seconds)

You have 30 seconds to answer: "Why should I keep watching this instead of anything else?"

**Hook formulas that work:**

**The Contrarian:** "Everyone says X, but after building Y enterprise agents, I've learned the opposite is true."

**The Specific Problem:** "If your Copilot Studio agent keeps routing to the wrong child agent, I know exactly why — and it's not what the docs say."

**The Before/After:** "Six months ago, our client's AP team was reviewing 3,000 invoices a week. Today the agent handles 97% of them. Here's what changed."

**The Number:** "Five D365 agent patterns that actually work in production — ranked by how hard they are to get wrong."

The hook must be specific. "Today we're going to talk about AI agents" is not a hook.

## The 3-Shift Structure

The body of every video has three shifts — three distinct moves that build on each other.

**Shift 1 — WHY THIS MATTERS**  
Context. Stakes. Why the viewer should care about this specific thing, right now.

**Shift 2 — HOW IT WORKS**  
The actual technical content. Go deep. Show the code, the config, the architecture.

**Shift 3 — WHAT TO DO NEXT**  
The practical takeaway. One specific action the viewer can take today.

## Script Format

```
[HOOK - spoken to camera]
Text of what you say. Short sentences. Pause points marked with — or ...

[B-ROLL: screen recording of Copilot Studio canvas]
Narration over the screen recording goes here.

[BACK TO CAMERA]
Direct talk. Summary point.

[DEMO START]
Show X. Click Y. Explain what's happening.
[DEMO END]
```

## B-Roll Cue Types

- `[B-ROLL: screen recording]` — software demo
- `[B-ROLL: diagram/whiteboard]` — architecture or concept visualization  
- `[B-ROLL: code]` — code walking, syntax highlighting
- `[BACK TO CAMERA]` — return to face-to-camera segment
- `[TEXT OVERLAY: key stat]` — data point or quote on screen

## The CTA (Last 30 Seconds)

Two beats:
1. **Value summary:** "So if you take one thing from this video..."
2. **Next step:** "The next thing I'd recommend watching is [specific video title] — I'll link it here."

Don't ask viewers to subscribe as the primary CTA. Give them the next valuable video instead. Subscribers follow naturally from value.

## What Makes AI Topics Click

Topics that consistently perform well:
- **"I tried X so you don't have to"** — saves the viewer time
- **"Why X doesn't work the way you think"** — contrarian, creates curiosity
- **"Building X in Y minutes"** — specific, time-bounded, achievable
- **"The mistake everyone makes with X"** — universal pain point

Specificity always beats generality. "How to build a D365 procurement agent that auto-approves invoices" outperforms "Introduction to AI agents in D365" every time.

## Script Template

```
[HOOK]
[Problem statement — 2 sentences]
[Why I'm qualified to talk about this — 1 sentence]
[What you'll get from watching — 1 sentence]

[SHIFT 1: WHY THIS MATTERS]
[Context — 2-3 paragraphs]

[SHIFT 2: HOW IT WORKS]
[Main technical content — can include B-ROLL, demos]
[Step 1...]
[Step 2...]
[Step 3...]

[SHIFT 3: WHAT TO DO NEXT]
[Practical takeaway]
[One specific action]

[CTA]
[Value summary — 1 sentence]
[Next video recommendation]
```

## Trigger Phrases

- "Help me with youtube script"
- "YouTube Script"
- "How do I youtube script"

## Quick Example

> See `youtube-script-example.md` in this folder for a full worked scenario with business impact.

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
