---
name: "TDD Workflow"
slug: "tdd-workflow"
description: "Test-driven development enforced at 80%+ coverage — red-green-refactor, testing pyramid, and when TDD is the wrong tool."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-curated"
tags: ["tdd", "testing", "red-green-refactor", "coverage", "quality"]
version: "1.0"
icon_emoji: "🧪"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "obra/superpowers TDD Skill"
    url: "https://github.com/obra/superpowers"
  - title: "Test-Driven Development by Kent Beck"
    url: "https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530"
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

## When TDD Slows You Down

TDD is not always right:
- **Exploratory code** — when you don't know the shape of the solution yet, write the code first, then add tests
- **UI/visual work** — behavior-based tests are hard to write for visual components; use snapshot tests sparingly
- **Throwaway prototypes** — don't test code you'll delete

For production code that will be maintained: always TDD.

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
