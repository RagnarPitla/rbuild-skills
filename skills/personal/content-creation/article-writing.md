---
name: article-writing
description: Writes long-form articles, blog posts, tutorials, and newsletter content in Ragnar's practitioner voice. Use when user says 'write an article', 'blog post', 'write a guide', 'newsletter issue', 'medium post', 'thought leadership piece'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, content, writing, thought-leadership]
requires: fal.ai MCP or OpenRouter
mcp_tools:
  - "fal-ai-mcp"
  - "openrouter"
---

# Article Writing

Long-form articles, blog posts, guides, and newsletter issues for AI/enterprise audiences. Written in Ragnar's voice: confident practitioner, real implementations, no fluff.

## Trigger Phrases

- "write an article about"
- "write a blog post"
- "write a guide on"
- "newsletter issue about"
- "medium post on"
- "thought leadership piece"
- "technical article about"
- "long-form content on"

## Article Structure

Every article follows the same backbone regardless of topic.

### 1. Hook Paragraph

The first paragraph does one job: earn the next paragraph. It must answer "why does this matter to me, right now?"

**Hook patterns:**

**The Problem Hook:** State a pain point so precisely that the reader feels seen.
"You've been told to 'adopt AI'. Your ERP consultant is quoting you six months and half a million dollars. And you still don't have a working agent. Here's why that keeps happening."

**The Contrarian Hook:** Challenge the consensus view.
"Everyone is talking about AI agents like they're magic. After deploying them in D365 for 20+ enterprise clients, I can tell you: the technology is the easy part."

**The Stat Hook:** An unexpected number that reframes the problem.
"97% of enterprise AI projects that fail, fail for the same three reasons. None of them are technical."

### 2. Narrative Arc

Good articles build an argument, not just a list.

```
Setup: Here's the situation most people are in
Conflict: Here's why that situation is a problem
Insight: Here's what most people miss
Resolution: Here's what actually works (with evidence)
Call to Action: Here's the one thing to do next
```

### 3. Concrete Examples

Abstract claims without examples are opinion. Examples without context are anecdotes. The combination is evidence.

**Formula:** Claim + Example + So What
"Agents that use Dataverse-backed policies outperform hardcoded instruction agents in compliance scenarios [claim]. At one client, switching to the Niyam pattern reduced policy violations by 40% in the first month [example]. The reason is simple: Dataverse policies can be updated without redeploying the agent [so what]."

### 4. Framework Thinking

Ragnar's articles introduce frameworks, not just opinions. A framework gives the reader something they can apply.

**Framework signals:**
- "There are three types of..."
- "The pattern I've seen across every successful deployment is..."
- "Think of it as a spectrum from X to Y..."
- "I call this the [Name] pattern because..."

### 5. Call to Action

End with a single specific next step. Not "explore AI", but "build your first policy table in Dataverse this week using the template below."

## Article Types

### Technical Tutorial
**Structure:** Problem statement, prerequisites, step-by-step walkthrough, expected outcome, common mistakes
**Length:** 1,200-2,000 words
**Tone:** Instructive but conversational. "Here's what you do, here's why."

### Thought Leadership
**Structure:** Contrarian claim, evidence from real work, framework to apply, what it means for your company
**Length:** 800-1,200 words
**Tone:** Confident, framework-driven, practitioner voice

### Newsletter Issue
**Structure:** One insight, one example, one action item, one resource
**Length:** 400-600 words
**Tone:** Direct, scannable, punchy. Like a note from a smart colleague.

### LinkedIn Article
**Structure:** Hook, 3-4 sections with bold headers, clean close
**Length:** 600-1,000 words
**Tone:** Professional but not corporate. Personal but not casual.

## Writing Rules

1. Never use em dashes. Use a comma, colon, or period instead.
2. No passive voice where active is possible.
3. Short paragraphs. Three sentences maximum for online content.
4. Every technical claim needs evidence (your own experience, data, or a cited source).
5. First-person throughout. "I've seen this in production" beats "organizations often find."
6. Add disclaimer on published content: "Views expressed are my own and do not represent Microsoft's official position."

## Prompt Template

```
Write a [type: technical tutorial / thought leadership / newsletter issue] article about [topic].

Target audience: [enterprise tech leaders / AI practitioners / D365 consultants]
Key argument: [the main claim or insight]
Length: [word count target]
Include: [specific examples, frameworks, technical details to include]
Tone: [Ragnar's practitioner voice: confident, real implementations, no fluff]
```

## Quick Example

> See `article-writing-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Article sounds generic | No specific examples given | Provide real client scenarios, numbers, or implementation details |
| Too long / loses focus | Trying to cover too much | Narrow to one core claim and cut anything that doesn't support it |
| Wrong tone | Prompt missing voice guidance | Add "write in Ragnar's practitioner voice: confident, real builds, no fluff" |
| Hook is weak | Opening starts with context instead of conflict | Lead with the problem or the contrarian take, not the setup |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
