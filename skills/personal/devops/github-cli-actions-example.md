# GitHub CLI Actions -- Example

## Scenario: Trigger a Production Deploy and Watch It Live

**Who:** Priya, DevOps Engineer, managing deployments for a SaaS platform
**Where:** macOS terminal, inside the `platform-api` repo
**The Problem:** Priya needs to trigger a manual production deploy using the `workflow_dispatch` workflow, passing the environment and version as inputs. After triggering, she has to watch the deploy complete or fail in real time. Currently she opens GitHub Actions in the browser, fills in the form, then watches the log page. She wants to do the entire flow from her terminal without a browser.

**Prerequisites:** gh CLI installed, authenticated, workflow has `workflow_dispatch` with `environment` and `version` inputs

---

### What You Say to the Agent

> "Trigger the deploy workflow on main for production with version v2.3.1, then watch it complete"

### What the Agent Does

1. Runs `gh workflow run deploy.yml --ref main -f environment=production -f version=v2.3.1` to trigger the workflow with the specified inputs. GitHub queues the run immediately.

2. Waits 3 seconds for the run to register, then gets the new run ID with `gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId'`.

3. Runs `gh run watch <run-id> --exit-status` to stream live log output to the terminal. If the deploy fails, the command exits with a non-zero code so it can be used in scripts.

### The Business Impact

- **Real-time visibility:** Priya sees every step's status as it runs, just like the GitHub browser UI, without leaving the terminal.
- **Scriptable:** The `--exit-status` flag means this pattern can be embedded in larger deploy scripts that gate on success.
- **Speed:** Triggering, getting the run ID, and watching takes about 30 seconds vs. 2-3 minutes of browser navigation.

### Try It Yourself

> "Show me the failed step logs from the last run on main"

```bash
LATEST=$(gh run list --branch main --status failure --limit 1 --json databaseId --jq '.[0].databaseId')
gh run view $LATEST --log-failed
```
