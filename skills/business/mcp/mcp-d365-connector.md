---
name: "mcp-d365-connector"
slug: "mcp-d365-connector"
description: "Design and build an MCP server that exposes D365 F&O OData entities as agent-consumable tools with pagination, authentication, and error handling. Use when user says \"connect D365 to Claude\", \"MCP server for ERP\", \"expose D365 tools to AI agent\", \"build D365 F&O MCP server\", \"D365 OData MCP integration\", \"give my agent access to D365 data\"."
tab: "business"
domain: "mcp"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "mcp", "d365", "odata"]
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



# D365 ERP MCP Connector

Building an MCP server for D365 F&O gives every AI agent in your organization access to live ERP data through a single, maintained interface. Here's how to design and build it.

## Architecture Decision: OData vs Custom Services

D365 F&O exposes data through two main APIs:

**OData REST API:** query data entities using standard HTTP + OData syntax
- Available for all standard data entities out of the box
- Query with filters, selects, expands (joins)
- Rate limited, no real-time streaming

**Custom D365 Services:** C# classes that expose business logic as web services
- More powerful, can run business logic not exposed via OData
- Requires X++ development
- Use when OData doesn't have what you need

**Recommendation:** Start with OData. Build Custom Services only when needed.

## Key D365 OData Entities to Expose

| MCP Tool | D365 Entity | Use Case |
|---|---|---|
| `get_inventory_onhand` | `InventOnHandV2` | Stock levels by item/warehouse |
| `get_vendor` | `VendorsV2` | Vendor details, payment terms |
| `get_purchase_order` | `PurchaseOrderHeadersV2` | PO status and details |
| `get_sales_order` | `SalesOrderHeadersV2` | SO status and details |
| `get_customer` | `CustomersV3` | Customer details, credit limit |
| `get_open_invoices` | `VendorInvoiceHeaderEntity` | Open AP invoices |
| `get_gl_balance` | `LedgerTrialBalanceEntity` | GL account balances |
| `get_production_order` | `ProductionOrderHeaderEntity` | Production order status |
| `get_item_details` | `ReleasedProductsV2` | Product master data |

## Authentication

D365 OData uses Azure AD OAuth 2.0. Your MCP server needs:

1. **App registration in Azure AD:** create a service principal
2. **D365 permissions:** grant the app registration access to D365
3. **Client credentials flow:** server authenticates with client_id + client_secret

```typescript
// Token acquisition
const tokenResponse = await fetch(
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.D365_CLIENT_ID!,
      client_secret: process.env.D365_CLIENT_SECRET!,
      scope: `${process.env.D365_BASE_URL}/.default`,
    }),
  }
);
```

Store credentials in environment variables, never in code.

**Production preference:** Use Managed Identity on Azure Container Apps instead of client secrets. Eliminates secret rotation overhead entirely.

## Tool Implementation Pattern

```typescript
// Example: get_inventory_onhand tool
server.tool(
  'get_inventory_onhand',
  'Get current on-hand inventory for an item at a specific warehouse. ' +
  'Use when the user asks about stock levels, available inventory, or ' +
  'how much of an item is in stock.',
  {
    item_number: z.string().describe('The D365 item number (e.g. "ITEM-001")'),
    warehouse_id: z.string().optional()
      .describe('Warehouse ID. Omit to get totals across all warehouses.'),
  },
  async ({ item_number, warehouse_id }) => {
    const filter = warehouse_id
      ? `ItemNumber eq '${item_number}' and InventLocationId eq '${warehouse_id}'`
      : `ItemNumber eq '${item_number}'`;

    const response = await d365Client.get(
      `/data/InventOnHandV2?$filter=${encodeURIComponent(filter)}` +
      `&$select=ItemNumber,InventLocationId,AvailPhysical,UnitsId`
    );

    if (!response.value.length) {
      return {
        content: [{
          type: 'text',
          text: `No inventory found for item ${item_number}` +
                (warehouse_id ? ` at warehouse ${warehouse_id}` : '')
        }]
      };
    }

    // Format for LLM readability: avoid raw JSON dumps
    const formatted = response.value.map((r: any) =>
      `Item: ${r.ItemNumber} | Warehouse: ${r.InventLocationId} | ` +
      `Available: ${r.AvailPhysical} ${r.UnitsId}`
    ).join('\n');

    return { content: [{ type: 'text', text: formatted }] };
  }
);
```

## Pagination

D365 OData returns max 1,000 records per call. For larger datasets:

```typescript
async function getAllPages(url: string): Promise<any[]> {
  const results = [];
  let nextLink: string | null = url;

  while (nextLink) {
    const response = await d365Client.get(nextLink);
    results.push(...response.value);
    nextLink = response['@odata.nextLink'] || null;
  }

  return results;
}
```

**Important:** For agent tools, cap at 100-200 records and instruct the agent to add more specific filters. Returning 10,000 records to an agent consumes tokens, slows response, and rarely improves answer quality.

## OData Query Reference

### Common filter patterns
```
# By single field
$filter=ItemNumber eq 'ITEM-001'

# Date range
$filter=InvoiceDate ge 2026-01-01T00:00:00Z and InvoiceDate le 2026-03-31T23:59:59Z

# Status filter
$filter=PurchaseOrderStatus eq 'Backorder'

# Top N records (most recent)
$top=50&$orderby=CreatedDateTime desc
```

### Select only needed fields (reduces payload)
```
$select=PurchaseOrderNumber,VendorAccountNumber,TotalInvoiceAmount,Status
```

### Expand related entities
```
$expand=PurchaseOrderLines($select=ItemNumber,PurchasedQuantity,UnitPrice)
```

## Error Handling

D365 returns specific error codes. Handle them cleanly:

```typescript
catch (error: any) {
  if (error.status === 401) {
    return {
      content: [{
        type: 'text',
        text: 'Authentication failed. Check service principal permissions in D365.'
      }]
    };
  }
  if (error.status === 404) {
    return {
      content: [{
        type: 'text',
        text: `Record not found: ${error.message}`
      }]
    };
  }
  if (error.status === 429) {
    // Rate limited: implement exponential backoff
    await sleep(2000);
    return retry(/* ... */);
  }
  return {
    content: [{
      type: 'text',
      text: `D365 error (${error.status}): ${error.message}`
    }]
  };
}
```

## Token Caching

D365 access tokens expire every hour. Cache them to avoid redundant calls:

```typescript
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60000) {
    return tokenCache.token;
  }
  const response = await acquireNewToken();
  tokenCache = {
    token: response.access_token,
    expiresAt: Date.now() + (response.expires_in * 1000),
  };
  return tokenCache.token;
}
```

## Deployment on Azure Container Apps

```yaml
# container-app.yml key settings
properties:
  configuration:
    ingress:
      targetPort: 3000
      transport: http
    secrets:
      - name: d365-client-secret
        value: <from Key Vault>
  template:
    containers:
      - name: d365-mcp-server
        env:
          - name: D365_BASE_URL
            value: "https://your-tenant.operations.dynamics.com"
          - name: D365_CLIENT_ID
            value: "your-app-registration-id"
          - name: D365_CLIENT_SECRET
            secretRef: d365-client-secret
```

For the full Azure deployment pattern, use the `mcp-azure` skill.

## Security Checklist

- [ ] Credentials stored in environment variables, not code
- [ ] Managed Identity used in production (no client secrets)
- [ ] Private endpoint configured (D365 traffic stays internal)
- [ ] Rate limiting implemented per agent/session
- [ ] Audit logging: every tool call logged with agent identity, parameters, timestamp
- [ ] Read-only service principal (separate write principal for write tools)
- [ ] Input validation on all tool parameters (no SQL/OData injection)

## Trigger Phrases

- "connect D365 to Claude"
- "MCP server for ERP"
- "expose D365 tools to AI agent"
- "build D365 F&O MCP server"
- "D365 OData MCP integration"
- "give my agent access to D365 data"
- "D365 ERP MCP connector"
- "D365 OData as MCP tools"

## Quick Example

> See `mcp-d365-connector-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| 401 errors from D365 OData | Service principal not registered in D365, or missing D365 API permission | In D365: System Administration > Azure Active Directory applications, register the app ID and assign appropriate security role |
| OData returns 0 results for valid items | Cross-company data isolation, wrong legal entity in filter | Add `dataAreaId eq 'USMF'` (or your company) to every filter, or set default data area on the service principal |
| Pagination loop never terminates | `@odata.nextLink` loop hits deleted/moved records | Add a max-page circuit breaker (e.g., stop after 20 pages) and log when it triggers |
| Agent tool descriptions cause wrong tool selection | Multiple tools with similar purposes, vague descriptions | Add "USE THIS TOOL WHEN..." and "DO NOT USE when..." sections to every tool description |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
