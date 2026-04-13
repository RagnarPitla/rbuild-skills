---
name: "mcp-server-patterns"
slug: "mcp-server-patterns"
description: "Production patterns for MCP servers. Tool chunking, streaming, error handling, caching, rate limiting, stateful vs stateless design, and batching for ERP systems. Use when user says 'MCP server best practices', 'how to handle large data in MCP', 'MCP caching strategy', 'MCP rate limiting', 'stateful MCP server', 'optimize MCP server for ERP performance'."
tab: "business"
domain: "mcp"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "mcp", "patterns", "caching"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Node.js TypeScript SDK"
mcp_tools: []
---



# MCP Server Patterns

## What This Skill Does

Production MCP servers hit patterns that tutorials don't cover: ERP systems returning 50,000 records, agents making 100 tool calls per minute, stale cached data causing wrong answers, and tool descriptions so similar the LLM keeps picking the wrong one. This skill covers the patterns that make the difference between a demo and a production system.

## Triggers

- "MCP server best practices"
- "how to handle large data in MCP"
- "MCP caching strategy"
- "MCP rate limiting"
- "stateful MCP server"
- "optimize MCP server for ERP performance"
- "mcp server patterns"
- "MCP production patterns"

## Key Concepts

### Pattern Decision Matrix

| Challenge | Pattern | When to Use |
|---|---|---|
| ERP returns too many records | Tool chunking with pagination | List operations returning >100 records |
| Repeated identical queries | Response caching with TTL | ERP master data (vendors, items, customers) |
| Agent hammers the API | Rate limiting per session | Production systems where agent can loop |
| Multiple related queries needed | Batching | Fetching details for a list of IDs |
| Context across multiple turns | Stateful session | Multi-step workflows (order creation wizard) |
| Large payload, slow response | Streaming | Long-running queries, large reports |

## Core Tasks

### 1. Tool Chunking for Large Data

```
GIVEN ERP query returns more records than useful for an agent
WHEN skill applies chunking pattern
THEN cap results at sensible limit (50-200 records)
AND tell agent to filter more specifically if needed
AND never return raw full datasets
```

### 2. Response Caching

```
GIVEN same data queried repeatedly
WHEN skill applies cache pattern
THEN cache with appropriate TTL per data type
AND invalidate on known write operations
AND never cache financial balances or real-time inventory
```

### 3. Rate Limiting

```
GIVEN agent could make unlimited tool calls
WHEN skill applies rate limiting
THEN limit per session and per time window
AND return informative rate limit message
AND log when limits are hit
```

## Pattern 1: Tool Chunking

Return useful subsets, not full datasets:

```typescript
server.tool(
  'list_open_invoices',
  'List open vendor invoices. Returns up to 50 most recent. ' +
  'If you need more, filter by vendor, date range, or amount.',
  {
    vendor_id: z.string().optional().describe('Filter by vendor account number'),
    date_from: z.string().optional().describe('ISO date string, e.g. "2026-01-01"'),
    date_to: z.string().optional().describe('ISO date string, e.g. "2026-03-31"'),
    max_results: z.number().min(1).max(100).optional().default(50),
  },
  async ({ vendor_id, date_from, date_to, max_results = 50 }) => {
    const filters: string[] = ['InvoiceStatus eq \'Open\''];
    if (vendor_id) filters.push(`VendorAccountNumber eq '${vendor_id}'`);
    if (date_from) filters.push(`InvoiceDate ge ${date_from}T00:00:00Z`);
    if (date_to) filters.push(`InvoiceDate le ${date_to}T23:59:59Z`);

    const url = `/data/VendorInvoiceHeaderEntity?` +
      `$filter=${encodeURIComponent(filters.join(' and '))}` +
      `&$top=${max_results}&$orderby=InvoiceDate desc` +
      `&$select=InvoiceId,VendorAccountNumber,InvoiceAmount,InvoiceDate`;

    const response = await d365Client.get(url);
    const total = response['@odata.count'] ?? response.value.length;

    const lines = response.value.map((inv: any) =>
      `${inv.InvoiceId} | ${inv.VendorAccountNumber} | $${inv.InvoiceAmount} | ${inv.InvoiceDate.split('T')[0]}`
    ).join('\n');

    const header = `Open Invoices (showing ${response.value.length} of ${total}):\n` +
      `Invoice ID | Vendor | Amount | Date\n` +
      `${'-'.repeat(60)}\n`;

    const footer = total > max_results
      ? `\n[${total - max_results} more invoices exist. Add filters to narrow results.]`
      : '';

    return { content: [{ type: 'text', text: header + lines + footer }] };
  }
);
```

## Pattern 2: Response Caching with TTL

Cache master data that rarely changes; never cache transactional data:

```typescript
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.cache.set(key, { data, expiresAt: Date.now() + (ttlSeconds * 1000) });
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) this.cache.delete(key);
    }
  }
}

const cache = new ResponseCache();

// TTL guidelines by data type
const TTL = {
  VENDOR_MASTER: 15 * 60,       // 15 min: vendor details rarely change
  ITEM_MASTER: 30 * 60,         // 30 min: product data stable
  CUSTOMER_MASTER: 15 * 60,     // 15 min: customer credit may change
  INVENTORY_ONHAND: 2 * 60,     // 2 min: inventory changes frequently
  OPEN_INVOICES: 0,             // Never cache: real-time required
  GL_BALANCES: 0,               // Never cache: financial data
};

// Usage in a tool:
const cacheKey = `vendor:${vendor_id}`;
let vendor = cache.get(cacheKey);
if (!vendor) {
  vendor = await d365Client.getVendor(vendor_id);
  cache.set(cacheKey, vendor, TTL.VENDOR_MASTER);
}
```

## Pattern 3: Rate Limiting

Protect ERP systems from agent loops:

```typescript
class RateLimiter {
  private calls = new Map<string, number[]>();

  check(sessionId: string, toolName: string, maxCalls: number, windowMs: number): boolean {
    const key = `${sessionId}:${toolName}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const callTimes = (this.calls.get(key) || []).filter(t => t > windowStart);
    callTimes.push(now);
    this.calls.set(key, callTimes);

    return callTimes.length <= maxCalls;
  }
}

const limiter = new RateLimiter();

// In tool handler:
const sessionId = req.headers['mcp-session-id'] as string || 'default';
if (!limiter.check(sessionId, 'list_open_invoices', 20, 60000)) {
  return {
    content: [{
      type: 'text',
      text: 'Rate limit reached: max 20 invoice queries per minute. ' +
            'Wait 60 seconds before trying again.'
    }]
  };
}
```

## Pattern 4: Batching

Fetch details for multiple IDs in one pass instead of N+1 calls:

```typescript
// Without batching: agent calls get_vendor 50 times for 50 vendors
// With batching: one call returns all 50 vendors

server.tool(
  'get_vendors_batch',
  'Get details for multiple vendors in one call. ' +
  'Use when you have a list of vendor IDs and need details on all of them.',
  {
    vendor_ids: z.array(z.string()).max(50)
      .describe('Array of vendor account numbers, max 50'),
  },
  async ({ vendor_ids }) => {
    // OData 'in' filter for batch lookup
    const idList = vendor_ids.map(id => `'${id}'`).join(',');
    const response = await d365Client.get(
      `/data/VendorsV2?$filter=VendorAccountNumber in (${idList})` +
      `&$select=VendorAccountNumber,VendorName,PaymentTerms,CurrencyCode`
    );

    const lines = response.value.map((v: any) =>
      `${v.VendorAccountNumber}: ${v.VendorName} | Terms: ${v.PaymentTerms} | ${v.CurrencyCode}`
    );

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);
```

## Pattern 5: Stateful Sessions for Multi-Step Workflows

When an agent needs to collect data across multiple turns before acting:

```typescript
interface WorkflowSession {
  step: string;
  data: Record<string, any>;
  createdAt: number;
}

const sessions = new Map<string, WorkflowSession>();

server.tool(
  'start_po_creation',
  'Start a new purchase order creation workflow. ' +
  'Returns a session ID to use in subsequent steps.',
  {
    vendor_id: z.string(),
    requested_by: z.string(),
  },
  async ({ vendor_id, requested_by }) => {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      step: 'header_complete',
      data: { vendor_id, requested_by, lines: [] },
      createdAt: Date.now(),
    });

    return {
      content: [{
        type: 'text',
        text: `PO creation started. Session ID: ${sessionId}\n` +
              `Vendor: ${vendor_id}\n` +
              `Next: Add line items using add_po_line with this session ID.`
      }]
    };
  }
);
```

## Pattern 6: Tool Description Engineering

The most impactful pattern. Agent selects the wrong tool when descriptions overlap:

```typescript
// WEAK: too generic, LLM confused between similar tools
server.tool('get_invoice', 'Get invoice details', { id: z.string() }, ...);
server.tool('get_po', 'Get PO details', { id: z.string() }, ...);

// STRONG: explicit disambiguation
server.tool(
  'get_vendor_invoice',
  'Get details of a VENDOR (AP) invoice by invoice ID. ' +
  'Use when the user asks about bills received from suppliers, payables, or AP invoices. ' +
  'Do NOT use for sales invoices sent to customers. Use get_customer_invoice instead.',
  { invoice_id: z.string().describe('AP invoice ID starting with "INV-" or "VINV-"') },
  ...
);

server.tool(
  'get_customer_invoice',
  'Get details of a CUSTOMER (AR) invoice by invoice ID. ' +
  'Use when the user asks about invoices sent to customers, receivables, or AR invoices. ' +
  'Do NOT use for vendor invoices. Use get_vendor_invoice instead.',
  { invoice_id: z.string().describe('AR invoice ID starting with "SINV-" or "CINV-"') },
  ...
);
```

## Checklist: Production-Ready MCP Server

- [ ] All list tools cap at 50-200 records with filter guidance
- [ ] Master data tools cache with appropriate TTL
- [ ] Financial/balance tools never cached (always fresh)
- [ ] Rate limiting applied to high-frequency tools
- [ ] Batch tools available for multi-ID lookups
- [ ] Tool descriptions include "Use when" and "Do NOT use when"
- [ ] Error messages tell the agent what to do next, not just what failed
- [ ] All inputs validated with Zod constraints (not just .string())
- [ ] Session cleanup for stateful sessions (expire after 30 min idle)
- [ ] Monitoring: track cache hit rates, rate limit events, error rates

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent makes same tool call 10+ times in a loop | Tool returns partial results, agent retries; or rate limit message not understood | Ensure response includes explicit guidance: "No more results available" or "Add filters to narrow results" |
| Cache returns wrong data after ERP update | TTL too long for the data type | Reduce TTL or add explicit cache invalidation when write tools are called (e.g., after create_po, invalidate po_list cache) |
| Rate limiting blocks legitimate multi-step workflows | Rate limits too tight for complex agent tasks | Implement per-tool limits instead of global limits; complex workflows need 20-50 calls per minute |
| Stateful sessions leak memory | Sessions never cleaned up | Run cleanup every 10 minutes: delete sessions older than 30 minutes or with no recent activity |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Complete skill content: 6 production patterns with code, decision matrix, checklist, troubleshooting |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
