---
name: "git-workflow-mastery"
slug: "git-workflow-mastery"
description: "Git branching strategies, Conventional Commits, rebase vs merge, stash, bisect, and conflict resolution. Use when user says 'git workflow', 'branching strategy', 'commit message convention', 'rebase vs merge', 'git conflict', 'cherry-pick', 'git bisect'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "software-engineering", "git", "workflow"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Git Workflow Mastery

Most Git problems come from not having a shared team understanding of how to use it. This is the workflow that keeps things clean.

## Branching Strategy

**GitHub Flow** (recommended for most teams):

```
main (always deployable)
  ↑
feature/your-feature-name
  ↑
fix/bug-description
  ↑
chore/dependency-update
```

Rules:
- `main` is always production-ready
- All work happens in branches (never commit directly to main)
- Branch names are kebab-case with a prefix: `feature/`, `fix/`, `chore/`, `docs/`
- Branches are short-lived — open a PR quickly, merge quickly

**When to use GitFlow** (feature branches + develop branch): Only if you have multiple versions in production simultaneously (rare). It's more overhead than most teams need.

**Trunk-based development:** For high-performing teams with strong test coverage. Commit small changes directly to main (or short-lived branches under 1 day). Feature flags hide incomplete work.

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

[optional body explaining the why]
[optional footer: breaking changes, closes #issue]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no logic change)
- `refactor`: Code change with no feature or fix
- `test`: Adding or fixing tests
- `chore`: Build process, dependency updates, tooling

**Examples:**
```
feat(auth): add OAuth2 Google login

fix(payments): handle decimal rounding in invoice total
Closes #234

chore(deps): upgrade React to 19.0.0

docs(api): update endpoint documentation for v2
```

**The golden rule:** The message completes the sentence "This commit will..."
- "fix: handle null user in getProfile"
- NOT "fixed stuff" / "wip" / "asdfgh"

## Rebase vs Merge

**Merge:** Keeps all commits, adds a merge commit. Clean history of what happened.
```
git checkout main
git merge feature/my-feature
```

**Rebase:** Rewrites feature commits on top of main. Linear history, no merge commits.
```
git checkout feature/my-feature
git rebase main
```

**When to use which:**
- Merge main INTO your feature branch: use `rebase` (cleaner)
- Merge your feature INTO main: use `merge --no-ff` (preserves the feature branch context)
- Never rebase commits that are on a shared/remote branch (rewrites history = chaos)

## Interactive Rebase (Clean Up Before PR)

```bash
# Squash last 3 commits into one
git rebase -i HEAD~3

# In the editor:
# pick abc123 add user endpoint
# squash def456 fix typo
# squash ghi789 fix tests

# Result: one clean commit with combined message
```

Use this to clean up "wip", "fix typo", "oops" commits before merging.

## Cherry-Pick

Apply a single commit from one branch to another:

```bash
# Get the commit hash from git log
git log --oneline feature/payment-fix

# Apply it to your current branch
git cherry-pick abc123def

# Cherry-pick a range of commits
git cherry-pick abc123..def456
```

Useful when a hotfix on a feature branch also needs to go to main.

## Git Bisect (Find the Bug-Introducing Commit)

When you know HEAD is broken but a previous commit was fine:

```bash
git bisect start
git bisect bad HEAD              # Current state is bad
git bisect good v1.2.0           # This tag/commit was good

# Git checks out the midpoint — run your test
npm test

git bisect good    # If test passes
git bisect bad     # If test fails

# Git binary-searches — repeat until it identifies the first bad commit
git bisect reset   # Clean up when done
```

Bisect can find the exact commit that introduced a bug in O(log n) steps.

## PR (Pull Request) Conventions

**PR title:** Same format as a commit message
```
feat(dashboard): add real-time order status updates
```

**PR description template:**
```markdown
## What
[What changes were made and why]

## How to Test
1. [Step 1]
2. [Step 2]

## Screenshots (if UI changes)
[before/after]

## Checklist
- [ ] Tests pass
- [ ] No console errors
- [ ] Accessibility checked (if UI changes)
```

**PR size:** Keep PRs small. Under 400 lines changed is reviewable. Over 800 lines and reviewers start rubber-stamping. If your PR is too large, split it.

## Conflict Resolution

When you pull and get conflicts:

```bash
git pull --rebase origin main
# Fix conflicts in each file
git add [file]
git rebase --continue
```

**Understanding the conflict markers:**
```
<<<<<<< HEAD (your current changes)
const name = 'current version';
=======
const name = 'incoming version';
>>>>>>> origin/main (the incoming changes)
```

Delete the markers and the version you don't want. Or combine them if both changes should exist.

## Useful Commands

```bash
# See what you're about to push
git log origin/main..HEAD --oneline

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Discard unstaged changes to a file
git checkout -- filename.js

# See who changed a line
git blame filename.js

# Find the commit that introduced a bug (binary search)
git bisect start
git bisect bad HEAD
git bisect good v1.0

# Save work in progress without committing
git stash push -m "wip: feature xyz"
git stash pop

# See all stashes
git stash list
```

## Trigger Phrases

- "git workflow"
- "branching strategy"
- "commit message convention"
- "rebase vs merge"
- "git conflict"
- "cherry-pick"
- "git bisect"
- "conventional commits"

## Quick Example

> See `git-workflow-mastery-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Merge conflicts every PR | Branches live too long | Move to shorter branch lifetimes; merge main into your branch daily with `git pull --rebase` |
| Messy commit history | No squash discipline | Use interactive rebase before PR; require squash-merge in GitHub repo settings |
| Pushed to wrong branch | Working directly on main | Protect main branch (require PR reviews); use `git reset --soft HEAD~1` to undo before pushing |
| Cannot find which commit broke something | No systematic approach | Use `git bisect` with a test script to binary-search the exact breaking commit |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
