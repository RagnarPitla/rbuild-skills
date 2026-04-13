# GitHub CLI Extensions -- Example

## Scenario: Set Up a Power User Extension Kit and Clean Up 40 Merged Branches

**Who:** Jordan, Staff Engineer, who maintains the main monorepo for a 15-person team
**Where:** macOS terminal, inside the `platform` monorepo
**The Problem:** After a busy sprint, the repo has accumulated 40+ local branches that were merged to main via PRs weeks ago. Jordan needs to identify which ones are safe to delete (confirmed merged via PR, not just git-merged locally) and remove them. Doing it manually with `git branch -d` risks deleting branches that were never properly merged. Jordan also wants a dashboard to stay on top of PRs and issues without opening GitHub in a browser.

**Prerequisites:** gh CLI installed, authenticated, fzf installed

---

### What You Say to the Agent

> "Install gh-dash for a TUI dashboard and gh-poi to clean up my merged branches, then run the cleanup"

### What the Agent Does

1. Installs both extensions:
   ```bash
   gh extension install dlvhdr/gh-dash
   gh extension install seachicken/gh-poi
   ```

2. Runs `gh extension list` to confirm both installed successfully alongside any existing extensions.

3. Runs `gh poi` to start the interactive branch cleanup. `gh-poi` checks GitHub to confirm which local branches have been merged via an actual PR (not just rebased or cherry-picked locally). It presents an interactive list where Jordan can select which branches to delete.

4. After cleanup, shows the before/after branch count:
   ```bash
   git branch | wc -l
   ```

5. Launches `gh dash` to show the TUI dashboard, explaining that `~/.config/gh-dash/config.yml` can be edited to customize the sections and filters.

### The Business Impact

- **Safety:** `gh-poi` checks the GitHub API to confirm merges, not just local git state. No risk of deleting a branch that was never properly merged.
- **Time saved:** Cleaning 40 branches manually takes 30+ minutes of reviewing each one. `gh poi` does it in under 2 minutes with an interactive UI.
- **Ongoing visibility:** `gh dash` replaces opening 3-4 GitHub browser tabs at the start of each work session.

### Try It Yourself

> "Search for gh extensions related to code review and install one"

```bash
gh extension search "review"
gh extension browse
```
