---
name: build-your-own-skill
description: "A step-by-step guide for beginners to create their first Claude Code skill from scratch. Covers what a skill is, when to make one, the minimal template, and how to test it. Use when user says 'build my own skill', 'create a skill', 'how do I make a skill', 'write a skill file', 'what is a skill', 'build your own skill'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, universal, skills, claude-code, getting-started]
---

# Build Your Own Skill

## What This Skill Does

A skill is a markdown file with instructions that Claude loads automatically when you use a specific phrase. This guide walks you through creating your first one from scratch. No coding experience needed. If you have ever typed the same context into Claude more than 3 times, you are ready for your first skill.

## Triggers

- "build my own skill"
- "create a skill"
- "how do I make a skill"
- "write a skill file"
- "what is a skill"
- "build your own skill"

## How It Works

### Step 1: Identify the Pattern Worth Capturing

Ask yourself: what do I explain to Claude every time I start a session?

Good examples:
- "Here is how I write for my newsletter..."
- "When I say analyze data, here is the format I want..."
- "My company sells X to Y, our tone is Z..."
- "Every time I review code, check for these 5 things..."

The test is simple: if you would say the same thing next session, it should be a skill. Once it is a skill, you never explain it again.

### Step 2: Write It Out in Plain Language First

Before formatting anything, write what you want Claude to know. Stream of consciousness works fine:

```
When I ask for help writing LinkedIn posts, you should know:
- I write for founders and operators, not techies
- My tone is direct and short, no fluff
- I never use bullet points in the post itself
- Always end with a question to prompt comments
- Never say "In today's fast-paced world"
- My name is Sarah and I run a supply chain software company
```

Getting this down in plain language first is more important than the format. The format is just structure around what you already know.

### Step 3: Structure It as a Skill File

Every skill file has three parts:

**Part 1: Frontmatter at the top (the metadata)**
```yaml
---
name: my-linkedin-voice
description: "Writing style and context for Sarah's LinkedIn posts. Use when user says 'write a LinkedIn post', 'draft a post for me', 'LinkedIn post about'."
version: 1.0.0
author: Your Name
tags: [writing, linkedin, voice]
---
```

The description field is the most important. It must include the exact trigger phrases you will say. Claude uses this to decide when to load the skill.

**Part 2: The context**
Who you are, what this skill covers, when to use it.

**Part 3: The instructions**
What Claude should actually do when this skill loads.

### Step 4: Use This Minimal Template

```markdown
---
name: [skill-name-with-hyphens]
description: "One sentence describing what this does. Use when user says 'phrase 1', 'phrase 2', 'phrase 3'."
version: 1.0.0
author: Your Name
tags: [tag1, tag2]
---

# Skill Name

## Context
[2-3 sentences: who you are, what this skill is for]

## Instructions
[Your instructions in plain language. Be specific.]

## Trigger Phrases
- "phrase 1"
- "phrase 2"
- "phrase 3"

## What to Avoid
- [Things Claude should NOT do]
- [Common mistakes to prevent]
```

### Step 5: Let Claude Build It for You

The fastest path is to tell Claude what you want and let it write the skill file:

```
I want to create a Claude skill for [what you do repeatedly].
Here is what I want it to do: [paste your plain language notes from Step 2]
Please generate a skill file I can save and use.
```

Claude produces the formatted file. Read it, fix anything that feels wrong, then save it.

### Step 6: Install and Test

**Save the file to:**
```
~/.claude/skills/your-skill-name/SKILL.md
```

**To test:** Open a new Claude Code conversation and type one of your trigger phrases exactly. If Claude loads the skill and behaves as expected, it works. If not, check that your trigger phrases in the description field match how you actually speak.

## Output

A working SKILL.md file saved in the right location, a confirmed trigger phrase, and the first time Claude behaves exactly the way you configured it without you having to explain anything.

## Checklist
- [ ] Repeated pattern identified (used more than 3 times)
- [ ] Plain language notes written before formatting
- [ ] Trigger phrases in the description field match how you actually speak
- [ ] Skill file saved to ~/.claude/skills/[name]/SKILL.md
- [ ] Tested in a new conversation using the trigger phrase

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Skill not activating | Trigger phrases too formal or don't match how you speak | Rewrite triggers to match your exact natural phrasing |
| Skill output is too generic | Not enough specific detail in the instructions | Add 3 real examples of what good output looks like |
| Skill is trying to do too much | Scope too broad | One skill, one job. Split into multiple smaller skills. |
| Instructions conflict | Wrote it too fast, contradictions inside | Read it aloud, fix any sentences that undo each other |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
