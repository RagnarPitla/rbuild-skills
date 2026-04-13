---
name: github-cli-issues
description: "Manage GitHub issues from the terminal. Use when user says 'create an issue', 'list open issues', 'assign issue', 'create branch from issue', 'close issue', 'check my assigned issues'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, github-cli, issues, project-management]
---

# GitHub CLI: Issue Management

Create, track, and work issues without ever opening a browser tab. The standout feature: `gh issue develop` creates a linked branch and checks it out in one command.

## Triggers

- "Create a GitHub issue for this bug"
- "Show me all issues assigned to me"
- "Create a branch from issue 42 and check it out"
- "Close this issue with a comment"
- "What issues are assigned to me across repos?"
- "Add a comment to issue 88"

## How It Works

### Creating Issues

**Interactive creation (prompts for title, body, etc.):**
```bash
gh issue create
```

**Fully specified from the command line:**
```bash
gh issue create \
  --title "fix: null pointer in order processor" \
  --body "Steps to reproduce: 1. Create order with empty cart 2. Call /submit endpoint" \
  --label "bug,high-priority" \
  --assignee "@me" \
  --milestone "v2.1.0"
```

**From a template (uses `.github/ISSUE_TEMPLATE/` files):**
```bash
gh issue create --template bug_report.md
```

**Open in browser instead of creating from CLI:**
```bash
gh issue create --web
```

### Listing and Filtering Issues

**List open issues:**
```bash
gh issue list
```

**Filter by label:**
```bash
gh issue list --label "bug"
gh issue list --label "enhancement,backend"
```

**Filter by assignee:**
```bash
gh issue list --assignee "@me"
gh issue list --assignee octocat
```

**Filter by milestone:**
```bash
gh issue list --milestone "v2.1.0"
```

**Search in title and body:**
```bash
gh issue list --search "payment timeout"
```

**List closed issues:**
```bash
gh issue list --state closed
```

**Show as JSON for scripting:**
```bash
gh issue list --json number,title,labels,assignees --jq '.[] | "\(.number): \(.title)"'
```

### Cross-Repo Status (the hidden gem)

**See all your assigned issues and review requests across all repos you have access to:**
```bash
gh status
```

This shows a unified view of what needs your attention, spanning every org and repo you are part of.

### Viewing and Editing Issues

**View issue details:**
```bash
gh issue view 42
```

**Open in browser:**
```bash
gh issue view 42 --web
```

**Edit title, body, labels, or assignees:**
```bash
gh issue edit 42 --title "fix: null pointer in order processor (critical)"
gh issue edit 42 --add-label "regression"
gh issue edit 42 --remove-label "needs-triage"
gh issue edit 42 --add-assignee senior-dev
```

### Adding Comments

**Add a comment to an issue:**
```bash
gh issue comment 42 --body "Confirmed in production. Rolling back the deploy now."
```

**Write body from a file:**
```bash
gh issue comment 42 --body-file ./investigation-notes.md
```

### Closing and Reopening

**Close an issue:**
```bash
gh issue close 42
```

**Close with a reason (completed or not planned):**
```bash
gh issue close 42 --reason "completed"
gh issue close 42 --reason "not planned"
```

**Close with a comment:**
```bash
gh issue close 42 --comment "Fixed in PR #87. Deployed to prod."
```

**Reopen a closed issue:**
```bash
gh issue reopen 42
```

### The Gem: Develop a Branch From an Issue

**Create a linked branch and check it out:**
```bash
gh issue develop 42 --checkout
```

This creates a branch named after the issue (e.g., `42-fix-null-pointer`), pushes it to the remote, links it to the issue on GitHub, and checks it out locally. All in one command.

**Specify a custom branch name:**
```bash
gh issue develop 42 --name "hotfix/null-pointer-orders" --checkout
```

**Target a different base branch:**
```bash
gh issue develop 42 --base develop --checkout
```

**List branches already linked to an issue:**
```bash
gh issue develop 42 --list
```

## Quick Reference

| Task | Command |
|------|---------|
| Create issue | `gh issue create` |
| List open issues | `gh issue list` |
| My assigned issues | `gh issue list --assignee "@me"` |
| Cross-repo status | `gh status` |
| View issue | `gh issue view <number>` |
| Create branch from issue | `gh issue develop <number> --checkout` |
| Add comment | `gh issue comment <number> --body "..."` |
| Close issue | `gh issue close <number>` |
| Close with comment | `gh issue close <number> --comment "..."` |
| Edit labels | `gh issue edit <number> --add-label "bug"` |

## Common Patterns

### Pattern 1: Triage Morning Stand-up

```bash
# See everything needing your attention across all repos
gh status

# Then dive into a specific issue
gh issue view 42

# If you're picking it up, assign yourself and create a branch
gh issue edit 42 --add-assignee "@me"
gh issue develop 42 --checkout
```

### Pattern 2: Report a Bug While It's Fresh

```bash
gh issue create \
  --title "fix: timeout on large invoice batch" \
  --body "$(cat <<'EOF'
## Steps to Reproduce
1. Queue batch with >500 invoices
2. Trigger /api/invoices/process
3. Request times out at 30s

## Expected
Batch processes asynchronously

## Actual
HTTP 504 Gateway Timeout

## Environment
Production, v2.0.4
EOF
)" \
  --label "bug,backend" \
  --assignee "@me"
```

### Pattern 3: Bulk Label Triage

```bash
# List all unlabeled issues, extract numbers, add triage label
gh issue list --label "" --json number --jq '.[].number' | \
  xargs -I{} gh issue edit {} --add-label "needs-triage"
```

### Pattern 4: Close All Issues From a Sprint

```bash
# Close a set of issues by number with the same comment
for num in 41 42 43 44 45; do
  gh issue close $num --comment "Completed in sprint 12. See release v2.1.0."
done
```

## Troubleshooting

**Problem: `gh issue develop` says branch already exists**
Cause: A branch with that auto-generated name already exists on the remote.
Fix: Use `--name` to specify a different branch name: `gh issue develop 42 --name "fix/orders-null-ptr-v2" --checkout`.

**Problem: `gh issue list` shows no issues even though there are open ones**
Cause: You may be in a directory not associated with a GitHub repo, or the default repo is wrong.
Fix: Run `gh repo set-default` to specify the repo, or pass `--repo owner/repo` explicitly.

**Problem: `gh issue create --label` fails with "label not found"**
Cause: The label must already exist in the repo before you can apply it.
Fix: Create the label first with `gh label create "high-priority" --color "ff0000"`, then retry.

**Problem: `gh status` shows issues from repos you do not care about**
Cause: `gh status` pulls from all repos you have access to, including org repos.
Fix: There is no built-in filter, but you can pipe to grep: `gh status | grep "my-main-repo"`.

**Problem: `gh issue comment` fails with authentication error**
Cause: Your token may lack the `repo` scope.
Fix: Run `gh auth refresh -s repo` to add the scope, then retry.

## Version History

- **1.0.0** (2026-04-13): Initial release covering full issue lifecycle with `gh issue develop` pattern
