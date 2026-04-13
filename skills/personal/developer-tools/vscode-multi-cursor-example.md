# VS Code Multi-Cursor Editing — Example

## Scenario: Refactoring a Component to Use a New Prop Name

**Who:** Daniela Ferreira, Mid-Level Frontend Developer, working on a design system team at a fintech company.
**Where:** VS Code on macOS, React + TypeScript component library.
**The Problem:** The design system team is renaming the `color` prop to `variant` across all button components for consistency with the new design tokens. The `Button` component file has 14 occurrences of `color` spread across the props interface, JSX, internal logic, and test assertions. Doing a global search-and-replace is too risky because `color` also appears in CSS property names like `backgroundColor` and in comments about color theory.

**Prerequisites:** VS Code 1.85+, TypeScript language extension active, a React component file open.

---

### What You Say to the Agent

> "I need to rename a prop called `color` to `variant` in my Button component, but I can't just replace all occurrences because `color` also appears in CSS properties and comments. How do I do this precisely?"

### What the Agent Does

1. Explains the difference between `Cmd+Shift+L` (literal text match, replaces everything) and `F2` Rename Symbol (scope-aware, only renames the specific symbol and its references).
2. Instructs Daniela to click on the `color` in the props interface definition (`color: ButtonColor`).
3. Presses `F2` and types `variant`. VS Code updates the prop name and all references to it in JSX (`color={theme}` becomes `variant={theme}`) while leaving `backgroundColor` and comment text untouched.
4. For cases where `F2` misses JSX spread patterns, uses `Cmd+D` to manually select the remaining occurrences one at a time, verifying each before adding the cursor.
5. Demonstrates using `Alt+Click` to place additional cursors at the exact positions in the test file where `color=` appears in Enzyme/Testing Library assertions.
6. Shows the Quick Fix lightbulb (`Cmd+.`) on the updated prop type to add a deprecation comment to the old name via a code action.

### The Business Impact

- **Zero broken CSS:** The rename does not touch `backgroundColor`, `borderColor`, or any color-related CSS properties in the file.
- **Accurate refactor:** All 14 prop references updated correctly, 0 false positives.
- **Speed:** What would have been a careful manual edit of 14 lines took under 60 seconds.

### Try It Yourself

> "I have five object literals where I need to add `isActive: false` as a new property to each. How do I do this with multi-cursor without editing each one individually?"
