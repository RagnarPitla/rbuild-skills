# GitHub CLI Scripting -- Example

## Scenario: Build an Interactive PR Checkout Tool With Live Preview

**Who:** Kai, Lead Developer, working across 3 active feature branches on a React app
**Where:** macOS terminal with fzf installed, inside the `frontend-app` repo
**The Problem:** The team has 12 open PRs at any given time. When Kai wants to review or test a colleague's PR locally, he has to run `gh pr list`, read the output, mentally pick the right one, then type `gh pr checkout <number>`. He wants a single command that shows him all open PRs in a fuzzy picker with the PR body as a live preview, so he can select and check out with one keystroke.

**Prerequisites:** gh CLI installed, authenticated, fzf installed (`brew install fzf`)

---

### What You Say to the Agent

> "Create a gh alias called 'pick' that lets me fuzzy search open PRs with a preview and check one out interactively"

### What the Agent Does

1. Creates a shell-based gh alias using `gh alias set`:
   ```bash
   gh alias set pick '!gh pr list --json number,title,author \
     --jq ".[] | \"\(.number)\t\(.title) (\(.author.login))\"" | \
     fzf --delimiter="\t" \
         --preview "gh pr view {1}" \
         --preview-window=right:60% \
         --header "Select a PR to checkout" | \
     cut -f1 | \
     xargs gh pr checkout'
   ```

2. Verifies the alias registered with `gh alias list`.

3. Demonstrates the full flow by running `gh pick`, showing the fzf TUI with PR title and author in the left pane and the full PR description in the right pane.

### The Business Impact

- **Discoverability:** Kai sees all open PRs with titles and authors without running a separate command first.
- **Context before checkout:** The live preview shows the full PR body so he knows what he is checking out before committing.
- **One command:** From zero to on the PR branch takes a single `gh pick` invocation.

### Try It Yourself

> "Show me a formatted table of all open PRs with PR number, author, title, and how long ago they were created"

```bash
gh pr list --json number,title,author,createdAt \
  --template \
  '{{tablerow "NUM" "AUTHOR" "TITLE" "OPENED"}}{{range .}}{{tablerow .number .author.login .title (timeago .createdAt)}}{{end}}'
```
