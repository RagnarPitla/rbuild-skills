# Claude Code Memory — Example

## Scenario: Onboarding Claude to a Complex Legacy Microservices Codebase

**Who:** Daniel Osei, Staff Engineer, joining a team maintaining a 6-year-old e-commerce platform with 18 microservices
**Where:** Claude Code on a large Node.js/TypeScript monorepo with inconsistent conventions across services
**The Problem:** Every new Claude session requires Daniel to re-explain the same context: which services exist, which conventions are active vs legacy, where the tests live, what the deployment process is. He spends 10-15 minutes per session just re-establishing context before Claude can be useful. Some of his teammates give Claude wrong context by accident and end up with suggestions that break the build.

**Prerequisites:** Claude Code installed, the codebase is checked out locally, project is a git repository

---

### What You Say to the Agent

> "Explore this codebase thoroughly and generate a CLAUDE.md file that captures everything you need to work effectively here. Include the real tech stack versions from package.json, the actual folder structure, the naming conventions you observe in existing code, how to run tests, and any gotchas you find. I'll review and edit it before committing."

### What the Agent Does

1. Reads `package.json` at the root and in each service directory to extract real framework and dependency versions
2. Maps the folder structure across all 18 services, identifying which follow the new pattern (src/routes, src/services, src/repositories) versus the legacy pattern (controllers/, models/)
3. Samples existing files to identify actual naming conventions: camelCase files vs kebab-case, function naming patterns, error handling patterns
4. Reads test configuration files to document how to run the full test suite vs individual service tests
5. Notes any non-obvious gotchas found in comments, READMEs, or code (e.g., a deprecated auth flow still used in 3 services)
6. Writes a `CLAUDE.md` at the project root with all findings organized under clear headers, under 200 lines

### The Business Impact

- **Time saved** — 10-15 minutes of context-setting per session eliminated, every session
- **Consistency** — all developers get the same Claude behavior; no more mismatched context between teammates
- **Accuracy** — Claude works from actual code conventions, not guessed or generic best practices

### Try It Yourself

> "Create a CLAUDE.md for a new Next.js 15 project I'm starting with TypeScript strict mode, Prisma ORM, Vitest, and a feature-based folder structure. Include conventions I should follow from the start."
