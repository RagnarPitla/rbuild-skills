---
name: "D365 ERP MCP Connector"
slug: "mcp-d365-connector"
description: "Design and build an MCP server that exposes D365 F&O OData entities as agent-consumable tools with pagination and error handling."
tab: "business"
domain: "mcp"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["mcp", "d365-fno", "odata", "integration", "enterprise-ai"]
version: "1.0"
icon_emoji: "⚙️"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: "mcp-path"
learning_path_position: 5
prerequisites: ["mcp-fundamentals", "d365-navigation-fundamentals"]
references:
  - title: "D365 OData Documentation"
    url: "https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/odata"
  - title: "MCP TypeScript SDK"
    url: "https://github.com/modelcontextprotocol/typescript-sdk"
---

# D365 ERP MCP Connector

Building an MCP server for D365 F&O gives every AI agent in your organization access to live ERP data through a single, maintained interface. Here's how to design and build it.

## Architecture Decision: OData vs Custom Services

D365 F&O exposes data through two main APIs:

**OData REST API** — query data entities using standard HTTP + OData syntax
- Available for all standard data entities out of the box
- Query with filters, selects, expands (joins)
- Rate limited, no real-time streaming

**Custom D365 Services** — C# classes that expose business logic as web services
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

## Authentication

D365 OData uses Azure AD OAuth 2.0. Your MCP server needs:

1. **App registration in Azure AD** — create a service principal
2. **D365 permissions** — grant the app registration access to D365
3. **Client credentials flow** — server authenticates with client_id + client_secret

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

## Tool Implementation Pattern

```typescript
// Example: get_inventory_onhand tool
server.tool(
  'get_inventory_onhand',
  'Get current on-hand inventory for an item at a specific warehouse',
  {
    item_number: z.string().describe('The D365 item number'),
    warehouse_id: z.string().optional().describe('Warehouse ID, omit for all warehouses'),
  },
  async ({ item_number, warehouse_id }) => {
    const filter = warehouse_id
      ? `ItemNumber eq '${item_number}' and InventLocationId eq '${warehouse_id}'`
      : `ItemNumber eq '${item_number}'`;

    const response = await d365Client.get(
      `/data/InventOnHandV2?$filter=${encodeURIComponent(filter)}&$select=ItemNumber,InventLocationId,AvailPhysical,UnitsId`
    );

    if (!response.value.length) {
      return { content: [{ type: 'text', text: `No inventory found for item ${item_number}` }] };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(response.value, null, 2),
      }],
    };
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

For agent tools, cap at 100-200 records and tell the agent to filter more specifically. Returning 10,000 records to an agent is rarely useful.

## Error Handling

D365 returns specific error codes. Handle them cleanly:

```typescript
catch (error: any) {
  if (error.status === 401) {
    return { content: [{ type: 'text', text: 'Authentication failed. Check service principal permissions.' }] };
  }
  if (error.status === 404) {
    return { content: [{ type: 'text', text: `Record not found: ${error.message}` }] };
  }
  if (error.status === 429) {
    // Rate limited — implement exponential backoff
    await sleep(2000);
    return retry(/* ... */);
  }
  return { content: [{ type: 'text', text: `D365 error: ${error.message}` }] };
}
```

## Deployment

Deploy to Azure Container Apps for production (use the `mcp-azure` skill for the deployment pattern). Key configuration:

- **Managed Identity** — prefer over client secret for production
- **Private endpoint** — keep D365 traffic on internal network
- **Rate limiting** — implement per-agent rate limits to protect D365 performance
- **Audit logging** — log every tool call with agent identity and parameters
