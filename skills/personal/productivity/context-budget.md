---
name: "Context Budget"
slug: "context-budget"
description: "Audit and manage your Claude Code context window — identify what's consuming tokens, compress what's bloated, and keep sessions efficient."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["context-window", "context-budget", "claude-code", "optimization", "tokens", "performance"]
version: "1.0.1"
icon_emoji: "🪟"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Claude Context Window Documentation"
    url: "https://docs.anthropic.com/en/docs/about-claude/models"
requires: "None"
mcp_tools: []
---

# Context Budget

Claude's context window is finite. Long sessions, bloated files, verbose tool outputs, and sprawling conversations eat through it fast. When it runs out, the session compresses — and Claude loses earlier context that might matter.

This skill helps you understand what's consuming your context and make intelligent tradeoffs to keep sessions productive longer.

## The Context Budget Mental Model

Think of your context like a whiteboard. Every message, every file you read, every tool output, every skill loaded — it all takes up space. When the whiteboard fills up, old content gets erased.

**What consumes the most context:**
1. Large files read with the Read tool (especially generated files)
2. Long conversation histories
3. Verbose tool outputs (test runners, build logs)
4. Skills with long content (especially multi-skill sessions)
5. Repeated re-reading of the same files

## Trigger Phrases

- "Audit my context budget"
- "What's consuming my context window?"
- "Help me manage context for this long session"
- "Context window is getting full"
- "Compact this conversation"
- "How can I extend this session?"
- "Context budget check"

## What the Audit Produces

```
CONTEXT BUDGET AUDIT

Estimated consumption:
  Conversation history:  ~8,000 tokens (HIGH — 12 back-and-forths)
  Files read:            ~4,200 tokens (3 large files still in context)
  Tool outputs:          ~6,100 tokens (test run output is verbose)
  Skills loaded:         ~2,800 tokens (3 skills active)
  TOTAL ESTIMATE:        ~21,100 tokens

RECOMMENDATIONS:
1. [HIGH] Your test output from 4 messages ago is still in context — 
   it added 3,800 tokens. Don't read full test output; ask for summary.
   
2. [MEDIUM] package-lock.json was read unnecessarily — 1,200 tokens 
   for a file you didn't need. Avoid reading generated/lock files.

3. [LOW] Consider using /compact at the natural breakpoint after this 
   task — you've completed the auth implementation, clean slate for testing.
```

## Strategies to Extend Session Life

**Before the session:**
- Read only files you'll actively edit, not every file for context
- Use targeted grep/glob instead of reading whole files
- Set clear scope — one feature per session

**During the session:**
- Request summaries of tool output instead of full output
- Use `/compact` at natural breakpoints (feature complete, major milestone)
- Don't re-read files you've already read — they're still in context

**File reading strategy:**
```
❌ Read the whole file to understand it
✅ Read only the specific section you need (use offset/limit)
✅ Ask "what does function X do?" instead of reading the whole file
```

**Tool output strategy:**
```
❌ Run full test suite, read all output
✅ Run tests, ask "summarize the failures — just file and line number"
❌ Read full build log
✅ Ask "what's the first error in the build log?"
```

## When to Compact

Use `/compact` (Claude Code command) when:
- You've finished a distinct phase of work (auth done, now onto UI)
- The conversation history is mostly resolved questions
- You're about to start a fresh problem

Don't compact when:
- You still need the context from recent messages
- You're mid-task on something complex

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Session feels slow or repetitive | Context near limit, older context compressed | Use /compact, start new session for new feature |
| Claude "forgets" earlier decisions | Context limit hit, old messages compressed | Document key decisions in a CLAUDE.md or design doc — not just in chat |
| Context fills faster than expected | Skills, MCPs, or rules adding large content | Audit what's auto-loading; disable unused skills for focused sessions |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
