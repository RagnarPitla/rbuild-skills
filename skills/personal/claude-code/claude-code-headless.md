---
name: claude-code-headless
description: "Run Claude Code non-interactively in CI/CD pipelines, scripts, and automation. Use when user says 'run Claude in CI', 'non-interactive mode', 'claude -p command', 'automate Claude Code', 'GitHub Actions with Claude', 'pipe output to Claude', 'scheduled Claude tasks'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, claude-code, ci-cd, automation]
---

# Claude Code Headless Mode

Headless mode runs Claude Code non-interactively. Pass a prompt with `-p`, pipe input from stdin, and get structured output back. Use it in CI/CD pipelines, GitHub Actions, scheduled tasks, and any automation where a human is not present to approve each step.

The key flag is `claude -p "your prompt"`. No interactive session, no prompts, no waiting for keystrokes. Claude executes and exits.

## Triggers

- "How do I run Claude Code in a GitHub Actions workflow?"
- "Non-interactive Claude Code for CI/CD"
- "Pipe a file to Claude and get an explanation"
- "Schedule Claude to run a nightly code audit"
- "How do I use claude -p in a script?"
- "Build a PR review bot with Claude Code"

## How It Works

1. **Use `claude -p "prompt"` for non-interactive execution.** Claude reads the prompt, executes the task (reading files, running commands, etc.), and prints output to stdout when done. The process exits when the task is complete.

2. **Pipe stdin for dynamic input.** `cat error.log | claude -p "explain this error and suggest a fix"` passes the file content as context. Claude combines the piped input with any files it reads from the filesystem.

3. **Choose your output format with `--output-format`.** Three options: `text` (default, clean prose), `json` (structured with metadata), `stream-json` (streaming JSON events, useful for real-time processing). Use `json` when parsing output programmatically.

4. **Restrict tools with `--allowedTools` for CI security.** In CI environments, you rarely want Claude to have unrestricted tool access. `--allowedTools Read,Glob,Grep` limits Claude to read-only file access. `--allowedTools Bash(git diff,git log)` allows only specific Bash commands.

5. **Use `--bare` to suppress status messages.** By default Claude Code emits progress messages. `--bare` suppresses these and outputs only the final response. Useful in scripts where you are parsing the output.

6. **Set `ANTHROPIC_API_KEY` in your environment.** Headless mode uses the API key from the environment, not from an interactive session. For GitHub Actions, store it as a repository secret and reference it in your workflow.

```bash
# Basic non-interactive execution
claude -p "List all TypeScript files that have no corresponding test file"

# Pipe stdin
cat build-error.txt | claude -p "Explain this build error and provide the exact fix"

# Get structured JSON output
claude -p "Review src/api/users.ts for security issues" --output-format json

# Stream JSON events (useful for real-time progress)
claude -p "Refactor the authentication module" --output-format stream-json

# Restrict to read-only tools for auditing
claude -p "Find all database queries missing parameterization" \
  --allowedTools "Read,Glob,Grep,Bash(grep,find,git)"

# Suppress status messages, get clean output only
claude -p "Generate a changelog from the last 10 commits" --bare

# Specify the project directory explicitly
claude -p "Run all tests and summarize failures" \
  --project-dir /path/to/project

# Set max tokens for long-running tasks
claude -p "Refactor the entire src/ directory to use strict TypeScript" \
  --max-tokens 8192
```

## Quick Reference

| Flag | Purpose | Example |
|------|---------|---------|
| `-p "prompt"` | Non-interactive prompt | `claude -p "explain this"` |
| `--output-format text` | Default clean text output | Good for human-readable logs |
| `--output-format json` | Structured JSON response | Good for script parsing |
| `--output-format stream-json` | Streaming JSON events | Good for real-time UI |
| `--allowedTools X,Y,Z` | Restrict tool access | `--allowedTools Read,Glob` |
| `--bare` | Suppress status messages | Good for piping output |
| `--project-dir <path>` | Specify project root | Multi-project CI runners |

| Use case | Recommended flags |
|---------|------------------|
| PR review bot | `-p prompt --output-format json --allowedTools Read,Glob,Grep` |
| Build error explainer | `stdin pipe -p --bare` |
| Nightly security audit | `-p prompt --allowedTools Read,Glob,Grep,Bash(grep,find)` |
| Automated refactor | `-p prompt` (full tool access, careful in CI) |
| Code quality report | `-p prompt --output-format json --allowedTools Read,Glob,Grep` |

## Common Patterns

### Pattern 1: GitHub Actions PR Review Bot

Automatically review every PR for code quality when it is opened.

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Get changed files
          CHANGED=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -E '\.(ts|tsx|js|jsx)$' | head -20)
          
          if [ -z "$CHANGED" ]; then
            echo "No TypeScript/JavaScript files changed"
            exit 0
          fi
          
          # Run Claude review
          REVIEW=$(claude -p "Review these changed files for issues: $CHANGED. 
            Check for: logic errors, security vulnerabilities, missing error handling, performance issues.
            Format as markdown with sections for Critical, Major, and Minor issues.
            Be specific with file names and line references." \
            --allowedTools "Read,Glob,Grep" \
            --output-format text \
            --bare)
          
          # Post as PR comment
          gh pr comment ${{ github.event.pull_request.number }} --body "$REVIEW"
```

### Pattern 2: Build Error Explainer

When CI builds fail, automatically get an explanation and suggested fix.

```bash
#!/bin/bash
# explain-build-error.sh

set -e

# Run the build, capture output
BUILD_OUTPUT=$(npm run build 2>&1) || BUILD_FAILED=true

if [ "$BUILD_FAILED" = "true" ]; then
  echo "Build failed. Getting explanation from Claude..."
  
  EXPLANATION=$(echo "$BUILD_OUTPUT" | \
    claude -p "This is a build error output. Explain what went wrong and provide the exact code fix needed. Be specific about which file and line to change." \
    --bare \
    --allowedTools "Read,Glob,Grep")
  
  echo "=== Claude's Analysis ==="
  echo "$EXPLANATION"
  
  # Optionally post to Slack
  if [ -n "$SLACK_WEBHOOK" ]; then
    curl -s -X POST "$SLACK_WEBHOOK" \
      -H 'Content-type: application/json' \
      --data "{\"text\": \"Build failed in $(basename $PWD):\n\`\`\`\n$EXPLANATION\n\`\`\`\"}"
  fi
  
  exit 1
fi
```

### Pattern 3: Nightly Security Audit

Schedule a comprehensive security scan to run every night.

```bash
#!/bin/bash
# nightly-security-audit.sh
# Run via cron: 0 2 * * * /path/to/nightly-security-audit.sh

REPORT_FILE="security-audit-$(date +%Y-%m-%d).json"

claude -p "Perform a comprehensive security audit of this codebase.

Scan for:
1. Hardcoded secrets, API keys, passwords
2. SQL injection vulnerabilities
3. XSS vulnerabilities
4. Missing input validation
5. Insecure dependencies (check package.json)
6. Insecure file permissions or path traversal
7. Missing authentication on sensitive routes
8. Unsafe use of eval() or similar

Return findings as JSON with this structure:
{
  'summary': 'one paragraph overview',
  'critical': [{'file': '', 'line': 0, 'issue': '', 'fix': ''}],
  'high': [...],
  'medium': [...],
  'low': [...]
}" \
  --allowedTools "Read,Glob,Grep,Bash(cat,grep,find,npm audit)" \
  --output-format json \
  --bare > "$REPORT_FILE"

# Alert if critical issues found
CRITICAL_COUNT=$(python3 -c "import json,sys; d=json.load(open('$REPORT_FILE')); print(len(d.get('result',{}).get('critical',[])))" 2>/dev/null || echo "0")

if [ "$CRITICAL_COUNT" -gt "0" ]; then
  echo "ALERT: $CRITICAL_COUNT critical security issues found!"
  # Send alert via your preferred channel
fi
```

### Pattern 4: Automated Changelog Generation

Generate a changelog from git history before each release.

```bash
#!/bin/bash
# generate-changelog.sh <version>

VERSION="${1:-next}"
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -z "$LAST_TAG" ]; then
  GIT_LOG=$(git log --oneline --no-merges -50)
else
  GIT_LOG=$(git log "${LAST_TAG}..HEAD" --oneline --no-merges)
fi

CHANGELOG=$(echo "$GIT_LOG" | claude -p "
Generate a user-facing changelog for version $VERSION from these git commits.
Group by: Features, Bug Fixes, Performance, Breaking Changes.
Use plain English, not commit message jargon.
Skip chore/refactor commits unless they affect users.
Format as markdown.
" --bare)

echo "$CHANGELOG" > CHANGELOG-${VERSION}.md
echo "Changelog written to CHANGELOG-${VERSION}.md"
```

## Troubleshooting

**`claude: command not found` in CI**

Claude Code must be installed on the CI runner. Add `npm install -g @anthropic-ai/claude-code` as a step before any Claude commands. Or pin to a specific version: `npm install -g @anthropic-ai/claude-code@1.x.x` for reproducible CI.

**API key authentication fails in GitHub Actions**

Add `ANTHROPIC_API_KEY` as a repository secret in GitHub (Settings, Secrets and variables, Actions). Reference it in your workflow with `${{ secrets.ANTHROPIC_API_KEY }}`. Make sure the secret name matches exactly (case-sensitive).

**Output format json returns an error**

The `--output-format json` flag wraps Claude's response in a JSON envelope. Parse it with `jq '.result'` or `python3 -c "import json,sys; print(json.load(sys.stdin)['result'])"`. If Claude itself errors (API failure, tool error), the JSON will have an `error` field instead of `result`.

**Claude using too many tokens in CI and timing out**

Add `--max-tokens 4096` to limit response length. Also scope the task more narrowly: instead of "review the whole codebase," pass only the changed files. Use `--allowedTools` to restrict to read-only tools, which prevents Claude from running expensive operations.

**Claude keeps asking for interactive confirmation in scripts**

Use `--allowedTools` to pre-approve the tools Claude needs. In headless mode with `-p`, Claude should not prompt interactively, but if it encounters an action outside its allowed tools, it may stall. Explicitly list all tools the task requires.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
