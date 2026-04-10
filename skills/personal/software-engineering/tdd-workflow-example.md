# TDD Workflow — Example

## Scenario: MCP Tool That Validates D365 Vendor IDs Before Creating Purchase Orders

**Who:** James Okafor, Backend Developer, procurement automation team
**Where:** TypeScript, Node.js, MCP SDK, D365 F&O OData, Jest
**The Problem:** James is building an MCP tool that validates vendor IDs against D365 before allowing a purchase order creation. He wants to write the test first but is not sure how to structure it. The vendor lookup makes a real OData call, so he needs to mock the D365 client without making the tests brittle. He is tempted to skip TDD and write the implementation first.

**Prerequisites:** Node.js project, Jest or Vitest installed, MCP SDK. The D365 OData client should be injectable (or the skill will help make it so).

---

### What You Say to the Agent

> "I need to write a TDD workflow for an MCP tool that validates D365 vendor IDs. The tool should return an error if the vendor doesn't exist, and approve the vendor ID if it does. I want to write the test first but I don't know how to mock the D365 OData call cleanly."

### What the Agent Does

1. **Defines the interface before the test:** Creates `VendorLookupClient` as a TypeScript interface with a single method `getVendor(vendorId: string): Promise<Vendor | null>`. This is the seam where the mock lives. James would have written the test against the concrete OData class, making it impossible to mock.

2. **Writes the failing test first:**
```typescript
it('returns VENDOR_NOT_FOUND error when vendor ID does not exist in D365', async () => {
  const mockClient: VendorLookupClient = {
    getVendor: jest.fn().mockResolvedValue(null)
  };
  const tool = new ValidateVendorTool(mockClient);
  const result = await tool.execute({ vendorId: 'V-99999' });
  expect(result.isError).toBe(true);
  expect(result.error.code).toBe('VENDOR_NOT_FOUND');
});
```
The test fails because `ValidateVendorTool` does not exist yet.

3. **Writes the minimal implementation to pass:** Creates `ValidateVendorTool` with just enough code to make the test green. No extra logic. The agent resists adding the success case until there is a test for it.

4. **Catches a missing test case the developer overlooked:** Adds a test for the D365 OData timeout scenario: when `getVendor` throws a network error, the tool should return `VENDOR_LOOKUP_FAILED`, not crash the MCP server process. This failure mode was not in James's original plan and would have caused silent process exits in production.

5. **Adds the happy path test and implementation:** The `VENDOR_FOUND` case is now a third test case, written before the implementation. The final tool has 3 tests and 3 behaviors, each independently verifiable.

### The Business Impact

- **Timeout crash path caught before production** — the unhandled OData error would have silently killed the MCP server process on every D365 network hiccup
- **Refactoring made safe** — James later changed the OData client library; all three tests stayed green without modification because they tested behavior, not implementation
- **Onboarding artifact** — the three test cases became the specification for the tool, read by two other developers who needed to understand what it does

### Try It Yourself

> "I need to write TDD tests for a Copilot Studio topic handler that routes procurement intents. Start with the test for the 'approve purchase order' intent. The handler calls a D365 MCP tool — help me mock that dependency cleanly."
