# GitHub CLI API -- Example

## Scenario: Bulk Close All Stale Issues From Last Quarter

**Who:** Lena, Engineering Manager, maintaining a public OSS library
**Where:** macOS terminal, inside the `my-library` repo
**The Problem:** The repo has accumulated 80+ issues that have not been updated in over 90 days. Lena wants to close all issues labeled "stale", leave a comment explaining why, and mark them as "not planned". Doing this manually in the GitHub UI means clicking through each issue one by one. It would take over an hour.

**Prerequisites:** gh CLI installed, authenticated with `repo` scope, issues labeled "stale" already exist

---

### What You Say to the Agent

> "Bulk close all issues labeled 'stale' with a comment saying they are being closed due to inactivity, and mark them as not planned"

### What the Agent Does

1. Runs the following to collect all stale issue numbers using the REST API with pagination:
   ```bash
   gh api repos/{owner}/{repo}/issues \
     --paginate \
     --jq '.[] | select(.labels[].name == "stale") | .number'
   ```

2. Loops through each number, first posting a comment explaining the closure:
   ```bash
   gh api repos/{owner}/{repo}/issues/$NUM/comments \
     --method POST \
     -f body="Closing due to inactivity (90+ days). Reopen if this is still relevant."
   ```

3. Then closes each issue with the `not_planned` reason:
   ```bash
   gh api repos/{owner}/{repo}/issues/$NUM \
     --method PATCH \
     -f state=closed \
     -f state_reason=not_planned
   ```

4. Reports the count of issues closed to confirm completion.

### The Business Impact

- **Time saved:** What would have taken 60-90 minutes of clicking through the GitHub UI completes in under 2 minutes via script.
- **Consistency:** Every closed issue gets the same professional comment with no variation or missed cases.
- **Auditability:** The `not_planned` state reason is preserved on each issue, making it clear these were intentional closures.

### Try It Yourself

> "Get the star count, fork count, and open issue count for this repo as JSON"

```bash
gh api repos/{owner}/{repo} --jq '{stars: .stargazers_count, forks: .forks_count, open_issues: .open_issues_count}'
```
