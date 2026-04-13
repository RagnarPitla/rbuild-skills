---
name: claude-code-plan-mode
description: "Use Plan mode in Claude Code to explore and plan before writing any code. Use when user says 'plan before coding', 'how do I use plan mode', 'make Claude think before acting', 'avoid wrong implementations', 'read-only exploration mode', 'shift tab plan mode'."
tab: claude-code
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, claude-code, planning, workflow]
---

# Claude Code Plan Mode

Plan mode puts Claude in a read-only exploration state. Claude can read files, search the codebase, and think through approaches, but cannot write files, run commands, or make changes. This prevents the classic mistake of confident wrong implementations.

Activate with Shift+Tab twice (toggles between Normal, Auto-accept, and Plan modes) or pass `--permission-mode plan` when starting a session.

## Triggers

- "How do I activate plan mode in Claude Code?"
- "I want Claude to explore before writing any code"
- "Claude keeps implementing the wrong thing — how do I make it plan first?"
- "What is the difference between plan mode and regular mode?"
- "How do I use Shift+Tab in Claude Code?"
- "Make Claude think through the approach before touching any files"

## How It Works

1. **Activate Plan mode with Shift+Tab twice.** Claude Code cycles through three modes with Shift+Tab: Normal (asks for permission on each action), Auto-accept (executes without asking), and Plan (read-only). Two presses from Normal mode lands you in Plan mode.

2. **Alternatively, use the CLI flag for full sessions.** `claude --permission-mode plan` starts the entire session in plan mode. Useful when you want to force yourself to review the plan before anything gets changed.

3. **Claude explores but cannot modify.** In plan mode, Claude can call Read, Glob, Grep, and Bash (for read-only commands like `git log`, `cat`, `ls`). It cannot call Write, Edit, or any Bash command that modifies the filesystem. This is enforced at the permission level, not just instructed.

4. **Use Ctrl+G to open the plan in your editor.** After Claude generates a plan, pressing Ctrl+G opens the plan text in your configured editor for annotation and modification before handing it back.

5. **Review and exit plan mode before execution.** Once you are satisfied with the plan, press Shift+Tab to cycle back to Normal mode. Claude will then execute the plan with its full understanding of the codebase context.

6. **The recommended workflow is Explore, Plan, Code, Commit.** Use plan mode for the Explore and Plan phases. Switch to Normal or Auto-accept for Code. Use `/commit` or your commit command when done.

```bash
# Start a session in plan mode from the CLI
claude --permission-mode plan

# Once inside Claude Code, toggle plan mode with:
# Shift+Tab (press twice from Normal mode to reach Plan mode)

# To check which mode you are in:
# Look at the mode indicator in the Claude Code status bar

# Example plan mode workflow:
# 1. Open Claude Code: claude
# 2. Press Shift+Tab twice to enter Plan mode
# 3. Ask: "Explore the codebase and create a plan to add pagination to the users API"
# 4. Claude reads files and produces a detailed plan
# 5. Press Ctrl+G to open the plan in your editor and annotate it
# 6. Press Shift+Tab once to return to Normal mode
# 7. Ask: "Execute the plan we just created"
```

## Quick Reference

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` (once from Normal) | Enter Auto-accept mode |
| `Shift+Tab` (twice from Normal) | Enter Plan mode |
| `Shift+Tab` (from Plan mode) | Return to Normal mode |
| `Ctrl+G` | Open current plan in editor |

| Mode | Can read? | Can write? | Can run Bash? | Use when |
|------|-----------|------------|--------------|---------|
| Normal | Yes | Yes (with permission) | Yes (with permission) | Default work |
| Auto-accept | Yes | Yes (no prompt) | Yes (no prompt) | Trusted bulk changes |
| Plan | Yes | No | Read-only | Exploring, planning |

| CLI flag | Effect |
|---------|--------|
| `--permission-mode plan` | Start entire session in plan mode |
| `--permission-mode default` | Normal mode (default) |
| `--permission-mode bypass` | Auto-accept everything (use carefully) |

## Common Patterns

### Pattern 1: Explore Before a Major Refactor

Before touching anything in a large refactor, use plan mode to map the full blast radius.

```
[In Plan mode]
"Explore the current authentication system. Map all files that would need to change if we switched from session-based auth to JWT tokens. Show me the dependency chain and estimate the scope of the change."
```

Claude will trace imports, read all relevant files, and produce a concrete list of files and changes needed. You can review this before writing a single line.

### Pattern 2: Architecture Decision Support

Use plan mode to compare approaches before committing to one.

```
[In Plan mode]
"I need to add a background job system to this Node.js app. Explore the existing codebase and compare three approaches: 1) BullMQ with Redis, 2) pg-boss with our existing Postgres, 3) a simple cron-based solution. Look at what infrastructure we already have and recommend the best fit."
```

Claude reads your package.json, checks existing infrastructure, and gives you a grounded recommendation without touching anything.

### Pattern 3: Bug Investigation

Use plan mode to fully investigate a bug before attempting a fix.

```
[In Plan mode]
"Users are reporting that orders occasionally have duplicate line items. Explore the order creation flow, the database schema, the API handlers, and the background jobs that touch orders. Identify all the places where a duplicate could be introduced."
```

Claude traces the full code path and produces a diagnosis. Then switch to Normal mode and ask: "Fix the most likely cause you identified."

### Pattern 4: Pre-Sprint Planning

Use plan mode at the start of a sprint to break down a feature into tasks.

```
[In Plan mode]
"I need to build a CSV export feature for the reports section. Explore the current reports module, how we handle large data sets elsewhere in the codebase, and what our API patterns look like. Then produce a detailed implementation plan broken into small, independently committable tasks."
```

Review the plan, adjust it in your editor with Ctrl+G, then execute each task in separate Normal mode sessions.

## Troubleshooting

**Shift+Tab is not activating Plan mode**

Shift+Tab cycles through three modes: Normal, Auto-accept, Plan. If you are already in Auto-accept mode, one press moves to Plan mode. If you are in Normal mode, press twice. Watch the status indicator in the Claude Code interface to see which mode you are in.

**Claude is executing changes while in Plan mode**

This should not be possible — plan mode blocks Write and Edit tools at the permission level. If you are seeing file changes, verify you actually entered Plan mode (not Auto-accept mode, which looks similar). Check the mode indicator.

**My plan is too vague to execute**

Ask Claude to be more specific: "Make the plan more detailed — include exact file names, function signatures to modify, and test cases to add for each step." Good plans reference specific files and functions, not abstract descriptions.

**Ctrl+G opens the wrong editor**

Claude Code uses your `EDITOR` environment variable. Set it in your shell profile: `export EDITOR=code` for VS Code, `export EDITOR=vim` for Vim, etc. Restart Claude Code after changing the variable.

**I want plan mode as my default**

Add `--permission-mode plan` to your alias: `alias cc='claude --permission-mode plan'`. This forces plan mode for every session, and you toggle to Normal mode when ready to execute.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
