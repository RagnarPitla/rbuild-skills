# Backend Patterns — Example

## Scenario: Messy Express.js API for a Copilot Studio D365 Agent

**Who:** Lena Fischer, Full-Stack Developer at a manufacturing company (building internal tooling for a Copilot Studio procurement agent)
**Where:** Node.js 20, Express.js, TypeScript, D365 F&O OData API, Azure App Service
**The Problem:** Lena's Express.js API started as a quick prototype to let Copilot Studio query D365 vendor and PO data. After 4 months, it has grown to 22 routes, all in a single `routes.ts` file. Business logic (OData query construction, data transformation, caching) is mixed directly into route handlers. Three developers now touch the codebase, and a bug fix in vendor lookup broke PO creation last week because they share inline helper functions. There are no unit tests because the handlers are impossible to test in isolation.

**Prerequisites:** Node.js 20+, TypeScript 5+, Express 4+, familiarity with D365 F&O OData endpoint structure. Target: each layer independently testable with Jest.

---

### What You Say to the Agent

> "My Express.js API for a Copilot Studio agent is a mess of routes with business logic everywhere. I need to refactor to clean layered architecture so it's testable and maintainable. Walk me through the pattern."

### What the Agent Does

1. **Maps the current mess:** Analyzes the route file and identifies 4 responsibility types mixed together: HTTP handling (request parsing, response formatting), business logic (validation, business rules), data access (OData query construction, HTTP calls to D365), and transformation (mapping D365 response shapes to the agent's expected schema)

2. **Implements a 3-layer architecture:** Creates `src/routes/` (HTTP handlers only, 10-20 lines each), `src/services/` (business logic, no HTTP knowledge), and `src/repositories/` (all D365 OData calls). Each layer depends only on the layer below it. Route handlers call services, services call repositories. No cross-layer imports

3. **Extracts the VendorRepository:** Creates `src/repositories/VendorRepository.ts` with typed methods: `findById(vendorId: string): Promise<Vendor>`, `search(filters: VendorSearchFilters): Promise<Vendor[]>`, `getPaymentTerms(vendorId: string): Promise<PaymentTerms>`. All OData query strings live here. The repository accepts an `ODataClient` interface — swappable in tests

4. **Implements dependency injection via factory:** Creates `src/container.ts` that instantiates the ODataClient with real D365 credentials in production and a `MockODataClient` in tests. Routes receive service instances via `createVendorRouter(vendorService: VendorService)` factory functions. This makes every route handler unit-testable with a 5-line mock

5. **Adds error boundary middleware:** Creates `src/middleware/errorBoundary.ts` that catches errors from all layers and maps them to structured HTTP responses. D365 `ResourceNotFoundException` maps to 404 with a standard JSON error body. Validation errors map to 422. Unhandled errors map to 500 and trigger an Application Insights alert

### The Business Impact

- **Test coverage went from 0% to 74%** in the first sprint after refactoring — the layered architecture made unit tests straightforward to write
- **The cross-contamination bug class eliminated** — vendor and PO services now have no shared mutable state; the class of bug that caused last week's incident is architecturally impossible
- **Onboarding time for new developers cut from 3 days to half a day** — the layer responsibilities are self-documenting and consistent across all 22 routes

### Try It Yourself

> "The layered architecture is clean. Now I need to add request validation for all incoming agent payloads — the Copilot Studio agent sometimes sends malformed JSON with missing required fields and I want to reject those early with a helpful error message. How do I add Zod schema validation as a middleware layer?"
