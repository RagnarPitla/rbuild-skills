---
name: "mcp-azure"
slug: "mcp-azure"
description: "Deploys and updates MCP servers on Azure Container Apps using Streamable HTTP transport, with authentication, scaling, and monitoring. Step-by-step workflow for first deploy and updates. Use when user says 'deploy MCP server', 'MCP on Azure', 'Azure Container Apps MCP', 'deploy MCP to cloud', 'host MCP server'."
tab: "personal"
domain: "devops"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "devops", "mcp", "azure"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Azure CLI, Docker"
mcp_tools: []
---


# MCP on Azure

Deploy MCP servers to Azure Container Apps. Covers first-time deploy, image updates, authentication, scaling, and monitoring. Designed for Streamable HTTP transport (the modern MCP standard for cloud deployment).

## Trigger Phrases

- "deploy MCP server"
- "MCP on Azure"
- "Azure Container Apps MCP"
- "deploy MCP to cloud"
- "host MCP server"
- "update my MCP server"
- "MCP server deployment"
- "containerize MCP"

## Architecture Overview

```
Claude Code / Copilot Studio
        |
        | HTTPS (Streamable HTTP / SSE)
        v
Azure Container Apps
  - MCP Server Container
  - Ingress: HTTPS on port 443
  - Scaling: min 1, max 10 replicas
        |
        | Internal calls
        v
  - Azure Key Vault (secrets)
  - Azure Container Registry (images)
  - Downstream APIs (D365 OData, Dataverse, etc.)
```

## Prerequisites

```bash
# Install Azure CLI
brew install azure-cli

# Login
az login

# Set subscription
az account set --subscription "My Subscription"

# Install Container Apps extension
az extension add --name containerapp --upgrade
```

## First Deploy

### Step 1: Create Resource Group

```bash
RESOURCE_GROUP="rg-mcp-production"
LOCATION="eastus"

az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### Step 2: Create Container Registry

```bash
ACR_NAME="mcpregistry$(openssl rand -hex 4)"

az acr create \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku Basic \
  --admin-enabled true

# Get credentials
ACR_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)
```

### Step 3: Build and Push Image

```bash
# Build image
docker build -t $ACR_SERVER/mcp-server:latest .

# Login to ACR
docker login $ACR_SERVER -u $ACR_NAME -p $ACR_PASSWORD

# Push
docker push $ACR_SERVER/mcp-server:latest
```

### Step 4: Create Container Apps Environment

```bash
ENVIRONMENT_NAME="env-mcp-production"

az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

### Step 5: Deploy Container App

```bash
APP_NAME="mcp-server"

az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_SERVER/mcp-server:latest \
  --registry-server $ACR_SERVER \
  --registry-username $ACR_NAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 5 \
  --cpu 0.5 \
  --memory 1Gi \
  --env-vars \
    NODE_ENV=production \
    PORT=3000 \
    MCP_TRANSPORT=streamable-http
```

### Step 6: Get the URL

```bash
APP_URL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo "MCP Server URL: https://$APP_URL/mcp"
```

## Update Workflow (New Image Version)

```bash
# Build and push new version
IMAGE_TAG=$(git rev-parse --short HEAD)
docker build -t $ACR_SERVER/mcp-server:$IMAGE_TAG .
docker push $ACR_SERVER/mcp-server:$IMAGE_TAG

# Update container app to new image
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_SERVER/mcp-server:$IMAGE_TAG
```

## Authentication

### API Key Authentication (simple)

```typescript
// In your MCP server
app.use('/mcp', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.MCP_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

Set the secret in Container Apps:

```bash
az containerapp secret set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets mcp-api-key=$MCP_API_KEY

az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars MCP_API_KEY=secretref:mcp-api-key
```

### Azure Managed Identity (production-grade)

```bash
# Enable system-assigned identity
az containerapp identity assign \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --system-assigned

# Grant Key Vault access
IDENTITY_PRINCIPAL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query identity.principalId \
  -o tsv)

az keyvault set-policy \
  --name my-keyvault \
  --object-id $IDENTITY_PRINCIPAL \
  --secret-permissions get list
```

## Scaling Configuration

```bash
# Scale based on HTTP request count
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rule-name http-scaling \
  --scale-rule-type http \
  --scale-rule-metadata concurrentRequests=10
```

## Monitoring

```bash
# Stream live logs
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow

# Get recent logs
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 100
```

## MCP Server Transport Config

For Streamable HTTP transport (required for cloud deployment):

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

const app = express();
app.use(express.json());

const server = new McpServer({ name: 'my-mcp-server', version: '1.0.0' });

// Register your tools
server.tool('my-tool', { input: z.object({ query: z.string() }) }, async ({ query }) => {
  return { content: [{ type: 'text', text: await doSomething(query) }] };
});

// Mount Streamable HTTP transport
app.all('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get('/health/live', (req, res) => res.json({ status: 'alive' }));

app.listen(parseInt(process.env.PORT || '3000'));
```

## Quick Example

> See `mcp-azure-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Container exits immediately after deploy | App startup error or wrong port | Check logs with `az containerapp logs show`, verify `--target-port` matches the port your server listens on |
| MCP client gets 401 | API key not passed or misconfigured secret | Verify secret is set with `az containerapp secret list` and env var references the secret correctly |
| Scale-to-zero cold start delays | Min replicas set to 0 | Set `--min-replicas 1` for MCP servers. Cold starts break long-running agent sessions. |
| SSE connection drops | Container Apps has 4-minute idle timeout | Configure keepalive pings in your Streamable HTTP transport, or switch to stateless request/response pattern |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
