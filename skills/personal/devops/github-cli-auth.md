---
name: github-cli-auth
description: "Set up and manage GitHub CLI authentication. Use when user says 'login to gh', 'add another GitHub account', 'switch between work and personal account', 'add scopes to token', 'set up gh in CI', 'configure GitHub Enterprise'."
tab: github-cli
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, github-cli, authentication, setup]
---

# GitHub CLI: Authentication and Account Management

Configure `gh` for personal accounts, work accounts, GitHub Enterprise, and CI environments. Getting auth right once saves every future command from failing.

## Triggers

- "Login to GitHub with gh"
- "Add my work GitHub account to gh"
- "Switch between my personal and work GitHub accounts"
- "Add project or admin scope to my token"
- "Set up gh auth for CI without browser"
- "Configure gh for GitHub Enterprise"

## How It Works

### Initial Login

**Interactive login (opens browser for OAuth):**
```bash
gh auth login
```

This prompts for:
1. Account type: GitHub.com or GitHub Enterprise
2. Protocol: HTTPS or SSH
3. Auth method: web browser or paste token

**Login to GitHub.com via web browser directly:**
```bash
gh auth login --web
```

**Login with a Personal Access Token (PAT) from stdin — great for scripts:**
```bash
echo "$MY_GITHUB_TOKEN" | gh auth login --with-token
```

**Login for a specific hostname (GitHub Enterprise):**
```bash
gh auth login --hostname github.mycompany.com
```

### Checking Auth Status

**Show current auth status:**
```bash
gh auth status
```

**Check status for a specific host:**
```bash
gh auth status --hostname github.mycompany.com
```

Output shows: logged-in user, token source, active scopes, and whether the token is valid.

### Managing Scopes

The default `gh auth login` grants scopes: `repo`, `read:org`, `workflow`.

**Add additional scopes to the current token:**
```bash
gh auth refresh -s project
gh auth refresh -s admin:org
gh auth refresh -s read:packages
gh auth refresh -s delete_repo
```

**Add multiple scopes at once:**
```bash
gh auth refresh -s project -s admin:org -s read:packages
```

Common scopes you may need:
- `project`: GitHub Projects (v2) access
- `admin:org`: Org-level admin operations
- `read:packages` / `write:packages`: GitHub Packages
- `gist`: Create and manage gists
- `delete_repo`: Delete repositories
- `workflow`: Manage GitHub Actions workflows (usually already included)
- `notifications`: Access notifications

### Multiple Accounts (Personal + Work)

**Add a second account:**
```bash
gh auth login --hostname github.com
# When prompted, use a different token or browser session for the second account
```

**List all authenticated accounts:**
```bash
gh auth status
```

**Switch the active account:**
```bash
gh auth switch
# Interactive picker showing all authenticated accounts
```

**Switch to a specific account/host combo:**
```bash
gh auth switch --user personal-account --hostname github.com
gh auth switch --user work-account --hostname github.com
```

After switching, all `gh` commands run as the selected account.

### Using the Token in Scripts

**Print the current token (for use in scripts or other tools):**
```bash
gh auth token
```

**Use in a curl command:**
```bash
TOKEN=$(gh auth token)
curl -H "Authorization: Bearer $TOKEN" https://api.github.com/user
```

**Use in a script that needs the token as an env var:**
```bash
export GITHUB_TOKEN=$(gh auth token)
```

### Setting Up the Git Credential Helper

**Configure git to use gh for HTTPS authentication:**
```bash
gh auth setup-git
```

This sets `git config --global credential.helper` to use `gh` so that `git push` and `git pull` work over HTTPS without separate credential management.

**Verify it worked:**
```bash
git config --global credential.helper
# Should output: gh auth git-credential
```

### CI/CD Setup (No Browser)

**Option 1: Use the built-in GITHUB_TOKEN in GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
steps:
  - uses: actions/checkout@v4
  - name: Create PR
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: gh pr create --fill --base main
```

The `GITHUB_TOKEN` is automatically available in every Actions run. Set `GH_TOKEN` env var and `gh` picks it up.

**Option 2: Use a PAT stored as a secret:**
```yaml
env:
  GH_TOKEN: ${{ secrets.MY_PAT }}
run: gh pr merge --squash --auto
```

**Option 3: Inline token for one-off scripts:**
```bash
echo "$MY_TOKEN" | gh auth login --with-token
gh pr list
```

### GitHub Enterprise Configuration

**Login to GHE instance:**
```bash
gh auth login --hostname github.mycompany.com
```

**Set the default hostname globally:**
```bash
gh config set -h github.mycompany.com git_protocol https
```

**All commands for the GHE host:**
```bash
GH_HOST=github.mycompany.com gh pr list
```

**Check GHE connection:**
```bash
gh auth status --hostname github.mycompany.com
```

### Configuration Options

**View all gh config values:**
```bash
gh config list
```

**Set git protocol (https or ssh):**
```bash
gh config set git_protocol ssh
```

**Set default editor:**
```bash
gh config set editor "code --wait"
```

**Set browser:**
```bash
gh config set browser firefox
```

### Logging Out

**Logout from github.com:**
```bash
gh auth logout
```

**Logout from a specific host:**
```bash
gh auth logout --hostname github.mycompany.com
```

## Quick Reference

| Task | Command |
|------|---------|
| Login (web) | `gh auth login` |
| Login with token | `echo "$TOKEN" \| gh auth login --with-token` |
| Check status | `gh auth status` |
| Add scope | `gh auth refresh -s project` |
| Switch account | `gh auth switch` |
| Print token | `gh auth token` |
| Setup git creds | `gh auth setup-git` |
| GHE login | `gh auth login --hostname <host>` |
| CI token | `GH_TOKEN=${{ secrets.GITHUB_TOKEN }} gh ...` |
| View config | `gh config list` |

## Common Patterns

### Pattern 1: First-Time Full Setup

```bash
# Login and configure git
gh auth login
gh auth setup-git

# Verify everything works
gh auth status
gh repo list --limit 5
```

### Pattern 2: Add Work Account Alongside Personal

```bash
# Already logged in as personal, add work
gh auth login --hostname github.com
# Use a different PAT or browser session for work account

# Verify both are registered
gh auth status

# Switch to work for a specific session
gh auth switch --user work-username --hostname github.com

# Switch back to personal
gh auth switch --user personal-username --hostname github.com
```

### Pattern 3: Grant Project Access for GitHub Projects v2

```bash
# You get "Resource not accessible by integration" on project commands
gh auth refresh -s project

# Verify the scope is now present
gh auth status
```

### Pattern 4: CI Pipeline Auth Without Secrets Setup

```yaml
name: Auto-merge PR
on:
  push:
    branches: [main]

permissions:
  pull-requests: write
  contents: write

jobs:
  merge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: gh pr merge --squash --auto --delete-branch
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

**Problem: `gh` commands fail with "authentication required"**
Cause: Not logged in, or token has expired.
Fix: Run `gh auth login` to authenticate, or `gh auth refresh` to renew an expired session.

**Problem: "Resource not accessible by integration" on specific API calls**
Cause: The token lacks the required scope.
Fix: Identify the missing scope and run `gh auth refresh -s <scope>`. Run `gh auth status` after to confirm.

**Problem: `gh auth switch` shows only one account**
Cause: Only one account has been logged in.
Fix: Run `gh auth login` again with a different token/account while already logged in as the first.

**Problem: `git push` still prompts for credentials after `gh auth setup-git`**
Cause: An existing credential helper is overriding the `gh` one, or you are using SSH remotes.
Fix: Check `git config --global credential.helper`. If SSH, the credential helper is not needed. For HTTPS, ensure the remote URL starts with `https://`.

**Problem: GH_TOKEN in GitHub Actions has insufficient permissions**
Cause: The default `GITHUB_TOKEN` has read-only permissions unless you declare `permissions` in the workflow.
Fix: Add a `permissions` block to your job. Example: `permissions: pull-requests: write`.

**Problem: `gh auth status` shows correct login but commands still fail for an org**
Cause: The org requires SSO and you have not authorized the token for SAML SSO.
Fix: Go to https://github.com/settings/tokens, find your token, and click "Configure SSO" to authorize for the org.

## Version History

- **1.0.0** (2026-04-13): Initial release covering login, scopes, multi-account, CI setup, and GitHub Enterprise
