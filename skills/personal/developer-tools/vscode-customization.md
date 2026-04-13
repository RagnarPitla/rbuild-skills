---
name: vscode-customization
description: "Customize VS Code with settings.json, profiles, snippets, and per-language formatters. Use when user says 'VS Code settings.json', 'create VS Code snippet', 'VS Code profiles', 'format on save VS Code', 'customize VS Code', 'recommended extensions workspace'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, vscode, settings, snippets]
---

# VS Code Customization

VS Code is infinitely configurable. Settings, snippets, profiles, and per-language overrides let you shape the editor to match exactly how you work, and share that configuration with your team.

## Triggers

- "How do I edit settings.json in VS Code?"
- "Create a custom snippet in VS Code"
- "VS Code profiles: how to create and switch"
- "Format on save per language in VS Code"
- "How do I add recommended extensions to a workspace?"
- "Customize VS Code for a specific project"

## How It Works

### settings.json Hierarchy

VS Code applies settings in this order (later entries override earlier ones):

1. **Default settings:** Built-in VS Code defaults.
2. **User settings:** `~/.config/Code/User/settings.json` (Mac: `~/Library/Application Support/Code/User/settings.json`). Applies everywhere.
3. **Profile settings:** Settings saved in a VS Code Profile. Overrides user settings.
4. **Workspace settings:** `.vscode/settings.json` in the project root. Overrides user settings for that workspace.
5. **Folder settings:** `.vscode/settings.json` in a specific folder within a multi-root workspace. Overrides workspace settings for that folder.

Open user settings JSON: `Cmd+Shift+P` then "Preferences: Open User Settings (JSON)".
Open workspace settings JSON: `Cmd+Shift+P` then "Preferences: Open Workspace Settings (JSON)".

### Key Settings to Configure

**Font and appearance:**
```json
{
  "editor.fontFamily": "Fira Code, Cascadia Code, monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "workbench.colorTheme": "One Dark Pro"
}
```

**Editor behavior:**
```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.stickyScroll.enabled": true,
  "editor.bracketPairColorization.enabled": true
}
```

**Auto-save and format:**
```json
{
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true
}
```

### Per-Language Settings

Any setting can be scoped to a specific language using the `[language-id]` key. This overrides the global setting for files of that type only.

```json
{
  "editor.formatOnSave": false,
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.tabSize": 4
  },
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": { "other": false }
  }
}
```

Language IDs for common file types: `javascript`, `typescript`, `python`, `json`, `markdown`, `html`, `css`, `scss`, `go`, `rust`, `java`.

### VS Code Profiles

Profiles let you save a complete VS Code configuration (settings, extensions, keybindings, snippets, and tasks) and switch between them instantly. This is useful for context-switching between personal projects, work environments, and specific tech stacks.

**Create a profile:**
1. Click the gear icon in the bottom-left of the activity bar.
2. Choose "Profiles".
3. Click "Create Profile".
4. Name it (e.g., "TypeScript Web", "Python Data", "Writing").
5. Choose whether to start from the Default profile, a template, or an existing profile.

**Switch a profile:**
1. Click the gear icon.
2. Choose "Profiles".
3. Click the profile you want.

**Export/import profiles:** From the Profile menu, choose "Export Profile" to save it as a `.code-profile` file. Share it with teammates or import it on another machine.

### User-Defined Snippets

Snippets are reusable code templates with tabstops. They appear in IntelliSense when you type a prefix.

Open the snippet editor: `Cmd+Shift+P` then "Snippets: Configure Snippets". Choose a language to edit language-specific snippets, or choose "New Global Snippets file" for snippets that work everywhere.

**Snippet anatomy:**
```json
{
  "React functional component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:// props}",
      "}",
      "",
      "export const ${1:ComponentName} = ({ ${3:props} }: ${1:ComponentName}Props) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};",
      ""
    ],
    "description": "React functional component with TypeScript props interface"
  }
}
```

**Tabstops explained:**
- `$1`, `$2`, `$3`: Tab stops in order. Pressing `Tab` moves to the next stop.
- `$0`: Final cursor position after all tab stops.
- `${1:placeholder}`: Tab stop with a default value. The placeholder is selected so you can type over it.
- `${1:Name}` appearing multiple times: All instances share the same value. Edit one and all update simultaneously.
- `${1|option1,option2,option3|}`: Dropdown choices at that tab stop.

**Practical snippets:**

TypeScript try-catch with async:
```json
"Async try-catch": {
  "prefix": "trycatch",
  "body": [
    "try {",
    "  ${1:await expression};",
    "} catch (error) {",
    "  console.error('${2:Operation} failed:', error);",
    "  throw error;",
    "}"
  ]
}
```

Python docstring:
```json
"Python docstring": {
  "prefix": "docstring",
  "body": [
    "\"\"\"${1:Summary line.}",
    "",
    "Args:",
    "    ${2:param}: ${3:Description.}",
    "",
    "Returns:",
    "    ${4:Description.}",
    "\"\"\""
  ]
}
```

### .vscode/extensions.json for Teams

Commit a `.vscode/extensions.json` file to share recommended extensions with your team. When a teammate opens the workspace, VS Code prompts them to install missing recommended extensions.

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.black-formatter",
    "eamodio.gitlens",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint"
  ],
  "unwantedRecommendations": [
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### The @tag:advanced Settings Filter

In the Settings UI (`Cmd+,`), type `@tag:advanced` in the search bar to surface settings that are hidden by default. These include:
- `editor.semanticHighlighting.enabled`
- `editor.inlayHints.enabled`
- `editor.suggest.matchOnWordStartOnly`
- Advanced language server tuning

Other useful tags:
- `@tag:experimental` — features in preview
- `@modified` — settings you have changed from default
- `@lang:python` — settings specific to Python

## Quick Reference

### Settings File Locations

| Scope | Location |
|---|---|
| User (global) | Mac: `~/Library/Application Support/Code/User/settings.json` |
| User (global) | Linux: `~/.config/Code/User/settings.json` |
| Workspace | `<project-root>/.vscode/settings.json` |
| Snippet (global) | Mac: `~/Library/Application Support/Code/User/snippets/` |
| Snippet (language) | `<snippet-dir>/<language>.json` |
| Extensions recommendation | `<project-root>/.vscode/extensions.json` |

### Snippet Syntax

| Syntax | Meaning |
|---|---|
| `$1`, `$2` | Tab stop (numbered order) |
| `$0` | Final cursor position |
| `${1:text}` | Tab stop with placeholder text |
| `${1:Name}` (repeated) | Linked tab stop (all instances update together) |
| `${1\|a,b,c\|}` | Tab stop with dropdown choices |
| `$TM_FILENAME` | Current filename variable |
| `$CURRENT_YEAR` | Current year |

## Common Patterns

### Format on Save for Some Languages but Not All

```json
{
  "editor.formatOnSave": false,
  "[typescript]": { "editor.formatOnSave": true },
  "[javascript]": { "editor.formatOnSave": true },
  "[python]": { "editor.formatOnSave": true },
  "[json]": { "editor.formatOnSave": true }
}
```

This disables format-on-save globally but enables it only for specific languages.

### Create a Project-Specific Profile

1. Set up the workspace settings, install the required extensions, and configure keybindings for the project.
2. Create a profile named after the project.
3. Export the profile to `.code-profile` and commit it (optionally, or share via a team link).
4. Teammates import the profile for an identical starting environment.

### Use Workspace Settings to Override Tabs for a Specific Project

User settings might have `"editor.tabSize": 2`, but a legacy project requires 4-space tabs.

In `.vscode/settings.json`:
```json
{
  "editor.tabSize": 4,
  "editor.insertSpaces": true
}
```

This overrides your global setting only for this workspace.

### Add a Snippet for a Boilerplate File Header

```json
"File header": {
  "prefix": "header",
  "body": [
    "/**",
    " * @file ${TM_FILENAME}",
    " * @description ${1:Module description}",
    " * @author ${2:Your Name}",
    " * @created $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
    " */"
  ]
}
```

## Troubleshooting

**Format on save runs but does not format the file.**
Cause: No default formatter is set for the language, or two formatters are conflicting.
Fix: Open Command Palette and run "Format Document With..." to see available formatters. Then set `"editor.defaultFormatter"` in settings for that language.

**Snippets do not appear in IntelliSense when typing the prefix.**
Cause: `"editor.suggestSnippets"` may be set to `"none"`, or Quick Suggestions are disabled.
Fix: Set `"editor.quickSuggestions": { "other": true }` and `"editor.suggestSnippets": "inline"` or `"top"`.

**Workspace settings are not being applied.**
Cause: The `.vscode/settings.json` file is in the wrong directory, or the folder is not the workspace root.
Fix: Confirm the file is at the exact root of the opened folder. In a multi-root workspace, settings in each folder's `.vscode/` only apply to that folder.

**Profile switch resets extensions to unexpected state.**
Cause: Each profile manages its own extension list. Extensions enabled in one profile may be disabled in another.
Fix: Open the Extensions panel, click the profile icon button, and add needed extensions to the current profile.

**Recommended extensions prompt does not appear for teammates.**
Cause: The `extensions.json` file path is wrong, or VS Code's workspace trust is blocking it.
Fix: Confirm the file is at `.vscode/extensions.json`. Ask teammates to trust the workspace when prompted.

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering settings.json hierarchy, profiles, snippets, per-language formatters
- Includes .vscode/extensions.json for teams and @tag:advanced settings filter
- Snippet syntax reference with practical TypeScript and Python examples
