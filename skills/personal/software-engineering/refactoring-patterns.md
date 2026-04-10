---
name: "Refactoring Patterns"
slug: "refactoring-patterns"
description: "Safe refactoring techniques — extract method, replace conditional, introduce parameter object, and how to refactor without breaking things."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-curated"
tags: ["refactoring", "code-quality", "patterns", "clean-code", "design"]
version: "1.0"
icon_emoji: "🔧"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: ["code-review", "tdd-workflow"]
references:
  - title: "Refactoring by Martin Fowler"
    url: "https://refactoring.com/"
  - title: "Refactoring Catalog"
    url: "https://refactoring.com/catalog/"
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

## When NOT to Refactor

- When you don't have tests (write them first)
- When you're under deadline pressure (ship first, refactor after)
- When the code works and nobody will touch it again
- When the refactoring would require changing multiple systems simultaneously

**The Boy Scout Rule:** Leave the code cleaner than you found it — but only the code you're already touching. Don't refactor code you're not changing.
