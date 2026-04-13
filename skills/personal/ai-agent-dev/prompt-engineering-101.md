---
name: "prompt-engineering-101"
slug: "prompt-engineering-101"
description: "Prompt engineering fundamentals — system prompts, chain-of-thought, few-shot examples, and the mistakes that kill quality. Use when user says 'prompt engineering basics', 'how to write a system prompt', 'improve my prompt', 'chain of thought', 'few-shot examples', 'why is my LLM output bad', 'prompt injection'."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["beginner", "ai-agent-dev", "prompt-engineering", "fundamentals"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Claude API"
mcp_tools: []
---


# Prompt Engineering 101

Prompt engineering is less about magic words and more about clear communication. LLMs are capable — they mostly fail because instructions are ambiguous, not because they can't do the task.

## The System Prompt

The system prompt sets the context for every message. Think of it as the job description you give the model before any work starts.

**Structure that works:**
```
1. ROLE: Who is the model in this context?
2. TASK: What does it do?
3. CONSTRAINTS: What should it NOT do?
4. FORMAT: How should responses look?
```

**Example:**
```
You are a code reviewer specializing in Python security.
Review code for: SQL injection, XSS, hardcoded secrets, insecure dependencies.
Do NOT rewrite the code — only identify issues with line numbers.
Format: numbered list, one issue per line, with severity: [HIGH/MEDIUM/LOW].
```

Clear beats clever. Simple beats elaborate.

## Chain-of-Thought (Think Before Answering)

For complex tasks, tell the model to reason before giving the final answer:

```
Before answering, think through this step by step:
1. What is the core question?
2. What information do I have?
3. What's the most accurate answer?

Then provide your final answer.
```

When to use it: math problems, multi-step reasoning, analysis, debugging.
When to skip it: simple lookups, classification, one-sentence responses.

## Few-Shot Examples

Show the model what good output looks like. 2-3 examples is optimal.

```
Examples:

Input: "Hello"
Output: "Hi there! How can I help you today?"

Input: "What time is it?"
Output: "I don't have access to real-time information, so I can't tell you the current time. Check your device's clock."

Now respond to this message: [user input]
```

Choose examples that cover the main cases, especially edge cases you care about.

## Temperature

- **0** — Deterministic. Same input gives same output. Use for: code, classification, data extraction
- **0.3-0.5** — Slight variation. Good for: summarization, analysis
- **0.7-1.0** — Creative variation. Good for: brainstorming, creative writing

For agents: keep at 0-0.3. You want predictability, not creativity.

## The 5 Mistakes That Kill Quality

1. **Vague instructions** — "Be helpful" vs "Keep responses under 100 words and use formal language"
2. **Too many rules** — 2,000-word system prompts degrade performance. Keep under 500 words.
3. **No output format specified** — always specify the exact format you want
4. **Not testing edge cases** — your prompt fails the moment a user does something unexpected
5. **Prompt injection vulnerability** — never put untrusted user input directly into system prompts

## Quick Test Checklist

Before shipping a prompt:
- [ ] Does it do the right thing for the main use case?
- [ ] What happens with empty input?
- [ ] What happens with malicious input?
- [ ] What happens when the model doesn't know the answer?
- [ ] Is the format exactly what downstream code expects?

## Trigger Phrases

- "prompt engineering basics"
- "how to write a system prompt"
- "improve my prompt"
- "chain of thought"
- "few-shot examples"
- "why is my LLM output bad"
- "prompt injection"
- "temperature setting for agents"

## Quick Example

> See `prompt-engineering-101-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Model ignores instructions | System prompt too long, instructions buried | Move the most important constraint to the first sentence; trim prompt to under 500 words |
| Output format inconsistent | Format only described, not shown | Add a concrete example of the exact output format you want |
| Model makes up information | No grounding constraints | Add "Only use information from the provided context. If unsure, say so." |
| Prompt injection succeeds | User input concatenated into system prompt | Always separate user input from system instructions using XML tags or clear delimiters |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
