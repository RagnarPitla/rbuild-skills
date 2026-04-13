# VS Code Debugging — Example

## Scenario: Node.js API Returning Wrong Data for Specific Users

**Who:** Marcus Webb, Full-Stack Developer, building a B2B SaaS product. Three years of experience, mostly using `console.log` for debugging.
**Where:** VS Code on Windows 11, Node.js 22 Express API, TypeScript.
**The Problem:** The `/api/orders` endpoint returns correct data for most users but returns an empty array for users whose accounts were migrated from the legacy system. The bug is intermittent and the condition is hard to reproduce with `console.log` because the logs scroll past quickly in a busy dev server.

**Prerequisites:** VS Code 1.85+, Node.js project, `.vscode/launch.json` created.

---

### What You Say to the Agent

> "I have a Node.js Express API that returns wrong data for migrated users. I need to pause execution when a specific user ID is processed so I can inspect the state. How do I set this up in VS Code?"

### What the Agent Does

1. Creates a `launch.json` configuration with `"type": "node"`, `"request": "launch"`, pointing to the Express entry file, with `"skipFiles": ["<node_internals>/**", "node_modules/**"]` to keep focus on application code.
2. Instructs Marcus to set a conditional breakpoint on the database query line: right-click gutter, "Add Conditional Breakpoint", enter `user.isMigrated === true`.
3. Explains the Variables panel: how to expand the `user` object to see every property, including the `legacyId` field that may be driving the bug.
4. Shows how to add a Watch expression: `orders.filter(o => o.userId === user.id).length` to track the count without logging.
5. Demonstrates stepping through the filter logic with `F10` (Step Over) to watch the array shrink at each condition.
6. Shows the Debug Console for running ad-hoc expressions: `JSON.stringify(user, null, 2)` to see the full user object.

### The Business Impact

- **Bug found in one session:** The conditional breakpoint reveals that migrated users have a `legacyId` field set, and the query filters by `userId` without accounting for it. Fix takes 3 lines.
- **Time saved:** Without the debugger, Marcus estimated 2+ hours of `console.log` iteration. With the conditional breakpoint, the root cause is visible in under 10 minutes.
- **No leftover debug code:** No `console.log` statements to clean up before the PR.

### Try It Yourself

> "Set up a logpoint that prints the user object and order count on every API call without pausing execution."
