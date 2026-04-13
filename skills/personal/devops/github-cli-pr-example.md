# GitHub CLI PR -- Example

## Scenario: Auto-Merge a Feature PR After Review Approval

**Who:** Sofia, Senior Backend Engineer, working on a payment service microservice
**Where:** macOS terminal, inside the `payment-service` repo
**The Problem:** Sofia has a feature branch ready for review. She wants to create the PR, set it to auto-merge once the CI passes and a reviewer approves, and have the branch deleted automatically. She currently does this manually by checking GitHub every few hours to see if the checks are green.

**Prerequisites:** gh CLI installed, authenticated with repo write access, auto-merge enabled in repo settings

---

### What You Say to the Agent

> "Create a PR from my current branch with my reviewer as senior-backend, use squash merge with auto-merge, and delete the branch after it merges"

### What the Agent Does

1. Runs `gh pr create --fill-verbose --reviewer senior-backend --label "enhancement"` to create the PR using all commit messages to populate the body, assigning the reviewer and label in one command.

2. Runs `gh pr merge --squash --auto --delete-branch` on the newly created PR number so it is queued to merge automatically the moment all required checks pass and the reviewer approves.

3. Confirms the PR is set up by running `gh pr view` to display the PR URL, auto-merge status, and assigned reviewer.

### The Business Impact

- **Time saved:** No more manually checking GitHub every hour. Sofia can move on to the next task knowing the merge will happen automatically.
- **Branch hygiene:** The source branch is deleted on merge with no extra manual step, keeping the repo clean.
- **Review flow:** The reviewer is notified immediately via GitHub, and the auto-merge queues up without blocking anyone.

### Try It Yourself

> "Show me all my open PRs and watch the CI checks run on the top one"

```bash
gh pr list --author "@me"
gh pr checks <number> --watch
```
