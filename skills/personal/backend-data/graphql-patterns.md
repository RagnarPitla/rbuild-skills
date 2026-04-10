---
name: graphql-patterns
description: "Design GraphQL APIs — schema-first development, DataLoader for N+1, subscriptions, federation, and when to use REST instead. Use when user says 'GraphQL schema', 'N+1 problem', 'DataLoader', 'GraphQL subscriptions', 'cursor pagination GraphQL', 'GraphQL vs REST', 'GraphQL security', 'depth limiting'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, backend, graphql, api]
---

# GraphQL Patterns

GraphQL solves real problems (over-fetching, under-fetching, multiple round trips) but introduces new ones if not implemented carefully. Here's what actually works in production.

## Schema-First Design

Write the schema before implementation. The schema is your API contract.

```graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter, limit: Int = 20): UserConnection!
}

type User {
  id: ID!
  email: String!
  name: String!
  orders(status: OrderStatus): [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
  items: [OrderItem!]!
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
}
```

Design for the client's needs, not your database schema. These often diverge.

## The N+1 Problem (and DataLoader)

The most common GraphQL performance bug:

```javascript
// Bad: N+1 queries
const resolvers = {
  Order: {
    customer: async (order) => {
      // This fires a DB query for EVERY order
      return db.customers.findById(order.customerId);
    }
  }
}
// If you load 100 orders -> 100 customer queries
```

**Fix: DataLoader**
```javascript
const DataLoader = require('dataloader');

const customerLoader = new DataLoader(async (customerIds) => {
  // ONE query for all IDs
  const customers = await db.customers.findMany({ id: { in: customerIds } });
  return customerIds.map(id => customers.find(c => c.id === id));
});

const resolvers = {
  Order: {
    customer: (order) => customerLoader.load(order.customerId)
  }
}
// Now 100 orders -> 1 customer query (batched)
```

DataLoader automatically batches requests within the same tick and caches results within a request.

## Cursor-Based Pagination

Use cursor pagination for large datasets — page numbers break when data changes between requests.

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}
```

```javascript
// Resolver implementation
async users(_, { limit = 20, after }) {
  const cursor = after ? decodeCursor(after) : null;
  const items = await db.users.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' }
  });

  const hasNextPage = items.length > limit;
  const edges = items.slice(0, limit).map(item => ({
    node: item,
    cursor: encodeCursor(item.id)
  }));

  return {
    edges,
    pageInfo: { hasNextPage, endCursor: edges.at(-1)?.cursor }
  };
}
```

## Subscriptions (Real-Time)

```graphql
type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}
```

```javascript
const resolvers = {
  Subscription: {
    orderStatusChanged: {
      subscribe: (_, { orderId }) =>
        pubsub.asyncIterator(`ORDER_UPDATED_${orderId}`),
    }
  }
};

// Publish when status changes
pubsub.publish(`ORDER_UPDATED_${orderId}`, { orderStatusChanged: updatedOrder });
```

Use subscriptions only for genuine real-time needs. They're complex to scale (require persistent connections). For polling-friendly data, use polling queries instead.

## When to Use REST Instead

GraphQL is not always the answer:

**Use REST when:**
- Simple CRUD API with well-defined resources
- Public API with external consumers (REST is more universally understood)
- File upload/download endpoints
- Your team is unfamiliar with GraphQL (learning curve is real)

**Use GraphQL when:**
- Multiple clients with different data needs (mobile vs web vs partner)
- Complex nested data relationships
- Rapid frontend iteration (schema drives development)
- You need subscriptions

## Security

```javascript
// Limit query depth (prevent deeply nested attacks)
import depthLimit from 'graphql-depth-limit';
server.use('/graphql', graphqlHTTP({
  validationRules: [depthLimit(7)]
}));

// Limit query complexity
import { createComplexityLimitRule } from 'graphql-validation-complexity';
server.use('/graphql', graphqlHTTP({
  validationRules: [createComplexityLimitRule(1000)]
}));

// Disable introspection in production
const server = new ApolloServer({
  introspection: process.env.NODE_ENV !== 'production'
});
```

## Trigger Phrases

- "GraphQL schema"
- "N+1 problem"
- "DataLoader"
- "GraphQL subscriptions"
- "cursor pagination GraphQL"
- "GraphQL vs REST"
- "GraphQL security"
- "depth limiting"

## Quick Example

> See `graphql-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Slow queries on nested types | N+1 problem — resolver fires per-row DB query | Wrap all batched lookups in DataLoader; one loader per entity type |
| Query takes down the database | Deeply nested query with no depth limit | Add depthLimit(7) and complexity limits to validation rules; test with nested query attacks |
| Subscriptions disconnect frequently | No heartbeat or proxy timeout | Add keepAlive to WebSocket connection; configure proxy timeout to exceed heartbeat interval |
| Introspection exposes schema in production | Missing introspection guard | Set `introspection: process.env.NODE_ENV !== 'production'` in server config |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
