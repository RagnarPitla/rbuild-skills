# Codebase Onboarding — Example

## Scenario: Day-3 PR Review on an Undocumented Copilot Studio Integration

**Who:** David Osei, Senior Engineer, enterprise software consultancy
**Where:** TypeScript, Node.js, Copilot Studio, D365 F&O OData, 40-file repo, no README
**The Problem:** David joined a team building a Copilot Studio and D365 F&O integration. No one is available to walk him through the codebase. There is no README. The original architect left two weeks ago. On day 3, David has a PR to review that touches the MCP tool routing layer. He has read 8 files and still does not understand the data flow from Copilot Studio through to the OData calls.

**Prerequisites:** Read access to the repository. The skill works best when the agent can read multiple files to build a mental model.

---

### What You Say to the Agent

> "I'm new to this codebase. I need to review a PR by end of day but I don't understand the architecture yet. There's no README. Can you map out the codebase for me — entry points, data flow, key abstractions — so I can review the PR intelligently?"

### What the Agent Does

1. **Entry point discovery:** Scans `package.json` scripts and `src/index.ts` to identify that the server starts two listeners: an HTTP endpoint for Copilot Studio webhooks and a stdio MCP server for local tool use. Many reviewers would assume a single entry point.

2. **Data flow reconstruction:** Traces a request from the Copilot Studio webhook through `src/handlers/agentRouter.ts`, into `src/tools/`, and out via `src/d365/odataClient.ts`. Produces a plain-text flow diagram showing the five layers: webhook receiver, intent parser, tool dispatcher, OData client, response formatter.

3. **Key abstraction surfaced:** Identifies that `ToolContext` in `src/types/context.ts` is the central shared object passed through all layers. The PR being reviewed modifies `ToolContext` — understanding this object is the prerequisite for reviewing that PR safely.

4. **Hidden dependency flagged:** Notes that `src/d365/odataClient.ts` reads `process.env.D365_TENANT_ID` at startup, not at request time. If the env var is missing, the server starts cleanly but all D365 calls silently return empty arrays rather than throwing an error. This is a bug that would not be obvious from reading the PR alone.

5. **PR context provided:** Explains that the PR adds a new field to `ToolContext`. Points out that the field is read in 3 places and written in 1, and that the write happens after the read in the async flow — a potential race condition in concurrent requests.

### The Business Impact

- **PR reviewed confidently on day 3** — David caught the race condition because the agent surfaced the async execution order
- **Silent failure bug discovered as a side effect** — the missing env var issue was filed as a separate ticket and fixed before it caused a production incident
- **Onboarding time cut from weeks to hours** — the generated architecture map became the team's de facto README

### Try It Yourself

> "I need to understand how the Niyam pattern is implemented in this codebase. Show me which Dataverse tables are involved, how policies are loaded at agent startup, and where Power Automate is called to enforce a policy decision."
