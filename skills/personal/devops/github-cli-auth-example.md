# GitHub CLI Auth -- Example

## Scenario: Set Up Work and Personal GitHub Accounts Side by Side

**Who:** Dana, Freelance Developer, who contributes to personal OSS projects on github.com and also works at a company using github.com (separate org)
**Where:** macOS terminal, fresh gh install
**The Problem:** Dana has two GitHub accounts: a personal one and a work one. Both are on github.com. When working on client projects she needs to push as her work identity. When contributing to OSS she uses her personal account. Currently she logs out and back in every time she switches contexts, which takes 5 minutes and breaks her flow. She needs both accounts active simultaneously with a quick switch command.

**Prerequisites:** gh CLI installed, personal and work GitHub PATs ready

---

### What You Say to the Agent

> "Set up both my personal and work GitHub accounts in gh so I can switch between them without logging out"

### What the Agent Does

1. Logs in the personal account first using the PAT:
   ```bash
   echo "$PERSONAL_GITHUB_PAT" | gh auth login --with-token
   ```
   Confirms with `gh auth status` showing the personal account as active.

2. Logs in the work account as a second session on the same hostname:
   ```bash
   echo "$WORK_GITHUB_PAT" | gh auth login --hostname github.com --with-token
   ```
   Both accounts are now stored. `gh auth status` shows both.

3. Demonstrates switching:
   ```bash
   gh auth switch --user work-username --hostname github.com
   gh auth status   # Confirms work account is active

   gh auth switch --user personal-username --hostname github.com
   gh auth status   # Back to personal
   ```

4. Sets up the git credential helper so HTTPS pushes use whichever account is currently active:
   ```bash
   gh auth setup-git
   ```

### The Business Impact

- **Zero logout friction:** Switching context takes one command instead of a full logout and re-authentication cycle.
- **Correct identity on commits:** Pushes automatically use the active account's credentials, preventing commits showing up under the wrong identity in org repos.
- **Setup time:** Full dual-account setup takes under 3 minutes and is permanent until tokens expire.

### Try It Yourself

> "Check what scopes my current token has and add project access for GitHub Projects v2"

```bash
gh auth status
gh auth refresh -s project
gh auth status
```
