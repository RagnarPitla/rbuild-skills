---
name: vscode-multi-cursor
description: "Use multi-cursor editing and refactoring tools in VS Code. Use when user says 'select multiple occurrences', 'rename variable VS Code', 'multi cursor', 'select all occurrences', 'VS Code refactoring', 'extract variable VS Code'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, vscode, multi-cursor, refactoring]
---

# VS Code Multi-Cursor Editing

Multi-cursor editing turns repetitive changes across a file from a minute of tedious work into a single keystroke. Pair it with VS Code's built-in refactoring tools and you can rename symbols, extract functions, and restructure code without a plugin.

## Triggers

- "How do I select multiple occurrences in VS Code?"
- "Multi-cursor editing in VS Code"
- "How do I rename a variable across a file?"
- "Select all occurrences of a word in VS Code"
- "VS Code refactoring shortcuts"
- "How do I use Cmd+D in VS Code?"

## How It Works

### Adding Cursors by Selection (Cmd+D Pattern)

`Cmd+D` (Mac) / `Ctrl+D` (Windows/Linux): Selects the word under the cursor (first press), then selects the next occurrence of that word (subsequent presses). Each press adds a new cursor at the next match. You end up with multiple cursors, one at each occurrence.

Hold `Cmd` / `Ctrl` and press `K` before pressing `D` again to **skip** the current match and move to the next one without adding a cursor there.

`Cmd+Shift+L` (Mac) / `Ctrl+Shift+L` (Windows/Linux): Immediately adds cursors at ALL occurrences of the currently selected text. Use this when you want to replace every instance at once rather than one by one.

### Adding Cursors by Click

`Alt+Click` (Mac/Windows/Linux): Places an additional cursor wherever you click. Use this for arbitrary positions that do not share a common string. Hold `Alt` and click multiple locations to build up exactly the set of cursors you need.

### Column (Box) Selection

`Cmd+Alt+Down` / `Ctrl+Alt+Down`: Adds a cursor one line below the current position, in the same column. Repeat to extend downward.
`Cmd+Alt+Up` / `Ctrl+Alt+Up`: Adds a cursor one line above.

For mouse-based column selection: hold `Shift+Alt` and drag vertically to create a rectangular selection. Every line in the rectangle gets a cursor at its right edge.

This is ideal for aligning property values in a JSON object, adding the same prefix to every line of a list, or editing CSV columns.

### Escaping Multi-Cursor Mode

Press `Escape` to collapse all cursors back to a single cursor at the primary position.

### Rename Symbol (F2)

`F2` (all platforms): The proper way to rename any symbol (variable, function, class, parameter). VS Code uses language intelligence to find all references across the entire file and update them simultaneously. Unlike `Cmd+Shift+L`, Rename Symbol understands scope, so it will not rename a different variable that happens to share the same text.

Supported in: TypeScript, JavaScript, Python, C#, Java, Go, Rust, and most language extensions.

After pressing `F2`, a small inline input box appears. Type the new name and press `Enter`.

### Quick Fix Lightbulb (Cmd+.)

`Cmd+.` (Mac) / `Ctrl+.` (Windows/Linux): Opens the Quick Fix and Refactoring menu for the symbol or selection at your cursor.

Common actions available here:
- **Extract to function:** Moves the selected code into a new function, with parameters inferred automatically.
- **Extract to variable:** Wraps the selected expression in a `const` assignment.
- **Move to file:** Moves a symbol to a separate file and updates the import.
- **Organize imports:** Removes unused imports and sorts the remaining ones.
- **Add missing import:** Adds the `import` statement for an unresolved symbol.
- **Infer function return type:** Adds an explicit return type annotation.

### Find and Replace with Regular Expressions

`Cmd+H` (Mac) / `Ctrl+H` (Windows/Linux): Opens Find and Replace.

Click the `.*` button in the search bar to enable regex mode. Now you can use capture groups to restructure matches.

Example: Convert `firstName, lastName` function parameters to a destructured object:
- Find: `function (\w+)\((\w+), (\w+)\)`
- Replace: `function $1({ $2, $3 })`

The `$1`, `$2`, `$3` tokens reference capture groups from the search pattern.

Use `Cmd+Alt+Enter` / `Ctrl+Alt+Enter` to replace all matches at once.

## Quick Reference

### Multi-Cursor Shortcuts

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Cmd+D` | `Ctrl+D` | Select next occurrence |
| `Cmd+Shift+L` | `Ctrl+Shift+L` | Select all occurrences |
| `Alt+Click` | `Alt+Click` | Add cursor at click |
| `Cmd+Alt+Down` | `Ctrl+Alt+Down` | Add cursor below |
| `Cmd+Alt+Up` | `Ctrl+Alt+Up` | Add cursor above |
| `Shift+Alt+Drag` | `Shift+Alt+Drag` | Column/box selection |
| `Escape` | `Escape` | Collapse to single cursor |

### Refactoring Shortcuts

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `F2` | `F2` | Rename Symbol |
| `Cmd+.` | `Ctrl+.` | Quick Fix / Refactor menu |
| `Cmd+H` | `Ctrl+H` | Find and Replace |
| `Shift+F12` | `Shift+F12` | Find All References |
| `F12` | `F12` | Go to Definition |
| `Alt+F12` | `Alt+F12` | Peek Definition inline |

## Common Patterns

### Rename a Variable (Scoped)

1. Click on the variable name.
2. Press `F2`.
3. Type the new name.
4. Press `Enter`. All references in scope are updated. References in other files (for exported symbols) are updated too if VS Code can resolve them.

### Change All Occurrences of a String (Literal Match)

1. Double-click the text to select it.
2. Press `Cmd+Shift+L` / `Ctrl+Shift+L` to select every occurrence.
3. Type the new value. All cursors type simultaneously, replacing all occurrences.

### Add a Property to Multiple Objects

Given:
```javascript
const user = { name: "Alice" };
const admin = { name: "Bob" };
const guest = { name: "Carol" };
```

1. Click at the end of `{ name: "Alice" }` (before the `}`).
2. Hold `Alt` and click before the `}` on the next two lines.
3. Type `, active: true` with all three cursors active.

Result: each object now has `, active: true` added.

### Extract a Repeated Expression to a Variable

1. Select the repeated expression (e.g., `user.profile.settings.theme`).
2. Press `Cmd+.` to open Quick Fix.
3. Choose "Extract to constant" or "Extract to local variable".
4. VS Code creates `const theme = user.profile.settings.theme;` and replaces all occurrences within scope.

### Align Object Properties with Column Selection

Given misaligned JSON:
```
name: "Alice",
age: 30,
email: "alice@example.com",
```

1. Hold `Shift+Alt` and drag vertically over the value column to select all three values.
2. Type the replacement values in order. Each cursor replaces one line.

## Troubleshooting

**`Cmd+D` selects the wrong thing or does not respond.**
Cause: Your cursor is not on a word, or the selection is empty.
Fix: Double-click the word first to select it, then press `Cmd+D` to add the next occurrence.

**F2 Rename Symbol shows no results or renames the wrong references.**
Cause: The language server for this file type is not active, or the file is not part of a recognized project (no `tsconfig.json`, for example).
Fix: Ensure the language extension is installed and the project root is opened as a workspace folder (not just a single file). For TypeScript, a `tsconfig.json` must exist.

**`Cmd+Shift+L` selects too many occurrences including comments or strings.**
Cause: The shortcut does a literal text search, not a semantic search.
Fix: Use `F2` (Rename Symbol) when you need scope-aware replacement. Use `Cmd+Shift+L` only when you want to replace ALL instances including comments.

**Quick Fix lightbulb shows no refactoring options.**
Cause: The selection is not a recognized expression, or the language extension does not support that refactoring.
Fix: Select a complete, valid expression before pressing `Cmd+.`. For JavaScript/TypeScript, select from one side of the expression to the other without trailing whitespace.

**Column selection does not work as expected when lines have different lengths.**
Cause: Cursors are placed at the column position even if a line is shorter, which can result in cursors at the end of shorter lines rather than in the column.
Fix: This is expected behavior. Either pad the shorter lines first or use `Alt+Click` to place cursors manually on shorter lines.

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering multi-cursor editing, column selection, Rename Symbol, Quick Fix
- Includes Find and Replace with regex capture groups
- Covers Cmd+D, Cmd+Shift+L, Alt+Click, F2, and Cmd+. workflows
