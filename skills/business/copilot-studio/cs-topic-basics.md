---
name: Copilot Studio Topic Basics
slug: cs-topic-basics
description: Build well-structured topics — trigger phrases, question nodes, conditions, variables, and the anti-patterns to avoid.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"topics\", \"conversation-design\", \"beginner\"]"
version: 1.0.1
icon_emoji: 💬
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 2
prerequisites: "[\"cs-first-agent\"]"
references:
  - "title: "Create and edit topics"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Copilot Studio Topic Basics

Topics are structured conversation flows. Unlike generative AI responses (which are free-form), topics give you precise control over what the agent says and does.

## When to Use Topics vs Generative Answers

**Use topics for:**
- Collecting structured data from users (form-like flows)
- Triggering Power Automate actions (submit a request, check status)
- Compliance-sensitive conversations where exact wording matters
- Multi-step processes with branching logic

**Use generative answers for:**
- Answering questions from your knowledge sources
- Open-ended Q&A about policies, procedures, FAQs

Most production agents use both — topics for structured tasks, generative answers for everything else.

## Trigger Phrases

Every topic starts with trigger phrases — the user inputs that activate this topic.

**Good triggers (5-8 per topic):**
```
Check my purchase order status
Where is my order
PO status lookup
Track my purchase
Order tracking
```

**Rules:**
- Use natural language, not keywords
- Vary phrasing (different sentence structures)
- 5-8 phrases is the sweet spot
- Don't overlap with other topic triggers

## Question Nodes

Question nodes collect information from users. Always set the **entity type**:

| Entity | Use For | Example |
|---|---|---|
| Text | Open-ended answers | "What's your vendor name?" |
| Number | Amounts, IDs | "What's your PO number?" |
| Email | Email addresses | "What's your email?" |
| Boolean | Yes/No confirmations | "Do you want to proceed?" |
| Date/time | Dates | "What's your required date?" |

Save the response to a **Topic variable** (`Topic.PONumber`).

## Variables: Topic vs Global

**Topic variables** (`Topic.VarName`) — exist only in this topic conversation. Use for collected inputs.

**Global variables** (`Global.VarName`) — persist across all topics in the session. Use for user identity, preferences, or data multiple topics need.

```
✅ Global.UserEmail — set once at session start, available everywhere
✅ Topic.OrderNumber — collected here, used here
❌ Using global for single-topic data (wastes memory)
```

## Conditions (Branching)

After a Question node, add a **Condition** to branch based on the answer:

```
User answers "New request" → Branch: go to request submission flow
User answers "Check status" → Branch: ask for order number, look it up
All other conditions → "I didn't understand. Can you clarify?"
```

Always add a catch-all branch. Users will say unexpected things.

## Top Anti-Patterns

**The mega-topic** — one topic handling 10 different scenarios. Split it.

**Hardcoded data** — putting vendor names or product categories in topic messages. Use Dataverse tables. Data changes; your topic shouldn't need editing.

**No confirmation step** — for any action (submit, approve, update), always confirm before executing.

**Missing error handling** — what happens if the Power Automate action fails? Add an error branch.

## Quick Example

> See `cs-topic-basics-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
