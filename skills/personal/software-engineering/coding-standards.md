---
name: "coding-standards"
slug: "coding-standards"
description: "Universal coding standards and language-agnostic principles for clean, maintainable code. Use when user says 'coding standards', 'code style guide', 'naming conventions', 'clean code principles', 'function design', 'error handling patterns'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["beginner", "software-engineering", "coding-standards", "conventions"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Coding Standards

These are language-agnostic principles. They apply whether you're writing TypeScript, Python, Go, or Rust. The goal is code that other engineers (and future you) can read, understand, and safely change.

## Naming Conventions

**Variables and functions:** Describe what they are or do, not how they work.

```typescript
// Bad: abbreviations, vague names
const usr = getUsrById(id);
const d = new Date();
let flag = false;
function proc(x) { ... }

// Good: self-documenting
const user = getUserById(id);
const orderCreatedAt = new Date();
let isEmailVerified = false;
function calculateOrderTotal(order) { ... }
```

**Boolean names:** Use `is`, `has`, `can`, `should` prefixes.
```typescript
isActive, hasPermission, canDelete, shouldRetry
```

**Functions:** Verb + noun that describes the action.
```typescript
getUserById(), calculateTax(), sendWelcomeEmail(), validateInput()
```

**Constants:** SCREAMING_SNAKE_CASE for module-level constants.
```typescript
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;
```

## Functions: Do One Thing

A function should do one thing, do it well, and do it only.

Signs a function does too much:
- Its name contains "and" (processAndSaveOrder)
- It's over 20-30 lines
- It has more than 3-4 levels of nesting
- You need a comment at the top to explain what it does

```typescript
// Bad: does multiple things
function handleCheckout(cart, user, paymentInfo) {
  // validate cart
  for (const item of cart.items) {
    if (item.quantity <= 0) throw new Error('Invalid quantity');
    if (!item.productId) throw new Error('Missing product');
  }
  // apply discount
  let total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (user.loyaltyLevel === 'gold') total *= 0.9;
  // charge card
  const charge = stripe.charge({ amount: total, source: paymentInfo.token });
  // save order
  db.orders.create({ userId: user.id, items: cart.items, total });
}

// Good: each function does one thing
function handleCheckout(cart, user, paymentInfo) {
  validateCart(cart);
  const total = calculateCartTotal(cart, user);
  const charge = chargePayment(paymentInfo, total);
  return createOrder(user, cart, total, charge.id);
}
```

## Comments: Why, Not What

Code shows what. Comments explain why.

```typescript
// Bad: explains what (code already shows this)
// increment i by 1
i++;

// Bad: restates the code
// get user by id
const user = getUserById(id);

// Good: explains the why
// Retry limit is 3 because the payment gateway SLA requires 
// response within 10 seconds, and each attempt has a 3s timeout
const MAX_RETRIES = 3;

// Good: explains non-obvious business rule
// Prices are stored in cents to avoid floating-point rounding errors
// Convert to dollars only at display time
const priceInCents = Math.round(displayPrice * 100);
```

## Error Handling

Handle errors at the right level. Not too early, not too late.

**Principle:** Fail fast and loudly in development. Fail gracefully and informatively in production.

```typescript
// Bad: swallowing errors
try {
  await processPayment(order);
} catch (e) {
  // ignore
}

// Bad: catching too broadly
try {
  const user = await getUser(id);
  const order = await createOrder(user, cart);
  await sendConfirmationEmail(user, order);
} catch (e) {
  console.log('something failed');
}

// Good: handle specific errors at the right level
async function createOrder(userId: string, cart: Cart): Promise<Order> {
  const user = await getUser(userId);
  if (!user) throw new NotFoundError(`User ${userId} not found`);

  const order = await db.orders.create({ userId, items: cart.items });
  
  // Non-critical: email failure should not fail the order
  sendConfirmationEmail(user, order).catch(err => 
    logger.error('Failed to send confirmation email', { orderId: order.id, err })
  );

  return order;
}
```

**Error types:** Use specific error classes, not generic Error.
```typescript
class ValidationError extends Error { constructor(message: string, public fields: string[]) { super(message); } }
class NotFoundError extends Error { constructor(message: string) { super(message); } }
class UnauthorizedError extends Error { constructor(message: string) { super(message); } }
```

## Immutability Preference

Prefer immutable data. Mutation is a common source of bugs.

```typescript
// Bad: mutates input
function addDiscount(cart, discountPercent) {
  cart.total = cart.total * (1 - discountPercent);
  return cart;
}

// Good: returns new object
function addDiscount(cart, discountPercent) {
  return { ...cart, total: cart.total * (1 - discountPercent) };
}
```

Use `const` by default. Use `let` only when you need to reassign. Never use `var`.

## Avoid Premature Optimization

Write clear code first. Optimize only when you have measured evidence of a problem.

```typescript
// "Optimized" but unreadable
const r = u.reduce((a, x) => a + (x.s === 'a' ? x.p * x.q : 0), 0);

// Clear code — optimize later if profiling shows it's a bottleneck
const activeItems = users.filter(item => item.status === 'active');
const totalRevenue = activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

## The Standards Checklist

- [ ] Names describe what things are, not how they work
- [ ] Functions do one thing (under 30 lines, no "and" in the name)
- [ ] Comments explain why, not what
- [ ] Errors are handled specifically (not caught and swallowed)
- [ ] No magic numbers (use named constants)
- [ ] Immutable patterns preferred over mutation
- [ ] `const` used by default, `let` only when needed
- [ ] No dead code committed (commented-out blocks, unused variables)
- [ ] No `console.log` / debug output in production code
- [ ] Consistent with the rest of the codebase conventions

## Trigger Phrases

- "coding standards"
- "code style guide"
- "naming conventions"
- "clean code principles"
- "function design"
- "error handling patterns"
- "how to name variables"
- "comment best practices"

## Quick Example

> See `coding-standards-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Team uses inconsistent naming | No enforced standard | Add ESLint/Prettier with team-agreed rules; enforce via pre-commit hooks |
| Functions grow too large over time | No discipline in code review | Flag functions over 30 lines in code review; extract until each function reads like a sentence |
| Magic numbers scattered throughout | Expedient shortcuts | Search for literal numbers in code review; require named constants for any value used more than once |
| Errors swallowed silently | Fear of crashing | Distinguish between errors that should fail the operation vs side effects; always log even if you catch |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
