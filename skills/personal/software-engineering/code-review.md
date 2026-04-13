---
name: "code-review"
slug: "code-review"
description: "Structured code review checklist covering correctness, security, performance, and maintainability. Use when user says 'review my code', 'code review checklist', 'PR review', 'what to look for in a code review', 'review this pull request', 'give feedback on my code'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "software-engineering", "code-review", "checklist"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Code Review

A code review is a quality gate, a knowledge transfer mechanism, and a team standards enforcement tool — all at once. The goal is not to find fault; it's to ship better software together.

## The Code Review Mindset

**As a reviewer:** Your job is to improve the code, not demonstrate your knowledge. Ask questions, don't lecture. Distinguish between blocking issues and suggestions.

**As an author:** You are not your code. Feedback on the code is not feedback on you. Respond to every comment, even if just to say "done" or "discussed offline."

Use prefixes to signal intent:
- `nit:` Minor style suggestion — author can ignore or accept
- `question:` Genuine question, not a critique
- `blocking:` Must be addressed before merge
- `suggestion:` Non-blocking improvement idea

## The Core Review Checklist

### Correctness
- [ ] Does the code do what the PR description says it does?
- [ ] Are edge cases handled? (empty arrays, null inputs, zero values, max values)
- [ ] Is error handling complete? (not just the happy path)
- [ ] Are there off-by-one errors in loops or array access?
- [ ] Is concurrent access safe? (shared state, race conditions)

### Security (OWASP Top 10)
- [ ] User input is validated before use (never trust client data)
- [ ] Database queries use parameterized statements (no string concatenation into SQL)
- [ ] Output is encoded before rendering in HTML (XSS prevention)
- [ ] Authentication is required where expected
- [ ] Authorization checks exist — not just "is this user logged in?" but "can this user do THIS?"
- [ ] No secrets hardcoded in source (API keys, passwords, connection strings)
- [ ] File uploads are validated (type, size, not stored in publicly accessible location)

### Performance
- [ ] No N+1 query problems (queries inside loops)
- [ ] Database queries have appropriate indexes
- [ ] No unnecessary computation in hot paths
- [ ] Caching used where appropriate (and invalidated correctly)
- [ ] No large payloads returned unnecessarily (select only needed fields)

### Maintainability
- [ ] Functions do one thing (single responsibility)
- [ ] Variable and function names are clear and descriptive
- [ ] Complex logic has comments explaining "why" (not "what")
- [ ] No copy-pasted code that should be a shared function
- [ ] Magic numbers replaced with named constants
- [ ] Code is consistent with the rest of the codebase (same patterns, same conventions)

### Tests
- [ ] New behavior has tests
- [ ] Bug fixes have a regression test
- [ ] Tests are readable and test behavior, not implementation
- [ ] Test coverage is maintained or improved

## What to Look For by PR Type

### Feature PR
Focus on: correctness, edge cases, test coverage, does it match the spec?

### Refactor PR
Focus on: behavior unchanged (tests still pass), no scope creep, coverage maintained.

### Bug Fix PR
Focus on: is the root cause addressed (not just the symptom)? Is there a regression test?

### Dependency Update PR
Focus on: changelog reviewed for breaking changes, tests still pass, no unexpected behavior changes.

## PR Description Template

Consistent PR descriptions make reviews faster. Require this format:

```markdown
## What
[1-3 sentences: what changed and why]

## How to Test
1. [Specific step]
2. [Specific step]
3. Expected: [what should happen]

## Screenshots
[Before/after for UI changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactor
- [ ] Test/docs only

## Checklist
- [ ] Tests added/updated
- [ ] No console.log or debug code left in
- [ ] No secrets committed
- [ ] Accessibility checked (for UI changes)
```

## Giving Feedback Well

**Bad feedback:**
```
"This is wrong."
"Why would you do it this way?"
```

**Good feedback:**
```
"suggestion: This could be simplified with Array.reduce — 
would remove the temporary variable. Happy to show an example 
if useful."

"question: What happens when orders is an empty array here? 
I think this throws — should we guard for it?"

"blocking: This query is vulnerable to SQL injection because 
userId is concatenated directly. Use parameterized queries: 
db.query('SELECT * FROM users WHERE id = $1', [userId])"
```

Be specific, be actionable, explain the why.

## PR Size Guidelines

| Lines Changed | Review Quality |
|---|---|
| Under 200 | Excellent — reviewer can fully understand impact |
| 200-400 | Good — manageable with context |
| 400-800 | Degrading — reviewers start skimming |
| 800+ | Poor — break it up |

If a PR must be large, provide a guided tour in the description (review file X first, then Y).

## Trigger Phrases

- "review my code"
- "code review checklist"
- "PR review"
- "what to look for in a code review"
- "review this pull request"
- "give feedback on my code"
- "code review best practices"
- "how to review a PR"

## Quick Example

> See `code-review-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Reviews are too slow | PRs are too large | Enforce PR size limit (400 lines); split large features into multiple PRs |
| Reviewers miss security issues | No structured security checklist | Make the OWASP section of the checklist mandatory; add security to PR template |
| Feedback causes conflict | Comments feel personal not technical | Add the nit/question/blocking prefix system to team norms; model the behavior as a reviewer |
| Authors ignore suggestions | Suggestions not actionable | Every comment should include a specific alternative, not just identification of the problem |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
