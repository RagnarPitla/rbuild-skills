---
name: refactoring-patterns
description: Safe refactoring techniques including strangler fig, extract method, replace conditional with polymorphism, and decompose conditional. Use when user says 'refactor this code', 'clean up this function', 'refactoring patterns', 'how to refactor safely', 'extract method', 'reduce complexity'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, software-engineering, refactoring, patterns]
---


# Refactoring Patterns

Refactoring is changing code structure without changing behavior. The key word is "without" — if behavior changes, that's not refactoring, that's changing functionality.

## The Golden Rule: Tests Before Refactoring

Never refactor without tests. You need to know when you've accidentally broken something.

```
1. Write tests that cover the current behavior
2. Run tests — they should pass
3. Refactor
4. Run tests — they should still pass
5. If tests fail, you broke something
```

If there are no tests and you need to refactor: write characterization tests first (tests that document the current behavior, even if it's wrong).

## Pattern 1: Extract Function

**When:** A block of code needs a comment to explain what it does.
**Rule:** If code needs a comment, it should be a function with a descriptive name.

```javascript
// Before
function processOrder(order) {
  // Calculate total with tax
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  total += total * 0.08; // tax

  // Send confirmation email
  const subject = `Order #${order.id} confirmed`;
  emailService.send(order.customer.email, subject, buildEmailBody(order));
}

// After
function processOrder(order) {
  const total = calculateOrderTotal(order);
  sendOrderConfirmation(order);
}

function calculateOrderTotal(order) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * 1.08; // subtotal + 8% tax
}

function sendOrderConfirmation(order) {
  const subject = `Order #${order.id} confirmed`;
  emailService.send(order.customer.email, subject, buildEmailBody(order));
}
```

## Pattern 2: Replace Conditional with Polymorphism

**When:** A switch/if-else decides behavior based on a type.

```javascript
// Before
function getShippingCost(order) {
  switch (order.type) {
    case 'standard': return order.weight * 0.5;
    case 'express': return order.weight * 1.2 + 5;
    case 'overnight': return order.weight * 2.5 + 15;
  }
}

// After
class StandardShipping { cost(order) { return order.weight * 0.5; } }
class ExpressShipping  { cost(order) { return order.weight * 1.2 + 5; } }
class OvernightShipping{ cost(order) { return order.weight * 2.5 + 15; } }

const shippers = {
  standard: new StandardShipping(),
  express: new ExpressShipping(),
  overnight: new OvernightShipping(),
};

function getShippingCost(order) {
  return shippers[order.type].cost(order);
}
```

Adding a new shipping type = new class. No touching the switch statement.

## Pattern 3: Introduce Parameter Object

**When:** A function takes many related parameters.

```javascript
// Before
function createEvent(title, startDate, endDate, location, maxAttendees, isPublic) { ... }

// Called as:
createEvent('Conference', new Date('2026-06-01'), new Date('2026-06-03'), 'NYC', 500, true);

// After
function createEvent(eventConfig) { ... }

// Called as:
createEvent({
  title: 'Conference',
  startDate: new Date('2026-06-01'),
  endDate: new Date('2026-06-03'),
  location: 'NYC',
  maxAttendees: 500,
  isPublic: true
});
```

Benefits: Named parameters (self-documenting), easy to add optional fields, easy to pass around.

## Pattern 4: Replace Magic Number with Named Constant

```javascript
// Before
if (user.plan === 2) { enablePremiumFeatures(); }
const discount = price * 0.15;

// After
const PREMIUM_PLAN_ID = 2;
const LOYAL_CUSTOMER_DISCOUNT = 0.15;

if (user.plan === PREMIUM_PLAN_ID) { enablePremiumFeatures(); }
const discount = price * LOYAL_CUSTOMER_DISCOUNT;
```

## Pattern 5: Decompose Conditional

**When:** Complex boolean conditions obscure intent.

```javascript
// Before
if (user.age >= 18 && user.country !== 'US' && !user.isRestricted && subscription.status === 'active') {
  showContent();
}

// After
function canViewContent(user, subscription) {
  const isAdult = user.age >= 18;
  const isEligibleRegion = user.country !== 'US';
  const isNotRestricted = !user.isRestricted;
  const hasActiveSubscription = subscription.status === 'active';
  return isAdult && isEligibleRegion && isNotRestricted && hasActiveSubscription;
}

if (canViewContent(user, subscription)) {
  showContent();
}
```

## Pattern 6: Strangler Fig (Large-Scale Refactoring)

**When:** You need to refactor a large system incrementally without a big-bang rewrite.

The strangler fig pattern: build new functionality around the old system, gradually routing traffic to the new implementation until the old system is no longer called and can be removed.

```typescript
// Old monolithic OrderService
class OldOrderService {
  createOrder(data: any) { /* hundreds of lines */ }
}

// New service — starts handling specific cases
class NewOrderService {
  createOrder(data: CreateOrderRequest): Promise<Order> { /* clean implementation */ }
}

// Router decides which to use
class OrderServiceRouter {
  async createOrder(data: any) {
    // Route new order types to new service
    if (data.type === 'subscription') {
      return this.newService.createOrder(data);
    }
    // Everything else still goes to old service
    return this.oldService.createOrder(data);
  }
}

// Gradually expand what the new service handles
// Until old service handles nothing and can be deleted
```

## When NOT to Refactor

- When you don't have tests (write them first)
- When you're under deadline pressure (ship first, refactor after)
- When the code works and nobody will touch it again
- When the refactoring would require changing multiple systems simultaneously

**The Boy Scout Rule:** Leave the code cleaner than you found it — but only the code you're already touching. Don't refactor code you're not changing.

## Trigger Phrases

- "refactor this code"
- "clean up this function"
- "refactoring patterns"
- "how to refactor safely"
- "extract method"
- "reduce complexity"
- "strangler fig pattern"
- "replace conditional"

## Quick Example

> See `refactoring-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Refactoring breaks behavior | No tests before starting | Stop, write characterization tests documenting current behavior, then refactor |
| Refactoring turns into a rewrite | Scope creep during refactor | Set a scope limit before starting; if you find you need to rewrite, make that a separate decision |
| Team resists refactoring | "It works, don't touch it" culture | Frame refactoring as risk reduction, not cleanup; link specific bugs to unclean code that made them hard to find |
| Polymorphism over-engineered | Applied to switches that rarely change | Only use replace-conditional-with-polymorphism when new types are regularly added; for 2-3 fixed cases, a switch is fine |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
