# GitHub CLI Issues -- Example

## Scenario: Pick Up a Bug During Stand-up and Start Working in 30 Seconds

**Who:** Marcus, Full-Stack Developer, working on an e-commerce platform
**Where:** macOS terminal, inside the `storefront` repo
**The Problem:** During stand-up, a P1 bug is triaged and assigned to Marcus. He needs to assign himself, create a branch linked to the issue, and start working immediately. Right now he opens GitHub in a browser, finds the issue, manually creates a branch from the UI, then copies the branch name to his terminal. It takes 3-4 minutes and breaks his focus.

**Prerequisites:** gh CLI installed, authenticated, issue already created in GitHub

---

### What You Say to the Agent

> "Assign issue 134 to me, create a branch from it, and check it out"

### What the Agent Does

1. Runs `gh issue edit 134 --add-assignee "@me"` to assign the issue to Marcus in the current repo.

2. Runs `gh issue develop 134 --checkout` to create a new branch named `134-checkout-null-pointer` (based on the issue title), push it to the remote, link it to the issue on GitHub, and check it out locally all in one command.

3. Confirms the branch is active with `git branch --show-current` and shows the issue summary with `gh issue view 134`.

### The Business Impact

- **Speed:** What took 3-4 minutes with browser switching now takes under 10 seconds.
- **Traceability:** The branch is automatically linked to the issue on GitHub, so every commit pushed to this branch shows up on the issue timeline with no extra config.
- **Focus:** Marcus never leaves the terminal, keeping his flow state intact.

### Try It Yourself

> "Show me all issues assigned to me and give me a cross-repo overview"

```bash
gh issue list --assignee "@me"
gh status
```
