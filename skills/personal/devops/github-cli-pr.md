---
name: github-cli-pr
description: "Full PR lifecycle in the terminal. Use when user says 'create a pull request', 'open a PR', 'merge my PR', 'review pull request', 'check PR status', 'auto-merge PR'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, github-cli, pull-requests, code-review]
---

# GitHub CLI: Full Pull Request Lifecycle

Manage the entire PR lifecycle without leaving the terminal. From creating a draft to auto-merging with branch cleanup, everything runs through `gh pr` commands.

## Triggers

- "Create a pull request from this branch"
- "Set up auto-merge and delete the branch after merge"
- "Check my PR checks and watch them run"
- "Review someone's pull request"
- "Merge PR with squash and clean up"
- "Update my branch before merging"

## How It Works

### Creating a PR

**Basic creation with auto-filled title and body from commits:**
```bash
gh pr create --fill
```

**Verbose fill: uses more commit context for the body:**
```bash
gh pr create --fill-verbose
```

**Draft PR with reviewer and label:**
```bash
gh pr create --draft --reviewer octocat --label "needs-review" --title "feat: add OAuth flow"
```

**From a template (picks up `.github/PULL_REQUEST_TEMPLATE.md`):**
```bash
gh pr create --template .github/PULL_REQUEST_TEMPLATE.md
```

**Full creation with all options:**
```bash
gh pr create \
  --title "feat: add webhook retry logic" \
  --body "Adds exponential backoff for failed webhook deliveries" \
  --reviewer team-lead,senior-dev \
  --label "enhancement,backend" \
  --milestone "v2.1.0" \
  --base main
```

### Listing and Finding PRs

**List open PRs in current repo:**
```bash
gh pr list
```

**Filter by author, label, or base branch:**
```bash
gh pr list --author "@me"
gh pr list --label "needs-review"
gh pr list --base main --state open
```

**List with JSON output for scripting:**
```bash
gh pr list --json number,title,author,state --jq '.[] | "\(.number): \(.title)"'
```

### Viewing a PR

**View PR details in terminal:**
```bash
gh pr view 42
```

**Open in browser:**
```bash
gh pr view 42 --web
```

**View diff:**
```bash
gh pr diff 42
```

### Checking Out a PR

**Checkout a PR branch locally:**
```bash
gh pr checkout 42
```

This fetches the branch from the contributor's fork automatically, even if it is not in your remote.

### Watching Checks

**Watch CI checks run in real time:**
```bash
gh pr checks 42 --watch
```

**List checks with current status:**
```bash
gh pr checks 42
```

### Reviewing a PR

**Approve:**
```bash
gh pr review 42 --approve
```

**Request changes with a comment:**
```bash
gh pr review 42 --request-changes --body "The retry interval needs a max cap"
```

**Add a comment review:**
```bash
gh pr review 42 --comment --body "Looks good, just a few nits inline"
```

### Merging a PR

**Merge with squash (default for most projects):**
```bash
gh pr merge 42 --squash
```

**Rebase merge:**
```bash
gh pr merge 42 --rebase
```

**Standard merge commit:**
```bash
gh pr merge 42 --merge
```

**Delete branch after merge:**
```bash
gh pr merge 42 --squash --delete-branch
```

**Auto-merge when checks pass (the killer pattern):**
```bash
gh pr merge 42 --squash --auto --delete-branch
```

### PR Lifecycle Helpers

**Mark draft as ready for review:**
```bash
gh pr ready 42
```

**Update branch with latest from base (rebase or merge):**
```bash
gh pr update-branch 42
gh pr update-branch 42 --rebase
```

**Revert a merged PR (creates a new revert PR):**
```bash
gh pr revert 42
```

## Quick Reference

| Task | Command |
|------|---------|
| Create from commits | `gh pr create --fill` |
| Create draft | `gh pr create --draft` |
| List my PRs | `gh pr list --author "@me"` |
| Checkout PR branch | `gh pr checkout <number>` |
| Watch checks | `gh pr checks <number> --watch` |
| Approve | `gh pr review <number> --approve` |
| Squash merge + cleanup | `gh pr merge <number> --squash --delete-branch` |
| Auto-merge | `gh pr merge <number> --squash --auto --delete-branch` |
| Mark ready | `gh pr ready <number>` |
| Update branch | `gh pr update-branch <number>` |
| View diff | `gh pr diff <number>` |

## Common Patterns

### Pattern 1: The Full Feature PR Workflow

```bash
# Create branch and push
git checkout -b feat/webhook-retry
# ... make changes, commit ...
git push -u origin feat/webhook-retry

# Open PR with reviewer and auto-merge configured
gh pr create --fill-verbose --reviewer senior-dev --label "enhancement"
gh pr merge --squash --auto --delete-branch
# Now just wait. When checks pass and reviewer approves, it merges and cleans up.
```

### Pattern 2: Review Another Dev's PR

```bash
# Find PRs needing review
gh pr list --label "needs-review"

# Checkout to test locally
gh pr checkout 87

# Run tests, poke around, then submit review
gh pr review 87 --approve --body "Tested locally, LGTM"
```

### Pattern 3: Create a Hotfix PR Fast

```bash
git checkout -b hotfix/null-pointer-prod
# ... fix the bug, commit ...
git push -u origin hotfix/null-pointer-prod

gh pr create \
  --title "fix: null pointer in payment processor" \
  --body "Fixes #234 - adds nil check before calling .process()" \
  --label "hotfix,urgent" \
  --base main \
  --reviewer on-call-lead

gh pr merge --squash --delete-branch
```

### Pattern 4: Batch View All Your Open PRs Across Repos

```bash
# gh status shows all your open PRs and review requests
gh status
```

## Troubleshooting

**Problem: `gh pr create` fails with "no commits between main and your branch"**
Cause: You have not pushed any commits yet, or you are on the base branch.
Fix: Commit your changes and push the branch before running the command.

**Problem: `--auto` flag errors with "auto-merge is not enabled for this repository"**
Cause: Auto-merge must be enabled in the repository settings under General.
Fix: Go to repo Settings, scroll to "Pull Requests", enable "Allow auto-merge".

**Problem: `gh pr checkout 42` fails on a fork PR**
Cause: The fork branch is not in your configured remote.
Fix: `gh pr checkout` handles this automatically via the GitHub API. If it fails, ensure you are authenticated with `gh auth status`.

**Problem: `gh pr checks --watch` shows no checks**
Cause: No CI workflows are configured on this repo, or the workflow trigger does not fire on PRs.
Fix: Check `.github/workflows/` for `on: pull_request` triggers.

**Problem: `gh pr merge` fails with "required reviews missing"**
Cause: Branch protection rules require one or more approvals.
Fix: Get the required reviews first with `gh pr review <number> --approve` from authorized reviewers.

**Problem: `gh pr update-branch` fails**
Cause: Merge conflicts exist between the PR branch and base.
Fix: Checkout the branch locally, resolve conflicts, push. `gh pr checkout <number>` then `git merge main`, resolve, push.

## Version History

- **1.0.0** (2026-04-13): Initial release covering full PR lifecycle with auto-merge pattern
