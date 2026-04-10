# Refactoring Patterns — Example

## Scenario: A 400-Line Copilot Studio Topic Handler With 8 Nested Conditions

**Who:** Sofia Andersson, Senior Developer, enterprise solutions team
**Where:** TypeScript, Copilot Studio topic handler, Node.js backend, no unit tests
**The Problem:** A topic handler that started as a simple router has grown to 400 lines with 8 levels of nested if/else. It handles intent routing, D365 entity lookups, error formatting, and response building all in one function. Adding a new routing path takes 3 hours because the developer has to mentally trace 8 levels of nesting to find the right insertion point. Nothing is testable in isolation.

**Prerequisites:** The code must compile. Unit test framework optional but the refactoring will make tests possible. TypeScript preferred but the patterns apply to any language.

---

### What You Say to the Agent

> "This topic handler function is 400 lines with 8 nested if/else blocks. Adding new routing logic takes hours. It handles routing, D365 lookups, error formatting, and response building all in one place. Help me refactor it into something I can actually test and extend."

### What the Agent Does

1. **Identifies the four responsibilities mixed in one function:** Routing logic, D365 entity resolution, error normalization, and response serialization. Each should be a separate function. The current function violates single responsibility in four distinct ways.

2. **Applies early return to eliminate nesting:** Replaces the 8-level nesting with guard clauses. The first three levels of nesting are null/error checks that can return early. Flattening these reduces maximum nesting depth from 8 to 3 and makes the happy path visible.

3. **Extracts a routing table:** Replaces the `if (intent === 'X') ... else if (intent === 'Y')` chain with a `Record<IntentType, Handler>` lookup table. Adding a new route becomes one line. The agent notes that the original code had a subtle bug: two intents with similar names (`create_po` and `create_po_draft`) fell through to the same handler branch due to a missing `else`, which the routing table structure makes impossible.

4. **Separates the D365 lookup layer:** Extracts `resolveVendorEntity()` and `resolvePurchaseOrder()` into standalone async functions that return `Result<T, D365Error>` instead of throwing. Now each can be unit tested with mocked OData responses.

5. **Proposes a test structure:** Shows how the extracted functions enable tests like `it('returns NotFound when vendor ID missing from D365')` that previously could not be written without standing up the entire handler.

### The Business Impact

- **Time to add a new route dropped from 3 hours to 15 minutes** — the routing table pattern means new intents are a single-line addition
- **Intent collision bug found during refactor** — `create_po` and `create_po_draft` had been sharing a handler for 6 weeks; purchase order drafts were being submitted directly instead of saved
- **Test coverage became possible** — 12 unit tests written in the first week after refactoring, covering all D365 error paths that had been untestable before

### Try It Yourself

> "I have a Power Automate flow that has grown to 60 steps with nested conditions. Help me identify the logical boundaries where it should be split into child flows, and write the interface contract between them."
