---
name: Topic Design Patterns
slug: topic-design-patterns
description: Design well-structured Copilot Studio topics with trigger phrases, branching, variable scoping, and anti-patterns to avoid.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"topics\", \"conversation-design\", \"branching\"]"
version: 1.0.1
icon_emoji: 💬
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 2
prerequisites: "[\"your-first-copilot-studio-agent\"]"
references:
  - "title: "Create and edit topics in Microsoft Copilot Studio"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Topic Design Patterns

Topics are the building blocks of every Copilot Studio agent. Good topic design means fewer unexpected fallbacks, cleaner conversation flows, and agents that actually work in production.

## Trigger Phrases: The Right Number and Specificity

**Target 5-8 trigger phrases per topic.** Too few and the agent won't recognize the intent. Too many and you'll have overlap with other topics causing routing conflicts.

**Good triggers for a "Check PO Status" topic:**
```
- Check my purchase order
- What's the status of my PO
- Where is my order
- Purchase order lookup
- PO status
- Has my order shipped
```

**Rules:**
- Use natural language, not keywords ("What is the status of my purchase order" not "PO status check")
- Vary the phrasing — use synonyms and different sentence structures
- Avoid overlapping with other topic triggers unless you want overlap (and manage it with conditions)
- Don't use trigger phrases like "Hello" or "Help" — those belong in system topics

## Question Nodes: Entity Extraction vs Free Text

Use **Question nodes** to collect information from the user. Always specify the entity type:

| Entity Type | When to Use |
|---|---|
| Text | Open-ended free text (names, descriptions) |
| Number | Quantities, order numbers |
| Email | Email addresses (validated automatically) |
| Boolean (yes/no) | Confirmations |
| Custom entity | Domain-specific choices (department names, order types) |

**Slot filling tip:** If you ask "What's your PO number and the vendor name?", the agent can extract both in one message if you set up two question nodes back-to-back and enable slot filling. Users can answer in any order.

## Variable Scoping: Topic vs Global

This is where most beginners make mistakes.

**Topic variables** (`Topic.VarName`): Exist only within the current topic conversation. Use these for anything temporary — collected input, intermediate results.

**Global variables** (`Global.VarName`): Persist across the entire session. Use for user identity, preferences, or data that multiple topics need.

```
✅ Good: Global.UserEmail — set once at session start, used everywhere
✅ Good: Topic.PONumber — collected in this topic, used in this topic
❌ Bad: Using a global variable for a one-time input in a single topic
```

## Branching with Conditions

Add a **Condition node** after any Question node to branch the conversation based on the answer.

Example: After asking "Do you want to submit a new request or check an existing one?"
```
Branch 1: Topic.RequestType = "Submit new"
  → Route to "Submit Request" topic

Branch 2: Topic.RequestType = "Check existing"  
  → Ask for PO number, call API, display status

Branch 3: All other conditions
  → Fallback message with clarification
```

**Always add an else/catch-all branch** — users will say unexpected things.

## Sub-Topics: When to Split

Split a large topic into sub-topics when:
- It has more than 15-20 nodes
- Multiple parent topics need the same logic
- You want to reuse a flow (like authentication or confirmation)

Use a **Redirect node** to call a sub-topic and optionally return.

## Anti-Patterns to Avoid

**❌ The mega-topic** — one topic that handles 5 different scenarios with 50 nodes. Split it.

**❌ Hardcoded data** — putting vendor lists or product categories inside topic message nodes. Use Dataverse tables or connector actions instead. When the data changes, you'll have to edit the topic.

**❌ No confirmation step** — for any action that changes data (submitting a request, approving, updating a record), always add a confirmation message before executing.

**❌ Dead-end branches** — every conditional branch needs a meaningful response or redirect, even if it's just "I'm not sure how to handle that — let me connect you to support."

**❌ Missing "end of topic" handling** — add an End Conversation or redirect node at the end of every path so users know the flow is complete.

## Testing Your Topics

After building a topic, test these scenarios:
1. The happy path (correct inputs, expected flow)
2. Unexpected input at each Question node
3. Each conditional branch
4. What happens if the user types "cancel" mid-flow

## Quick Example

> See `topic-design-patterns-example.md` in this folder for a full worked scenario with business impact.

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
