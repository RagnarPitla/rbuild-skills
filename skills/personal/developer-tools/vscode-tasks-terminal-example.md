# VS Code Tasks and Terminal — Example

## Scenario: Automating a Multi-Step Build and Lint Pipeline for a TypeScript Monorepo

**Who:** Elena Vasquez, DevOps-leaning Developer, responsible for developer experience at a mid-size e-commerce company. The frontend team of 8 developers works in a TypeScript monorepo with 3 packages.
**Where:** VS Code on macOS, TypeScript monorepo with packages: `core`, `api`, and `web`. Each package has its own build and lint scripts.
**The Problem:** Developers run three separate terminal commands before every PR: `npm run build` in `core`, `npm run lint` in `api`, and `npm run test` in `web`. They forget steps, run them in the wrong order, and waste time context-switching between terminal windows. Elena wants a single keystroke to run the entire pre-PR check pipeline.

**Prerequisites:** VS Code 1.85+, Node.js monorepo with package-level npm scripts.

---

### What You Say to the Agent

> "I want a single keyboard shortcut that builds the `core` package, then in parallel runs lint on `api` and tests on `web`. All errors should appear in the Problems panel. How do I set this up with tasks.json?"

### What the Agent Does

1. Creates `.vscode/tasks.json` with individual tasks for each step: "Build: Core" (`npm run build --workspace=core`, `problemMatcher: ["$tsc"]`), "Lint: API" (`npm run lint --workspace=api`, `problemMatcher: ["$eslint-stylish"]`), and "Test: Web" (`npm run test --workspace=web`, `problemMatcher: []`).
2. Creates a compound task "CI: Pre-PR Check" that has `"dependsOn": ["Build: Core"]` with `"dependsOrder": "sequence"`, then a second compound task that runs Lint and Test in parallel after core builds.
3. Marks "CI: Pre-PR Check" as the default build task with `"group": { "kind": "build", "isDefault": true }`.
4. Adds a `keybindings.json` entry binding `Cmd+Shift+R` to run the "CI: Pre-PR Check" task by label.
5. Configures `"presentation": { "reveal": "always", "panel": "shared", "clear": true }` so the terminal clears before each run and shows results immediately.
6. Shows Elena how the Problems panel aggregates TypeScript compiler errors and ESLint warnings from all three packages into a single list after the pipeline completes.

### The Business Impact

- **One keystroke replaces three commands:** `Cmd+Shift+R` runs the entire pre-PR pipeline. Developers do not need to remember the sequence.
- **Faster feedback loop:** Core builds first (required), then lint and test run in parallel, cutting total pipeline time from ~90 seconds sequential to ~55 seconds.
- **Errors surfaced in Problems panel:** TypeScript errors are clickable, jumping directly to the offending file. No scrolling through terminal output.

### Try It Yourself

> "Set up a VS Code terminal profile that opens a Node.js REPL as a named session called 'Node Scratch', so I can quickly test JavaScript expressions without creating a file."
