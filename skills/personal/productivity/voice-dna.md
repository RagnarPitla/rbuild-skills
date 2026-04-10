---
name: voice-dna
description: "Analyzes writing samples to extract a person's unique voice patterns, vocabulary, and tone markers. Use when user says 'analyze my writing style', 'extract my voice', 'voice DNA', 'write like me', 'match my writing style', 'what's my writing style'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, universal, writing, content, voice]
---

# Voice DNA

## What This Skill Does

You paste samples of your own writing and the agent extracts your unique voice fingerprint. It identifies your sentence rhythm, vocabulary preferences, structural habits, and the things you never do. The output is a reusable Voice DNA card you can reference at the start of any writing session so AI writes like you, not like a polished stranger.

## Triggers

- "analyze my writing style"
- "extract my voice"
- "voice DNA"
- "write like me"
- "match my writing style"
- "what's my writing style"

## How It Works

### Step 1: Gather Your Samples

Paste 3-5 pieces of your own writing into the conversation. Use a mix of formats if you can. Good sources:

- LinkedIn posts or newsletter issues
- Emails you're proud of
- Blog posts or articles you wrote
- Chat messages where you were being yourself
- Talk transcripts or recorded conversation snippets

Aim for at least 500 words total. More variation gives a sharper extraction. Don't clean them up first, messy drafts reveal your natural patterns.

### Step 2: Run the Extraction

Paste your samples and say: "Extract my Voice DNA from these samples."

The agent will analyze:

**Sentence patterns** — average length, how you open paragraphs, transition words you use or avoid, whether you use intentional fragments.

**Vocabulary fingerprint** — words you reach for often, words you never use (especially AI-common words like "delve", "utilize", "transformative"), how technical vs plain your language is.

**Structural habits** — do you use bullet points or prose? How long before you get to the point? Do you use rhetorical questions? How you end (call to action, open question, or statement).

**Punctuation and formatting** — em dashes, semicolons, Oxford commas, paragraph length.

**Override rules** — the critical part. These are the things Claude would "improve" that you intentionally do differently. "This writer uses fragments as emphasis." "Short paragraphs, always." "Never ends with a question."

### Step 3: Review and Refine

Read the Voice DNA card the agent produces. Correct anything that feels wrong. Add anything it missed. You know your voice better than any algorithm.

Common additions people make:
- "Add: I never write more than 3 lines in a paragraph"
- "Remove: I do use Oxford commas actually"
- "Add: I always start with the problem, never with context"

### Step 4: Save and Use It

Save the Voice DNA card somewhere you can copy it quickly.

**In Claude Projects:** Paste it into your Project Instructions so it applies automatically to every conversation.

**In Claude Code:** Save it as a skill file so it loads on demand.

**Manual use:** Paste it at the start of any writing session with: "Here is my Voice DNA. Use it for everything you write for me today."

## Output

A Voice DNA card with 8-10 specific characteristics covering: sentence rhythm, opening style, vocabulary profile, words to avoid, structural habits, punctuation rules, and override rules (what not to improve).

## Checklist
- [ ] At least 3 writing samples provided (minimum 500 words total)
- [ ] Samples include at least 2 different formats or contexts
- [ ] Voice DNA card reviewed and corrected
- [ ] Override rules section present
- [ ] Card saved somewhere accessible for future sessions

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Profile sounds generic | Too few samples | Add 5 or more diverse examples |
| Voice still sounds off | Profile not being applied | Paste the full profile at the start of the conversation |
| Profile contradicts itself | Samples from different periods or platforms | Use samples from the same era and context |
| Misses a key habit | Agent didn't catch a subtle pattern | Add it manually: "Add to override rules: [your rule]" |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
