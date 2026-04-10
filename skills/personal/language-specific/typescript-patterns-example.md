# TypeScript Patterns — Example

## Scenario: D365 OData Responses Typed as `any`, Runtime Crashes That TypeScript Should Have Caught

**Who:** Elena Vasquez, Full-Stack Developer, ERP integration team
**Where:** TypeScript 5.2, Node.js, D365 F&O OData API, MCP server
**The Problem:** Elena built TypeScript interfaces for D365 OData responses but used `any` in 12 places "just to get it working." Three weeks later, the MCP server crashes with `TypeError: Cannot read properties of undefined (reading 'paymentTerms')` on live procurement requests. The property exists on some D365 vendor records but not others. TypeScript gave no warning because `any` opted out of all type checking.

**Prerequisites:** TypeScript 4.9+, `strict: true` in `tsconfig.json`. The patterns work for any external API response, not just D365.

---

### What You Say to the Agent

> "My MCP server crashes with 'Cannot read properties of undefined' on D365 vendor data. I have `any` everywhere in my OData types because I wasn't sure of the exact shape. Help me replace the `any` with proper types and catch this bug at compile time."

### What the Agent Does

1. **Identifies the crash source:** Reads the crash stack trace and traces it to `vendor.PaymentTerms.Code` where `PaymentTerms` is optional in D365 — it is only populated when a vendor has payment terms configured. The OData response includes `"PaymentTerms": null` for vendors without them. The code assumed it was always an object.

2. **Replaces `any` with `unknown` as a safe intermediate:** Explains the difference: `any` opts out of type checking entirely; `unknown` forces the developer to narrow the type before using it. This is the bridge between unsafe D365 data and type-safe application code.

3. **Builds a typed OData response structure:**
```typescript
interface D365Vendor {
  VendorAccountNumber: string;
  Name: string;
  PaymentTerms: {
    Code: string;
    Description: string;
  } | null;  // Explicitly nullable
  PrimaryContactEmail: string | undefined;  // Sometimes absent entirely
}

// Type guard for OData response envelope
function isD365VendorResponse(data: unknown): data is { value: D365Vendor[] } {
  return typeof data === 'object' && data !== null && 'value' in data;
}
```

4. **Catches a second `any` hiding a more serious bug:** One of the `any` usages is on the OData error response handler. The code was accessing `error.code` and `error.message` but D365 OData errors actually return `error.error.code` and `error.error.message` (nested under an `error` key). This was silently swallowing the actual error code and logging `undefined` instead of the real D365 error. TypeScript would have caught this with a proper error type.

5. **Adds a Zod validation layer at the API boundary:**
```typescript
import { z } from 'zod';
const VendorSchema = z.object({
  VendorAccountNumber: z.string(),
  PaymentTerms: z.object({ Code: z.string() }).nullable(),
});
// Validates at runtime AND infers the TypeScript type
type Vendor = z.infer<typeof VendorSchema>;
```
Explains that TypeScript types disappear at runtime; Zod catches shape mismatches from D365 API changes at the boundary, not deep in application logic.

### The Business Impact

- **Runtime crash eliminated** — the `PaymentTerms` nullability is now a compile error if not handled; the crash cannot recur
- **Hidden D365 error swallowing fixed** — the `error.error.code` bug had been masking the actual error codes in logs for 3 weeks; operations team can now see real D365 error codes
- **API contract change detection added** — when D365 OData changes a field type, the Zod schema throws at the API boundary rather than propagating corrupt data through the system

### Try It Yourself

> "I'm building TypeScript types for the D365 Sales Order OData entity. The entity has 40+ fields and some are only present in certain order statuses. Help me model the discriminated union so the TypeScript compiler enforces that I check the order status before accessing status-specific fields."
