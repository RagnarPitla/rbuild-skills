# GraphQL Patterns — Example

## Scenario: Copilot Studio Agent Triggering N+1 Queries on Vendor Invoices

**Who:** Mia Chen, Backend Developer at a professional services firm (building a GraphQL API layer between Copilot Studio agents and a PostgreSQL database synced from D365)
**Where:** Node.js 20, Apollo Server 4, TypeScript, PostgreSQL 15, DataLoader, Copilot Studio as the API consumer
**The Problem:** The agent fetches a vendor's invoice list with line items. The GraphQL query looks clean but generates 1 query for the vendor's invoices, then N separate queries for each invoice's line items (one per invoice). A vendor with 30 open invoices triggers 31 database queries. When Copilot Studio asks for the top 10 vendors with their open invoices, that's up to 301 queries. Response times hit 30 seconds, causing Copilot Studio to time out and return an error to the user.

**Prerequisites:** Node.js 20+, Apollo Server 4, `dataloader` npm package, PostgreSQL 15. The N+1 problem is deterministic — it appears whenever a list type contains a nested list resolver.

---

### What You Say to the Agent

> "My GraphQL API for a Copilot Studio agent is triggering N+1 queries when fetching vendor invoice lists with line items. It's causing 30-second timeouts. Help me fix this with DataLoader."

### What the Agent Does

1. **Diagnoses the N+1 pattern:** Traces the resolver chain. `vendorInvoices` resolver queries `SELECT * FROM invoices WHERE vendor_id = $1`. Then for each returned invoice, the `lineItems` resolver runs `SELECT * FROM invoice_line_items WHERE invoice_id = $1` — once per invoice. 30 invoices = 31 queries. Apollo tracing confirms: total DB time 28.4 seconds, 31 queries, all sequential

2. **Implements DataLoader for line items:**
   ```typescript
   const lineItemLoader = new DataLoader<string, LineItem[]>(
     async (invoiceIds: readonly string[]) => {
       const rows = await db.query(
         `SELECT * FROM invoice_line_items WHERE invoice_id = ANY($1)`,
         [invoiceIds]
       );
       // Group by invoice_id preserving input order
       const grouped = groupBy(rows, 'invoice_id');
       return invoiceIds.map(id => grouped[id] ?? []);
     },
     { cache: true, maxBatchSize: 100 }
   );
   ```
   One SQL query with `ANY($1)` array instead of 30 individual queries. DataLoader automatically batches all `lineItems` resolver calls that fire within a single event loop tick

3. **Creates a DataLoader factory per request:** DataLoaders are scoped to the request context (not global) to prevent data leaking between users. Creates `buildLoaders(db: DatabaseClient)` factory called in `ApolloServer.context()`. Each request gets fresh loader instances with their own in-flight batching cache

4. **Adds a persisted query for the Copilot Studio agent:** The agent always runs the same "vendor invoices with line items" query. Registers it as a persisted query with hash `sha256:abc123`. Copilot Studio sends `extensions: { persistedQuery: { sha256Hash: "abc123" } }` instead of the full query string. Reduces payload size by 340 bytes per request and enables CDN caching of the query parse result

5. **Implements query depth limiting:** Adds `graphql-depth-limit` with `depthLimit(5)` to prevent the agent (or any client) from crafting a deeply nested query that bypasses the DataLoader optimization. Any query deeper than 5 levels returns a 400 with a descriptive error

### The Business Impact

- **Query count dropped from 31 to 2** for the vendor-invoices-with-line-items query (one for invoices, one batched for all line items)
- **Response time dropped from 28,400ms to 340ms** — the Copilot Studio 30-second timeout is no longer a risk
- **D365 sync database load reduced 94%** — from 400 queries/minute peak to under 25 queries/minute; the read replica no longer shows CPU spikes during business hours

### Try It Yourself

> "The DataLoader fix eliminated the N+1 problem. But now I'm seeing a new issue: the Copilot Studio agent sometimes requests invoice data for the same vendor 5 times in a single conversation turn. The DataLoader cache only lasts one request. How do I add a short-lived Redis cache layer (30 second TTL) on top of DataLoader to deduplicate cross-request fetches?"
