# Blueprint — Example

## Scenario: Learning Path Feature for skills.rbuild.ai

**Who:** Ragnar Pitla, founder of RBuild.ai, building a new feature for the skills platform
**Where:** skills.rbuild.ai — a web app cataloguing Claude Code skills by domain
**The Problem:** Ragnar wants to add a learning path feature that shows users a recommended sequence for each skill domain (e.g., "Start here if you're new to MCP: mcp-server-patterns, then mcp-azure, then build-mcp"). The idea is clear in his head but undefined in terms of data model, UI flow, and build order. If he opens a Claude Code session without a plan, he will spend the first hour making architecture decisions that should have been made upfront — and burn context on things that could have been resolved in 10 minutes with a blueprint.

**Prerequisites:** A one-line objective and a rough sense of the existing codebase structure. The blueprint skill reads the project context itself if available.

---

### What You Say to the Agent

> "Blueprint a new feature for skills.rbuild.ai: learning paths for each skill domain. A learning path is a curated ordered list of skills with a recommended sequence and a short description of what you'll be able to do after each one. I need a complete multi-session build plan before I touch a line of code."

### What the Agent Does

1. **Reads the existing codebase** to understand the current data model (skills index JSON), tech stack (Next.js, TypeScript), and deployment pattern
2. **Asks three scoping questions** to eliminate ambiguity before planning: Are paths hand-curated or algorithmically generated? Is there a user account system (for tracking progress)? Is this v1 a read-only feature or does it include interactive progress tracking?
3. **Produces a phased build plan:**

```
BLUEPRINT: Learning Paths Feature — skills.rbuild.ai

OBJECTIVE: Curated, ordered skill sequences per domain with
           "what you'll be able to do" descriptions.

PHASE 1 — Data Model (Session 1, ~45 min)
  - Extend skills-index.json schema: add `learning_paths` array per domain
  - Each path: { id, title, description, skills: [skill_id], difficulty }
  - Seed 3 paths manually (MCP, Copilot Studio, D365 Dev) as v1

PHASE 2 — UI Components (Session 2, ~90 min)
  - LearningPathCard component (path title, skill count, difficulty badge)
  - LearningPathDetail page with ordered skill list and progress indicators
  - Connect to existing SkillCard component, no new design primitives needed

PHASE 3 — Navigation Integration (Session 3, ~30 min)
  - Add "Learning Paths" to domain nav
  - Add "Part of X learning path" badge on individual skill pages

PHASE 4 — Content Authoring (Session 4, ~60 min)
  - Write path descriptions for all 8 domains
  - Verify skill ordering makes pedagogical sense

DECISION LOG:
  - v1 is read-only, no user accounts needed
  - Hand-curated paths only (algorithmic generation is v2)
  - No backend changes required — static JSON is sufficient for v1
```

### The Business Impact

- **Four clean sessions instead of one chaotic one** — each session has a defined output and a stopping point
- **Architecture decisions made before coding** — the decision log prevents "wait, should this be in the database?" at 2am during session 3
- **Onboarding accelerator** — the learning path feature is the highest-requested feature from first-time visitors to skills.rbuild.ai

### Try It Yourself

> "Take Phase 2 from this blueprint and expand it into a detailed implementation plan for a single Claude Code session. Include the file paths to create, the component interface definitions, and the acceptance criteria for calling Phase 2 done."
