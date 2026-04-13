# Claude Code Headless Mode — Example

## Scenario: Automated PR Review Bot in GitHub Actions

**Who:** Fatima Al-Hassan, DevOps Engineer, maintaining CI/CD infrastructure for a 40-person engineering team
**Where:** GitHub Actions on a TypeScript monorepo with 15 services
**The Problem:** Code reviews are a bottleneck. Senior engineers spend 2-3 hours per day reviewing PRs, mostly catching the same categories of issues: missing error handling, TypeScript `any` types, unparameterized database queries. These are mechanical checks that do not require deep domain knowledge. Fatima wants an automated first-pass review on every PR so senior engineers can focus on architecture and business logic.

**Prerequisites:** `ANTHROPIC_API_KEY` stored as a GitHub Actions repository secret, `gh` CLI available in the workflow, Claude Code installable via npm

---

### What You Say to the Agent

> "Build a GitHub Actions workflow that runs on every PR, uses claude -p in headless mode to review the changed TypeScript files, and posts the findings as a PR comment. Restrict Claude to read-only tools for security. Only review files with actual code changes, not generated files."

### What the Agent Does

1. Creates `.github/workflows/claude-review.yml` with a `pull_request` trigger on `opened` and `synchronize` events
2. Adds a job that checks out the repo with `fetch-depth: 0` so git diff has access to the base branch
3. Installs Claude Code with `npm install -g @anthropic-ai/claude-code`
4. Gets the list of changed TypeScript/JavaScript files using `git diff --name-only origin/$BASE_BRANCH...HEAD`, filters out generated files and `node_modules`
5. Calls `claude -p` with a detailed review prompt, `--allowedTools "Read,Glob,Grep"` for read-only access, and `--output-format text --bare` for clean parseable output
6. Uses the `gh pr comment` command to post the review as a comment on the PR, formatted as markdown with Critical/Major/Minor sections
7. Confirms the workflow syntax is valid and summarizes how to enable it

### The Business Impact

- **Time reclaimed** — senior engineers stop reviewing boilerplate issues; Claude catches them automatically on every PR
- **Faster feedback loop** — developers get a review within 2 minutes of opening a PR, not after waiting hours for a human reviewer
- **Consistent standards** — every PR gets the same review checklist applied, regardless of which human reviewer is assigned

### Try It Yourself

> "Write a shell script that uses claude -p to explain any build error. The script should capture the build output, pipe it to Claude with the --bare flag, and print Claude's explanation and suggested fix."
