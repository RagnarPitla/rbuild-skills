---
name: github-cli-actions
description: "Control GitHub Actions from the terminal. Use when user says 'trigger a workflow', 'watch CI run', 'rerun failed jobs', 'download artifacts', 'set a secret', 'check workflow status'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, github-cli, github-actions, ci-cd]
---

# GitHub CLI: GitHub Actions Control

Trigger, monitor, rerun, and manage GitHub Actions workflows without leaving the terminal. Stop opening browser tabs just to watch a build.

## Triggers

- "Trigger the deploy workflow on main"
- "Watch my CI run in real time"
- "Rerun only the failed jobs"
- "Download artifacts from the last run"
- "Set a new secret for this repo"
- "Check which workflows are configured"

## How It Works

### Listing Workflows

**List all workflows in the repo:**
```bash
gh workflow list
```

**Include disabled workflows:**
```bash
gh workflow list --all
```

**Show workflow details:**
```bash
gh workflow view deploy.yml
```

### Triggering Workflows

**Trigger a `workflow_dispatch` event (simplest form):**
```bash
gh workflow run deploy.yml
```

**Trigger on a specific branch:**
```bash
gh workflow run deploy.yml --ref staging
```

**Pass inputs defined in the workflow's `workflow_dispatch.inputs`:**
```bash
gh workflow run deploy.yml \
  --ref main \
  -f environment=production \
  -f version=v2.1.0 \
  -f dry_run=false
```

The `-f` flag passes string values. Use `-F` for typed values (numbers, booleans):
```bash
gh workflow run load-test.yml -F concurrency=50 -F duration=120
```

### Listing Runs

**List recent runs:**
```bash
gh run list
```

**Filter by workflow:**
```bash
gh run list --workflow deploy.yml
```

**Filter by branch:**
```bash
gh run list --branch main
```

**Filter by status (queued, in_progress, completed, failure, success, cancelled):**
```bash
gh run list --status failure
gh run list --status in_progress
```

**Limit results:**
```bash
gh run list --limit 20
```

**JSON output for scripting:**
```bash
gh run list --json databaseId,status,conclusion,headBranch --jq '.[] | "\(.databaseId): \(.status) - \(.conclusion)"'
```

### Watching a Run

**Watch a run in real time (prints live log updates):**
```bash
gh run watch
```

**Watch a specific run:**
```bash
gh run watch 9876543210
```

**Exit with non-zero code if run fails (useful in scripts):**
```bash
gh run watch 9876543210 --exit-status
```

### Viewing Run Logs

**View summary of a specific run:**
```bash
gh run view 9876543210
```

**Print full logs:**
```bash
gh run view 9876543210 --log
```

**Print only failed step logs (much faster to diagnose):**
```bash
gh run view 9876543210 --log-failed
```

**View in browser:**
```bash
gh run view 9876543210 --web
```

### Rerunning

**Rerun a failed run (all jobs):**
```bash
gh run rerun 9876543210
```

**Rerun only failed jobs (skips already-passing jobs):**
```bash
gh run rerun 9876543210 --failed
```

**Enable debug logging for the rerun:**
```bash
gh run rerun 9876543210 --debug
```

### Cancelling a Run

**Cancel a running workflow:**
```bash
gh run cancel 9876543210
```

### Downloading Artifacts

**Download all artifacts from a run:**
```bash
gh run download 9876543210
```

**Download a specific artifact by name:**
```bash
gh run download 9876543210 --name test-results
```

**Specify download directory:**
```bash
gh run download 9876543210 --dir ./artifacts
```

**Download artifacts from the latest run:**
```bash
gh run download --name test-results
```

### Secrets and Variables

**Set a secret:**
```bash
gh secret set DATABASE_URL
# Prompts for value securely (no value in shell history)
```

**Set a secret from a value (less secure, in shell history):**
```bash
echo "postgres://..." | gh secret set DATABASE_URL
```

**Set a secret from a file:**
```bash
gh secret set PRIVATE_KEY < ./private.pem
```

**List secrets (names only, values are never shown):**
```bash
gh secret list
```

**Delete a secret:**
```bash
gh secret delete DATABASE_URL
```

**Set an environment-level secret:**
```bash
gh secret set DATABASE_URL --env production
```

**Set a repository variable (visible in logs, not secret):**
```bash
gh variable set APP_VERSION --body "2.1.0"
```

**List variables:**
```bash
gh variable list
```

## Quick Reference

| Task | Command |
|------|---------|
| List workflows | `gh workflow list` |
| Trigger workflow | `gh workflow run <file>` |
| Trigger with inputs | `gh workflow run <file> -f key=value` |
| List runs | `gh run list` |
| Watch live | `gh run watch` |
| View failed logs | `gh run view <id> --log-failed` |
| Rerun failed jobs | `gh run rerun <id> --failed` |
| Cancel run | `gh run cancel <id>` |
| Download artifacts | `gh run download <id> --name <artifact>` |
| Set secret | `gh secret set <NAME>` |
| Set variable | `gh variable set <NAME> --body <value>` |

## Common Patterns

### Pattern 1: Deploy to Production Manually

```bash
# Trigger the deploy workflow on main with prod env
gh workflow run deploy.yml --ref main -f environment=production -f confirm=true

# Get the run ID of what just triggered
sleep 3
RUN_ID=$(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# Watch it complete
gh run watch $RUN_ID --exit-status && echo "Deploy succeeded" || echo "Deploy FAILED"
```

### Pattern 2: Diagnose a Flaky Test

```bash
# Find recent failures on main
gh run list --workflow test.yml --branch main --status failure --limit 5

# View failed step logs for the most recent one
LATEST=$(gh run list --workflow test.yml --status failure --limit 1 --json databaseId --jq '.[0].databaseId')
gh run view $LATEST --log-failed

# Rerun with debug logging
gh run rerun $LATEST --failed --debug
```

### Pattern 3: Rotate a Secret Safely

```bash
# Delete old secret
gh secret delete API_KEY

# Set new value (prompts securely)
gh secret set API_KEY

# Trigger a test run to confirm the new key works
gh workflow run smoke-test.yml --ref main
gh run watch --exit-status
```

### Pattern 4: Download and Inspect Test Results

```bash
# Run is complete, grab the test result artifact
gh run download --name junit-results --dir ./test-output

# View the JUnit XML
ls ./test-output/
```

## Troubleshooting

**Problem: `gh workflow run` says "workflow not found"**
Cause: The workflow file name is wrong, or the workflow does not have a `workflow_dispatch` trigger.
Fix: Run `gh workflow list` to see exact file names. Check the workflow YAML for `on: workflow_dispatch:`.

**Problem: `-f` inputs are ignored or workflow fails validation**
Cause: The input names in `-f key=value` must exactly match the `inputs` keys defined in the workflow.
Fix: Check the workflow file for `workflow_dispatch.inputs` keys and match them exactly.

**Problem: `gh run watch` shows nothing and exits immediately**
Cause: The run already completed by the time you ran the command.
Fix: Use `gh run view <id>` to see the completed status, or `gh run view <id> --log-failed` for failures.

**Problem: `gh secret set` fails with "resource not accessible by integration"**
Cause: Your GitHub token lacks the `repo` scope or you are not an admin on the repo.
Fix: Run `gh auth refresh -s repo` or ask a repo admin to set the secret.

**Problem: `gh run download` says artifact not found**
Cause: Artifacts expire after 90 days by default, or the artifact name is misspelled.
Fix: Run `gh run view <id>` to see what artifacts the run produced, then use the exact name.

## Version History

- **1.0.0** (2026-04-13): Initial release covering workflow triggering, monitoring, reruns, and secrets
