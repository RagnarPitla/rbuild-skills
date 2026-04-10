---
name: video-editing
description: AI-assisted video editing workflow for YouTube tech content, covering transcript-based cutting, B-roll selection, chapter markers, auto-captions, and thumbnail frame selection. Use when user says 'edit my video', 'video editing workflow', 'cut my footage', 'add chapters', 'auto captions', 'B-roll ideas'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, content, video-editing, youtube]
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---

# Video Editing

AI-assisted video editing workflows for YouTube tech content. Covers the full pipeline from raw footage to published video: transcript-based cutting, structure review, B-roll planning, chapter markers, caption export, and thumbnail frame selection.

## Trigger Phrases

- "edit my video"
- "video editing workflow"
- "cut my footage"
- "add chapters to my video"
- "auto captions"
- "B-roll ideas for my video"
- "trim my recording"
- "video structure review"

## The Workflow

### Phase 1: Transcript-Based Edit

Before touching the timeline, work from the transcript.

1. **Generate transcript:** use Descript, Otter.ai, or the YouTube auto-transcript (edit for accuracy after)
2. **Read the transcript as a document:** mark sections as Keep / Cut / Restructure
3. **Identify the real hook:** it's often 2-3 minutes into the recording, not at the start
4. **Cut filler and tangents:** "um", "you know", long pauses, off-topic detours
5. **Verify the 3-shift structure:** WHY it matters, HOW it works, WHAT to do next

**Transcript edit prompt:**
```
Here's the transcript from my video about [topic].
Please:
1. Identify the best hook moment (first compelling statement, not intro pleasantries)
2. Map it to the 3-shift structure (Why / How / What)
3. Flag sections to cut (tangents, filler, repeated points)
4. Suggest chapter titles and approximate timestamps
```

### Phase 2: B-Roll Planning

B-roll covers jump cuts, adds visual context, and breaks up talking head footage.

**B-roll types for tech content:**

| Type | When to Use | Example |
|---|---|---|
| Screen recording | Any time you're explaining software | Copilot Studio canvas, D365 screens |
| Code walkthrough | Technical demos | VS Code with TypeScript, Power Fx |
| Diagram / whiteboard | Architecture explanations | Multi-agent architecture diagram |
| Text overlay | Key stats or quotes | "97% of enterprise AI projects..." |
| Transition shot | Between major sections | Keyboard close-up, notification ding |

**B-roll planning prompt:**
```
Here are the chapter topics from my video:
[list chapters]

Suggest B-roll shots or screen recordings for each section.
I'm a solo creator with: [screen recording capability / phone camera / no second camera].
Topics are: [AI agents, Copilot Studio, D365, enterprise tech].
```

### Phase 3: Chapter Markers

YouTube chapters improve watch time and searchability. Add them when the video is over 8 minutes.

**Chapter rules:**
- First chapter starts at 00:00
- Minimum 10 chapters for a 20+ minute video
- Chapter titles must be scannable and specific ("Set Up Dataverse Policy Table" not "Step 2")
- Each chapter title is a search-able phrase, not a label

**Chapter format for YouTube description:**
```
00:00 Introduction
01:45 Why traditional ERP agents fail
04:30 The Niyam Pattern explained
08:15 Building the policy table in Dataverse
12:00 Connecting to D365 F&O via MCP
16:30 Testing the agent
19:45 What to build next
```

### Phase 4: Captions

Auto-captions are rarely accurate for technical content. Fix the most common errors:

**High-error terms for Ragnar's content:**
- Copilot Studio (often captioned as "Copilot's Studio" or "co-pilot studio")
- Dataverse (often "data verse")
- D365 / Dynamics 365
- MCP (often "MCP" read as letters, should clarify in caption: "M-C-P")
- Niyam (proper noun, always check)

**Caption export:** SRT format for manual upload, or VTT for web embedding.

### Phase 5: Thumbnail Frame Selection

While editing, mark 3-5 frames where your expression is strong (engaged, surprised, serious) and your face framing is good. These become thumbnail candidates.

**Good thumbnail frame criteria:**
- Eyes open and directed toward camera or slightly off-camera
- Expression reads clearly at small size (150px wide)
- No awkward mid-word mouth position
- Clean background visible behind you
- No hands blocking face

## Tools Comparison

| Tool | Best For | Cost |
|---|---|---|
| Descript | Transcript-based editing, word delete | $24/mo |
| CapCut | Quick cuts, auto captions, mobile | Free tier available |
| DaVinci Resolve | Full color grade, multi-track | Free tier available |
| Premiere Pro | Industry standard, team collab | Adobe subscription |
| YouTube Studio | Auto chapters, basic trim | Free |

**Recommendation for solo tech creators:** Descript for structure editing, CapCut for captions and fast exports, DaVinci for color grading when quality matters.

## Quick Example

> See `video-editing-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Video feels too long despite cutting | Weak structure: filler removed but tangents kept | Recheck against 3-shift structure, cut any section that doesn't serve Why/How/What |
| Auto-captions wrong on technical terms | AI transcription doesn't know your domain vocabulary | Manually correct in YouTube Studio or export SRT and fix a glossary of terms once |
| Hook starts too late | Recording includes pre-roll warmup chat | Find the first genuinely compelling statement and cut everything before it |
| B-roll timing feels awkward | B-roll doesn't match narration rhythm | Align B-roll cuts to sentence breaks in narration, not in the middle of phrases |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
