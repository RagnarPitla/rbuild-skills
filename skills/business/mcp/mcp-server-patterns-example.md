# MCP Server Patterns — Example

## Scenario: Fixing 60-Second D365 MCP Response Times

**Who:** David Chen, Backend Developer, SaaS company building D365-connected agents
**Where:** MCP server in production for 3 weeks; agent is timing out on 40% of tool calls; D365 OData queries averaging 58 seconds
**The Problem:** The MCP server calls D365 OData without any caching or pagination. Every tool call fetches fresh data. The `get_open_purchase_orders` tool returns all 4,200 open POs in one response — 2.1MB of JSON — and the OData filter runs a full table scan each time. Agents are timing out and the D365 team is complaining about load spikes. Performance was fine in testing with 50 records. Production has 4,200.

**Prerequisites:** MCP server running in Node.js/TypeScript; D365 OData endpoint accessible; Redis or in-memory cache available.

---

### What You Say to the Agent

> "My MCP server hitting D365 is returning 60-second response times and timing out. The main problem is the get_open_purchase_orders tool — it's returning 4,200 records with no pagination or caching. What patterns should I apply to fix this?"

### What the Agent Does

1. Diagnoses the three root causes from the symptom description:
   - No `$top` pagination: OData returns all records, D365 runs a full table scan, response payload is 2.1MB
   - No `$select` projection: every PO field is returned including fields the agent never uses (60+ fields per record)
   - No caching: every agent call triggers a fresh D365 query even for data that changes at most once per minute

2. Applies the pagination pattern first (highest impact): rewrites the tool to accept `pageSize` (default 50, max 200) and `pageToken` parameters, uses OData `$skip` and `$top` to page, returns a `nextPageToken` in the response so the agent can request the next page if needed. Reduces average response to 1.8 seconds.

3. Applies the `$select` projection: identifies the 8 fields the agent actually uses (PO number, vendor, status, delivery date, amount, currency, buyer, site) and hard-codes them into the OData query string. Reduces payload from 2.1MB to 94KB per page.

4. Implements the caching layer with a 90-second TTL using a simple in-memory Map with timestamp tracking (no Redis dependency for quick fix): cache key is the normalized query string, stale entries are evicted on read. Reduces D365 load by 85% during peak agent usage.

5. Adds a `forceRefresh` boolean parameter to the tool so the agent can bypass cache when a user explicitly says "give me the latest data" — prevents the pattern of users getting stale answers after a PO update

6. Provides the before/after performance numbers: p50 latency drops from 58s to 1.8s, p95 drops from 120s to 4.2s, D365 OData requests per hour drops from 3,400 to 510

### The Business Impact

- **Timeout rate drops from 40% to under 1%** after pagination and caching changes
- **D365 OData load reduced by 85%** — no more complaints from the D365 team about query spikes
- **Agent answers feel instant** at 1.8s p50 versus users abandoning after 10+ seconds
- **Patterns documented** so the next 4 tools the team builds start with pagination and caching from day one

### Try It Yourself

> "My MCP server calls a vendor API that has rate limits of 100 requests per minute. The agent sometimes makes 40 tool calls in a burst and hits the rate limit. What patterns should I use to handle rate limiting gracefully without failing the agent's task?"
