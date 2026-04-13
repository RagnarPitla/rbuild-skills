---
name: claude-code-subagents
description: "Spawn specialized subagents in Claude Code for parallel execution and least-privilege task isolation. Use when user says 'parallel agents', 'spawn a subagent', 'define a custom agent', 'code review agent', 'security audit agent', 'multi-agent Claude Code workflow'."
tab: claude-code
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, claude-code, subagents, multi-agent]
---

# Claude Code Subagents

Subagents are specialized Claude instances spawned by a parent session to work in parallel or handle specific tasks in isolation. Each subagent can have its own tool restrictions, system prompt, and working context. The parent session orchestrates; subagents execute.

Define persistent subagent types in `.claude/agents/<name>.md`. Spawn them via the Agent tool during a session, or use them as templates in multi-agent automation scripts.

## Triggers

- "How do I spawn a subagent in Claude Code?"
- "I want to run a code review agent in parallel with my implementation"
- "Create a security audit agent with restricted tool access"
- "How do I define custom agents in .claude/agents/?"
- "Run multiple agents in parallel on different parts of my codebase"
- "How does the Agent tool work in Claude Code?"

## How It Works

1. **Understand the execution model.** Subagents run as separate Claude API calls coordinated by the parent session. They operate with their own context window and tool access. The parent session waits for subagent results (or runs them in parallel via async dispatch) and synthesizes the outputs.

2. **Define reusable agent templates in `.claude/agents/<name>.md`.** Each file describes the agent's role, instructions, and allowed tools. The file name becomes the agent identifier. This lets you call the same specialized agent repeatedly without re-describing it.

3. **Spawn agents with the Agent tool.** During a Claude Code session, Claude itself can invoke the Agent tool to delegate tasks. Or you can ask Claude to spawn an agent: "Spawn a code review subagent to review src/api/ while we continue working on the tests."

4. **Apply least-privilege tool restrictions.** An agent that only needs to read files should not have Write or Bash access. Restrict tools in the agent definition. This prevents runaway agents from making unintended changes and keeps security boundaries tight.

5. **Use subagents for parallelism.** The parent session can dispatch multiple agents simultaneously. Each agent works on its task and returns results. The parent synthesizes them. This is much faster than sequential execution for independent tasks.

6. **Aggregate and synthesize results in the parent.** Subagents return their findings to the parent session. The parent decides what to do with the results: merge code, create a report, commit changes, trigger next steps.

```bash
# Create the agents directory
mkdir -p .claude/agents

# Define a code review agent (read-only, no execution)
cat > .claude/agents/code-reviewer.md << 'EOF'
You are a senior code reviewer. Your job is to review code changes and provide structured feedback.

## Tools
You have access to: Read, Glob, Grep

## Review Criteria
For every file changed, evaluate:
1. Logic correctness and edge case handling
2. Security vulnerabilities (injection, auth bypass, data exposure, secrets in code)
3. Performance issues (N+1 queries, missing indexes, inefficient algorithms)
4. Error handling completeness
5. Test coverage adequacy
6. TypeScript type safety

## Output Format
Return a structured review with:
- SUMMARY: One paragraph overall assessment
- CRITICAL: Issues that must be fixed before merge (list each with file:line)
- MAJOR: Issues that should be fixed (list each with file:line)
- MINOR: Suggestions for improvement
- RECOMMENDATION: APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION
EOF

# Define a security audit agent
cat > .claude/agents/security-auditor.md << 'EOF'
You are a security engineer specializing in application security.

## Tools
You have access to: Read, Glob, Grep, Bash (read-only commands: cat, grep, find, ls, git log)

## Audit Scope
Scan for:
- Hardcoded secrets and credentials
- SQL injection vulnerabilities
- XSS and output encoding issues
- Insecure direct object references
- Missing authentication or authorization checks
- Dependency vulnerabilities (check package.json for known-vulnerable packages)
- Insecure file operations
- Unvalidated user input reaching dangerous functions

## Output Format
Return a prioritized list of findings.
Each finding: severity (CRITICAL/HIGH/MEDIUM/LOW), location (file:line), description, recommended fix.
EOF

# Define a test writer agent
cat > .claude/agents/test-writer.md << 'EOF'
You are a test engineer. Your job is to write comprehensive tests for code that lacks coverage.

## Tools
You have access to: Read, Glob, Grep, Write, Edit, Bash (npm test, npx vitest)

## Testing Philosophy
- Write tests that verify behavior, not implementation
- Test happy path, error path, and edge cases
- Use the existing test patterns in the project (check existing test files first)
- Tests must pass before you finish

## Output
Write the test files, run them, and confirm they pass.
Report: files created, test count, all-pass confirmation.
EOF
```

## Quick Reference

| Agent definition location | Scope |
|--------------------------|-------|
| `.claude/agents/<name>.md` | Project-scoped (git-committed) |
| `~/.claude/agents/<name>.md` | User-scoped (all projects) |

| Tool restriction | Use case |
|-----------------|---------|
| Read, Glob, Grep only | Audit agents, review agents |
| Read, Write, Edit | Implementation agents (no Bash) |
| All tools | Full-capability agents |
| Bash (read-only commands) | Analysis agents that need git/find |

| Pattern | When to use |
|---------|------------|
| Parallel agents | Independent tasks with no shared state |
| Sequential agents | Tasks where output of one feeds the next |
| Specialized agents | Domain-specific work needing focused context |
| Least-privilege agents | Untrusted or potentially risky task execution |

## Common Patterns

### Pattern 1: Parallel Review and Implementation

While one agent reviews a PR for quality issues, another agent writes tests for the new code. Both work simultaneously.

```
"I'm going to implement the new billing module. While I write the code,
spawn two parallel subagents:
1. code-reviewer: review any new files I create in src/billing/ and flag issues
2. test-writer: write tests for each new function I add

When I finish the implementation, synthesize both agents' findings and create a summary."
```

### Pattern 2: Security Scan Before Every PR

Trigger the security auditor as a pre-commit step.

```bash
# .claude/commands/pre-pr.md
Before we create the PR, spawn a security-auditor subagent to scan all changed files.
Run: git diff main --name-only to get the list of changed files.
Pass that list to the security auditor.
If any CRITICAL or HIGH findings come back, address them before proceeding.
Then show me the audit report.
```

### Pattern 3: Codebase-Wide Analysis Pipeline

Dispatch multiple specialized agents to analyze different aspects of the codebase in parallel.

```
"Run a full codebase health check. Spawn these agents in parallel:
1. security-auditor: scan all files in src/ for security issues
2. code-reviewer: identify the top 5 highest-risk files in terms of code quality
3. A custom agent with Read/Grep access: find all TODO and FIXME comments and categorize them

Collect all three reports and produce a single prioritized action plan."
```

### Pattern 4: Least-Privilege Experimental Agent

When you want Claude to explore a risky approach (like refactoring a critical module), use a sandboxed agent with no write access for the exploration phase.

```
"Spawn a read-only agent (Read, Glob, Grep tools only) to explore how we would
migrate from Express to Fastify. The agent should:
1. Map all Express-specific code in the codebase
2. Identify all route handlers, middleware, and plugins
3. Write a detailed migration plan

Do NOT make any changes. Return the migration plan only."
```

Once you review and approve the plan, a second agent with Write access executes it.

## Troubleshooting

**Agent tool not available in my session**

The Agent tool is available in Claude Code sessions with sufficient capability. If you do not see it, check that you are using a recent version of Claude Code (`claude --version`). The tool may also be restricted in your organization's settings configuration.

**Subagent runs but ignores the agent definition file**

Verify the file is in `.claude/agents/` (relative to your git root) and ends in `.md`. The filename (without `.md`) should match exactly what you specify when spawning. If the agent definition is not loading, try referencing it explicitly in your spawn request.

**Subagent has access to tools I restricted**

Tool restrictions in agent definition files are advisory guidance to Claude about what it should use. For hard enforcement, configure tool restrictions in `.claude/settings.json` using the hooks system. If you need true sandboxing, use worktrees combined with `--allowedTools` in headless mode.

**Parallel agents conflicting on shared files**

This happens when two agents write to the same file simultaneously. Design your task decomposition so each agent owns distinct files. If overlap is unavoidable, have one agent write and another only read. Or use worktrees to give each agent a fully isolated filesystem.

**Subagent context lost between dispatches**

Each subagent call is a fresh context. Pass all relevant context explicitly in the spawn prompt. If a subagent needs results from a previous subagent, the parent session must retrieve and pass that output explicitly when spawning the next agent.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-13 | Initial release |
