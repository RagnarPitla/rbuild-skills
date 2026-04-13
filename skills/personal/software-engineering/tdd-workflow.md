---
name: "tdd-workflow"
slug: "tdd-workflow"
description: "Test-driven development with red-green-refactor cycle, testing pyramid, test doubles, and TDD for legacy code. Use when user says 'TDD', 'test-driven development', 'write tests first', 'red green refactor', 'testing pyramid', 'when to use mocks'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "software-engineering", "tdd", "testing"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# TDD Workflow

Test-first sounds backwards until you've done it for a week. Then you can't work any other way.

## The Red-Green-Refactor Cycle

1. **Red** — write a failing test for the behavior you want. Run it. Watch it fail. This proves the test works.
2. **Green** — write the minimum code to make the test pass. Don't over-engineer. Just make it green.
3. **Refactor** — clean up the code now that you have a safety net. The tests will catch regressions.

The discipline is staying in this cycle. Most developers skip to "write the code" immediately. That's not TDD.

## Coverage Targets

| Layer | Target | Reason |
|---|---|---|
| Unit tests | 80%+ | Fast, cheap, catches logic bugs |
| Integration tests | 60%+ | Catches wiring bugs between components |
| E2E tests | Key user paths | Catches UI/flow bugs, expensive to maintain |

80% unit coverage is the floor, not the ceiling. Critical business logic (payment processing, auth, data migrations) should be at 100%.

## What to Test vs Mock

**Test:** Business logic, edge cases, error paths, return values
**Mock:** External services (APIs, databases), file system, time/dates, random values

The test suite should run without network access and complete in under 30 seconds.

## The Testing Pyramid

```
        /\
       /E2E\        Few — expensive, slow, brittle
      /──────\
     /Integr. \     Some — test component boundaries
    /──────────\
   /   Unit     \   Many — fast, cheap, specific
  /______________\
```

Invert this pyramid and you get a test suite that's slow, fragile, and gives false confidence.

## Test Doubles: Mock vs Stub vs Spy vs Fake

These terms are often used interchangeably, but they're different:

| Type | What it Does | When to Use |
|------|-------------|-------------|
| **Stub** | Returns pre-programmed responses | Replacing external dependencies with fixed data |
| **Mock** | Stub + verifies it was called correctly | When the call itself (not just the result) matters |
| **Spy** | Wraps real object, records calls | When you want real behavior but also want to observe calls |
| **Fake** | Simplified working implementation | In-memory database, fake email server |

```typescript
// Stub: just returns data
const userRepo = { findById: jest.fn().mockResolvedValue({ id: '1', name: 'Alice' }) };

// Mock: verifies the call was made with correct arguments
const emailService = { send: jest.fn() };
// After test:
expect(emailService.send).toHaveBeenCalledWith('alice@example.com', expect.stringContaining('Welcome'));

// Spy: real implementation, but you can inspect calls
const consoleSpy = jest.spyOn(console, 'log');

// Fake: in-memory implementation
class InMemoryUserRepo {
  private users = new Map<string, User>();
  async findById(id: string) { return this.users.get(id) ?? null; }
  async save(user: User) { this.users.set(user.id, user); return user; }
}
```

## Test Naming Convention

```javascript
// describe: the thing being tested
// it: specific behavior
describe('calculateDiscount', () => {
  it('returns 10% discount for orders over $100', () => { ... })
  it('returns 0% discount for orders under $100', () => { ... })
  it('throws for negative order amounts', () => { ... })
})
```

Test names should read as specifications. If a test fails, the name tells you what broke.

## TDD for Legacy Code (Seams and Characterization Tests)

When you need to change code that has no tests:

1. **Write characterization tests** — tests that document what the code currently does (not what it should do)
2. **Find a seam** — a place where behavior can change without editing the existing code
3. **Inject the dependency** — pass the dependency as a parameter instead of creating it internally
4. **Now you can test** — replace the real dependency with a test double

```typescript
// Legacy: untestable (creates its own dependencies)
class OrderProcessor {
  process(order) {
    const db = new Database(); // Can't inject a fake
    const emailer = new Emailer(); // Can't inject a mock
    db.save(order);
    emailer.send(order.customer.email);
  }
}

// Refactored: testable (dependencies injected)
class OrderProcessor {
  constructor(private db: Database, private emailer: Emailer) {}
  process(order) {
    this.db.save(order);
    this.emailer.send(order.customer.email);
  }
}
```

## When TDD Slows You Down

TDD is not always right:
- **Exploratory code** — when you don't know the shape of the solution yet, write the code first, then add tests
- **UI/visual work** — behavior-based tests are hard to write for visual components; use snapshot tests sparingly
- **Throwaway prototypes** — don't test code you'll delete

For production code that will be maintained: always TDD.

## Trigger Phrases

- "TDD"
- "test-driven development"
- "write tests first"
- "red green refactor"
- "testing pyramid"
- "when to use mocks"
- "test doubles"
- "characterization tests"

## Quick Example

> See `tdd-workflow-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Tests pass but bugs still reach production | Testing implementation, not behavior | Test observable outcomes (return values, side effects) not internal function calls |
| Test suite takes 10+ minutes | Too many integration/E2E tests, slow stubs | Move to in-memory fakes for databases; stub external HTTP calls; run unit tests in parallel |
| Tests break on every refactor | Tests depend on implementation details | Test behavior through the public interface; avoid testing private methods directly |
| Cannot write a test because code is not injectable | Legacy code with hardcoded dependencies | Apply the seam pattern: find a constructor or function parameter where you can inject a test double |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
