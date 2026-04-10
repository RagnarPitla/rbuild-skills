# MCP Azure — Example

## Scenario: Deploying a D365 OData MCP Server to Azure Container Apps

**Who:** Priya Nair, Integration Developer at a Microsoft partner building Copilot Studio agents for a retail customer
**Where:** Local MCP server (Node.js, TypeScript) connecting to D365 OData, needs to be reachable by Copilot Studio from the cloud
**The Problem:** Priya has a working MCP server locally that exposes three D365 OData endpoints as tools: `get_sales_orders`, `get_inventory_levels`, and `get_vendor_list`. The Copilot Studio agent works perfectly in the local test harness. But Copilot Studio is a cloud service — it cannot reach `localhost:3000`. Priya needs to deploy the MCP server to Azure Container Apps with proper authentication so the agent can reach it from production, without exposing the D365 credentials publicly.

**Prerequisites:** Azure CLI installed and authenticated. The MCP server has a working `Dockerfile`. D365 credentials and the OData base URL are available as environment variables locally.

---

### What You Say to the Agent

> "Deploy my D365 MCP server to Azure Container Apps. It's a Node.js/TypeScript server using SSE transport on port 3000. It connects to D365 OData using a service principal (client ID, client secret, tenant ID). I need the deployed endpoint to be reachable by Copilot Studio. Walk me through the full deployment — resource group, ACR, Container Apps environment, and the app itself. Include how to pass secrets without putting them in the Dockerfile."

### What the Agent Does

Produces a complete, step-by-step deployment script with explanations:

```bash
# Step 1: Variables
RG="rg-mcp-d365-prod"
LOCATION="eastus"
ACR_NAME="acrmcpd365prod"
ENV_NAME="mcp-env"
APP_NAME="mcp-d365-server"

# Step 2: Resource group + ACR
az group create --name $RG --location $LOCATION
az acr create --name $ACR_NAME --resource-group $RG \
  --sku Basic --admin-enabled true

# Step 3: Build and push image
az acr build \
  --registry $ACR_NAME \
  --image mcp-d365-server:latest .

# Step 4: Container Apps environment
az containerapp env create \
  --name $ENV_NAME \
  --resource-group $RG \
  --location $LOCATION

# Step 5: Deploy app with secrets (not in Dockerfile or env vars in plain text)
az containerapp create \
  --name $APP_NAME \
  --resource-group $RG \
  --environment $ENV_NAME \
  --image $ACR_NAME.azurecr.io/mcp-d365-server:latest \
  --registry-server $ACR_NAME.azurecr.io \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --secrets \
      d365-client-id=<CLIENT_ID> \
      d365-client-secret=<CLIENT_SECRET> \
      d365-tenant-id=<TENANT_ID> \
  --env-vars \
      D365_CLIENT_ID=secretref:d365-client-id \
      D365_CLIENT_SECRET=secretref:d365-client-secret \
      D365_TENANT_ID=secretref:d365-tenant-id \
      D365_BASE_URL="https://your-d365-env.operations.dynamics.com"
```

Also generates:
- The Copilot Studio connector configuration pointing to the deployed FQDN
- A health check endpoint scaffold (`/health` returning `{ status: "ok", tools: 3 }`)
- Instructions for rotating the D365 service principal secret without redeploying the container

### The Business Impact

- **Copilot Studio agent reaches D365 from production** — the deployment takes under 20 minutes end-to-end
- **Secrets never touch the Dockerfile or git history** — Container Apps secrets pattern is used throughout
- **Scaling handled automatically** — min 1 replica keeps cold starts out of agent response time, max 3 handles concurrent agent calls

### Try It Yourself

> "The deployment is live but Copilot Studio is getting 401 errors when calling the MCP tools. The D365 service principal has the right permissions in D365. Walk me through diagnosing whether it is a token acquisition issue, a Container Apps networking issue, or a Copilot Studio connector configuration issue."
