---
name: github-cli-repo
description: "Create, clone, fork, and manage GitHub repositories. Use when user says 'create a new repo', 'fork and clone', 'sync my fork', 'create repo from template', 'create a release', 'change repo visibility'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, github-cli, repositories, setup]
---

# GitHub CLI: Repository Management

Bootstrap new repos, fork and sync existing ones, publish releases, and manage repo settings without touching the GitHub web UI.

## Triggers

- "Create a new GitHub repo from a template"
- "Fork this repo and clone it locally"
- "Sync my fork with the upstream"
- "Create a release and tag it"
- "Make my repo private"
- "Set the default repo for this directory"

## How It Works

### Creating Repositories

**Create a new repo interactively:**
```bash
gh repo create
```

**Create a public repo with a name:**
```bash
gh repo create my-new-project --public
```

**Create a private repo:**
```bash
gh repo create my-new-project --private
```

**Create and clone immediately:**
```bash
gh repo create my-new-project --public --clone
```

**Create with a description:**
```bash
gh repo create my-new-project --public --description "My project description" --clone
```

**Bootstrap from a template repo (the one-command pattern):**
```bash
gh repo create my-new-agent \
  --template myorg/agent-template \
  --private \
  --clone
```

This creates a new private repo from the template and clones it locally in one command. No browser, no copy-pasting URLs.

**Create repo with topics:**
```bash
gh repo create my-project --public --clone
gh repo edit --add-topic "typescript,ai,agents"
```

### Cloning Repositories

**Clone by owner/repo:**
```bash
gh repo clone myorg/myrepo
```

**Clone to a specific directory:**
```bash
gh repo clone myorg/myrepo ./local-folder
```

**Clone with additional git flags (pass after --):**
```bash
gh repo clone myorg/myrepo -- --depth 1
```

### Forking Repositories

**Fork and clone immediately:**
```bash
gh repo fork myorg/upstream-repo --clone
```

**Fork and set the original as a remote named `upstream`:**
```bash
gh repo fork myorg/upstream-repo --clone --remote
```

After this, `git remote -v` shows both `origin` (your fork) and `upstream` (the original).

**Fork an org repo to a specific org:**
```bash
gh repo fork myorg/upstream-repo --org my-other-org --clone
```

### Viewing Repository Info

**View repo details:**
```bash
gh repo view
```

**View a specific repo:**
```bash
gh repo view myorg/myrepo
```

**Open in browser:**
```bash
gh repo view --web
```

**List your repos:**
```bash
gh repo list
```

**List repos in an org:**
```bash
gh repo list myorg --limit 50
```

**Filter by language:**
```bash
gh repo list --language typescript
```

### Editing Repository Settings

**Change description and homepage:**
```bash
gh repo edit --description "My agent project" --homepage "https://myproject.dev"
```

**Make a repo private:**
```bash
gh repo edit --visibility private
```

**Make a repo public:**
```bash
gh repo edit --visibility public
```

**Enable or disable features:**
```bash
gh repo edit --enable-wiki=false
gh repo edit --enable-issues=true
gh repo edit --enable-projects=false
```

**Add or remove topics:**
```bash
gh repo edit --add-topic "ai,agents,copilot"
gh repo edit --remove-topic "legacy"
```

### Syncing a Fork

**Sync your fork with the upstream (fast-forward, no merge commits):**
```bash
gh repo sync
```

**Sync a specific branch:**
```bash
gh repo sync --branch main
```

**Force sync (overwrites local changes, use carefully):**
```bash
gh repo sync --force
```

**Sync a fork that is not the current repo:**
```bash
gh repo sync myfork/myrepo
```

### Setting the Default Repo

When you are in a directory not tied to a GitHub repo, `gh` commands fail. Fix it:

**Set the default repo interactively:**
```bash
gh repo set-default
```

**Set it directly:**
```bash
gh repo set-default myorg/myrepo
```

This writes to `.git/config` so all `gh` commands in this directory target that repo.

### Releases

**Create a new release:**
```bash
gh release create v2.1.0
```

**Create with a title and notes:**
```bash
gh release create v2.1.0 --title "v2.1.0 - Retry Logic" --notes "Adds exponential backoff for webhook retries"
```

**Create a draft release:**
```bash
gh release create v2.1.0 --draft
```

**Create a pre-release:**
```bash
gh release create v2.1.0-beta.1 --prerelease
```

**Attach files to a release:**
```bash
gh release create v2.1.0 ./dist/myapp-linux-amd64 ./dist/myapp-darwin-arm64
```

**Generate release notes from commit messages automatically:**
```bash
gh release create v2.1.0 --generate-notes
```

**List releases:**
```bash
gh release list
```

**Download a specific release asset:**
```bash
gh release download v2.1.0 --pattern "*.tar.gz"
```

**Download the latest release:**
```bash
gh release download --pattern "myapp-*"
```

## Quick Reference

| Task | Command |
|------|---------|
| Create public repo | `gh repo create <name> --public --clone` |
| Create from template | `gh repo create <name> --template <org/template> --clone` |
| Clone repo | `gh repo clone <owner>/<repo>` |
| Fork and clone | `gh repo fork <owner>/<repo> --clone --remote` |
| Sync fork | `gh repo sync` |
| View repo | `gh repo view` |
| Edit settings | `gh repo edit --visibility private` |
| Set default repo | `gh repo set-default` |
| Create release | `gh release create v1.0.0 --generate-notes` |
| List releases | `gh release list` |
| Download release | `gh release download --pattern "*.zip"` |

## Common Patterns

### Pattern 1: Bootstrap a New Project From Template

```bash
# One command: create, clone, and open
gh repo create my-new-agent \
  --template ragnar/agent-starter-template \
  --private \
  --clone \
  --description "New agent project"

cd my-new-agent
code .
```

### Pattern 2: Contribute to an Open Source Repo

```bash
# Fork and set up with upstream remote
gh repo fork microsoft/semantic-kernel --clone --remote

cd semantic-kernel
git remote -v
# origin   = your fork
# upstream = microsoft/semantic-kernel

# Create a feature branch and contribute
git checkout -b fix/my-contribution
# ... make changes ...
gh pr create --fill
```

### Pattern 3: Keep Fork Up to Date

```bash
# Sync fork with upstream changes
gh repo sync

# Then update local branch
git pull origin main
```

### Pattern 4: Publish a Production Release With Assets

```bash
# Build first
npm run build

# Create release with auto-generated notes and attach dist files
gh release create "v$(node -p "require('./package.json').version")" \
  --generate-notes \
  ./dist/*.zip ./dist/*.tar.gz

# View it
gh release view --web
```

## Troubleshooting

**Problem: `gh repo create` fails with "Name already exists"**
Cause: A repo with that name already exists in your account or the target org.
Fix: Choose a different name or delete the existing repo if it is unused.

**Problem: `gh repo fork` fails with "Repository already exists"**
Cause: You have already forked this repo.
Fix: Clone your existing fork with `gh repo clone your-username/repo-name`.

**Problem: `gh repo sync` fails with "diverged branches"**
Cause: Your fork has commits that are not in the upstream, making fast-forward impossible.
Fix: Use `--force` to overwrite with upstream state (you will lose your fork's extra commits), or manually merge: `git fetch upstream && git merge upstream/main`.

**Problem: `gh release create` fails with "already exists"**
Cause: A release or tag with that version already exists.
Fix: Use `gh release delete v1.0.0` to remove the existing one, or increment the version number.

**Problem: `gh repo edit --visibility public` fails with "billing error"**
Cause: Your account or org plan does not allow public repos, or admin approval is required.
Fix: Check org settings, or contact the org admin to change the visibility.

## Version History

- **1.0.0** (2026-04-13): Initial release covering repo creation, forking, sync, releases, and settings management
