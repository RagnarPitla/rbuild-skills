---
name: cs-topic-basics
description: Build well-structured Copilot Studio topics with trigger phrases, question nodes, conditions, and variables. Use when user says 'create a topic in Copilot Studio', 'topic not triggering', 'how do I add branching to a topic', 'topic variables not working', 'agent routing to wrong topic', 'how do I collect user input in Copilot Studio'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, copilot-studio, topics, triggers]
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# CS Topic Basics

Topics are structured conversation flows. Unlike generative AI responses (which are free-form), topics give you precise control over what the agent says and does. Every production agent uses both.

## Trigger Phrases

- "create a topic in Copilot Studio"
- "my topic is not triggering"
- "how do I add branching logic to a topic"
- "topic variables not working"
- "agent routing to the wrong topic"
- "how do I collect user input in Copilot Studio"
- "add a question node to a topic"
- "topic design best practices"

## When to Use Topics vs Generative Answers

| Scenario | Use Topics | Use Generative Answers |
|---|---|---|
| Collecting structured data (form-like) | Yes | No |
| Triggering Power Automate actions | Yes | No |
| Compliance-sensitive exact wording | Yes | No |
| Multi-step process with branching | Yes | No |
| Answering questions from documents | No | Yes |
| Open-ended Q&A on policies and FAQs | No | Yes |

Most production agents use both — topics for structured tasks, generative answers for everything else.

## Trigger Phrases

Every topic starts with trigger phrases — the user inputs that activate this topic.

**Good triggers for a "PO Status" topic (5-8 per topic):**
```
Check my purchase order status
Where is my order
PO status lookup
Track my purchase
What's the status of my PO
Has my order been received
Order status check
```

**Rules:**
- Use natural language, not keywords
- Vary phrasing (different sentence structures, synonyms)
- 5-8 phrases is the sweet spot
- Don't overlap with other topic triggers
- Avoid generic phrases like "Help" or "Hello" — those belong in system topics

## Question Nodes

Question nodes collect information from users. Always set the entity type:

| Entity | Use For | Example |
|---|---|---|
| Text | Open-ended answers | "What's your vendor name?" |
| Number | Amounts, IDs, quantities | "What's your PO number?" |
| Email | Email addresses (auto-validated) | "What's your email?" |
| Boolean | Yes/No confirmations | "Do you want to proceed?" |
| Date/time | Dates and times | "What's your required delivery date?" |
| Custom entity | Domain-specific choices | Department list, order type list |

Save every response to a **Topic variable** (`Topic.PONumber`). Named variables are required for conditions and connector actions.

## Variables: Topic vs Global

**Topic variables** (`Topic.VarName`) exist only within this topic conversation. Use for collected inputs and intermediate results.

**Global variables** (`Global.VarName`) persist across all topics in the session. Use for user identity, preferences, or data multiple topics need.

```
Good: Global.UserEmail — set once at session start, available everywhere
Good: Topic.OrderNumber — collected here, used here
Bad:  Using a global variable for input used in only one topic
```

## Conditions (Branching)

After a Question node, add a **Condition** to branch based on the answer:

```
User answers "New request"   → Branch A: go to request submission flow
User answers "Check status"  → Branch B: ask for order number, look it up
All other conditions         → "I didn't understand. Can you clarify?"
```

Always add a catch-all branch. Users will say unexpected things.

## Core Tasks

### 1. Create a New Topic
```text
GIVEN user needs a new conversation flow
WHEN skill creates the topic
THEN name the topic clearly (what it does)
AND write 5-8 trigger phrases in natural language
AND add a message node as the first response
AND add question nodes for any required inputs
AND set entity type on every question node
AND save each answer to a named Topic variable
AND add conditions for branching after question nodes
AND add catch-all condition on every branch
AND add confirmation before any write action
AND add End Conversation node on every terminal path
```

### 2. Fix a Topic Not Triggering
```text
GIVEN topic not activating when user sends relevant messages
WHEN skill diagnoses the issue
THEN check trigger phrases for natural language vs keyword style
AND check for overlap with other topic trigger phrases
AND verify topic is not disabled
AND verify trigger phrases match what users actually say
AND check NLU model hasn't been overridden by a higher-priority topic
THEN rewrite triggers and test each one
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| The mega-topic | One topic handles 10+ scenarios, 50+ nodes | Split into focused sub-topics, use Redirect nodes |
| Hardcoded data | Vendor names, product categories in message text | Use Dataverse tables or connector lookups |
| No confirmation step | Action executes without user confirming | Add "Are you sure?" before every write/submit action |
| Missing error handling | Power Automate fails silently | Add error condition branch after every connector action |
| Dead-end branches | Branch has no response or redirect | Every branch needs a response and a path forward |

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Topic not triggering | Trigger phrases too specific or using keywords instead of natural language | Rewrite triggers as full natural sentences, add synonym variations |
| Two topics fire for the same input | Trigger phrase overlap between topics | Audit all topics for duplicate or near-duplicate phrases, make them mutually exclusive |
| Variable empty when used in condition | Question node not saving to variable, or variable scoped incorrectly | Check question node has "Save response as" configured, verify Topic vs Global scope |
| Agent loops or restarts mid-topic | Missing End Conversation or redirect on a branch path | Add terminal node to every condition branch path |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
