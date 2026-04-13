---
name: vscode-keyboard-shortcuts
description: "Master the 20 most valuable VS Code keyboard shortcuts for speed and flow. Use when user says 'VS Code shortcuts', 'keyboard shortcuts vscode', 'speed up coding', 'VS Code hotkeys', 'learn VS Code shortcuts'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, vscode, shortcuts, productivity]
---

# VS Code Keyboard Shortcuts

The fastest developers aren't faster typists. They're faster navigators. These 20 shortcuts eliminate the mouse from your daily workflow and compound into hours saved every week.

## Triggers

- "What are the most useful VS Code shortcuts?"
- "How do I use the command palette in VS Code?"
- "VS Code keyboard shortcuts I should know"
- "Speed up my VS Code workflow"
- "How do I open files quickly in VS Code?"
- "VS Code hotkeys for productivity"

## How It Works

### The Command Palette (Your Most Important Shortcut)

`Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)

Every VS Code command is accessible here. Type any fragment of a command name, and it appears. This is the entry point to everything in VS Code. You never need to memorize menu locations again.

Prefix shortcuts inside the palette:
- `>` — commands (default when opened with `Cmd+Shift+P`)
- No prefix — file search (same as Quick Open)
- `@` — symbols in current file
- `#` — symbols in workspace
- `:` — go to line number

### Quick Open (File Navigation)

`Cmd+P` (Mac) / `Ctrl+P` (Windows/Linux)

Opens files by name across the entire workspace. Type partial filenames, and VS Code fuzzy-matches. Type `filename:42` to open a file and jump to line 42. Press `Cmd+P` repeatedly to cycle through recent files.

### Multi-Cursor Editing

`Cmd+D` (Mac) / `Ctrl+D` (Windows/Linux): Select next occurrence of the current word.
`Cmd+Shift+L` (Mac) / `Ctrl+Shift+L` (Windows/Linux): Select ALL occurrences at once.
`Alt+Click` (Mac/Windows/Linux): Place an additional cursor anywhere.
`Cmd+Alt+Down` / `Ctrl+Alt+Down`: Add cursor one line below.
`Cmd+Alt+Up` / `Ctrl+Alt+Up`: Add cursor one line above.

### Go to Symbol (Code Navigation)

`Cmd+T` (Mac) / `Ctrl+T` (Windows/Linux): Search symbols across the entire workspace (functions, classes, variables).
`Cmd+Shift+O` (Mac) / `Ctrl+Shift+O` (Windows/Linux): Navigate symbols within the current file only.

### Editing Shortcuts

`Cmd+/` (Mac) / `Ctrl+/` (Windows/Linux): Toggle line comment.
`Shift+Alt+F` (Mac) / `Shift+Alt+F` (Windows/Linux): Format document.
`Alt+Up` / `Alt+Down`: Move line up or down.
`Shift+Alt+Up` / `Shift+Alt+Down`: Duplicate line up or down.
`Cmd+Shift+K` (Mac) / `Ctrl+Shift+K` (Windows/Linux): Delete current line.
`Ctrl+G`: Go to specific line number (works on all platforms).

### Window and Panel Management

`Cmd+\` (Mac) / `Ctrl+\` (Windows/Linux): Split editor to the right.
`Cmd+B` (Mac) / `Ctrl+B` (Windows/Linux): Toggle the sidebar.
`Cmd+J` (Mac) / `Ctrl+J` (Windows/Linux): Toggle the bottom panel (terminal, output, problems).
`Cmd+K Z` (Mac) / `Ctrl+K Z` (Windows/Linux): Toggle Zen mode (distraction-free full screen). Press `Escape` twice to exit.
`Cmd+Shift+E` (Mac) / `Ctrl+Shift+E` (Windows/Linux): Focus the Explorer panel.
`Ctrl+\`` (Mac/Windows/Linux): Open or focus the integrated terminal.

### Viewing and Customizing Keybindings

Open keybindings with `Cmd+K Cmd+S` (Mac) / `Ctrl+K Ctrl+S` (Windows/Linux).

In the Keybindings editor:
- Search for any command by name
- Click the pencil icon to rebind
- Right-click to remove a binding
- Toggle between UI and `keybindings.json` (the JSON button in the top-right)

To edit `keybindings.json` directly, open the Command Palette and run "Preferences: Open Keyboard Shortcuts (JSON)".

Example custom binding in `keybindings.json`:
```json
[
  {
    "key": "cmd+shift+t",
    "command": "workbench.action.terminal.new",
    "when": "terminalFocus"
  }
]
```

## Quick Reference

### Navigation

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Cmd+Shift+P` | `Ctrl+Shift+P` | Command Palette |
| `Cmd+P` | `Ctrl+P` | Quick Open file |
| `Ctrl+G` | `Ctrl+G` | Go to line |
| `Cmd+T` | `Ctrl+T` | Go to Symbol in workspace |
| `Cmd+Shift+O` | `Ctrl+Shift+O` | Go to Symbol in file |
| `F12` | `F12` | Go to Definition |
| `Alt+F12` | `Alt+F12` | Peek Definition |
| `Shift+F12` | `Shift+F12` | Find All References |

### Editing

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Cmd+D` | `Ctrl+D` | Select next occurrence |
| `Cmd+Shift+L` | `Ctrl+Shift+L` | Select all occurrences |
| `Alt+Click` | `Alt+Click` | Add cursor at click |
| `Cmd+/` | `Ctrl+/` | Toggle comment |
| `Shift+Alt+F` | `Shift+Alt+F` | Format document |
| `Alt+Up/Down` | `Alt+Up/Down` | Move line |
| `Shift+Alt+Up/Down` | `Shift+Alt+Up/Down` | Duplicate line |
| `Cmd+Shift+K` | `Ctrl+Shift+K` | Delete line |

### Layout

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Cmd+\` | `Ctrl+\` | Split editor |
| `Cmd+B` | `Ctrl+B` | Toggle sidebar |
| `Cmd+J` | `Ctrl+J` | Toggle panel |
| `Cmd+K Z` | `Ctrl+K Z` | Zen mode |
| `Ctrl+\`` | `Ctrl+\`` | Toggle terminal |

## Common Patterns

### Rename a Variable Across a File

1. Click on the variable name.
2. Press `F2` to trigger Rename Symbol.
3. Type the new name and press `Enter`. VS Code updates every reference in the file (or across the workspace for supported languages).

### Open Two Files Side by Side

1. Open the first file with `Cmd+P`.
2. Press `Cmd+\` to split the editor.
3. Open the second file with `Cmd+P` in the new pane.
4. Use `Cmd+1` / `Cmd+2` to switch focus between panes.

### Quickly Find and Jump to a Function

1. Press `Cmd+Shift+O` to open Symbol search for the current file.
2. Type the function name (fuzzy match works).
3. Press `Enter` to jump to it.

### Comment Out a Block of Code

1. Select the lines you want to comment (or just place the cursor on one line).
2. Press `Cmd+/` (Mac) / `Ctrl+/` (Windows/Linux).
3. Press again to uncomment.

For block comments: `Shift+Alt+A` on all platforms.

## Troubleshooting

**Shortcut does nothing or triggers a system action instead.**
Cause: Another app (Raycast, Alfred, system) is capturing the shortcut.
Fix: Check System Settings > Keyboard > Keyboard Shortcuts for conflicts. Rebind the VS Code shortcut to a different key in `keybindings.json`.

**`Cmd+D` keeps selecting the wrong thing.**
Cause: Your cursor is not on a word. VS Code selects the word at the cursor position first, then finds the next occurrence.
Fix: Double-click the word to select it first, then press `Cmd+D` to add the next occurrence.

**Command Palette is not finding commands.**
Cause: Typing too broadly or the extension providing the command is not installed.
Fix: Try more specific terms, or check Extensions (`Cmd+Shift+X`) to confirm the relevant extension is active.

**Format Document does nothing.**
Cause: No formatter is installed for the language, or format-on-save is disabled.
Fix: Install the language-specific formatter extension (e.g., Prettier, Black) and confirm `"editor.defaultFormatter"` is set in `settings.json`.

**Zen Mode won't exit.**
Cause: Single `Escape` press closes other overlays first.
Fix: Press `Escape` twice in quick succession, or use the Command Palette to run "View: Toggle Zen Mode".

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering the 20 most valuable VS Code keyboard shortcuts
- Includes Mac and Windows/Linux variants for all bindings
- Covers Command Palette, Quick Open, multi-cursor, symbol navigation, and layout management
