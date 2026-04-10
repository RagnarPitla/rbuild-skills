# Git Workflow Mastery — Example

## Scenario: API Key Committed to a Feature Branch Before Push

**Who:** Lena Fischer, Full-Stack Developer, SaaS startup
**Where:** TypeScript, Node.js, GitHub, feature branch not yet pushed to remote
**The Problem:** Lena was setting up a D365 OData connection and temporarily hardcoded her Azure AD client secret into `src/config/d365.ts` to test the connection. She committed the file, got the integration working, and then realized she forgot to move the secret to `.env` before committing. The branch has not been pushed yet. She needs the secret out of the Git history before anyone else sees the branch or the file shows up in a PR.

**Prerequisites:** Git installed. The branch must not yet be pushed to remote. If it has been pushed, the approach changes significantly (force push + secret rotation required).

---

### What You Say to the Agent

> "I accidentally committed a file with my Azure AD client secret in it. The file is `src/config/d365.ts`. The branch hasn't been pushed yet. I need to remove the secret from the commit history completely and replace it with an environment variable. What's the safest way to do this?"

### What the Agent Does

1. **Confirms the scope first:** Asks Lena to run `git log --oneline` to confirm how many commits contain the file, and `git remote -v` to verify the branch has no upstream. Avoids recommending history rewrite before confirming it is safe.

2. **Identifies the exact commits:** Runs `git log --all --follow -p src/config/d365.ts` to show every commit that touched the file. Finds the secret was introduced two commits ago and is still present in HEAD.

3. **Guides an interactive rebase:** Walks through `git rebase -i HEAD~2` to edit the specific commit where the secret was introduced. Explains what `edit` vs `squash` vs `drop` does in the rebase todo list before Lena touches it.

4. **Catches a subtle history issue:** Notes that Lena also has a `git stash` containing an earlier version of the same file. If she restores the stash later, the secret reappears. Recommends `git stash drop` after the rebase is complete.

5. **Fixes the root cause:** Updates `src/config/d365.ts` to use `process.env.AZURE_CLIENT_SECRET` and creates a `.env.example` with a placeholder value. Adds `.env` to `.gitignore` if not already present.

6. **Verifies the history is clean:** Runs `git log --all -p -- src/config/d365.ts | grep -i "client_secret"` to confirm the secret string no longer appears anywhere in the history before the branch is pushed.

### The Business Impact

- **Secret never reached the remote** — no rotation required, no GitHub secret scanning alert, no incident report
- **Stash leak avoided** — the agent caught the stash that would have silently re-introduced the secret after the rebase
- **`.gitignore` gap closed** — `.env` had been missing from the ignore list; three other developers on the team were also at risk

### Try It Yourself

> "I have 6 commits on my feature branch that I want to clean up before opening a PR. Two are 'WIP' commits, one is 'fix typo', and the real work is spread across all 6. Help me squash them into 2 logical commits with proper messages."
