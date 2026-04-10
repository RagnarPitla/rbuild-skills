# Caching Strategies — Example

## Scenario: MCP Server Hammered With 400 Requests/Minute for D365 Vendor Data

**Who:** Tom Bergström, Backend Developer at a logistics company (building an MCP server that connects Copilot Studio agents to D365 vendor master data)
**Where:** Node.js MCP server, D365 F&O OData API, Azure Redis Cache (Basic C1 tier), TypeScript
**The Problem:** The MCP server handles requests from 3 Copilot Studio agents querying vendor master data (vendor name, payment terms, bank accounts, preferred currency). It's getting 400 requests/minute during business hours. Each D365 OData call takes 3-4 seconds due to the F&O API's response time. Users experience 3-4 second lag on every agent interaction. The D365 API team sent an email asking why vendor lookup calls increased 800% since the MCP server launched.

**Prerequisites:** Azure Redis Cache instance (Basic C1, 1GB is sufficient for vendor master), `ioredis` npm package, Node.js 18+. Vendor master data changes once/week during a maintenance window.

---

### What You Say to the Agent

> "My MCP server is getting 400 requests/minute for the same D365 vendor master records. Response times are 3-4 seconds and the D365 team is complaining about API load. Help me implement Redis caching for vendor data."

### What the Agent Does

1. **Classifies data by volatility:** Reviews what vendor data gets requested. Vendor name, payment terms, preferred currency: change quarterly at most, safe for 24-hour TTL. Bank account details: compliance-sensitive, use 1-hour TTL. Vendor status (active/inactive/hold): can change same-day, use 5-minute TTL. Different TTLs for different fields avoids both stale data and excessive cache misses

2. **Implements a cache-aside pattern:** Creates `VendorCacheService` wrapping Redis `ioredis` client. `getVendor(vendorId)` checks Redis first with key `vendor:{vendorId}:profile`. On cache miss, fetches from D365 OData, stores result with `SET vendor:V001:profile [json] EX 86400`, and returns data. Average Redis read latency: 1.2ms vs. 3,400ms D365 call

3. **Adds cache stampede protection:** Uses a `SET vendor:{id}:lock [token] EX 5 NX` pattern (Redis NX = only set if not exists). If 50 requests arrive simultaneously for a cold cache entry, only the first acquires the lock and fetches from D365. Others wait 100ms and retry — they hit the freshly-populated cache on retry. Without this, all 50 would hit D365 simultaneously

4. **Implements cache invalidation via webhook:** D365 F&O sends a webhook to a `/cache/invalidate` endpoint when a vendor record is updated (configured via D365 Business Events). The endpoint calls `DEL vendor:{vendorId}:*` using Redis pattern delete. This ensures vendor status changes (e.g., a vendor put on hold) propagate within seconds, not hours

5. **Adds cache warming on startup:** On MCP server cold start, a background task fetches the top 200 most-queried vendor IDs (from a Redis sorted set `vendor:access_count` updated on every cache hit) and pre-populates the cache. First request after deployment now hits warm cache instead of a 3-4 second D365 call

### The Business Impact

- **Response time dropped from 3,400ms to 4ms average** for cache hits (99.7% of requests after warm-up)
- **D365 API calls reduced from 400/minute to 8/minute** — the D365 team removed the complaint; the MCP server is now a well-behaved API consumer
- **Agent conversation latency improved** — Copilot Studio users went from a 3-second pause on every vendor question to a sub-100ms response

### Try It Yourself

> "The vendor profile caching is working perfectly. Now I need to cache vendor search results — queries like 'find all active vendors in Germany with payment terms NET30.' These are more complex because the same vendor can appear in multiple search results. What's the right caching strategy for query results vs. individual records?"
