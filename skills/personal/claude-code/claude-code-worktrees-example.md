# Claude Code Worktrees — Example

## Scenario: Shipping a Feature and a Critical Bug Fix Simultaneously Without Branch Conflicts

**Who:** James Kowalski, Senior Engineer, working on a fast-moving startup's API platform
**Where:** Claude Code on a TypeScript/Express API repository, single developer managing multiple priorities
**The Problem:** James has an urgent security bug fix requested by the security team (must ship today) and a two-day feature build for the product roadmap. If he works on them in the same branch, either the security fix gets delayed waiting for the feature, or the feature code leaks into the security patch. Switching branches manually means losing Claude's session context every time.

**Prerequisites:** Claude Code installed, git repository initialized, no uncommitted changes in the main session

---

### What You Say to the Agent

> "I need to work on two things at once: a critical auth bypass fix and the new user export feature. Use worktrees to run both in parallel so they don't interfere with each other. Start both sessions and tell me how to switch between them."

### What the Agent Does

1. Opens two terminal panes (or instructs James to open a second terminal window)
2. In the first terminal, runs `claude --worktree fix/auth-bypass` to create an isolated branch and worktree at `.claude/worktrees/fix/auth-bypass`
3. In the second terminal, runs `claude --worktree feature/user-export` to create a second isolated branch at `.claude/worktrees/feature/user-export`
4. Confirms both worktrees are active and independent by running `git worktree list`
5. Begins working on the auth bypass fix in the first session: reads the auth middleware, identifies the bypass condition, writes the fix, adds a test, commits
6. In the second session, independently builds the user export feature: adds the export endpoint, the CSV generation service, and tests
7. Both branches accumulate clean, independent commit histories that can be reviewed and merged separately

### The Business Impact

- **Velocity** — both the security fix and the feature are being built simultaneously, not sequentially
- **Clean history** — each branch has exactly the commits it should, making code review straightforward
- **No context switching penalty** — each Claude session maintains its full context for its specific task

### Try It Yourself

> "Create a worktree session called 'experiment/graphql-migration' to explore migrating our REST API to GraphQL. I want to try the approach without risking my main branch."
