---
name: github-cli-scripting
description: "Script and automate GitHub workflows with gh CLI output formatting. Use when user says 'format gh output', 'pipe gh to fzf', 'write a gh script', 'gh json fields', 'gh template output', 'set gh alias', 'use GH_TOKEN in CI'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, github-cli, scripting, automation]
---

# GitHub CLI: Scripting and Output Formatting

Turn `gh` into a full scripting toolkit. JSON fields, jq expressions, Go templates, fzf integration, env vars, and custom aliases let you build powerful automation on top of any `gh` command.

## Triggers

- "Format gh output as a table"
- "Pipe gh pr list into fzf for interactive selection"
- "Write a shell script using gh"
- "Create a gh alias for a command I use all the time"
- "Use GH_TOKEN in my CI pipeline"
- "Get specific JSON fields from a gh command"

## How It Works

### --json: Select Fields

Most `gh` commands support `--json` to output structured data instead of human-readable text.

**Available fields vary by command. Discover them:**
```bash
gh pr list --json       # Prints all available field names
gh issue list --json    # Same pattern
gh run list --json
```

**Select specific fields:**
```bash
gh pr list --json number,title,author,state,headRefName
```

**Output example:**
```json
[
  {
    "number": 42,
    "title": "feat: add retry logic",
    "author": {"login": "octocat"},
    "state": "OPEN",
    "headRefName": "feat/retry-logic"
  }
]
```

### --jq: Filter and Transform JSON

Use `--jq` with any expression from the `jq` language. It runs on the `--json` output.

**Extract a single field:**
```bash
gh pr list --json number,title --jq '.[0].title'
```

**Format as human-readable lines:**
```bash
gh pr list --json number,title,author \
  --jq '.[] | "#\(.number) \(.title) by \(.author.login)"'
```

**Filter by condition:**
```bash
gh pr list --json number,title,isDraft \
  --jq '.[] | select(.isDraft == false) | .number'
```

**Count results:**
```bash
gh issue list --json number --jq 'length'
```

**Extract nested fields:**
```bash
gh pr list --json number,labels \
  --jq '.[] | {pr: .number, labels: [.labels[].name]}'
```

### --template: Go Template Formatting

For richer formatting including colors and time, use `--template` with Go template syntax.

**Basic template:**
```bash
gh pr list --json number,title --template \
  '{{range .}}#{{.number}} {{.title}}{{"\n"}}{{end}}'
```

**tablerow: aligned columns:**
```bash
gh pr list --json number,title,author,state \
  --template \
  '{{range .}}{{tablerow .number .title .author.login .state}}{{end}}'
```

**timeago: human-readable timestamps:**
```bash
gh pr list --json number,title,createdAt \
  --template \
  '{{range .}}{{.number}} {{.title}} ({{timeago .createdAt}}){{"\n"}}{{end}}'
```

**color: colorized output:**
```bash
gh pr list --json number,title,state \
  --template \
  '{{range .}}{{if eq .state "OPEN"}}{{color "green" .title}}{{else}}{{color "red" .title}}{{end}}{{"\n"}}{{end}}'
```

**hyperlink: clickable terminal links:**
```bash
gh pr list --json number,title,url \
  --template \
  '{{range .}}{{hyperlink .url .title}}{{"\n"}}{{end}}'
```

### Piping to External Tools

**Pipe PR list to fzf for interactive selection:**
```bash
gh pr list --json number,title \
  --jq '.[] | "\(.number)\t\(.title)"' | \
  fzf --delimiter='\t' --preview 'gh pr view {1}' | \
  awk '{print $1}' | \
  xargs gh pr checkout
```

**View PR diff with bat syntax highlighting:**
```bash
gh pr diff 42 | bat --language diff
```

**Interactive issue browser:**
```bash
gh issue list --json number,title,labels \
  --jq '.[] | "\(.number) \(.title)"' | \
  fzf | \
  awk '{print $1}' | \
  xargs gh issue view
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `GH_TOKEN` | Auth token, overrides `gh auth login` session |
| `GH_REPO` | Default repo in `owner/repo` format |
| `GH_HOST` | GitHub Enterprise hostname |
| `GH_EDITOR` | Editor for interactive prompts |
| `GH_BROWSER` | Browser for `--web` commands |
| `NO_COLOR` | Disable color output |

**Use GH_TOKEN in CI (no login required):**
```bash
export GH_TOKEN=${{ secrets.GITHUB_TOKEN }}
gh pr list --repo myorg/myrepo
```

**Target a specific repo without cd:**
```bash
GH_REPO=myorg/myrepo gh issue list
```

**GitHub Enterprise:**
```bash
GH_HOST=github.mycompany.com gh auth login
# or per-command:
GH_HOST=github.mycompany.com gh pr list
```

### Custom Aliases

**Create an alias:**
```bash
gh alias set prs 'pr list --author "@me" --state open'
```

**Use it:**
```bash
gh prs
```

**Alias with arguments (use -- to pass through):**
```bash
gh alias set co 'pr checkout'
gh co 42
```

**Shell-level alias (runs shell commands, prefixed with !):**
```bash
gh alias set open-prs '!gh pr list --author "@me" | head -20'
```

**List all aliases:**
```bash
gh alias list
```

**Delete an alias:**
```bash
gh alias delete prs
```

### Exit Status for CI Scripts

**Use --exit-status to fail scripts on no results:**
```bash
# Fails if no open PRs (useful in CI gates)
gh pr list --state open --exit-status
echo "Open PRs exist"
```

**Use in a gate script:**
```bash
#!/bin/bash
set -e

# Fail if there are no passing checks on this PR
gh pr checks "$PR_NUMBER" --watch --exit-status || {
  echo "PR checks failed. Blocking deploy."
  exit 1
}

echo "All checks passed. Proceeding with deploy."
```

## Quick Reference

| Feature | Syntax |
|---------|--------|
| JSON fields | `gh pr list --json number,title,state` |
| jq filter | `--jq '.[] \| .field'` |
| Go template table | `--template '{{range .}}{{tablerow ...}}{{end}}'` |
| Time ago | `{{timeago .createdAt}}` |
| Color | `{{color "green" .field}}` |
| Pipe to fzf | `gh ... --jq ... \| fzf` |
| CI token | `export GH_TOKEN=xxx` |
| Target repo | `GH_REPO=org/repo gh ...` |
| Create alias | `gh alias set name 'command'` |
| CI exit status | `gh run watch --exit-status` |

## Common Patterns

### Pattern 1: My Morning Dashboard

```bash
gh alias set morning '!echo "=== My PRs ===" && gh pr list --author "@me" && echo "\n=== Review Requests ===" && gh pr list --reviewer "@me" && echo "\n=== My Issues ===" && gh issue list --assignee "@me" --limit 10'

gh morning
```

### Pattern 2: Interactive PR Checkout with Preview

```bash
gh pr list --json number,title,headRefName,author \
  --jq '.[] | "\(.number)\t\(.title)\t\(.author.login)"' | \
  fzf --delimiter='\t' \
      --preview 'gh pr view {1}' \
      --preview-window=right:60% | \
  cut -f1 | \
  xargs gh pr checkout
```

### Pattern 3: Tabular PR Report

```bash
gh pr list --state all --limit 50 \
  --json number,title,state,author,createdAt \
  --template \
  '{{tablerow "NUM" "AUTHOR" "STATE" "TITLE" "OPENED"}}{{range .}}{{tablerow .number .author.login .state .title (timeago .createdAt)}}{{end}}'
```

### Pattern 4: CI Script That Gates on Checks

```bash
#!/bin/bash
set -euo pipefail

PR_NUMBER=$(gh pr list --head "$(git branch --show-current)" \
  --json number --jq '.[0].number')

echo "Watching checks on PR #$PR_NUMBER..."
gh pr checks "$PR_NUMBER" --watch --exit-status

echo "All checks green. Merging."
gh pr merge "$PR_NUMBER" --squash --delete-branch
```

## Troubleshooting

**Problem: `--jq` expression returns nothing**
Cause: The expression may be wrong, or the field does not exist in the selected JSON fields.
Fix: First run with `--json fieldname` and no `--jq` to see the raw data structure, then build your expression.

**Problem: `--template` with `tablerow` produces misaligned output**
Cause: `tablerow` requires consistent column count. Mixing different numbers of args breaks alignment.
Fix: Ensure every `tablerow` call (including the header row) has the same number of arguments.

**Problem: GH_TOKEN in CI fails with 401**
Cause: The `GITHUB_TOKEN` secret in Actions has limited permissions by default.
Fix: Add the required permissions to your workflow YAML: `permissions: pull-requests: write` (or `contents: write` etc.).

**Problem: `gh alias set` with shell commands (`!`) does not expand variables**
Cause: Shell aliases with `!` run in a subshell and `$VAR` must use single quotes to defer expansion.
Fix: Use single quotes in the alias body and double quotes for literal strings within it.

**Problem: Piping to fzf fails on macOS with "command not found"**
Cause: `fzf` is not installed.
Fix: Install with `brew install fzf` on macOS.

## Version History

- **1.0.0** (2026-04-13): Initial release covering JSON fields, jq, Go templates, fzf piping, env vars, and aliases
