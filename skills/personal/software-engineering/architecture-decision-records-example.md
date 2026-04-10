# Architecture Decision Records — Example

## Scenario: The MCP Transport Decision Nobody Remembers Making

**Who:** Yuki Tanaka, Tech Lead, a 6-person platform team building internal tooling for a manufacturing company
**Where:** TypeScript MCP server, Node.js SDK, deployed on Azure Container Apps
**The Problem:** Six months ago Yuki chose Streamable HTTP transport over stdio for the team's MCP server. Now the team has a new hire, a pending migration to a different host, and a vendor asking why they didn't use stdio. The same "why did we do it this way" conversation has happened four times. Nobody wrote anything down. Yuki spends 30 minutes re-explaining context she no longer fully remembers.

**Prerequisites:** None. ADRs are plain markdown files. This works in any codebase regardless of language or framework.

---

### What You Say to the Agent

> "Help me write an ADR for the decision we made six months ago to use Streamable HTTP instead of stdio transport for our MCP server. I remember the main reasons were deployment environment and multi-client support, but I want to capture this properly so the team stops relitigating it."

### What the Agent Does

1. **Reconstructs the decision context:** Asks two clarifying questions: what deployment environment was in play, and were there rejected alternatives. Yuki confirms it was Azure Container Apps (no stdin/stdout access for containerized processes) and that SSE-only transport was also considered but rejected.

2. **Generates a structured ADR** with the standard sections: Status, Context, Decision, Consequences (positive and negative), and Alternatives Considered. The draft captures:
   - Azure Container Apps does not provide a persistent stdin/stdout pipe to the host process
   - Streamable HTTP supports multiple simultaneous clients, stdio is inherently single-client
   - Rejected: SSE-only because it lacks the bidirectional streaming needed for long-running D365 OData queries

3. **Adds the "Consequences" section human writers skip:** Flags that Streamable HTTP requires the server to handle connection lifecycle (reconnects, timeouts) that stdio gets for free from the OS. This is the context that would have answered the new hire's first question.

4. **Proposes file placement and numbering:** Creates `docs/decisions/ADR-001-mcp-transport.md` and suggests a lightweight naming convention for future decisions.

5. **Drafts a one-line summary** for the decisions index: "Use Streamable HTTP transport for MCP server to support Azure Container Apps deployment and multi-client access."

### The Business Impact

- **Re-explanation time eliminated** — new hires read the ADR, the vendor question answered with a file link
- **Migration decision accelerated** — when evaluating the new host, the team knew immediately that stdio would work there, and had the documented trade-offs to evaluate against
- **Decision quality improved going forward** — writing the first ADR surfaced two undocumented constraints the team had forgotten, which became inputs to the next architectural decision

### Try It Yourself

> "We just decided to store Copilot Studio agent policy data in Dataverse instead of a separate SQL database. Write the ADR capturing that decision, including why we rejected Azure SQL and what we're accepting as trade-offs with Dataverse row limits."
