---
name: "blueprint"
slug: "blueprint"
description: "Turns a one-line objective into a step-by-step construction plan for multi-session, multi-agent engineering projects. Use when user says 'create a project plan', 'blueprint for a feature', 'plan this project', 'break this down', 'how do I build this', 'project roadmap'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "productivity", "planning", "project"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Exa MCP, Firecrawl MCP"
mcp_tools: []
---


# Blueprint

Turn a one-line objective into a step-by-step construction plan for multi-session engineering.

## Trigger Phrases

- "create a project plan"
- "blueprint for a feature"
- "plan this project"
- "break this down into steps"
- "how do I build this"
- "project roadmap for"
- "construction plan"
- "help me plan this build"

## What Blueprint Produces

A blueprint is not a requirements doc. It's a construction plan: ordered phases, explicit dependencies, session break points, and decision gates.

**Output format:**

```markdown
# Blueprint: [Project Name]
**Objective:** [One sentence: what does "done" look like?]
**Scope:** [What's in and what's explicitly out]
**Estimated sessions:** [rough estimate based on complexity]

## Phase 1: [Phase Name]
**Goal:** [What this phase delivers]
**Inputs:** [What you need before starting]
**Steps:**
1. [Specific action: verb + noun + outcome]
2. ...
**Output:** [Testable artifact or state]
**Decision gate:** [What must be true to proceed to Phase 2]

## Phase 2: ...

## Open Questions
- [Any unknowns that must be resolved before or during execution]

## Dependencies
- [External tools, APIs, or systems this relies on]
- [Skills or knowledge required]
```

## Blueprint Principles

**One objective, one blueprint.** If a project has two distinct goals, write two blueprints and a third for integration.

**Phases must be independently valuable.** Each phase should produce something testable or usable on its own. Never design a phase whose only output is "more code."

**Decision gates prevent wasted effort.** Before moving from Phase 1 to Phase 2, you must validate that Phase 1's output meets the gate criteria. This is where you catch architectural mistakes early.

**Session break points are real constraints.** Claude Code sessions have context limits and interrupt risk. Design blueprints with natural stopping points where state can be saved and resumed.

## How to Use Blueprint

Provide:
- Your objective in one sentence
- Any constraints (time, technology, existing systems to integrate)
- Your current starting point (green field, existing codebase, specific phase)

Blueprint will decompose, sequence, identify dependencies, and surface open questions.

**Prompt template:**
```
Create a blueprint for: [objective]

Constraints:
- Tech stack: [languages, frameworks, platforms]
- Integration: [existing systems]
- Timeline: [if relevant]
- My starting point: [existing codebase / green field / specific state]

Output: Step-by-step construction plan with phases, decision gates, and session break points.
```

## Quick Example

> See `blueprint-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Blueprint too vague | Objective is ambiguous | Rewrite objective as "Build X that does Y, so that Z": subject, capability, outcome |
| Too many phases | Trying to plan too far ahead | Cap at 5 phases; use a follow-up blueprint for later phases once Phase 3 is complete |
| Missing decision gates | Steps listed without validation | Add an explicit "how do I know this worked?" check after each phase |
| Blueprint becomes a to-do list | Steps are tasks, not outcomes | Each step should produce a testable artifact, not just an action ("create schema" not "think about schema") |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
