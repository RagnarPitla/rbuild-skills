# Deployment Patterns — Example

## Scenario: Blue/Green CI/CD Pipeline for an MCP Server on Azure

**Who:** Jordan Lee, DevOps Engineer at an ISV building Copilot Studio tooling
**Where:** Azure Container Apps, GitHub Actions, MCP server written in Node.js/TypeScript
**The Problem:** Jordan is deploying an MCP server to Azure for the first time. The server exposes D365 tools to a Copilot Studio agent used in production by 12 enterprise customers. A broken deployment cannot take the agent offline — customers notice within minutes and support tickets start. Jordan needs blue/green deployment so traffic stays on the current version while the new one is validated, with an automatic rollback if health checks fail.

**Prerequisites:** Azure Container Apps environment already provisioned. GitHub Actions runner with Azure credentials configured. Docker image building locally.

---

### What You Say to the Agent

> "Set up blue/green deployment for my MCP server on Azure Container Apps with GitHub Actions. The server is Node.js/TypeScript. I need zero-downtime deploys — new version deploys to a staging revision, health check passes, then traffic shifts. Automatic rollback if the health check fails. Give me the complete workflow YAML and the Container Apps revision configuration."

### What the Agent Does

1. **Generates the GitHub Actions workflow** with four stages: build, push to ACR, deploy to inactive revision, traffic shift
2. **Generates the Container Apps revision configuration** with traffic weights and health probe settings
3. **Produces complete, runnable files:**

```yaml
# .github/workflows/deploy.yml
name: Deploy MCP Server (Blue/Green)

on:
  push:
    branches: [main]

env:
  REGISTRY: ${{ secrets.ACR_NAME }}.azurecr.io
  IMAGE: mcp-d365-server
  APP: mcp-server
  RG: rg-mcp-prod

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push image
        run: |
          az acr build \
            --registry ${{ secrets.ACR_NAME }} \
            --image $IMAGE:${{ github.sha }} .

      - name: Deploy new revision (inactive)
        run: |
          az containerapp revision copy \
            --name $APP \
            --resource-group $RG \
            --image $REGISTRY/$IMAGE:${{ github.sha }} \
            --revision-suffix ${{ github.sha }} \
            --min-replicas 1 \
            --max-replicas 3

      - name: Health check new revision
        run: |
          REVISION_URL=$(az containerapp revision show \
            --name $APP --resource-group $RG \
            --revision $APP--${{ github.sha }} \
            --query properties.fqdn -o tsv)
          curl --retry 5 --retry-delay 10 --fail \
            https://$REVISION_URL/health

      - name: Shift traffic to new revision
        run: |
          az containerapp ingress traffic set \
            --name $APP --resource-group $RG \
            --revision-weight $APP--${{ github.sha }}=100
```

4. **Adds the rollback step** — triggered automatically if the health check `curl` fails, pointing traffic back to the previous revision label

### The Business Impact

- **Zero-downtime deploys from day one** — no maintenance window, no customer-visible disruption
- **Automatic rollback in under 2 minutes** — health check failure triggers revert before customers are impacted
- **Revision history retained** — the previous blue revision stays warm for 24 hours, manual rollback is one CLI command if a silent failure is discovered post-shift

### Try It Yourself

> "Add a smoke test step after the health check. The smoke test should call the MCP server's `/tools/list` endpoint and verify it returns at least three tools. Fail the deployment if the response is empty or malformed."
