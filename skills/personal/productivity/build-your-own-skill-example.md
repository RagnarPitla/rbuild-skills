# Build Your Own Skill — Example

## Scenario: The Content Manager Who Automated Her Biggest Time Drain

**Who:** Sophie Williams, Content Manager at a SaaS marketing agency, managing content for 6 clients. No coding background. Has been using Claude for 3 months.
**Where:** Claude.ai, Friday afternoon.
**The Problem:** Every week Sophie asks Claude the same thing in 5 different ways: "help me write a LinkedIn post about [topic] in my voice for [client name]." Every time she starts from scratch, re-explaining the client's industry, tone, audience, what they never say, and what format she wants. It takes 10 minutes just to get Claude oriented before doing the actual work. She is managing 6 clients, 3 posts per client per week. That setup time is eating 3-4 hours per week that she does not have.

**Prerequisites:** None. Sophie just needs to write down what she already knows about each client.

---

### What You Say to the Agent

> "I want to create a Claude skill for one of my clients, a B2B cybersecurity company. I keep re-explaining the same context every session. Here's what I tell Claude every time: They sell to CISOs and IT Security Directors at mid-market companies. Their tone is confident and no-nonsense, never alarmist. They never use fear-based language like 'threats lurking' or 'you're at risk.' They like data and real examples. Posts should be between 150-250 words, end with a question, and never use bullet points in the body. Can you generate a skill file I can save?"

### What the Agent Does

1. Takes Sophie's plain language description and identifies the key components: audience, tone, vocabulary rules, format constraints, and trigger phrases.
2. Identifies what is missing: no trigger phrases in the description. Asks Sophie how she will activate the skill. She says: "I'll say 'write a LinkedIn post for SecureLayer'" or "SecureLayer post about [topic]."
3. Generates the skill file:

```markdown
---
name: securelayer-linkedin
description: "LinkedIn post writer for SecureLayer, a B2B cybersecurity company.
Use when user says 'write a LinkedIn post for SecureLayer',
'SecureLayer post about', 'draft a post for SecureLayer'."
version: 1.0.0
author: Sophie Williams
tags: [linkedin, content, cybersecurity, securelayer]
---

# SecureLayer LinkedIn Posts

## Client Context
SecureLayer sells endpoint security and compliance tools to CISOs
and IT Security Directors at mid-market companies (200-2000 employees).
Their brand voice is confident and authoritative, not alarmist.

## Writing Rules
- Audience: CISOs and IT Security Directors
- Tone: Confident, direct, data-driven. Never fear-based or alarmist.
- Vocabulary to avoid: "threats lurking", "you're at risk",
  "cybercriminals are watching", anything sensational
- Format: 150-250 words. End with a question. No bullet points in body.
- Lead with a data point or a real-world scenario when possible.

## Trigger Phrases
- "write a LinkedIn post for SecureLayer"
- "SecureLayer post about [topic]"
- "draft a post for SecureLayer"
```

4. Tells Sophie exactly where to save it: create a folder at `~/.claude/skills/securelayer-linkedin/` and save the file as `SKILL.md`.
5. Walks her through testing it: open a new conversation and type "SecureLayer post about the new SEC cybersecurity disclosure rules."

### The Business Impact

- **Setup time per session dropped from 10 minutes to 0** — the skill loads the full client context automatically
- **6 clients, 18 posts per week, each now starts correctly oriented** — scaled the time saving across the full workload
- **Sophie built 5 more skills over the next 2 weeks** — one per remaining client. Total weekly setup time went from 3-4 hours to under 15 minutes

### Try It Yourself

> "Now help me build a second skill for my second client: a B2C fintech company targeting millennials. Their tone is casual and optimistic. They use humor but never at the expense of financial stress. Posts are 100-180 words and always end with a call to action, not a question. Generate the skill file and tell me where to save it."
