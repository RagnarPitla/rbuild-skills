---
name: content-engine
description: Repurposes one core idea into platform-native content across LinkedIn, YouTube, newsletter, and X. Use when user says 'content calendar', 'repurpose this', 'turn this into content', 'multi-platform content', 'content from this idea', 'create a content week'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, content, repurposing, multi-platform]
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---

# Content Engine

One core idea, repurposed across every platform. The system Ragnar uses to publish consistently without recreating everything from scratch.

## Trigger Phrases

- "content calendar"
- "repurpose this into content"
- "turn this into a content week"
- "multi-platform content from"
- "content from this idea"
- "LinkedIn post and YouTube script"
- "create a content series"
- "content strategy for this topic"

## The One-to-Many Model

Every piece of content starts with a Core Insight. Everything else is a derivative.

```
Core Insight (1 idea, 1 framework, 1 observation)
    |
    +-- LinkedIn post (practitioner take, 800-1,200 chars)
    +-- YouTube script (15-20 min deep dive)
    +-- Newsletter issue (one insight + one action)
    +-- X thread (5-7 tweet breakdown)
    +-- Article / blog (long-form with evidence)
```

The core insight must be specific enough to generate an opinion and broad enough to be relevant to your audience.

**Too vague:** "AI agents are important"
**Too narrow:** "The timeout setting on Copilot Studio's DirectLine API is 10 seconds"
**Right:** "Most enterprise AI agent projects fail in the same predictable way, and it's not the technology"

## Platform Templates

### LinkedIn Post

LinkedIn rewards length and specificity. Write for the practitioner who is already trying to solve this problem.

```
[HOOK LINE: one sentence that stops the scroll]

[2-3 sentence setup: the situation]

[The insight: your real take, with evidence from your own work]

[Framework or pattern: something they can apply]

[Close: what it means for them, or a question]

[3-4 hashtags]
```

**LinkedIn rules:**
- First line must work as a standalone statement (it's all they see before "see more")
- No bullet soup in the opening. Earn the list.
- Personal beats polished. "At a client last week" beats "Organizations often find"
- Length: 800-1,400 characters is the sweet spot

### YouTube Script

See the full `youtube-script` skill. For repurposing: a LinkedIn post becomes the hook script, the framework becomes Shift 2, the call to action becomes Shift 3.

### Newsletter Issue

Ragnar's newsletter format: one idea, tight.

```
# [Headline: the specific insight]

[One paragraph: the situation]

[The insight + why it matters]

[One concrete example: specific, not generic]

[The action item: what to do with this]

[One resource or link]

---
*[Ragnar Pitla, [newsletter name]. Views are my own.]*
```

**Newsletter rules:**
- Target: 400-600 words
- One idea only. If you have two ideas, that's two issues.
- The action item must be executable this week, not "think about AI"

### X Thread

```
Tweet 1 (hook): [The contrarian claim or the specific number]

Tweet 2: The setup: what most people believe

Tweet 3: What's actually happening (the insight)

Tweet 4: Evidence from your own work

Tweet 5: The framework or pattern

Tweet 6: What to do with this

Tweet 7 (close): [The one sentence summary]
[Link to full article or video]
```

**X rules:**
- Each tweet must stand alone (people screenshot individual tweets)
- Tweet 1 is everything. Test multiple variations.
- Never end with "a thread" in tweet 1. Lead with the actual hook.

## Content Calendar System

Plan content in weekly blocks, not daily. One topic per week, adapted for each platform.

```
Week [N] Topic: [Core Insight]

Monday:    LinkedIn post (practitioner take)
Tuesday:   X thread (breakdown format)
Wednesday: Newsletter draft (action-oriented)
Thursday:  YouTube script (deep dive)
Friday:    Article draft (evidence + framework)
```

**Reality check:** You don't need all five every week. Pick two platforms you'll actually publish on and do those consistently. Consistency beats platform diversity.

## Repurposing From Existing Content

If you already have a YouTube video or article, work backwards:

1. **Extract the core insight:** what's the one sentence someone would remember?
2. **Pull the best quote:** what's the most quotable line? That's your LinkedIn hook.
3. **Find the framework:** what's the reusable pattern? That's your newsletter.
4. **Identify the controversy:** what would someone disagree with? That's your X thread.

## Prompt Template

```
I have [content type: video / article / talk / idea] about [topic].

Core insight: [one sentence, the main claim or observation]

Please create:
- LinkedIn post (practitioner voice, 800-1,200 chars)
- Newsletter issue (400-500 words, one action item)
- X thread (7 tweets, each standalone)
- [optional: YouTube hook for a deep-dive video]

Tone: Ragnar's voice. Confident practitioner, real builds, no fluff.
Audience: Enterprise tech leaders and AI practitioners.
```

## Quick Example

> See `content-engine-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| All platforms sound the same | Not adapting voice per channel | LinkedIn is professional, X is punchy, newsletter is collegial. Each has a distinct register. |
| Content feels thin across platforms | Core insight is too vague | Tighten the core insight to one specific, arguable claim before repurposing |
| LinkedIn post not performing | Hook line too generic | Test 3 different first lines before publishing. The hook is 80% of performance. |
| Newsletter unsubscribes spiking | Issues are too broad or too frequent | Go to one insight per issue, cut word count, increase value density |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
