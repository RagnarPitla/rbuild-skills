---
name: build-mcp
description: "Step-by-step guide to building a production-ready MCP server with Node.js/TypeScript SDK. Define tools with Zod schemas, handle auth, implement transport, deploy to Azure. Use when user says 'build an MCP server', 'how do I create an MCP server', 'MCP server TypeScript', 'write an MCP server from scratch', 'MCP Node.js SDK tutorial', 'production MCP server setup'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, mcp, typescript, azure]
requires: Node.js TypeScript SDK
mcp_tools:
  - "mcp-server-sdk"
---


# Build MCP

## What This Skill Does

Takes your requirements, what system you're connecting to and what operations agents need to perform, then walks you through building a production-ready MCP server with the TypeScript SDK. Covers project setup, tool definition with Zod schemas, authentication, transport selection, error handling, and Azure deployment.

## Triggers

- "build an MCP server"
- "how do I create an MCP server"
- "MCP server TypeScript"
- "write an MCP server from scratch"
- "MCP Node.js SDK tutorial"
- "production MCP server setup"
- "build mcp"
- "MCP server from requirements"

## Key Concepts

### MCP Server Architecture

```
+-------------------+
|   MCP Server      |
|                   |
| +--------------+  |
| | Tool: get_X  |  |  <-- What agents call
| +--------------+  |
| | Tool: get_Y  |  |
| +--------------+  |
| | Tool: post_Z |  |
| +--------------+  |
|                   |
| +---------------+ |
| | Auth Handler  | |  <-- Azure AD / API key
| +---------------+ |
|                   |
| +---------------+ |
| | Transport     | |  <-- stdio or Streamable HTTP
| +---------------+ |
+-------------------+
        |
        | API calls
        v
+-------------------+
|  Your System      |
|  (D365, DB, API)  |
+-------------------+
```

### Tool Anatomy

Every MCP tool has four parts:
1. **Name**: machine-readable identifier (snake_case)
2. **Description**: tells the LLM when and why to call this tool
3. **Input schema**: Zod schema defining required and optional parameters
4. **Handler**: async function that does the actual work and returns text/content

## Core Tasks

### 1. Project Setup

```
GIVEN user needs a new MCP server project
WHEN skill scaffolds project
THEN create TypeScript project with correct dependencies
AND set up tsconfig with module resolution
AND create index.ts with server initialization
AND add transport configuration
```

### 2. Define Tools

```
GIVEN user has list of operations agents need
WHEN skill defines tools
THEN create tool with name, description, Zod schema, handler
AND write description that guides LLM tool selection
AND validate all inputs with Zod before calling downstream API
AND format output as readable text, not raw JSON
```

### 3. Add Authentication

```
GIVEN server needs to authenticate to external system
WHEN skill adds auth
THEN implement token acquisition with caching
AND store credentials in environment variables
AND use Managed Identity in Azure production
AND handle 401 responses with clear error messages
```

## Step-by-Step Guide

### Step 1: Initialize the Project

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript ts-node @types/node
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Step 2: Create the Server

```typescript
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-erp-server',
  version: '1.0.0',
});

// Tools go here (Step 3)

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('MCP server running on stdio');
```

### Step 3: Define Your First Tool

```typescript
server.tool(
  'get_customer',
  // Description: tell the LLM when to use this tool
  'Get customer details from the ERP system including credit limit and payment terms. ' +
  'Use when the user asks about a specific customer account, credit status, or contact info.',
  {
    // Zod schema for inputs
    customer_id: z.string().describe('Customer account number (e.g. "CUST-001")'),
    include_balance: z.boolean().optional()
      .describe('Set true to include current balance. Defaults to false.'),
  },
  async ({ customer_id, include_balance }) => {
    // Validate inputs are clean before sending to API
    if (!customer_id.match(/^[A-Z0-9-]+$/)) {
      return {
        content: [{
          type: 'text',
          text: `Invalid customer ID format: ${customer_id}. Expected alphanumeric with dashes.`
        }]
      };
    }

    try {
      const customer = await erpClient.getCustomer(customer_id, include_balance);

      // Return human-readable text, not raw JSON
      return {
        content: [{
          type: 'text',
          text: [
            `Customer: ${customer.name} (${customer.id})`,
            `Status: ${customer.status}`,
            `Credit Limit: $${customer.creditLimit.toLocaleString()}`,
            `Payment Terms: ${customer.paymentTerms}`,
            include_balance ? `Current Balance: $${customer.balance.toLocaleString()}` : null,
          ].filter(Boolean).join('\n'),
        }],
      };
    } catch (error: any) {
      return handleError(error, `fetching customer ${customer_id}`);
    }
  }
);
```

### Step 4: Add Shared Error Handling

```typescript
function handleError(error: any, context: string) {
  if (error.status === 401) {
    return {
      content: [{
        type: 'text',
        text: `Authentication failed while ${context}. Check service credentials.`
      }]
    };
  }
  if (error.status === 404) {
    return {
      content: [{ type: 'text', text: `Not found while ${context}: ${error.message}` }]
    };
  }
  if (error.status === 429) {
    return {
      content: [{
        type: 'text',
        text: `Rate limited while ${context}. Try again in 30 seconds.`
      }]
    };
  }
  console.error(`Error ${context}:`, error);
  return {
    content: [{
      type: 'text',
      text: `Error while ${context}: ${error.message || 'unknown error'}`
    }]
  };
}
```

### Step 5: Switch to HTTP Transport for Production

For Azure deployment, replace stdio with Streamable HTTP:

```typescript
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000, () => console.log('MCP server listening on :3000'));
```

### Step 6: Environment Configuration

```bash
# .env (never commit this)
ERP_BASE_URL=https://your-erp.com/api
ERP_CLIENT_ID=your-app-id
ERP_CLIENT_SECRET=your-secret
ERP_TENANT_ID=your-tenant-id

# For D365 F&O specifically
D365_BASE_URL=https://your-tenant.operations.dynamics.com
```

```typescript
// Load at startup, fail fast if missing
const required = ['ERP_BASE_URL', 'ERP_CLIENT_ID'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}
```

## Production Checklist

- [ ] All tool descriptions explain when to use and when NOT to use
- [ ] All inputs validated with Zod before calling downstream APIs
- [ ] Error handling covers 401, 404, 429, and generic errors
- [ ] No credentials in code (all from environment variables)
- [ ] Token caching implemented (don't re-acquire on every call)
- [ ] Response format is human-readable text, not raw JSON dumps
- [ ] Pagination handled for list operations
- [ ] Audit logging: each tool call logged with timestamp and parameters
- [ ] Health check endpoint (for container apps)
- [ ] README documents all tools and their parameters

## Deployment to Azure

Use the `mcp-azure` skill for the full Azure Container Apps deployment pattern. Key steps:
1. Build Docker image
2. Push to Azure Container Registry
3. Deploy to Container Apps with ingress on port 3000
4. Configure Managed Identity for ERP authentication
5. Add to Claude Code or Copilot Studio as MCP server

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Zod validation passes invalid data through | Schema too permissive (z.string() accepts anything) | Add `.regex()`, `.min()`, `.max()` constraints matching your ERP's field rules |
| Agent calls tool with wrong parameter names | Parameter names not intuitive or not documented | Use `.describe()` on every Zod field; include example values in descriptions |
| stdio transport works locally, fails in Claude Desktop | MCP server not on system PATH or node not found | Use absolute paths in Claude Desktop config; test by running `which node` and using that path |
| HTTP transport hangs on large responses | Streaming not configured, response buffering | For large datasets, stream results with multiple content chunks; cap single responses at ~50KB |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Complete skill content: step-by-step guide, code examples, production checklist, troubleshooting |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
