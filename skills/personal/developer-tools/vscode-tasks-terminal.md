---
name: vscode-tasks-terminal
description: "Configure tasks.json to run build scripts and automate workflows in VS Code. Use when user says 'VS Code tasks.json', 'run build task VS Code', 'VS Code terminal profiles', 'bind task to shortcut', 'VS Code integrated terminal', 'run tests from VS Code task'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, vscode, tasks, terminal]
---

# VS Code Tasks and Terminal

Tasks let VS Code run your build scripts, test runners, and linters with a keystroke. The integrated terminal gives you a full shell experience without leaving the editor, with support for multiple sessions, custom profiles, and panel layouts.

## Triggers

- "How do I configure tasks.json in VS Code?"
- "Run a build script from VS Code"
- "How do I bind a task to a keyboard shortcut?"
- "VS Code integrated terminal: splitting and profiles"
- "Set up a default test task in VS Code"
- "How do I run multiple terminal sessions in VS Code?"

## How It Works

### tasks.json Basics

Tasks live in `.vscode/tasks.json`. Create the file manually or via the Command Palette: "Tasks: Configure Task" then "Create tasks.json file from template".

**Minimal task structure:**
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build",
      "type": "shell",
      "command": "npm run build",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    }
  ]
}
```

**Run a task:** `Cmd+Shift+P` then "Tasks: Run Task" and select by label. Or press `Cmd+Shift+B` / `Ctrl+Shift+B` to run the default build task directly.

### Task Properties

**`label`:** The name shown in the task picker. Use descriptive names like "Build: TypeScript" or "Test: Unit".

**`type`:** Almost always `"shell"`. Other options: `"process"` (runs without a shell) and `"npm"` (shorthand for npm scripts).

**`command`:** The shell command to run. Can include arguments as a string or array:
```json
"command": "npx",
"args": ["tsc", "--noEmit", "--watch"]
```

**`group`:** Sets the task's group.
```json
"group": {
  "kind": "build",   // or "test"
  "isDefault": true  // makes this the default for Cmd+Shift+B or Cmd+Shift+T
}
```

**`problemMatcher`:** Tells VS Code how to parse error output and surface it in the Problems panel. Built-in matchers: `"$tsc"` (TypeScript), `"$eslint-stylish"` (ESLint), `"$gcc"` (C/C++), `"$go"` (Go).

```json
"problemMatcher": ["$tsc"]
```

For a task that produces no parsed errors but you still want VS Code to scan for problems: `"problemMatcher": []`.

**`dependsOn`:** Run another task before this one:
```json
{
  "label": "Build and Test",
  "dependsOn": ["Build: TypeScript", "Lint: ESLint"],
  "dependsOrder": "parallel"
}
```

`dependsOrder` can be `"parallel"` (run dependencies simultaneously) or `"sequence"` (run in order).

### Common Task Configurations

**TypeScript compile and watch:**
```json
{
  "label": "TypeScript: Watch",
  "type": "shell",
  "command": "npx tsc --watch",
  "isBackground": true,
  "group": "build",
  "problemMatcher": ["$tsc-watch"],
  "presentation": {
    "reveal": "silent",
    "panel": "dedicated"
  }
}
```

**ESLint on the project:**
```json
{
  "label": "Lint: ESLint",
  "type": "shell",
  "command": "npx eslint . --ext .ts,.tsx",
  "problemMatcher": ["$eslint-stylish"],
  "group": "test"
}
```

**Run Jest tests:**
```json
{
  "label": "Test: Jest",
  "type": "shell",
  "command": "npx jest --watchAll=false --coverage",
  "group": {
    "kind": "test",
    "isDefault": true
  },
  "problemMatcher": []
}
```

**Python pytest:**
```json
{
  "label": "Test: pytest",
  "type": "shell",
  "command": "python -m pytest tests/ -v",
  "group": {
    "kind": "test",
    "isDefault": true
  },
  "problemMatcher": []
}
```

**Custom shell script:**
```json
{
  "label": "Deploy: Staging",
  "type": "shell",
  "command": "${workspaceFolder}/scripts/deploy.sh",
  "args": ["--env", "staging"],
  "presentation": {
    "reveal": "always",
    "focus": true
  }
}
```

### `presentation` Options

The `presentation` key controls how the task's terminal appears:

| Key | Options | Effect |
|---|---|---|
| `reveal` | `"always"`, `"silent"`, `"never"` | When to show the terminal panel |
| `panel` | `"shared"`, `"dedicated"`, `"new"` | Terminal reuse strategy |
| `focus` | `true` / `false` | Whether to focus the terminal panel |
| `clear` | `true` / `false` | Clear the terminal before each run |
| `echo` | `true` / `false` | Show the command before running it |

### Binding Tasks to Keyboard Shortcuts

Tasks are not bound to shortcuts by default (except the default build and test tasks). To bind a specific task:

Open `keybindings.json` (`Cmd+K Cmd+S`, then click the JSON icon):
```json
[
  {
    "key": "cmd+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Deploy: Staging"
  },
  {
    "key": "cmd+shift+t",
    "command": "workbench.action.tasks.test"
  }
]
```

The `"args"` value must match the task's `"label"` exactly.

### The Integrated Terminal

`Ctrl+\`` (all platforms): Toggle the terminal panel open or closed.
`Ctrl+Shift+\`` (all platforms): Create a new terminal session.

**Split the terminal:** Click the split icon (two columns) in the terminal toolbar, or press `Cmd+\` while the terminal is focused. Panes appear side-by-side within the terminal panel.

**Switch between terminal sessions:** Click the session name in the terminal dropdown (top-right of the terminal panel) or press `Cmd+Option+Left` / `Cmd+Option+Right` to cycle.

**Rename a terminal session:** Right-click the session name in the dropdown and choose "Rename". Useful when running multiple processes simultaneously (e.g., "API Server", "Frontend", "Tests").

**Launch a terminal in a specific folder:** Right-click any folder in the Explorer panel and choose "Open in Integrated Terminal". The terminal opens with that folder as the working directory.

**Kill a terminal session:** Click the trash icon, or run "Terminal: Kill the Active Terminal Instance" from the Command Palette.

### Terminal Profiles

Terminal profiles define which shell to use and with what settings.

**Configure profiles in settings.json:**
```json
{
  "terminal.integrated.profiles.osx": {
    "zsh": {
      "path": "/bin/zsh",
      "args": ["-l"]
    },
    "bash": {
      "path": "/bin/bash",
      "args": ["-l"]
    },
    "Node REPL": {
      "path": "node",
      "args": []
    }
  },
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

For Windows:
```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Git Bash": {
      "source": "Git Bash"
    },
    "WSL": {
      "path": "wsl.exe",
      "args": []
    }
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

**Open a specific profile:** Click the dropdown arrow next to the `+` icon in the terminal panel to select a profile for the new session.

### Default Build and Test Task Setup

VS Code treats tasks with `"group": { "kind": "build", "isDefault": true }` as the default build task (`Cmd+Shift+B` / `Ctrl+Shift+B`).

Tasks with `"group": { "kind": "test", "isDefault": true }` are the default test task, but VS Code does not assign a built-in shortcut to it. Bind it manually:
```json
{
  "key": "cmd+shift+u",
  "command": "workbench.action.tasks.test"
}
```

Only one task per group can be `"isDefault": true`. If multiple tasks are marked as default in the same group, VS Code prompts you to choose when the shortcut is pressed.

## Quick Reference

### Task Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+Shift+B` / `Ctrl+Shift+B` | Run default build task |
| `Cmd+Shift+P` then "Tasks: Run Task" | Pick and run any task |
| `Cmd+Shift+P` then "Tasks: Restart Running Task" | Restart a background task |
| `Cmd+Shift+P` then "Tasks: Terminate Task" | Kill a running task |

### Terminal Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+\`` | Toggle terminal panel |
| `Ctrl+Shift+\`` | New terminal session |
| `Cmd+\` (in terminal) | Split terminal |
| `Cmd+Option+Left/Right` | Cycle between sessions |

## Common Patterns

### Parallel Build Pipeline (TypeScript + ESLint)

```json
{
  "label": "CI: Check",
  "dependsOn": ["TypeScript: Compile", "Lint: ESLint"],
  "dependsOrder": "parallel",
  "group": {
    "kind": "build",
    "isDefault": true
  },
  "problemMatcher": []
}
```

Running `Cmd+Shift+B` now compiles TypeScript and runs ESLint simultaneously. Errors from both appear in the Problems panel.

### Watch Mode Task That Runs Silently

```json
{
  "label": "TypeScript: Watch",
  "type": "shell",
  "command": "npx tsc --watch --noEmit",
  "isBackground": true,
  "problemMatcher": {
    "base": "$tsc-watch",
    "background": {
      "activeOnStart": true,
      "beginsPattern": "Starting compilation",
      "endsPattern": "Found \\d+ errors"
    }
  },
  "presentation": {
    "reveal": "silent",
    "panel": "dedicated"
  }
}
```

This runs in a dedicated background terminal without stealing focus every time it recompiles.

### Run Multiple Services at Startup

Use VS Code's `"runOptions": { "runOn": "folderOpen" }` to start tasks automatically:
```json
{
  "label": "Start: API Server",
  "type": "shell",
  "command": "npm run dev:api",
  "isBackground": true,
  "runOptions": {
    "runOn": "folderOpen"
  },
  "presentation": {
    "reveal": "silent",
    "panel": "dedicated"
  },
  "problemMatcher": []
}
```

Enable auto-run via Command Palette: "Tasks: Manage Automatic Tasks in Folder" then "Allow Automatic Tasks in Folder".

## Troubleshooting

**Task runs but errors are not shown in the Problems panel.**
Cause: The `problemMatcher` is not configured or does not match the error format.
Fix: Set the correct built-in matcher (`$tsc`, `$eslint-stylish`, etc.) or define a custom one with regex patterns. Test by running the command manually in the terminal and comparing the output format to the matcher.

**Default build task shortcut prompts to choose a task instead of running.**
Cause: Multiple tasks are marked with `"isDefault": true` in the build group.
Fix: Set `"isDefault": true` on only one task in each group. Remove it from the others or omit the property entirely.

**Terminal profile does not appear in the dropdown.**
Cause: The `profiles` key is set for the wrong platform (e.g., `profiles.osx` on Windows).
Fix: Use `terminal.integrated.profiles.osx` on Mac, `terminal.integrated.profiles.linux` on Linux, and `terminal.integrated.profiles.windows` on Windows.

**Task silently fails with exit code 127.**
Cause: The command is not found in the shell's PATH as seen by VS Code.
Fix: Use the full path to the executable or ensure your shell profile (`.zshrc`, `.bashrc`) is loaded. In the task, set `"options": { "env": { "PATH": "/usr/local/bin:${env:PATH}" } }`.

**Background task keeps restarting unexpectedly.**
Cause: The `beginPattern`/`endPattern` in the background problemMatcher are matching lines they should not.
Fix: Refine the regex patterns to be more specific. Test them against the actual terminal output using a regex tester.

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering tasks.json, task types, groups, dependsOn, problemMatcher
- Terminal profiles for Mac, Windows, and Linux
- Keyboard shortcut binding for tasks
- Background watch tasks and parallel pipelines
