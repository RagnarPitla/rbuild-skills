---
name: "Git Workflow Mastery"
slug: "git-workflow-mastery"
description: "Practical Git workflows — branching strategies, PR conventions, commit messages, rebase vs merge, and conflict resolution."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-curated"
tags: ["git", "workflow", "branching", "commit", "pr", "collaboration"]
version: "1.0"
icon_emoji: "🌿"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Conventional Commits Specification"
    url: "https://www.conventionalcommits.org/"
  - title: "GitHub Flow Guide"
    url: "https://docs.github.com/en/get-started/quickstart/github-flow"
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
- ✅ "fix: handle null user in getProfile"
- ❌ "fixed stuff" / "wip" / "asdfgh"

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
```
