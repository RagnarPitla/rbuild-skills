---
name: "LinkedIn Post Generator"
slug: "linkedin-post-generator"
description: "Turn any idea, article, experience, or opinion into a high-performing LinkedIn post — with hooks that stop the scroll and endings that drive engagement."
tab: "personal"
domain: "content-creation"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["linkedin", "social-media", "content-creation", "personal-brand", "writing"]
version: "1.0.1"
icon_emoji: "💼"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "LinkedIn Creator Mode Guide"
    url: "https://www.linkedin.com/help/linkedin/answer/a545549"
requires: "None"
mcp_tools: []
---

# LinkedIn Post Generator

LinkedIn rewards a specific writing style: short paragraphs, strong hooks, real stories over corporate speak. This skill writes in that style — not generic, not cringe, not "I'm humbled to announce."

## What You Give It

**Option A: A raw idea**
```
"I just realized that the thing everyone calls 'AI replacing jobs' is 
actually about which parts of jobs get replaced, not whole jobs."
```

**Option B: An article or content you want to adapt**
```
[Paste the article, blog post, or key points]
```

**Option C: An experience or story**
```
"Yesterday a client told me our AI agent saved his team 14 hours a week.
6 months ago he thought AI was just hype."
```

**Option D: A specific goal**
```
"I need a post about why D365 consultants should learn Copilot Studio.
Audience: Microsoft partners and consultants."
```

## The LinkedIn Formula That Works

**Line 1 (the hook):** 1 sentence. Stops the scroll. Controversial, surprising, or specific number.

**Lines 2-4 (the tension):** What's the problem, the common belief, or the story setup.

**Lines 5-10 (the meat):** The insight, the story, the value. Short paragraphs. One idea per paragraph.

**Last 2 lines (the landing):** The takeaway + a question or call to action.

**What NOT to do:**
- "I'm thrilled to share..." → Never
- "In today's digital landscape..." → Never
- Paragraphs longer than 3 lines → Never
- Hashtag dumps at the end → 2-3 max, relevant only

## Hook Formulas

Pick one, adapt to your topic:

```
Contrarian: "Everyone says [X]. I disagree."
Specific: "6 months ago, [specific thing happened]."
Number: "[Number] things I wish I knew about [topic]."
Question: "Why does [strange thing] keep happening?"
After [time]: "After [doing X for Y time], here's what I learned:"
Hot take: "[Strong opinion]. Here's why:"
```

## Post Types

Tell Claude which type:
- **Story post** — a personal experience with a lesson
- **Insight post** — a perspective shift or counterintuitive take
- **List post** — N things about a topic (use sparingly)
- **Announcement post** — share something new without being annoying
- **Reaction post** — your take on industry news

## Trigger Phrases

- "Write a LinkedIn post about [topic/idea]"
- "Turn this into a LinkedIn post: [paste content]"
- "LinkedIn post — [raw idea]"
- "Create a post about [experience]"
- "Rewrite this for LinkedIn: [paste text]"

## Example

**Input:** "Had a call with a prospect today who said they spent $200K on a custom AI system that doesn't work. Meanwhile they ignored the native AI features in D365 that do the same thing for free."

**Output:**
```
A prospect just told me they spent $200K on a custom AI system.

It doesn't work.

The worst part? D365 already has built-in AI features that do 
exactly what they were trying to build.

It's been there the whole time.

This keeps happening because people assume enterprise AI needs 
to be complex. Custom-built. Expensive.

It doesn't.

The best AI projects I've seen this year weren't the most 
technically impressive. They were the ones that started with 
what already existed and actually shipped.

What's the most expensive "solved problem" you've seen someone 
try to solve from scratch?
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Sounds too corporate | No style guidance given | Add "casual, direct, no buzzwords" |
| Hook is too weak | Generic opening | Ask for "5 hook variations, I'll pick one" |
| Too long | No length spec | Add "under 150 words" |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
