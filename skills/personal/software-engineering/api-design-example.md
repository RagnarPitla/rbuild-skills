# API Design — Example

## Scenario: REST API for a D365 Data Service Called by Copilot Studio Agents

**Who:** Marcus Webb, Backend Engineer, mid-size logistics company (600 employees)
**Where:** Node.js/TypeScript, D365 F&O OData backend, Copilot Studio as the consumer
**The Problem:** Marcus drafted a REST API that Copilot Studio agents will call to query D365 shipment data. His first draft uses POST for all queries, returns HTTP 200 for errors with an `isError: true` body field, and has inconsistent resource naming like `/getShipments` and `/fetchVendor`. The agent keeps misinterpreting responses and the team can't tell if a call succeeded or failed.

**Prerequisites:** Basic familiarity with REST conventions and HTTP status codes. The API is not yet in production.

---

### What You Say to the Agent

> "Review my API design before we connect it to Copilot Studio. Here are my endpoints: POST /getShipments, POST /fetchVendor, POST /updateStatus. I'm using HTTP 200 for everything and putting error details in the body. Is there anything I should fix?"

### What the Agent Does

1. **Verb/resource mismatch flagged:** Identifies that `POST /getShipments` violates REST conventions. Queries should be `GET /shipments`. POST implies a state-changing operation and will confuse both developers and Copilot Studio's HTTP connector, which uses verb semantics for action inference.

2. **Status code antipattern caught:** Flags the `HTTP 200 + isError: true` pattern as a critical design flaw. Copilot Studio's Power Automate connector checks the HTTP status code to determine success or failure. A 200 response bypasses error handling, causing agents to treat failed D365 lookups as successful results and produce confident but wrong answers.

3. **Naming inconsistency fixed:** Corrects `/getShipments` and `/fetchVendor` to `/shipments` and `/vendors/{id}`. Suggests a consistent resource-based URL structure: `GET /shipments`, `GET /shipments/{id}`, `PATCH /shipments/{id}/status`.

4. **Error response schema added:** Proposes a standard error envelope so agents can parse failures consistently:
```json
{
  "error": {
    "code": "VENDOR_NOT_FOUND",
    "message": "Vendor V-10042 does not exist in D365",
    "correlationId": "req_7f3a2b"
  }
}
```
Returns `404` for not found, `422` for validation errors, `502` when D365 OData is unreachable.

5. **Pagination gap identified:** Notes that `GET /shipments` with no pagination will return all records. With 80,000+ shipments in D365, this will timeout in Copilot Studio's 30-second connector limit. Recommends `?$top=50&$skip=0` mirroring OData conventions the team already uses.

### The Business Impact

- **Agent reliability improved immediately** — Copilot Studio error handling now triggers correctly on 4xx/5xx, stopping agents from confidently reporting bad data
- **Integration time cut by half** — consistent naming and status codes meant the Power Automate connector required zero custom error-handling logic
- **Timeout incident avoided** — pagination added before launch; the unpaginated endpoint would have caused production failures on the first Monday morning query burst

### Try It Yourself

> "I have a D365 MCP server that returns vendor payment terms. Design the API contract for a `getPaymentTerms` tool — include the request schema, response schema, and all the error cases the Copilot Studio agent needs to handle."
