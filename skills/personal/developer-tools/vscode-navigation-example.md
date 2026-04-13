# VS Code Navigation — Example

## Scenario: Understanding an Unfamiliar Codebase Before a Bug Fix

**Who:** Arjun Mehta, Backend Developer, joining a team mid-sprint. He is assigned a bug in a large Go codebase he has never seen before. The bug is in the payment processing flow, somewhere in the chain from API handler to database.
**Where:** VS Code on macOS, Go project with 40+ packages, Go extension installed.
**The Problem:** Arjun does not know where anything lives. He has a stack trace pointing to a function name, but he does not know which file it is in, what calls it, or what it calls. Scrolling through the Explorer panel is useless at this scale. He needs to trace the call chain from the API endpoint down to the failing database query.

**Prerequisites:** VS Code 1.85+, Go extension (or any language with a language server), a multi-file project open as a workspace folder.

---

### What You Say to the Agent

> "I'm new to a large Go codebase and I have a stack trace. The failing function is called `processPaymentTransaction`. How do I find it, understand what calls it, and trace what it calls, all without leaving VS Code?"

### What the Agent Does

1. Opens Workspace Symbol Search with `Cmd+T`, types `processPaymentTransaction`, and jumps directly to the function definition across the entire workspace, regardless of which file it lives in.
2. Uses the Outline view in the Explorer panel to show all functions in the file, giving Arjun an immediate overview of the module's structure.
3. Places the cursor on `processPaymentTransaction` and presses `Shift+F12` to open Find All References. The References panel shows every call site: the HTTP handler, a retry wrapper, and a test file.
4. Clicks the HTTP handler call site to jump to it. Uses Breadcrumbs to see the full path: `api / handlers / payments / PaymentHandler / HandlePost`.
5. Enables Sticky Scroll so that as Arjun reads deep into the function body, the function name stays pinned at the top of the editor.
6. Uses `F12` on an internal call to `validateCard` to jump to its definition. Uses `Alt+Left` to navigate back. Repeats to trace the full call chain.
7. Uses code folding (`Cmd+K Cmd+0`) to collapse all functions and get a bird's-eye view of the payment module's structure before diving back in.

### The Business Impact

- **Orientation speed:** Arjun understands the payment call chain in 15 minutes instead of a full day of reading files linearly.
- **Fewer questions to teammates:** The Find All References result shows exactly where the function is called, so Arjun does not need to ask "where is this used?"
- **Bug found faster:** Sticky Scroll and the call chain trace reveal that the database query uses a stale transaction context after a retry, which is the root cause.

### Try It Yourself

> "I want to see all the methods on the `UserService` class in a TypeScript file without reading through the whole file. What's the fastest way to get that overview?"
