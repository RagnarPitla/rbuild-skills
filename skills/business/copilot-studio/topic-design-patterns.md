---
name: topic-design-patterns
description: Design well-structured Copilot Studio topics with trigger phrases, branching, variable scoping, and anti-patterns to avoid. Use when user says 'topic not triggering correctly', 'how do I design a topic', 'Copilot Studio branching patterns', 'slot filling in topics', 'topic anti-patterns', 'two topics firing for same intent'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, copilot-studio, topics, design-patterns]
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Topic Design Patterns

Topics are the building blocks of every Copilot Studio agent. Good topic design means fewer unexpected fallbacks, cleaner conversation flows, and agents that actually work in production.

## Trigger Phrases

- "topic not triggering correctly in Copilot Studio"
- "how do I design a well-structured topic"
- "Copilot Studio branching logic patterns"
- "slot filling in Copilot Studio topics"
- "topic anti-patterns to avoid"
- "two topics firing for the same user input"
- "when should I split a topic into sub-topics"
- "how do I use sub-topics and redirects"

## Trigger Phrases: The Right Number and Specificity

Target 5-8 trigger phrases per topic. Too few and the agent won't recognize the intent. Too many and you'll have overlap with other topics causing routing conflicts.

Good triggers for a "Check PO Status" topic:
```
Check my purchase order
What's the status of my PO
Where is my order
Purchase order lookup
PO status
Has my order shipped
Track my purchase order
```

Rules:
- Use natural language, not keywords ("What is the status of my purchase order" not "PO status check")
- Vary the phrasing — use synonyms and different sentence structures
- Avoid overlapping with other topic triggers unless you want overlap and manage it with conditions
- Don't use trigger phrases like "Hello" or "Help" — those belong in system topics

## Question Nodes: Entity Extraction vs Free Text

Use Question nodes to collect information. Always specify the entity type:

| Entity Type | When to Use | Example |
|---|---|---|
| Text | Open-ended free text (names, descriptions) | "What's the vendor name?" |
| Number | Quantities, order numbers, amounts | "What's your PO number?" |
| Email | Email addresses (auto-validated) | "What's your email?" |
| Boolean (yes/no) | Confirmations | "Do you want to proceed?" |
| Custom entity | Domain-specific choices (department names, order types) | "Which department are you in?" |

Slot filling tip: If you ask "What's your PO number and the vendor name?", the agent can extract both in one message if you set up two question nodes back-to-back with slot filling enabled. Users can answer in any order.

## Variable Scoping: Topic vs Global

This is where most beginners make mistakes.

**Topic variables** (`Topic.VarName`): Exist only within the current topic conversation. Use for anything temporary — collected input, intermediate results.

**Global variables** (`Global.VarName`): Persist across the entire session. Use for user identity, preferences, or data that multiple topics need.

```
Good: Global.UserEmail — set once at session start, used everywhere
Good: Topic.PONumber — collected in this topic, used in this topic
Bad:  Using a global variable for a one-time input in a single topic
```

## Branching with Conditions

Add a Condition node after any Question node to branch the conversation based on the answer.

Example: After asking "Do you want to submit a new request or check an existing one?"
```
Branch 1: Topic.RequestType = "Submit new"
  → Route to "Submit Request" topic

Branch 2: Topic.RequestType = "Check existing"
  → Ask for PO number, call API, display status

Branch 3: All other conditions (catch-all)
  → Fallback message with clarification
```

Always add an else/catch-all branch — users will say unexpected things.

## Sub-Topics: When to Split

Split a large topic into sub-topics when:
- It has more than 15-20 nodes
- Multiple parent topics need the same logic
- You want to reuse a flow (like authentication or confirmation steps)

Use a Redirect node to call a sub-topic and optionally return control to the parent topic.

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| The mega-topic | One topic handling 5+ different scenarios with 50+ nodes | Split into focused sub-topics using Redirect nodes |
| Hardcoded data | Vendor lists or product categories inside topic message nodes | Use Dataverse tables or connector actions; data changes, topics shouldn't |
| No confirmation step | Write action executes without user confirming | Add "Here's what I'll do: [summary]. Shall I proceed?" before every write |
| Dead-end branches | A branch path ends with no response or redirect | Every branch needs a response and a forward path |
| Missing End Conversation | Users don't know the flow is complete | Add End Conversation or redirect node at every terminal path |

## Testing Your Topics

After building a topic, test these scenarios:
1. Happy path — correct inputs, expected flow
2. Unexpected input at each Question node (wrong format, empty)
3. Each conditional branch explicitly
4. What happens if the user types "cancel" or "start over" mid-flow
5. Connector action failure path (does the error branch work?)

## Core Tasks

### 1. Audit a Topic for Quality Issues
```text
GIVEN an existing topic that's behaving unexpectedly
WHEN skill audits the topic
THEN count trigger phrases (target: 5-8, flag if fewer than 4)
AND check each trigger phrase for keyword style vs natural language
AND check for overlap with other topic trigger phrases
AND verify every Question node has entity type set
AND verify every Question node saves to a named variable
AND check every condition branch for catch-all
AND check every path ends with a terminal node
AND check every write action has a confirmation step
THEN report all issues with specific fix recommendations
```

### 2. Design a Net-New Topic
```text
GIVEN a new intent to handle (e.g., "check invoice status")
WHEN skill designs the topic
THEN write 6 trigger phrases in varied natural language
AND identify data to collect (question nodes)
AND determine entity type for each input
AND design the condition branches (what answers lead where)
AND identify required D365 or Dataverse queries
AND identify if Power Automate action is needed
AND produce topic node outline before building
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Topic not triggering | Trigger phrases too specific, keyword-style, or NLU conflict with another topic | Rewrite triggers as full natural sentences, add synonym variations, audit for overlap |
| Two topics firing for same input | Duplicate or near-duplicate trigger phrases across topics | Audit all trigger phrase lists, make them mutually exclusive, use Model description routing if needed |
| Variable empty in condition | Question node missing "Save response as" or variable scoped incorrectly | Check question node configuration, verify correct Topic/Global scope |
| Agent loops or restarts mid-topic | Branch path missing terminal node or redirect | Add End Conversation or Redirect node on every branch path |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
