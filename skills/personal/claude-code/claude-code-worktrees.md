---
name: claude-code-worktrees
description: "Use git worktrees with Claude Code to run multiple isolated sessions in parallel without file conflicts. Use when user says 'parallel Claude sessions', 'work on two features at once', 'isolated git branch for Claude', 'claude worktree', 'multi-agent parallel development'."
tab: claude-code
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, claude-code, git-worktrees, parallel-development]
---

# Claude Code Worktrees

Worktrees let you run multiple Claude Code sessions simultaneously, each working in its own isolated copy of the repository. No file locking, no branch conflicts, no stepping on each other's changes.

`claude --worktree feature-name` creates a new git worktree in `.claude/worktrees/feature-name` on a fresh branch. Claude works there independently while your main session continues uninterrupted.

## Triggers

- "How do I run multiple Claude Code sessions at the same time?"
- "I want Claude to work on two features in parallel"
- "How do I use claude --worktree?"
- "Git worktrees with Claude Code"
- "Isolated branch for a Claude agent to work in"
- "Multi-agent parallel development with Claude Code"

## How It Works

1. **Start a worktree session with `claude --worktree <name>`.** Claude creates a new git worktree at `.claude/worktrees/<name>` and checks out a new branch named `<name>`. The worktree is a full copy of your repo at its current HEAD, tracked by git.

2. **Each worktree is completely independent.** Changes in one worktree do not affect any other worktree or your main working directory. You can run `npm install`, modify files, run tests, and commit without touching the main branch.

3. **Your main session continues as normal.** Open two terminal windows: one running your regular session, one running `claude --worktree feature-name`. Both operate simultaneously with no conflicts.

4. **Claude auto-cleans empty worktrees.** If the session ends without any commits (no changes), Claude automatically removes the worktree and deletes the branch. Only worktrees with commits are kept.

5. **Merge using standard git workflows.** Each worktree creates a real git branch. Review the branch, open a PR, or merge it directly with `git merge` or `git rebase` from your main session.

6. **Use for multi-agent patterns.** Combine worktrees with headless mode (`claude -p`) to dispatch multiple agent sessions in parallel, each in their own worktree, then collect and merge results.

```bash
# Start a new worktree session interactively
claude --worktree add-pagination

# This creates:
# - .claude/worktrees/add-pagination/ (full repo copy)
# - branch: add-pagination (based on current HEAD)
# Claude opens in that worktree directory

# In a second terminal, run another worktree in parallel
claude --worktree fix-auth-bug

# List active worktrees
git worktree list

# After Claude finishes in a worktree, review the branch
git log add-pagination --oneline -10

# Create a PR from the worktree branch
gh pr create --head add-pagination --title "Add pagination to users API"

# Or merge directly
git merge add-pagination

# Manual cleanup if needed (auto-cleans if no commits)
git worktree remove .claude/worktrees/add-pagination
git branch -d add-pagination
```

## Quick Reference

| Command | What it does |
|---------|-------------|
| `claude --worktree <name>` | Start isolated session on new branch |
| `git worktree list` | Show all active worktrees |
| `git worktree add <path> <branch>` | Create worktree manually |
| `git worktree remove <path>` | Remove a worktree |
| `git worktree prune` | Clean up stale worktree references |

| Worktree path pattern | Branch name |
|----------------------|-------------|
| `.claude/worktrees/add-pagination` | `add-pagination` |
| `.claude/worktrees/fix-auth-bug` | `fix-auth-bug` |
| `.claude/worktrees/refactor-db-layer` | `refactor-db-layer` |

| When to use worktrees | When not to use worktrees |
|-----------------------|--------------------------|
| Parallel independent features | Sequential dependent tasks |
| Multi-agent pipelines | Quick one-off changes |
| Long-running Claude sessions | Changes to shared config files |
| Isolated experiment branches | When you need one coherent context |

## Common Patterns

### Pattern 1: Parallel Feature Development

Work on two independent features at the same time. Each gets its own Claude session and branch.

```bash
# Terminal 1: Feature work
claude --worktree feature/user-export
# Claude builds the CSV export feature here

# Terminal 2: Bug fix (independent, no conflict)
claude --worktree fix/order-duplicate
# Claude investigates and fixes the order duplication bug here

# Both run simultaneously, no interference
# Review and merge each branch independently via PR
```

### Pattern 2: Multi-Agent Parallel Implementation

Dispatch multiple headless agents in parallel, each in their own worktree.

```bash
#!/bin/bash
# parallel-agents.sh

TASKS=(
  "implement-caching:Add Redis caching to the products endpoint. Cache for 5 minutes. Write tests."
  "add-rate-limiting:Add rate limiting to all POST endpoints. 100 requests per minute per IP. Write tests."
  "optimize-queries:Profile and optimize the three slowest database queries in src/repositories/."
)

for task in "${TASKS[@]}"; do
  name="${task%%:*}"
  prompt="${task##*:}"
  
  # Launch each agent in its own worktree, in background
  claude --worktree "$name" -p "$prompt" &
  echo "Launched agent: $name"
done

# Wait for all agents to complete
wait
echo "All agents finished"

# Review each branch
for task in "${TASKS[@]}"; do
  name="${task%%:*}"
  echo "--- Branch: $name ---"
  git log "$name" --oneline -5
done
```

### Pattern 3: Experimental Architecture Spike

Use a worktree to try a risky refactor without any risk to your main branch.

```bash
# Start an experiment in isolation
claude --worktree experiment/graphql-migration

# In the worktree session:
# "Migrate the products REST API to GraphQL. This is experimental — 
# try the approach, get the tests passing, and summarize tradeoffs."

# If it works: merge or create a PR
# If it doesn't: just delete the branch, main is untouched
git worktree remove .claude/worktrees/experiment/graphql-migration
git branch -D experiment/graphql-migration
```

### Pattern 4: Code Review with Real Changes

Use a worktree to apply suggested code review changes without touching your PR branch.

```bash
# Your PR branch is checked out in main session
# Start a worktree to apply suggestions from review comments

claude --worktree review/pr-142-suggestions

# In the worktree:
# "Apply the code review suggestions from PR #142. 
# The reviewer asked for: 1) extract the validation logic, 
# 2) add error boundaries, 3) fix the TypeScript strict violations."

# Cherry-pick the commits onto your PR branch after review
git cherry-pick review/pr-142-suggestions
```

## Troubleshooting

**Error: worktree already exists**

A previous session left a worktree with the same name. Either use a different name, or clean up: `git worktree remove .claude/worktrees/<name>` and `git branch -D <name>`. Run `git worktree list` to see all active worktrees.

**Worktree branch is behind main and has conflicts**

The worktree branch was created from an older commit. In the worktree directory, run `git rebase main` (or `git merge main`) to bring it up to date. Then continue working or merge.

**Changes in worktree not visible in main session**

This is by design. Worktrees are isolated. To see the changes, merge or cherry-pick from the worktree branch into your main branch. Run `git diff main..<worktree-branch>` to see what changed.

**Disk space growing from worktrees**

Each worktree is a full repo copy (excluding `.git` itself, which is shared). Large repos with many worktrees use significant space. Remove finished worktrees promptly: `git worktree prune` removes stale references, `git worktree remove <path>` removes active ones.

**npm install or build tools fail in worktree**

`node_modules` is not shared between worktrees. Run `npm install` inside the worktree directory. Some build tools may also need their cache initialized. The worktree has its own package lock, so dependency versions are consistent with the branch.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
