# Claude Code Hooks — Example

## Scenario: Preventing Secrets from Being Committed to a Financial Services Repo

**Who:** Marcus Chen, Senior Backend Engineer, working on a fintech startup's payment processing service
**Where:** Claude Code on a Node.js/TypeScript API repository with strict compliance requirements
**The Problem:** The team has had two incidents where API keys and database passwords were accidentally committed to git. Compliance requires an automated gate that blocks any file write containing credential patterns. They also want Prettier to auto-run after every edit so they stop arguing about formatting in code review.

**Prerequisites:** Claude Code installed, `.claude/settings.json` exists or can be created, Python 3 available on the machine

---

### What You Say to the Agent

> "Set up hooks in this project so that: 1) any file Claude tries to write gets scanned for secrets like API keys and passwords and gets blocked if found, and 2) Prettier runs automatically on any TypeScript file Claude edits. Put these in .claude/settings.json so they apply to the whole team."

### What the Agent Does

1. Reads the current `.claude/settings.json` if it exists, or prepares to create it
2. Writes a `PreToolUse` hook that intercepts every `Write` tool call, uses a Python inline script to scan the file content for common secret patterns (AWS keys, bearer tokens, password assignments, API key patterns), and exits with code 2 to block the write if any pattern matches
3. Writes a `PostToolUse` hook that fires after every `Write` or `Edit` call, extracts the file path from `CLAUDE_TOOL_INPUT`, and runs `npx prettier --write` on the file if it ends in `.ts`, `.tsx`, `.js`, or `.jsx`
4. Validates the settings JSON is syntactically correct
5. Tests by attempting to write a test file containing a fake API key, confirms the block fires, then attempts a clean file write and confirms it succeeds

### The Business Impact

- **Compliance** — secrets never reach the filesystem via Claude, satisfying SOC 2 audit requirements for automated secret scanning
- **Code quality** — formatting is no longer a code review discussion; every file is always formatted
- **Team trust** — developers can use Claude at full speed without worrying about accidental credential exposure

### Try It Yourself

> "Add a hook that logs every Bash command Claude runs to ~/.claude/audit.log with a timestamp and session ID, for security audit trail purposes."
