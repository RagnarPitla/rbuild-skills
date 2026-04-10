---
name: save-session
description: Saves a structured summary of the current Claude Code session and loads it for seamless continuation. Exports decisions, code written, next steps, and open questions as markdown. Use when user says 'save my session', 'save progress', 'wrap up this session', 'export what we did', 'session summary', 'save context'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, productivity, session, context]
---

# Save Session

Claude Code sessions don't persist between conversations. This skill captures what happened in this session so the next session can pick up exactly where you left off, without re-explaining the project, the decisions made, or the current state.

## Trigger Phrases

- "save my session"
- "save progress"
- "wrap up this session"
- "export what we did"
- "session summary"
- "save context for next time"
- "end of session summary"
- "capture where we are"

## When to Save

Save a session when:
- You're stopping work mid-task and will continue later
- You've made architectural decisions you don't want to re-derive
- You've written code or configs that need to be documented
- You're handing context to another Claude session or agent
- A session is getting long and you want a clean re-start point

## Session Save Format

```markdown
# Session Summary
**Project:** [project name and path]
**Date:** [date]
**Duration:** [approximate]
**Session goal:** [what you set out to do]

## What Was Accomplished
- [Specific thing completed: be concrete]
- [File created or modified with path]
- [Decision made or design finalized]

## Code / Config Written This Session
| File | Purpose | Status |
|---|---|---|
| [path/to/file.ts] | [what it does] | Complete / In Progress |
| ... | ... | ... |

## Decisions Made
| Decision | Rationale | Alternatives Rejected |
|---|---|---|
| [Technical or design decision] | [Why] | [What else was considered] |

## Current State
[One paragraph describing the exact state the project is in right now: where in the build, what's working, what's not wired up yet]

## Next Steps (Ordered)
1. [Immediate next action: specific enough to start without re-reading context]
2. [Second step]
3. [Third step]

## Open Questions / Blockers
- [Something unresolved that affects the next session]
- [A question to answer before proceeding]

## Key File Paths
- [List all files relevant to this session with absolute paths]

## Commands to Resume
[Any setup commands needed to get back in the right state]
`cd [project path]`
`[any install or start commands]`
```

## How to Load a Session

At the start of the next Claude Code conversation:

```
Load session context from [path to session file].
Continue from where we left off. 
Current state: [paste the "Current State" section].
Next step: [paste the first item from "Next Steps"].
```

Or provide the full session file and say: "Continue this project. Read the session summary and pick up from the next steps."

## Save Location

Save session files to a consistent location per project:
```
[project root]/.claude/sessions/session-[date]-[topic].md
```

Example:
```
/Users/ragnarpitla/Documents/VS Code Repo/MyProject/.claude/sessions/session-2026-04-10-agent-setup.md
```

## Prompt Template

To trigger a session save:

```
Save this session. 

Project: [name]
What we accomplished today: [brief summary]

Please generate the full session summary including:
- What was accomplished
- Files created or modified (with paths)
- Decisions made and rationale
- Current state of the project
- Ordered next steps
- Any open questions or blockers
```

## Quick Example

> See `save-session-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Session summary too vague | Skipped the "Current State" section | The Current State paragraph is the most important part. Write it precisely, not "we built some stuff". |
| Next session can't pick up | Next steps are too high-level | Each next step must be actionable: start with a verb, name the file or component, describe the expected outcome |
| File paths missing | Session saved without paths | Always include absolute paths. Relative paths break when cwd changes. |
| Session file not found | Saved in wrong location | Use the `.claude/sessions/` convention consistently across all projects |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
