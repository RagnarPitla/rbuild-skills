# Build MCP — Example

## Scenario: First MCP Server Exposing D365 F&O Inventory On-Hand Data

**Who:** James Okafor, Developer, Microsoft partner ISV team
**Where:** Building a Claude Code agent integration; needs D365 F&O inventory on-hand data available as agent tools — first time building anything with MCP
**The Problem:** James's team has a Claude Code agent that needs to answer questions like "how much of Part #A4821 do we have on hand across all warehouses?" The data lives in D365 F&O via OData. James knows TypeScript but has never built an MCP server. He needs a production-ready server in 2 days before the sprint demo.

**Prerequisites:** D365 F&O environment with OData endpoint access; Node.js 18+; D365 app registration in Azure AD with inventory read permissions.

---

### What You Say to the Agent

> "I need to build an MCP server in TypeScript that exposes D365 F&O inventory on-hand data as tools for a Claude Code agent. I've never built MCP before. The agent needs to query on-hand quantities by item number and warehouse. D365 OData endpoint is available. Walk me through building this from scratch."

### What the Agent Does

1. Scaffolds the project structure using the official MCP TypeScript SDK: `npm init`, installs `@modelcontextprotocol/sdk`, `axios` for HTTP, `zod` for input validation, and `dotenv` for secrets management

2. Generates the core server file with two tools:
   - `get_inventory_onhand` — accepts `itemId` (required) and `warehouseId` (optional), queries the `InventOnHandEntries` OData entity, returns on-hand quantity, reserved quantity, and available physical by warehouse
   - `list_warehouses` — no parameters, returns all active warehouse codes and names from `WMSWarehouseV2` for discovery

3. Implements the D365 OData authentication pattern using client credentials flow: Azure AD token acquisition with `client_id`, `client_secret`, `tenant_id`, and `resource` URL stored in `.env`, token cached with 55-minute refresh window to avoid per-request auth overhead

4. Adds Zod validation on all tool inputs with descriptive error messages that surface D365 field name requirements to the agent

5. Writes the `claude_desktop_config.json` snippet to wire the MCP server into Claude Code, and a README with the exact Azure AD app permission required (`InventoryOnHandV2Entity.Read`)

6. Flags the gotcha: D365 OData returns `DataArea` (legal entity) in every response — the tool filters by the `dataAreaId` from the `.env` to prevent cross-company data leakage

### The Business Impact

- **MCP server running in 4 hours** instead of James spending 2 days reading documentation
- **Production patterns from day one** — token caching, Zod validation, and company isolation are in the first build, not added after a security review
- **Agent demo succeeds** — Claude Code can answer "how much of Part #A4821 do we have in warehouse MW-03?" by calling the tool directly
- **Pattern reusable** across 6 other D365 entities the team needs to expose in the next sprint

### Try It Yourself

> "I want to build an MCP server that exposes D365 F&O purchase order data — specifically, the ability to query open POs by vendor and check expected delivery dates. I have OData access. What does the tool definition and input schema look like?"
