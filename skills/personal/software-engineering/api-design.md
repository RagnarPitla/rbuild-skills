---
name: "api-design"
slug: "api-design"
description: "REST API design principles covering resource naming, HTTP semantics, status codes, pagination, versioning, and OpenAPI documentation. Use when user says 'design an API', 'REST API best practices', 'API versioning', 'pagination strategy', 'OpenAPI spec', 'status code selection'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "software-engineering", "api", "rest"]
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



# API Design

REST API design is about building contracts that don't break. Good API design is 90% restraint: naming things consistently, not inventing custom conventions, and thinking about your API consumer before yourself.

## Resource Naming: Nouns Not Verbs

Resources are nouns. Actions are HTTP methods.

```
# Wrong — verb-based
POST /createUser
GET  /getUserById/123
POST /deleteUser

# Right — noun-based, method-driven
POST   /users
GET    /users/123
DELETE /users/123
```

**Plural nouns** for collections, singular for individual resources (some teams use plural throughout — pick one and stick to it).

**Nested resources** for ownership relationships:
```
GET  /users/123/orders          # Orders for user 123
GET  /users/123/orders/456      # Specific order for user 123
POST /users/123/orders          # Create order for user 123
```

Only nest one level deep. `/users/123/orders/456/items` is harder to cache and harder to document.

## HTTP Method Semantics

| Method | Semantics | Body | Idempotent | Safe |
|--------|-----------|------|------------|------|
| GET | Read | No | Yes | Yes |
| POST | Create | Yes | No | No |
| PUT | Replace entirely | Yes | Yes | No |
| PATCH | Partial update | Yes | No | No |
| DELETE | Remove | No | Yes | No |

**Idempotent** means calling it N times has the same effect as calling it once. PUT and DELETE are idempotent. POST is not.

Never use GET for operations that change state. Search engines and caches will call your GET endpoints.

## Status Code Selection

The most commonly misused part of REST.

### 2xx Success
| Code | When to Use |
|------|-------------|
| 200 | Request succeeded, body contains the result |
| 201 | Resource created (POST). Include `Location` header with the new resource URL |
| 204 | Success with no response body (DELETE, some PATCHes) |

### 4xx Client Errors
| Code | When to Use |
|------|-------------|
| 400 | Malformed request syntax (unparseable JSON, missing required fields) |
| 401 | Not authenticated (no token, expired token) |
| 403 | Authenticated but not authorized (token valid, wrong permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource, version conflict) |
| 422 | Validation error (valid JSON, but field values fail business rules) |
| 429 | Rate limit exceeded |

**400 vs 422:** Use 400 for structural problems (can't parse the request). Use 422 for semantic problems (request parsed fine, but email is invalid format).

### 5xx Server Errors
| Code | When to Use |
|------|-------------|
| 500 | Unexpected server error (never intentionally return this) |
| 503 | Service temporarily unavailable (overload, maintenance) |

## Error Response Format

Consistent error responses matter as much as status codes. Clients need to parse errors programmatically.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      },
      {
        "field": "age",
        "code": "OUT_OF_RANGE",
        "message": "Age must be between 18 and 120"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

Always include a `request_id` — it makes debugging production issues possible.

## Pagination

### Offset Pagination (simple, but has problems)
```
GET /users?offset=0&limit=20
GET /users?offset=20&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "offset": 0,
    "limit": 20,
    "total": 147
  }
}
```

Problem: if items are inserted/deleted between pages, you get duplicates or skip items.

### Cursor Pagination (correct for most cases)
```
GET /users?limit=20
GET /users?after=cursor_xyz&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "has_next": true,
    "next_cursor": "cursor_xyz123",
    "has_prev": false
  }
}
```

Cursor is typically an opaque base64-encoded value (the ID or sort key of the last item). Stable across insertions.

**Use cursor pagination for:** feeds, activity streams, any sorted list.
**Use offset pagination for:** admin UIs where users jump to page 47, reports.

## Filtering and Sorting

```
GET /products?category=electronics&min_price=100&max_price=500
GET /orders?status=pending&created_after=2026-01-01T00:00:00Z
GET /users?sort=created_at:desc,name:asc
```

Keep filter parameter names consistent across your API. Document every filter parameter in OpenAPI.

## API Versioning

### URL Versioning (recommended for most APIs)
```
/v1/users
/v2/users
```

Pros: explicit, easy to route, visible in logs. Cons: URLs change.

### Header Versioning
```
Accept: application/vnd.myapi.v2+json
```

Pros: URLs stay stable. Cons: harder to test with browser/curl.

**Versioning strategy:**
- Never break v1 while v2 exists
- Deprecate with `Deprecation` response header
- Sunset date in `Sunset` header: `Sunset: Sat, 01 Jan 2027 00:00:00 GMT`
- Give clients at least 6 months to migrate

## OpenAPI Documentation

Generate your API spec, don't write it by hand.

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: Orders API
  version: 1.0.0

paths:
  /orders:
    post:
      summary: Create an order
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '201':
          description: Order created
          headers:
            Location:
              schema:
                type: string
              example: /orders/ord_abc123
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '422':
          $ref: '#/components/responses/ValidationError'

components:
  schemas:
    CreateOrderRequest:
      type: object
      required: [customer_id, items]
      properties:
        customer_id:
          type: string
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
```

## API Design Checklist

- [ ] Resources are nouns, not verbs
- [ ] HTTP methods match their semantics (GET never changes state)
- [ ] Status codes are specific (422 not 400 for validation, 403 not 404 for authorization)
- [ ] Error responses have consistent structure with error code, message, and request_id
- [ ] Pagination is implemented (cursor for feeds, offset for admin)
- [ ] All endpoints are documented in OpenAPI
- [ ] Versioning strategy is defined before v1 ships
- [ ] Rate limiting is implemented and documented (429 status + `Retry-After` header)
- [ ] Authentication is consistent (Bearer token in Authorization header)
- [ ] Breaking changes have a migration path

## Trigger Phrases

- "design an API"
- "REST API best practices"
- "API versioning"
- "pagination strategy"
- "OpenAPI spec"
- "status code selection"
- "API resource naming"
- "cursor vs offset pagination"

## Quick Example

> See `api-design-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Clients getting 400 when they expect 422 | Using 400 for all client errors | Reserve 400 for malformed syntax, use 422 for field validation failures |
| Pagination returning duplicates | Using offset pagination on a live-updating feed | Switch to cursor-based pagination using the last item's ID as the cursor |
| Breaking clients after a field rename | No versioning strategy | Never rename or remove fields in the same version; add new fields alongside old ones then deprecate |
| API spec drift from implementation | Spec written by hand separately | Generate spec from code annotations (e.g., tsoa, FastAPI, Spring Doc) to keep them in sync |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
