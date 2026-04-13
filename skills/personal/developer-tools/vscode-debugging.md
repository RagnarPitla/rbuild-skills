---
name: vscode-debugging
description: "Set up and use the VS Code debugger for Node.js and Python. Use when user says 'debug in VS Code', 'set breakpoints', 'launch.json setup', 'VS Code debugger', 'debug Node.js VS Code', 'debug Python VS Code'."
tab: developer-tools
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, vscode, debugging, launch-json]
---

# VS Code Debugging

Stop sprinkling `console.log` everywhere. The VS Code debugger gives you real-time variable inspection, conditional pausing, and a call stack view that shows exactly how your code got to where it is.

## Triggers

- "How do I debug in VS Code?"
- "Set up breakpoints in VS Code"
- "launch.json configuration for Node.js"
- "Debug Python in VS Code"
- "What is the difference between launch and attach in VS Code?"
- "How do I use watch expressions in VS Code?"

## How It Works

### Breakpoints

Click in the gutter (the space to the left of line numbers) to set a breakpoint. A red dot appears. When execution reaches that line, the debugger pauses and you can inspect state.

Types of breakpoints:

**Standard breakpoint:** Click the gutter. Pauses every time execution reaches the line.

**Conditional breakpoint:** Right-click the gutter and choose "Add Conditional Breakpoint". Enter an expression (e.g., `i > 100` or `user.id === "abc"`). The debugger only pauses when the condition is true. Invaluable for loops and high-frequency code paths.

**Logpoint:** Right-click the gutter and choose "Add Logpoint". Enter a message with expressions in curly braces: `User {user.name} logged in with role {user.role}`. Logpoints print to the Debug Console without pausing execution. No more temporary `console.log` lines to clean up later.

**Hit count breakpoint:** Right-click the gutter and choose "Add Conditional Breakpoint", then select "Hit Count". Set a number like `5` to pause only on the fifth hit.

### The Debug Toolbar

When paused, a floating toolbar appears with these controls:

| Button | Shortcut | Action |
|---|---|---|
| Continue | `F5` | Resume until next breakpoint |
| Step Over | `F10` | Run current line, stay at same level |
| Step Into | `F11` | Enter the function call on this line |
| Step Out | `Shift+F11` | Finish current function, return to caller |
| Restart | `Cmd+Shift+F5` / `Ctrl+Shift+F5` | Restart the debug session |
| Stop | `Shift+F5` | End the debug session |

### The Variables Panel

When paused, the Variables panel (left sidebar, Debug view) shows:

- **Local variables:** All variables in the current scope.
- **Closure variables:** Variables from enclosing scopes.
- **Global variables:** Top-level globals (can be noisy).

Hover over any variable in the editor to see its current value inline. Click the arrow next to an object to expand its properties.

### Watch Expressions

In the Watch panel, click the "+" icon to add an expression. VS Code evaluates it continuously as you step through code. Useful for tracking derived values, method calls, or complex expressions that do not appear as simple variables.

Examples:
- `users.filter(u => u.active).length`
- `JSON.stringify(response.headers)`
- `Date.now() - startTime`

### The Call Stack Panel

The Call Stack shows every function call that led to the current pause point. Click any frame to jump to that point in the code and inspect its local variables. This is how you trace "how did we get here?" without reading backwards through code.

### Debug Console

The Debug Console (bottom panel, appears during a debug session) accepts JavaScript expressions evaluated in the current debug context. Type any variable name or expression and press `Enter` to evaluate it.

You can also call functions: `formatDate(user.createdAt)` runs the function with the actual runtime values.

### Inline Values

VS Code shows variable values inline next to the code while paused. Enable or configure this in settings:

```json
"debug.inlineValues": "auto"
```

Options: `"on"`, `"off"`, `"auto"` (shows when the editor is not too crowded).

### launch.json Setup

Press `F5` in a project without a `launch.json` to trigger the configuration picker. VS Code offers templates for common environments. Configuration files live in `.vscode/launch.json`.

**Node.js: Launch a script**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

**Node.js: Attach to running process**
```json
{
  "name": "Attach to Node.js",
  "type": "node",
  "request": "attach",
  "port": 9229,
  "restart": true
}
```
Start your app with `node --inspect src/index.js` first, then run this config.

**TypeScript with ts-node**
```json
{
  "name": "Launch TypeScript",
  "type": "node",
  "request": "launch",
  "runtimeExecutable": "npx",
  "runtimeArgs": ["ts-node", "--esm"],
  "program": "${workspaceFolder}/src/index.ts",
  "sourceMaps": true
}
```

**Python: Launch current file**
```json
{
  "name": "Python: Current File",
  "type": "debugpy",
  "request": "launch",
  "program": "${file}",
  "console": "integratedTerminal",
  "justMyCode": true
}
```

**Python: Django or Flask**
```json
{
  "name": "Python: Django",
  "type": "debugpy",
  "request": "launch",
  "program": "${workspaceFolder}/manage.py",
  "args": ["runserver", "--noreload"],
  "django": true,
  "justMyCode": true
}
```

### Launch vs Attach

**Launch:** VS Code starts the process itself. Full control over environment, arguments, and working directory. Best for local development.

**Attach:** VS Code connects to an already-running process. Requires the process to start with debugging enabled (`--inspect` for Node.js, `debugpy.listen()` for Python). Best for debugging in Docker containers or long-running services.

### Useful `launch.json` Variables

| Variable | Value |
|---|---|
| `${workspaceFolder}` | Path to the opened workspace folder |
| `${file}` | Path of the currently active file |
| `${fileBasenameNoExtension}` | Filename without extension |
| `${env:MY_VAR}` | Value of environment variable `MY_VAR` |
| `${input:myPrompt}` | Prompts you to enter a value at launch |

## Quick Reference

### Debugging Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `F5` | Start debugging / Continue |
| `Shift+F5` | Stop debugging |
| `F9` | Toggle breakpoint on current line |
| `F10` | Step over |
| `F11` | Step into |
| `Shift+F11` | Step out |
| `Cmd+Shift+F5` / `Ctrl+Shift+F5` | Restart |
| `Cmd+K Cmd+I` / `Ctrl+K Ctrl+I` | Show hover at cursor (shows value) |

## Common Patterns

### Debug a Failing API Route

1. Open `launch.json` and add a launch config for your server.
2. Set a breakpoint inside the route handler.
3. Press `F5` to start the debug session.
4. Trigger the API request (Postman, curl, or browser).
5. Execution pauses at your breakpoint. Inspect `req.body`, `req.params`, and local variables in the Variables panel.
6. Step through the logic with `F10` until you see where the value diverges from what you expect.

### Debug a Specific Loop Iteration

1. Set a conditional breakpoint on the loop body: right-click gutter, "Add Conditional Breakpoint".
2. Enter a condition like `item.id === "problem-id"`.
3. Run the program. It skips every iteration except the one matching the condition.

### Debug a Python Script with Arguments

```json
{
  "name": "Python: With Args",
  "type": "debugpy",
  "request": "launch",
  "program": "${workspaceFolder}/scripts/process.py",
  "args": ["--input", "data.csv", "--dry-run"],
  "console": "integratedTerminal"
}
```

### Attach to a Docker Container

Start your container with debugging enabled:
```bash
docker run -p 9229:9229 myapp node --inspect=0.0.0.0:9229 src/index.js
```

Then use an attach config in `launch.json`:
```json
{
  "name": "Attach to Docker",
  "type": "node",
  "request": "attach",
  "address": "localhost",
  "port": 9229,
  "localRoot": "${workspaceFolder}",
  "remoteRoot": "/app"
}
```

## Troubleshooting

**Breakpoint shows as an empty circle (unverified).**
Cause: Source maps are missing or the file has not been loaded yet. The debugger cannot resolve the breakpoint.
Fix: Ensure `"sourceMaps": true` in `launch.json` and that your TypeScript/transpiled build includes source map files. For Node.js, add `"outFiles": ["${workspaceFolder}/dist/**/*.js"]`.

**Debugger hits breakpoints in `node_modules` instead of your code.**
Cause: `justMyCode` is not enabled.
Fix: Add `"skipFiles": ["<node_internals>/**", "${workspaceFolder}/node_modules/**"]` to your launch configuration.

**Python debugger says "No module named debugpy".**
Cause: `debugpy` is not installed in the active Python environment.
Fix: Run `pip install debugpy` in your virtual environment, then reload VS Code.

**Variables panel shows "not available" for most values.**
Cause: Code was compiled with optimizations that strip debug symbols, or you are looking at a frame that has already returned.
Fix: Build in debug mode (disable minification). Make sure you are in the correct call stack frame when inspecting variables.

**Attach config fails to connect.**
Cause: The process is not listening on the expected port, or a firewall is blocking the connection.
Fix: Confirm the process started with `--inspect` and the port matches. Run `lsof -i :9229` (Mac/Linux) or `netstat -ano | findstr 9229` (Windows) to confirm the port is open.

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering breakpoints, logpoints, watch expressions, call stack, Debug Console
- Node.js and Python launch.json configurations
- Launch vs Attach explanation
- Docker attach workflow
