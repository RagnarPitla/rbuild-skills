---
name: claude-code-custom-commands
description: "Create reusable slash commands for Claude Code by placing markdown files in .claude/commands/ or ~/.claude/commands/. Use when user says 'create a custom command', 'add a slash command', 'make a reusable prompt', 'share commands with my team', 'automate my workflow with commands'."
tab: claude-code
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, claude-code, custom-commands, productivity]
---

# Claude Code Custom Commands

Custom slash commands let you package frequently-used prompts into reusable commands that work in any Claude Code session. Drop a markdown file in the right directory and the filename becomes your slash command.

There are two scopes: project-scoped commands live in `.claude/commands/` and get committed to git so your whole team shares them. User-scoped commands live in `~/.claude/commands/` and are available across all your projects.

## Triggers

- "How do I create a custom slash command in Claude Code?"
- "I want to share reusable prompts with my team"
- "Create a /commit command that always writes good commit messages"
- "How do I make a /review command for code review?"
- "Add a slash command for my daily standup"
- "How do I pass arguments to a custom command?"

## How It Works

1. **Choose your scope.** For team-shared commands, use `.claude/commands/` in your project root. For personal commands available everywhere, use `~/.claude/commands/`.

2. **Create a markdown file.** The filename (without `.md`) becomes the slash command name. `review.md` creates `/review`. `standup.md` creates `/standup`.

3. **Write your prompt in the file.** Plain markdown. Claude reads the entire file as the instruction when you invoke the command.

4. **Use `$ARGUMENTS` for dynamic input.** When you type `/review src/api.ts`, the string `src/api.ts` replaces every occurrence of `$ARGUMENTS` in your command file.

5. **Invoke from Claude Code.** Type `/` in the Claude Code prompt and your commands appear in autocomplete. Select and run.

6. **Commit project commands to git.** Anyone who clones the repo gets the same commands automatically. No setup required.

```bash
# Create project-scoped commands directory
mkdir -p .claude/commands

# Create a commit command
cat > .claude/commands/commit.md << 'EOF'
Review all staged changes with `git diff --cached`. Write a conventional commit message following the format: type(scope): description. Types: feat, fix, docs, chore, refactor, test. Keep the subject under 72 characters. Add a body explaining WHY if the change is non-obvious. Then run the commit.
EOF

# Create a review command with arguments
cat > .claude/commands/review.md << 'EOF'
Review the file $ARGUMENTS for:
1. Logic errors and edge cases
2. Security vulnerabilities (injection, auth bypass, data exposure)
3. Performance issues (N+1 queries, missing indexes, memory leaks)
4. Missing error handling
5. Code style and readability

Provide specific line references for each issue found. Rate severity: critical, major, minor.
EOF

# Create user-scoped standup command (available everywhere)
mkdir -p ~/.claude/commands
cat > ~/.claude/commands/standup.md << 'EOF'
Run `git log --since="yesterday" --author="$(git config user.name)" --oneline` to get my commits. Then check open PRs with `gh pr list --author=@me`. Summarize what I did yesterday, what I'm doing today, and flag any blockers. Format as a standup message I can paste into Slack.
EOF
```

## Quick Reference

| Location | Scope | Git-committed | Example |
|----------|-------|--------------|---------|
| `.claude/commands/` | Project | Yes (recommended) | `/commit`, `/review` |
| `~/.claude/commands/` | User (global) | No | `/standup`, `/explain` |

| Feature | Syntax | Example |
|---------|--------|---------|
| Static command | Just write the prompt | `/deploy` runs full deploy checklist |
| Dynamic arguments | Use `$ARGUMENTS` in file | `/review src/api.ts` |
| Multi-file review | `$ARGUMENTS` passed as string | `/audit src/ tests/` |

## Common Patterns

### Pattern 1: Team Code Review Standard

Place in `.claude/commands/review.md` so every engineer uses the same review criteria.

```markdown
Perform a thorough code review of $ARGUMENTS.

Check for:
- Security: input validation, auth checks, secrets in code, SQL injection
- Logic: edge cases, null handling, error propagation
- Performance: database query patterns, unnecessary loops, caching opportunities
- Tests: coverage for happy path, error path, and edge cases
- Documentation: public API methods should have JSDoc

Format output as a structured review with sections for each category. Mark each finding as [CRITICAL], [MAJOR], or [MINOR]. End with an overall recommendation: APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION.
```

### Pattern 2: Release Notes Generator

```markdown
# .claude/commands/release-notes.md
Generate release notes for version $ARGUMENTS.

Run: `git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges`

Group commits by type:
- Features (feat:)
- Bug Fixes (fix:)
- Performance (perf:)
- Breaking Changes (BREAKING CHANGE:)

Write in a format suitable for a GitHub release. Use plain English, not commit message jargon. Target audience: technical users who need to understand what changed and why it matters.
```

### Pattern 3: Explain Any File

```markdown
# ~/.claude/commands/explain.md
Read and explain $ARGUMENTS to someone who is new to this codebase.

Cover:
1. What this file does (one sentence)
2. Key functions or classes and their purpose
3. How it connects to the rest of the system (check imports/exports)
4. Any non-obvious patterns or decisions
5. What you would need to understand to safely modify this file

Keep it concise. Use the actual code as examples.
```

### Pattern 4: Database Migration Helper

```markdown
# .claude/commands/migration.md
Create a database migration for: $ARGUMENTS

Follow the project's existing migration pattern (check existing files in db/migrations/).
Include:
- Up migration with rollback safety (add columns as nullable first)
- Down migration that fully reverses the change
- Index creation for any foreign keys or frequently queried columns
- A comment explaining why this migration exists

Name the file with today's date prefix and a descriptive slug.
```

## Troubleshooting

**Command not appearing in autocomplete**

The file must be in exactly `.claude/commands/` (relative to your git root) or `~/.claude/commands/`. Check that the file extension is `.md`. Run `ls .claude/commands/` to verify the file exists and has the correct name.

**`$ARGUMENTS` not being replaced**

`$ARGUMENTS` is case-sensitive and must be uppercase. Check there are no extra spaces or quotes around it in your command file. The entire text after the command name (including spaces) becomes the `$ARGUMENTS` value.

**Team members don't see project commands**

The `.claude/commands/` directory and its contents must be committed to git. Check `.gitignore` to make sure `.claude/` is not being ignored. Run `git status .claude/` to confirm the files are tracked.

**Command runs but ignores part of my prompt**

Claude reads the entire markdown file as the prompt. If the file is very long (over 500 lines), consider splitting it into focused commands. Avoid conflicting instructions in the same file. Use clear numbered steps for complex workflows.

**User commands conflicting with project commands**

If a user-scoped command (`~/.claude/commands/`) and a project-scoped command (`.claude/commands/`) have the same name, the project-scoped command takes precedence. Rename one of them to resolve the conflict.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
