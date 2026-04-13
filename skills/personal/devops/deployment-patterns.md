---
name: "deployment-patterns"
slug: "deployment-patterns"
description: "CI/CD pipeline design, blue/green and canary deployments, rollback strategies, health checks, feature flags, and zero-downtime deployment patterns. Use when user says 'deployment strategy', 'CI/CD pipeline', 'deploy to Azure', 'zero-downtime deploy', 'rollback strategy', 'feature flags'."
tab: "personal"
domain: "devops"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "devops", "deployment", "ci-cd"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Azure CLI, Docker"
mcp_tools: []
---


# Deployment Patterns

Production deployment patterns for modern cloud applications. Covers CI/CD pipeline design, zero-downtime strategies, health checks, rollback automation, and feature flags.

## Trigger Phrases

- "deployment strategy"
- "CI/CD pipeline"
- "deploy to Azure"
- "zero-downtime deploy"
- "rollback strategy"
- "feature flags"
- "blue/green deployment"
- "canary release"

## Deployment Strategies

### Blue/Green Deployment

Two identical production environments. Traffic switches from Blue (current) to Green (new) atomically.

```
Blue (current): v1.2.0  100% traffic
Green (new):    v1.3.0  0% traffic (staged, tested)

Cutover: switch traffic routing from Blue to Green
Rollback: switch traffic back to Blue (instant)
```

**Best for:** Web apps, APIs, MCP servers. Anything where you need instant rollback.
**Azure Container Apps:** Use `az containerapp ingress traffic set` to shift traffic between revisions.

```bash
# Set green (new revision) to 100% traffic
az containerapp ingress traffic set \
  --name my-app \
  --resource-group my-rg \
  --revision-weight my-app--new-revision=100
```

### Canary Release

Gradually route a percentage of traffic to the new version, monitoring errors before full cutover.

```
Stage 1: 5% canary   → monitor for 30 min
Stage 2: 20% canary  → monitor for 1 hour
Stage 3: 50% canary  → monitor for 2 hours
Stage 4: 100%        → decommission old
```

**Best for:** High-traffic services where bugs affect real users at scale.
**Azure Container Apps revision traffic weights:**

```bash
# 10% canary split
az containerapp ingress traffic set \
  --name my-app \
  --resource-group my-rg \
  --revision-weight \
    my-app--stable=90 \
    my-app--canary=10
```

### Rolling Update

Replace instances one at a time. Never takes all instances offline simultaneously.

**Best for:** Stateless services with multiple replicas.
**Not suitable for:** Breaking schema changes or when you need instant rollback.

## CI/CD Pipeline Blueprint

### GitHub Actions Pipeline (Azure Container Apps)

```yaml
name: Deploy to Azure Container Apps

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push image
        run: |
          docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/myapp:${{ github.sha }} .
          echo ${{ secrets.ACR_PASSWORD }} | docker login ${{ secrets.ACR_LOGIN_SERVER }} \
            -u ${{ secrets.ACR_USERNAME }} --password-stdin
          docker push ${{ secrets.ACR_LOGIN_SERVER }}/myapp:${{ github.sha }}

      - name: Deploy to Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          resourceGroup: my-rg
          containerAppName: my-app
          imageToDeploy: ${{ secrets.ACR_LOGIN_SERVER }}/myapp:${{ github.sha }}
```

### Pipeline Stages

```
1. Lint + Type Check    → fail fast on code quality
2. Unit Tests           → verify logic
3. Build Image          → create artifact
4. Integration Tests    → test in staging env
5. Deploy to Staging    → validate in prod-like env
6. Smoke Tests          → basic health check post-deploy
7. Deploy to Prod       → with health check gate
8. Post-deploy Monitor  → watch error rates for 15 min
```

## Health Checks

Every deployed service needs three health check endpoints:

```typescript
// /health/live: is the process alive?
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// /health/ready: is the service ready to receive traffic?
app.get('/health/ready', async (req, res) => {
  const dbOk = await checkDatabaseConnection();
  if (dbOk) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', reason: 'db unavailable' });
  }
});

// /health/startup: did the service start successfully?
app.get('/health/startup', (req, res) => {
  res.status(200).json({ status: 'started', version: process.env.APP_VERSION });
});
```

**Azure Container Apps health probe config:**
```yaml
probes:
  - type: liveness
    httpGet:
      path: /health/live
      port: 3000
    initialDelaySeconds: 10
    periodSeconds: 30
  - type: readiness
    httpGet:
      path: /health/ready
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 10
```

## Rollback Strategy

### Automated Rollback Trigger

```bash
# Monitor error rate after deploy, auto-rollback if threshold exceeded
PREV_REVISION=$(az containerapp revision list \
  --name my-app --resource-group my-rg \
  --query "[1].name" -o tsv)

ERROR_RATE=$(check_error_rate_last_5min)

if [ "$ERROR_RATE" -gt "5" ]; then
  echo "Error rate $ERROR_RATE% exceeds threshold. Rolling back..."
  az containerapp ingress traffic set \
    --name my-app --resource-group my-rg \
    --revision-weight $PREV_REVISION=100
fi
```

### Manual Rollback

```bash
# List revisions
az containerapp revision list --name my-app --resource-group my-rg

# Activate previous revision at 100%
az containerapp ingress traffic set \
  --name my-app --resource-group my-rg \
  --revision-weight [PREVIOUS_REVISION_NAME]=100
```

## Feature Flags

Decouple deployment from release. Ship code to production but keep features off until ready.

**Simple environment variable approach:**
```typescript
const FEATURES = {
  newAgentOrchestration: process.env.FEATURE_NEW_ORCHESTRATION === 'true',
  betaUI: process.env.FEATURE_BETA_UI === 'true',
};

if (FEATURES.newAgentOrchestration) {
  return newOrchestrationFlow(request);
} else {
  return legacyFlow(request);
}
```

**Azure App Configuration for dynamic flags (no redeploy):**
```bash
az appconfig feature set \
  --name my-config \
  --feature new-agent-orchestration \
  --label production
```

## Quick Example

> See `deployment-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Deploy succeeds but app not responding | Health check endpoint missing or failing | Add `/health/ready` endpoint and verify it returns 200 before routing traffic |
| Rollback takes too long | No previous stable revision kept active | Keep at least 2 revisions active in Azure Container Apps. Don't deactivate until canary fully validated. |
| CI/CD pipeline flaky | Tests depend on external services | Mock external dependencies in unit tests, use dedicated staging services for integration tests |
| Feature flag not toggling in prod | Flag cached at startup | Use Azure App Configuration with watchers for runtime updates instead of env vars read once at boot |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
