# Security Review — Example

## Scenario: Three Critical Issues Caught Before a D365 MCP Server Handles Vendor API Keys

**Who:** Ingrid Svensson, Backend Developer, procurement platform team
**Where:** TypeScript, Node.js MCP server, D365 F&O OData, Azure Key Vault (planned but not yet implemented)
**The Problem:** Ingrid is 2 days from deploying a D365 MCP server that will store and use vendor API keys to connect to third-party logistics systems. A quick security review before deployment catches 3 critical issues that would have gone live: API keys stored in plain text in a Dataverse text column, no input validation on the vendor ID parameter of the MCP tools, and error messages that expose internal system details to callers.

**Prerequisites:** Access to the MCP server source code. The review covers secrets management, input validation, and information disclosure. No special tooling required.

---

### What You Say to the Agent

> "I'm deploying a D365 MCP server tomorrow that handles vendor API keys. Run a security review before I push it. The keys are used to connect to third-party logistics APIs. I want to know if I have any critical issues."

### What the Agent Does

1. **Finds API keys stored in plain text:** Reads the Dataverse integration code and finds vendor API keys stored in a custom `cr023_vendor_api_key` column with type `Text`. Flags this as critical: Dataverse text columns are readable by any user with table read permissions. The key is also logged in the server's request log at `debug` level. Recommends: Azure Key Vault for key storage, with the Dataverse record storing only the Key Vault reference URL, not the key itself.

2. **Finds SQL injection via OData filter construction:** The MCP tool accepts a `vendorId` parameter and constructs an OData filter string directly:
```typescript
// Vulnerable
const filter = `$filter=VendorAccountNumber eq '${vendorId}'`;

// An attacker passes: ' or 1 eq 1
// Becomes: $filter=VendorAccountNumber eq '' or 1 eq 1
// Returns all vendors
```
The fix is OData parameter encoding: `encodeURIComponent(vendorId)` and validating the format matches the D365 vendor ID pattern (`^V-[0-9]{5}$`) before constructing the query.

3. **Flags error messages leaking internal details:** When a D365 OData call fails, the server returns the raw error to the MCP caller:
```
Error: Request failed: https://contoso.crm.dynamics.com/api/data/v9.2/...
AADSTS70011: The provided request must include a 'scope' input parameter.
```
This exposes the D365 tenant URL, the Azure AD error code, and the OAuth scope configuration. Recommends: log the full error server-side, return a generic `{ error: "VENDOR_LOOKUP_FAILED", requestId: "req_abc123" }` to the caller with a correlation ID for support use.

4. **Adds an authentication check that was missing:** The MCP server accepts connections over Streamable HTTP with no authentication. Any caller with network access can invoke the tools. Recommends adding an API key header check as a minimum, with a path to Azure Managed Identity for production.

5. **Generates a pre-deploy security checklist** with 4 items ranked by severity, estimated fix time, and the deployment decision: items 1-3 are blockers, item 4 is a hardening step for the next sprint.

### The Business Impact

- **Vendor API key exposure prevented** — the plain-text Dataverse storage would have made all vendor keys readable to anyone with Dataverse Reader role, approximately 40 people in the org
- **OData injection blocked** — the filter construction bug was exploitable by any MCP caller to enumerate all vendors regardless of their access scope
- **Information disclosure closed** — the raw AAD error messages would have told an attacker the exact tenant URL and OAuth misconfiguration to target

### Try It Yourself

> "My MCP server is now deployed with the fixes. I want to add rate limiting so a single caller cannot make more than 100 D365 API calls per minute. Show me how to implement a sliding window rate limiter in Node.js that uses the caller's API key as the rate limit identity."
