# Coding Standards — Example

## Scenario: Four Developers, Four Styles, One D365 MCP Server

**Who:** Keanu Makoa, Tech Lead, internal platform team at a manufacturing company (4 developers, 2 months into the project)
**Where:** TypeScript, Node.js MCP server, D365 F&O OData integration
**The Problem:** The team has been building fast. Two months in, PRs are getting messy. One developer writes 200-line functions with deeply nested logic. Another uses `snake_case` for variables while the rest use `camelCase`. Two developers name async functions `fetchData` and `getData` interchangeably. There is no lint config. Code review time has doubled because reviewers are commenting on style instead of logic.

**Prerequisites:** Node.js project with a `package.json`. The skill generates ESLint, Prettier, and TypeScript configs suited to the project's needs.

---

### What You Say to the Agent

> "Our 4-person team is building a D365 MCP server in TypeScript. After 2 months we have inconsistent naming, some functions are 200 lines, and PRs are full of style comments. Help us define and enforce coding standards so we can focus reviews on logic, not style."

### What the Agent Does

1. **Scans the existing codebase for patterns:** Reads a sample of files and catalogs the inconsistencies. Finds: 3 naming conventions in use (camelCase, snake_case, PascalCase for non-classes), async functions named with 4 different prefixes (`get`, `fetch`, `load`, `retrieve`), and an average function length of 87 lines with a maximum of 214 lines.

2. **Generates ESLint config with rationale:** Creates `.eslintrc.json` targeting the specific issues found. Sets `max-lines-per-function: 50` to force extraction. Adds `@typescript-eslint/naming-convention` rules enforcing camelCase for variables/functions and PascalCase for types/interfaces. Explains each rule so the team understands the "why" before enforcing it.

3. **Adds Prettier config:** Creates `.prettierrc` with tab width 2, single quotes, trailing commas. Adds a `format` script to `package.json`.

4. **Catches a TypeScript gap the team missed:** The codebase uses `any` in 14 places. Adds `@typescript-eslint/no-explicit-any: error` and provides the team a migration path: replace `any` with `unknown` and add a type guard, or create a proper interface for the D365 OData response shapes.

5. **Sets up a pre-commit hook:** Adds `husky` + `lint-staged` so `eslint --fix` and `prettier --write` run on staged files before every commit. PRs arrive already formatted.

6. **Proposes an async naming convention:** Standardizes on `fetch` prefix for OData calls, `get` prefix for synchronous data retrieval, `build` prefix for constructing objects. Three lines in the team wiki, enforced via a custom ESLint rule.

### The Business Impact

- **PR review time cut by 40%** — reviewers stopped commenting on formatting and naming, focused on logic and correctness
- **14 hidden type safety gaps fixed** — the `any` sweep found two places where D365 OData error responses were being silently swallowed as valid data
- **New developer onboarding faster** — the next hire read the ESLint config and knew the conventions before writing a line of code

### Try It Yourself

> "Run a style audit on this file and tell me every violation of our coding standards. For each violation, show me the fix and explain why the standard exists."
