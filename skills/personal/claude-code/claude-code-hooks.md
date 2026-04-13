---
name: claude-code-hooks
description: "Configure shell commands that fire at Claude Code lifecycle events: PreToolUse, PostToolUse, Notification, Stop, SubagentStop. Use when user says 'auto-run prettier after edits', 'block dangerous commands', 'send notifications when Claude finishes', 'enforce code quality automatically', 'run linter on every file change'."
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, claude-code, hooks, automation]
---

# Claude Code Hooks

Hooks are shell commands that fire at specific Claude Code lifecycle events. They run outside Claude's control, making them ideal for enforcement, side effects, and automation that should not be bypassed.

Configure hooks in `.claude/settings.json` for project-scoped rules or `~/.claude/settings.json` for global defaults.

## Triggers

- "How do I auto-run prettier every time Claude edits a file?"
- "Block Claude from running rm -rf commands"
- "Send me a desktop notification when Claude finishes a task"
- "Enforce code formatting automatically in Claude Code"
- "Run my linter every time Claude writes a TypeScript file"
- "How do hooks work in Claude Code?"

## How It Works

1. **Understand the event model.** Hooks fire at four lifecycle points. `PreToolUse` fires before Claude executes any tool (use this to block or modify). `PostToolUse` fires after a tool completes (use this for side effects like formatting). `Notification` fires when Claude sends a notification to the user. `Stop` fires when the main agent session ends. `SubagentStop` fires when a subagent session ends.

2. **Configure in settings.json.** Hooks live in the `hooks` key of your settings file. Each hook specifies a `matcher` (which tool to intercept), a `hooks` array of commands to run, and optionally a `when` condition.

3. **Control Claude's behavior with exit codes.** If your hook exits with code `2`, Claude will block the tool call and show your stderr output as the reason. Any other non-zero exit code logs a warning but does not block. Exit `0` to allow and continue.

4. **Pass context via environment variables.** Claude Code injects these into every hook: `CLAUDE_TOOL_NAME`, `CLAUDE_TOOL_INPUT` (JSON), `CLAUDE_TOOL_OUTPUT` (JSON, PostToolUse only), `CLAUDE_SESSION_ID`, `CLAUDE_CWD`.

5. **Use matchers to target specific tools.** Match on `Write`, `Edit`, `Bash`, `Read`, or any tool name. Use `*` to match all tools.

6. **Test hooks in isolation.** Hooks run as your shell user. Test your hook script directly before adding to settings to avoid surprising blocks during a session.

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q '\\.ts\"'; then npx prettier --write \"$(echo $CLAUDE_TOOL_INPUT | python3 -c 'import sys,json; print(json.load(sys.stdin).get(\"file_path\",\"\"))')\" 2>/dev/null; fi"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; cmd=json.load(sys.stdin).get('command',''); exit(2) if 'rm -rf /' in cmd or 'rm -rf ~' in cmd else exit(0)\" 2>&1 || echo 'Blocked: destructive rm command'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code finished\" with title \"Claude Code\"' 2>/dev/null || notify-send 'Claude Code' 'Task completed' 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

## Quick Reference

| Event | When it fires | Common uses | Blocking? |
|-------|--------------|-------------|-----------|
| `PreToolUse` | Before tool executes | Validate, block, log | Yes (exit 2) |
| `PostToolUse` | After tool completes | Format, lint, sync | No |
| `Notification` | When Claude notifies user | Slack/desktop alerts | No |
| `Stop` | Main session ends | Summary, cleanup | No |
| `SubagentStop` | Subagent session ends | Aggregate results | No |

| Exit Code | Meaning |
|-----------|---------|
| `0` | Allow, continue normally |
| `2` | Block tool call, show stderr to Claude |
| Any other | Log warning, continue |

| Env Variable | Content |
|-------------|---------|
| `CLAUDE_TOOL_NAME` | Name of the tool being called |
| `CLAUDE_TOOL_INPUT` | JSON of the tool's input parameters |
| `CLAUDE_TOOL_OUTPUT` | JSON of the tool's result (PostToolUse only) |
| `CLAUDE_SESSION_ID` | Current session identifier |
| `CLAUDE_CWD` | Working directory |

## Common Patterns

### Pattern 1: Auto-Format on Every File Write

Run ESLint and Prettier on any TypeScript/JavaScript file Claude writes or edits.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(echo \"$CLAUDE_TOOL_INPUT\" | python3 -c 'import sys,json; print(json.load(sys.stdin).get(\"file_path\",\"\"))'); case \"$FILE\" in *.ts|*.tsx|*.js|*.jsx) npx prettier --write \"$FILE\" 2>/dev/null && npx eslint --fix \"$FILE\" 2>/dev/null ;; esac"
          }
        ]
      }
    ]
  }
}
```

### Pattern 2: Block Secrets from Being Written

Scan any file Claude writes for hardcoded secrets before saving.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"\nimport sys, json, re\ndata = json.load(sys.stdin)\ncontent = data.get('content', '')\npatterns = [r'sk-[a-zA-Z0-9]{32,}', r'AKIA[0-9A-Z]{16}', r'password\\s*=\\s*[\\\"\\'][^\\\"\\']+']\nfor p in patterns:\n    if re.search(p, content):\n        print('Blocked: potential secret detected in file content', file=sys.stderr)\n        sys.exit(2)\n\""
          }
        ]
      }
    ]
  }
}
```

### Pattern 3: Slack Notification When Done

Post a message to Slack when Claude finishes a long task.

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST \"$SLACK_WEBHOOK_URL\" -H 'Content-type: application/json' --data '{\"text\":\"Claude Code finished task in '\"$(basename $CLAUDE_CWD)\"'\"}' 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

### Pattern 4: Log All Bash Commands for Audit Trail

Write every Bash command Claude runs to a local audit log.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SESSION=$CLAUDE_SESSION_ID CMD=$(echo $CLAUDE_TOOL_INPUT | python3 -c 'import sys,json; print(json.load(sys.stdin).get(\"command\",\"\").replace(chr(10),\" \"))' 2>/dev/null)\" >> ~/.claude/audit.log"
          }
        ]
      }
    ]
  }
}
```

## Troubleshooting

**Hook not firing at all**

Verify the settings.json file is valid JSON. A syntax error silently disables all hooks. Run `python3 -m json.tool .claude/settings.json` to validate. Also confirm the event name is spelled exactly: `PreToolUse`, `PostToolUse`, `Notification`, `Stop`, `SubagentStop` (PascalCase, case-sensitive).

**Hook fires but does not block Claude**

Blocking only works for `PreToolUse` hooks, and only when the hook exits with code exactly `2`. Exit code `1` will not block. Make sure your script outputs the reason to stderr (not stdout) since Claude displays the stderr content when explaining the block.

**Formatter runs but file shows old content**

The formatter is modifying the file on disk, but Claude's in-memory view may show the pre-format content for the current session. This is expected. The formatted content is correct on disk. Claude will read the updated file if it accesses it again in the same session.

**Hook command too complex for inline JSON**

Extract long hook logic into a shell script. Reference it from settings.json: `"command": "~/.claude/hooks/my-hook.sh"`. Make the script executable: `chmod +x ~/.claude/hooks/my-hook.sh`. This is much easier to maintain and test independently.

**Environment variables empty in hook**

Some tools only populate certain variables. `CLAUDE_TOOL_OUTPUT` is only set during `PostToolUse`. `CLAUDE_TOOL_INPUT` contains different fields depending on the tool being called. Print all environment variables in a test hook (`env | grep CLAUDE_`) to see what is available for each event.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
