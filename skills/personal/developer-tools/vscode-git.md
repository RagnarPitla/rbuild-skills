---
name: vscode-git
description: "Use VS Code's built-in Source Control panel and GitLens for git workflows. Use when user says 'git in VS Code', 'stage and commit in VS Code', 'resolve merge conflicts VS Code', 'GitLens', 'VS Code source control', 'git diff VS Code'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, vscode, git, source-control]
---

# VS Code Git and Source Control

VS Code has first-class git support built in. The Source Control panel, inline diffs, and 3-way merge editor cover most daily git workflows without opening a terminal. Add GitLens and you get blame, history, and interactive rebase inside the editor.

## Triggers

- "How do I use git in VS Code?"
- "Stage and commit files in VS Code"
- "Resolve merge conflicts in VS Code"
- "How do I view git history in VS Code?"
- "GitLens VS Code setup and usage"
- "How do I manage branches from VS Code?"

## How It Works

### The Source Control Panel

`Cmd+Shift+G` (Mac) / `Ctrl+Shift+G` (Windows/Linux): Opens the Source Control panel.

The panel has three sections:
- **Changes:** Modified files not yet staged.
- **Staged Changes:** Files added to the index (`git add`).
- **Merge Changes:** Files with conflicts during a merge or rebase.

Click the `+` icon next to a file to stage it. Click `-` to unstage. Click the file name to open an inline diff view showing exactly what changed.

The text box at the top is the commit message field. Press `Cmd+Enter` / `Ctrl+Enter` to commit staged changes.

The `...` menu in the panel header exposes: Pull, Push, Fetch, Sync, Stash, Pop Stash, and more.

### Inline Diff View

When you click a changed file in the Source Control panel (or press `Cmd+Shift+G` then click a file), VS Code opens a side-by-side diff editor:
- Left pane: the version in `HEAD` (last commit).
- Right pane: your working copy.

Additions are highlighted green, deletions red.

You can also see inline diffs in the editor itself. Modified lines show a colored bar in the gutter. Click the bar to see a compact diff popover. From the popover you can stage or revert individual hunks without staging the whole file.

### The Timeline View

Open the Explorer panel (`Cmd+Shift+E`) and scroll to the bottom to find the Timeline view. It shows a chronological list of:
- Local file saves
- Git commits that touched the file

Click any commit in Timeline to open a diff between that commit and the current file state. This is the fastest way to answer "what did this file look like two commits ago?"

### Branch Management from the Status Bar

The current branch name appears in the bottom-left status bar. Click it to:
- Switch to an existing branch (fuzzy search available).
- Create a new branch from the current commit.
- Create a branch from a remote.

For more detailed branch management (delete, rename, compare), use the `...` menu in the Source Control panel or the GitLens branch panel.

### 3-Way Merge Editor for Conflicts

When a merge or rebase produces conflicts, VS Code offers a dedicated 3-way merge editor. Click "Resolve in Merge Editor" when a conflict file opens.

The merge editor shows three panes:
- **Incoming (right):** Changes from the branch being merged in.
- **Current (left):** Your changes on the current branch.
- **Result (bottom):** The final output you are building.

For each conflict chunk, choose:
- "Accept Incoming" to take the incoming version.
- "Accept Current" to keep your version.
- "Accept Both" to include both.
- Or manually edit the Result pane for a custom resolution.

Click "Complete Merge" when all conflicts are resolved.

### GitLens Extension

Install GitLens (by GitKraken) for advanced git capabilities inside VS Code. The most useful features:

**Blame annotations:** Hover over any line to see who last modified it, when, and with what commit message. This appears inline at the end of the line as ghost text when you move your cursor there.

**File blame view:** In the Source Control panel, click the GitLens "File Blame" button to annotate every line in the current file with author and commit info.

**Commit graph:** Open the Command Palette and run "GitLens: Show Commit Graph" for a visual commit history with branching, merging, and tagging visible as a graph.

**Interactive rebase:** From the GitLens Commits panel, right-click any commit in the log and choose "Rebase to...". GitLens opens an interactive rebase editor inside VS Code. Drag commits to reorder, click to squash, drop, or edit. No terminal required.

**File history:** Right-click any file in the Explorer and choose "Open File History" (GitLens). Shows every commit that touched the file, with diff comparisons.

### Common Git Workflows Without the Terminal

**Pull latest changes:**
1. Click `...` in Source Control panel.
2. Choose "Pull".

**Push a branch:**
1. Commit your changes.
2. Click `...` and choose "Push".
3. If the branch has no upstream, VS Code prompts you to publish it.

**Stash work in progress:**
1. Click `...` in Source Control panel.
2. Choose "Stash" to save uncommitted changes. Enter a name.
3. Choose "Pop Stash" to restore when ready.

**Compare branches:**
1. Open Command Palette (`Cmd+Shift+P`).
2. Run "Git: Compare Branches".
3. Select the two branches to compare.

## Quick Reference

### Source Control Panel Actions

| Action | How |
|---|---|
| Open Source Control | `Cmd+Shift+G` / `Ctrl+Shift+G` |
| Stage a file | Click `+` next to file in Changes |
| Unstage a file | Click `-` next to file in Staged |
| Stage all changes | Click `+` next to "Changes" header |
| Commit staged | Type message, press `Cmd+Enter` |
| Undo last commit | `...` menu, "Undo Last Commit" |
| Discard file changes | Right-click file, "Discard Changes" |
| Switch branch | Click branch name in status bar |
| View file diff | Click file name in Source Control panel |

### GitLens Shortcuts

| Action | How |
|---|---|
| View inline blame | Hover over any line |
| Open commit graph | Command Palette: "GitLens: Show Commit Graph" |
| View file history | Right-click file, "Open File History" (GitLens) |
| Interactive rebase | Right-click commit in GitLens Commits panel |
| Compare with branch | Command Palette: "GitLens: Compare File with Branch or Tag" |

## Common Patterns

### Stage Partial Changes (Hunk-by-Hunk)

1. Click the changed file in the Source Control panel to open the diff.
2. In the diff view, right-click a specific hunk (block of changes).
3. Choose "Stage Selected Ranges".
4. Only that hunk is staged, leaving other changes unstaged.

This lets you commit one logical change even when a file has multiple unrelated modifications.

### Investigate When a Bug Was Introduced

1. Open the file in the editor.
2. Move your cursor to the suspicious line.
3. If GitLens is installed, the line's blame annotation shows the commit hash and message.
4. Click the annotation to open the full commit details.
5. If not using GitLens, open the Timeline view and click through recent commits to find where the line changed.

### Create a Feature Branch and Push

1. Click the branch name in the status bar.
2. Select "Create new branch from...".
3. Choose the base branch (e.g., `main`).
4. Enter the branch name.
5. Write your changes, stage them in Source Control, commit.
6. Click `...` and "Push". VS Code asks to publish the upstream branch.

### Resolve a Multi-File Merge Conflict

1. After a conflicting merge, the Merge Changes section in Source Control lists all conflicted files.
2. Click each file and choose "Open in Merge Editor".
3. Resolve each conflict using the 3-way editor.
4. Click "Complete Merge" for each file.
5. Once all files are resolved, commit from the Source Control panel (the message is pre-filled with a merge commit template).

## Troubleshooting

**Source Control panel shows no changes even though files were modified.**
Cause: The opened folder is not inside a git repository, or the `.git` directory is missing.
Fix: Confirm the workspace folder is a git repo (`git status` in the terminal). If the repo root is a parent folder, open that folder as the workspace root, not a subdirectory.

**Inline diff gutter bars are not appearing.**
Cause: The "Diff Decorations" setting is disabled.
Fix: Open Settings (`Cmd+,`) and search for `git.decorations.enabled`. Set it to `true`.

**3-way merge editor does not appear, VS Code opens a plain text file with conflict markers instead.**
Cause: The `git.mergeEditor` setting is disabled.
Fix: Open Settings and search for `git.mergeEditor`. Set it to `true`.

**GitLens blame annotations do not show on hover.**
Cause: GitLens may be in a limited mode (free features only in VS Code 1.85+) or the setting is toggled off.
Fix: In GitLens settings, ensure "Hovers: Current Line" is enabled. Run "GitLens: Toggle Line Blame" from the Command Palette.

**Commit fails with "Please tell me who you are" error.**
Cause: Git user name and email are not configured globally.
Fix: Run in the integrated terminal:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering Source Control panel, inline diff, Timeline, 3-way merge editor
- GitLens setup, blame, interactive rebase, commit graph
- Branch management from status bar and common git workflows
