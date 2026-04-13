---
name: github-cli-extensions
description: "Extend gh CLI with community and custom extensions. Use when user says 'install gh extension', 'find gh extensions', 'gh dashboard TUI', 'gh with fzf', 'create a gh extension', 'clean up merged branches with gh'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, github-cli, extensions, productivity]
---

# GitHub CLI: Extensions

`gh` extensions add commands that the core CLI does not have. Install community tools, browse a TUI dashboard, and even build your own extensions in any language.

## Triggers

- "Install a gh extension for a dashboard"
- "Find gh extensions for productivity"
- "Clean up merged branches automatically"
- "Use gh with a TUI interface"
- "Create my own gh extension"
- "Browse available extensions interactively"

## How It Works

### Managing Extensions

**Install an extension by GitHub repo:**
```bash
gh extension install dlvhdr/gh-dash
```

**List installed extensions:**
```bash
gh extension list
```

**Upgrade all extensions:**
```bash
gh extension upgrade --all
```

**Upgrade a specific extension:**
```bash
gh extension upgrade gh-dash
```

**Remove an extension:**
```bash
gh extension remove gh-dash
```

**Search for extensions on GitHub:**
```bash
gh extension search "dashboard"
gh extension search "fzf"
```

**Browse extensions interactively with a TUI:**
```bash
gh extension browse
```

This opens a terminal UI where you can search, preview, and install extensions.

### Notable Extensions

#### gh-dash: Full TUI Dashboard

The most powerful `gh` extension. Displays your PRs, issues, and notifications in an interactive terminal dashboard with keyboard navigation.

**Install:**
```bash
gh extension install dlvhdr/gh-dash
```

**Run:**
```bash
gh dash
```

Features: multi-repo views, filter presets, keyboard shortcuts, inline PR diff preview, and check status all in one screen.

**Configuration file:** `~/.config/gh-dash/config.yml` lets you set up custom sections, filters per repo, and keybindings.

#### gh-copilot: AI in the Terminal

GitHub Copilot directly in the CLI. Ask it to explain commands or suggest the right `gh` command for what you want to do.

**Install:**
```bash
gh extension install github/gh-copilot
```

**Explain a shell command:**
```bash
gh copilot explain "git rebase -i HEAD~3"
```

**Get a command suggestion:**
```bash
gh copilot suggest "undo my last commit but keep changes staged"
```

#### gh-poi: Clean Up Merged Branches

`poi` stands for "Point of Interest". It identifies local branches that have been merged and are safe to delete.

**Install:**
```bash
gh extension install seachicken/gh-poi
```

**Run interactively (select branches to delete):**
```bash
gh poi
```

This checks GitHub to confirm which branches were merged via PR, not just git-merged locally. Safe for team repos.

#### gh-f: fzf-Powered Fuzzy Finder

Adds `gh f` as a fuzzy-search interface for repos, PRs, issues, and branches.

**Install:**
```bash
gh extension install gennaro-tedesco/gh-f
```

**Fuzzy search repos:**
```bash
gh f repos
```

**Fuzzy search PRs:**
```bash
gh f prs
```

#### Other Worth Knowing

```bash
# gh-markdown-preview: Preview README/markdown locally
gh extension install yusukebe/gh-markdown-preview
gh markdown-preview README.md

# gh-actions-cache: Manage Actions cache entries
gh extension install actions/gh-actions-cache
gh actions-cache list
gh actions-cache delete --all

# gh-repo-stats: Visualize repo stats
gh extension install nicholasgasior/ghn
```

### Creating Custom Extensions

An extension is any executable file named `gh-<name>` hosted in a GitHub repo. It can be a shell script, Python script, Go binary, or anything else.

**Scaffold a new extension:**
```bash
gh extension create my-extension
```

This creates:
```
my-extension/
├── gh-my-extension    # The executable (shell script by default)
└── README.md
```

**The executable shell script template:**
```bash
#!/usr/bin/env bash
set -e

# Your extension logic here
# gh commands work inside extensions with the same auth context
echo "Running my extension"
gh pr list --author "@me"
```

**Make it executable:**
```bash
chmod +x my-extension/gh-my-extension
```

**Test locally:**
```bash
gh extension install ./my-extension
gh my-extension
```

**Share it by pushing to GitHub:**
```bash
cd my-extension
git init
gh repo create my-gh-extension --public --source=. --push
```

Anyone can then install it with:
```bash
gh extension install yourusername/my-gh-extension
```

### Extension Anatomy

Extensions follow a simple contract:
- The repo must contain an executable named `gh-<name>` (matching the repo name after stripping `gh-` prefix)
- For compiled languages (Go, Rust), include pre-built binaries for common platforms in a `dist/` folder, or use `gh extension install --pin` to reference a specific release
- `gh` injects the current auth context into the extension process via `GH_TOKEN`, so extensions can call `gh` commands directly

**Go-based extension:** Use the official scaffold:
```bash
gh extension create --precompiled=go my-extension
```

This generates a Go project with cross-platform build scripts.

**Extension with multiple commands:**
```bash
#!/usr/bin/env bash
case "$1" in
  list)
    gh pr list --author "@me"
    ;;
  review)
    gh pr list --reviewer "@me"
    ;;
  *)
    echo "Usage: gh my-ext [list|review]"
    ;;
esac
```

## Quick Reference

| Task | Command |
|------|---------|
| Install extension | `gh extension install <owner>/<repo>` |
| Browse TUI | `gh extension browse` |
| Search extensions | `gh extension search <term>` |
| List installed | `gh extension list` |
| Upgrade all | `gh extension upgrade --all` |
| Remove | `gh extension remove <name>` |
| Dashboard | `gh dash` (after installing dlvhdr/gh-dash) |
| AI suggestions | `gh copilot suggest "..."` |
| Clean branches | `gh poi` (after installing seachicken/gh-poi) |
| Create extension | `gh extension create <name>` |

## Common Patterns

### Pattern 1: Set Up a Power User Toolkit

```bash
# Install the essential power user extensions
gh extension install dlvhdr/gh-dash         # TUI dashboard
gh extension install github/gh-copilot       # AI assistance
gh extension install seachicken/gh-poi       # Branch cleanup
gh extension install gennaro-tedesco/gh-f    # fzf search

# Verify all installed
gh extension list
```

### Pattern 2: Configure gh-dash for Your Repos

```bash
# Install and run once
gh extension install dlvhdr/gh-dash
gh dash

# Configure custom sections (edit ~/.config/gh-dash/config.yml)
cat > ~/.config/gh-dash/config.yml <<'EOF'
prSections:
  - title: My PRs
    filters: "is:open author:@me"
  - title: Review Requested
    filters: "is:open review-requested:@me"
issuesSections:
  - title: My Issues
    filters: "is:open assignee:@me"
EOF
```

### Pattern 3: Build a Team Shortcuts Extension

```bash
gh extension create team-shortcuts

cat > team-shortcuts/gh-team-shortcuts << 'EOF'
#!/usr/bin/env bash
set -e
case "$1" in
  standup)
    echo "=== Assigned to me ==="
    gh issue list --assignee "@me"
    echo ""
    echo "=== My Open PRs ==="
    gh pr list --author "@me"
    ;;
  cleanup)
    gh poi
    ;;
  *)
    echo "Usage: gh team-shortcuts [standup|cleanup]"
    ;;
esac
EOF

chmod +x team-shortcuts/gh-team-shortcuts
gh extension install ./team-shortcuts
gh team-shortcuts standup
```

### Pattern 4: Weekly Branch Cleanup

```bash
# Run gh-poi to identify merged branches, confirm deletions interactively
gh poi

# Or chain with gh-dash for a full tidy-up session
gh dash
# Navigate to closed PRs, inspect, close tabs, then run:
gh poi
```

## Troubleshooting

**Problem: Extension installs but command is not found**
Cause: The extension binary name does not match the expected pattern (`gh-<name>`).
Fix: Check the repo for the executable. Run `gh extension list` to see what names were registered. Try running `gh <name>` where `<name>` matches the repo name minus the `gh-` prefix.

**Problem: `gh extension upgrade --all` fails for one extension**
Cause: The extension repo has no new releases, or the release asset for your platform is missing.
Fix: Check the extension's GitHub repo for its latest release. Remove and reinstall if the repo structure changed.

**Problem: `gh dash` shows "no sections configured"**
Cause: First run before a config file exists.
Fix: On first run, `gh-dash` creates a default config at `~/.config/gh-dash/config.yml`. Edit it to add your sections.

**Problem: Custom extension fails with permission denied**
Cause: The shell script is not marked executable.
Fix: Run `chmod +x gh-<name>` in the extension directory.

**Problem: `gh copilot suggest` says "not authorized"**
Cause: You need an active GitHub Copilot subscription to use this extension.
Fix: Ensure your account has Copilot access at https://github.com/settings/copilot.

## Version History

- **1.0.0** (2026-04-13): Initial release covering install, browse, notable extensions, and custom extension creation
