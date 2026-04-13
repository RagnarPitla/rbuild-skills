---
name: "typescript-patterns"
slug: "typescript-patterns"
description: "TypeScript strict mode, advanced types, utility types, discriminated unions, and real-world patterns for scalable applications. Use when user says 'TypeScript patterns', 'TypeScript types', 'TypeScript strict mode', 'discriminated union', 'utility types', 'TypeScript best practices'."
tab: "personal"
domain: "language-specific"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["intermediate", "language", "typescript", "patterns"]
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



# TypeScript Patterns

TypeScript's value is in making refactoring safe and bugs visible at development time. These patterns get the most out of the type system.

## Strict Mode: Always On

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // Enables all strict checks
    "noUncheckedIndexedAccess": true,  // array[n] returns T | undefined
    "exactOptionalPropertyTypes": true, // optional props can't be undefined
    "noImplicitReturns": true,   // All code paths must return
    "noFallthroughCasesInSwitch": true
  }
}
```

Start strict. Adding it to an existing codebase is painful. Starting without it is worse.

## Discriminated Unions for State Modeling

```typescript
// Bad: all fields optional, many invalid combinations
type RequestState = {
  isLoading: boolean;
  data?: Order[];
  error?: Error;
};

// Good: discriminated union — each state is complete and exclusive
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// TypeScript narrows the type in each branch
function renderOrders(state: RequestState<Order[]>) {
  switch (state.status) {
    case 'idle':    return <EmptyState />;
    case 'loading': return <Spinner />;
    case 'success': return <OrderList orders={state.data} />; // data is Order[]
    case 'error':   return <ErrorMessage error={state.error} />; // error is Error
  }
  // TypeScript knows this is exhaustive — no default needed
}
```

## Utility Types

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
};

// Partial — all fields optional
type UserUpdate = Partial<User>;

// Required — all fields required (removes optional markers)
type CompleteUser = Required<User>;

// Pick — select specific fields
type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;

// Omit — exclude specific fields
type CreateUserRequest = Omit<User, 'id' | 'createdAt'>;

// Readonly — immutable version
type ImmutableUser = Readonly<User>;

// Record — typed object/map
type UserMap = Record<string, User>;

// ReturnType — extract function return type
async function getUser(id: string): Promise<User> { ... }
type UserPromise = ReturnType<typeof getUser>; // Promise<User>
type UserResult = Awaited<ReturnType<typeof getUser>>; // User
```

## Generics with Constraints

```typescript
// Generic function with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
const name = getProperty(user, 'name'); // Type: string
// getProperty(user, 'unknown'); // Compile error

// Generic repository pattern
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

class OrderRepository implements Repository<Order, string> {
  async findById(id: string): Promise<Order | null> {
    return db.orders.findOne({ id });
  }
  // ...
}

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends Array<infer Item> ? Item : T;
type Flatten<Order[]> // -> Order
type Flatten<string>  // -> string
```

## Type Guards

```typescript
// User-defined type guard
function isOrder(value: unknown): value is Order {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'customerId' in value &&
    typeof (value as Order).id === 'string'
  );
}

// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

// Usage
const rawData: unknown = JSON.parse(response.body);
if (isOrder(rawData)) {
  processOrder(rawData); // Type narrowed to Order
}

assertIsString(userId);
console.log(userId.toUpperCase()); // Compiler knows it's string
```

## Template Literal Types

```typescript
// Type-safe event system
type EventName = 'order' | 'user' | 'payment';
type EventAction = 'created' | 'updated' | 'deleted';
type AppEvent = `${EventName}:${EventAction}`;
// 'order:created' | 'order:updated' | ... | 'payment:deleted'

// Type-safe CSS properties
type CSSUnit = 'px' | 'rem' | 'em' | '%';
type CSSValue = `${number}${CSSUnit}`;

// Type-safe route builder
type Route = `/users/${string}` | `/orders/${string}` | '/dashboard';
```

## Branded Types for Primitive Safety

```typescript
// Prevent mixing up IDs of different types
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): Promise<User> { ... }
function getOrder(id: OrderId): Promise<Order> { ... }

const userId = createUserId('usr_123');
const orderId = 'ord_456' as OrderId;

getUser(userId);   // Fine
getUser(orderId);  // Compile error: OrderId is not assignable to UserId
```

## Trigger Phrases

- "TypeScript patterns"
- "TypeScript types"
- "TypeScript strict mode"
- "discriminated union"
- "utility types"
- "TypeScript best practices"
- "TypeScript generics"
- "branded types TypeScript"

## Quick Example

> See `typescript-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `any` spreading through the codebase | `JSON.parse` and external data returns `any` | Use `unknown` instead of `any` for external data; parse with Zod or io-ts to get a typed result |
| Type assertions (`as`) hiding bugs | Forcing a type that may not be correct at runtime | Replace `as` with type guards that actually check the value; `as` should only be used when you know more than the compiler |
| Generic type not being inferred | Generic type argument needed but not provided | TypeScript infers generics from arguments — make sure the argument is typed; or explicitly provide `<T>` at the call site |
| Optional chaining masking logic errors | `?.` silently returns undefined instead of throwing | Use optional chaining only where undefined is a valid, expected value; for required data, assert existence before accessing |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
