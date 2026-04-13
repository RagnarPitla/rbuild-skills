# Claude Code Custom Commands — Example

## Scenario: Engineering Team Standardizes Their PR Review Process

**Who:** Priya Nair, Engineering Manager, leading a 12-person team building a SaaS billing platform
**Where:** Claude Code on a TypeScript/Node.js monorepo hosted on GitHub
**The Problem:** Every developer runs different kinds of code reviews. Some focus on security, others on performance, others just check style. The team is missing real bugs because there is no consistent review standard. New joiners don't know what to check. Writing the same review instructions repeatedly wastes time every single session.

**Prerequisites:** Claude Code installed, project is a git repository, team uses the same repo

---

### What You Say to the Agent

> "Create a /review command that any developer on my team can use. It should check TypeScript files for security issues, logic errors, and missing error handling. Include the file path as an argument so we can review specific files. Commit it to the project so everyone gets it automatically."

### What the Agent Does

1. Creates `.claude/commands/` directory in the project root if it does not already exist
2. Writes `.claude/commands/review.md` with a structured review prompt that uses `$ARGUMENTS` for the file path, covering security vulnerabilities, edge cases, missing error handling, TypeScript type safety, and test coverage gaps
3. Stages the new file with `git add .claude/commands/review.md`
4. Demonstrates the command by running `/review src/billing/invoice-service.ts` to show it works
5. Summarizes how to use it and confirms every teammate who pulls the repo gets the command automatically

### The Business Impact

- **Consistency** — every PR gets the same security and quality checks, not whatever the reviewer remembers that day
- **Speed** — developers skip the "what should I check?" overhead and get straight to meaningful review
- **Onboarding** — new team members get the team's review standards baked into their tooling from day one

### Try It Yourself

> "Create a /standup command for my personal use that checks my git commits from yesterday and open PRs, then formats a Slack-ready standup message."
