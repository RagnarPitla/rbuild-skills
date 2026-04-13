---
name: "prompt-engineering"
slug: "prompt-engineering"
description: "Structured prompt design — system prompts, chain-of-thought, few-shot examples, XML tags, and anti-patterns to eliminate. Use when user says 'prompt engineering', 'advanced prompting', 'XML tags in Claude', 'structured prompt design', 'chain of thought reasoning', 'anti-patterns in prompts', 'instruction overload'."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["intermediate", "ai-agent-dev", "prompt-engineering", "chain-of-thought"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Claude API"
mcp_tools: []
---


# Prompt Engineering

Prompting is a craft, not a magic formula. The fundamentals are simple, but mastery comes from understanding why each technique works.

## System Prompt Structure

The best system prompts follow this order:

```
1. ROLE — who the model is and what it knows
2. CONTEXT — relevant background about the situation
3. TASK — what it should do (and not do)
4. CONSTRAINTS — limits, tone, format requirements
5. OUTPUT FORMAT — exactly what the response should look like
```

Example:
```
You are a procurement policy assistant for Contoso Corporation.
You have deep knowledge of Contoso's procurement policies and D365 F&O processes.

Your job is to answer employee questions about purchasing policies.
Do NOT make up policies. Do NOT give financial or legal advice.

Always be concise (under 150 words per answer).
If unsure, say "I recommend checking with your procurement team."

Format: Plain text. No bullet points unless listing steps.
```

## Chain-of-Thought (CoT)

For reasoning tasks, tell the model to think step by step before answering:

```
Before answering, think through this step by step:
1. What is the core question being asked?
2. What relevant information do I have?
3. What is the most accurate answer?

Then provide your final answer.
```

**When CoT helps:** Math, logic, multi-step analysis, decision-making
**When to skip:** Simple lookups, classification, short responses — CoT adds tokens without benefit

## Few-Shot Examples

2-3 examples is usually optimal. More than 5 and you're burning tokens for diminishing returns.

Choose examples that:
- Cover edge cases you care about
- Represent the output format exactly
- Include at least one tricky case

```
Example 1:
Input: "Can I buy software without a PO?"
Output: "Software purchases under $500 can use a company credit card. Over $500 requires a PO. See Section 3.2 of the Procurement Policy."

Example 2:
Input: "What's the lead time for hardware orders?"
Output: "Standard hardware orders take 5-7 business days. Expedited shipping is available for urgent needs — contact procurement@contoso.com."
```

## XML Tags for Structure (Claude-specific)

Claude responds well to XML-tagged context:

```xml
<policy_document>
  [paste your policy here]
</policy_document>

<employee_question>
  Can I expense a standing desk?
</employee_question>

Answer based only on the policy document provided.
```

Tags help Claude distinguish between context types and follow instructions more precisely.

## Temperature Guide

| Task | Temperature |
|---|---|
| Code generation | 0 |
| Fact extraction | 0 |
| Classification | 0-0.2 |
| Summarization | 0.3-0.5 |
| Creative writing | 0.7-1.0 |
| Brainstorming | 0.8-1.0 |

For agents: keep temperature at 0-0.3. Predictability over creativity.

## Anti-Patterns

**Vague instructions**: "Be helpful and professional" should be "Keep responses under 100 words. Use formal language. Don't use slang."

**Role-play cosplay**: "You are an expert wizard who..." should be replaced with the actual expertise needed.

**Instruction overload**: 2,000-word system prompts with 50 rules. Keep it under 500 words. Test what's actually needed.

**Negative-only constraints**: "Don't mention competitors" (the model thinks about competitors). Instead: "When pricing comes up, focus on our own product value."

**Prompt injection vulnerability**: Never interpolate untrusted user input directly into system prompts. Separate user input clearly from your instructions.

## Trigger Phrases

- "prompt engineering"
- "advanced prompting"
- "XML tags in Claude"
- "structured prompt design"
- "chain of thought reasoning"
- "anti-patterns in prompts"
- "instruction overload"
- "negative constraints in prompts"

## Quick Example

> See `prompt-engineering-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Model violates negative constraints | Brain still activates concepts when told "don't" | Rewrite as positive direction: instead of "don't discuss X" use "stay focused on Y" |
| XML tags not working | Tags malformed or model not parsing them | Ensure opening and closing tags match; check for typos in tag names |
| CoT reasoning is wrong | Model reasoning step is flawed even when explicit | Add "Check your reasoning before giving the final answer" as a closing instruction |
| Few-shot examples make outputs worse | Examples are inconsistent or represent edge cases as normal | Audit examples; ensure they represent the typical case, not the exception |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
