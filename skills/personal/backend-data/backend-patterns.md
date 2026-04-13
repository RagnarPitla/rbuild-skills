---
name: "backend-patterns"
slug: "backend-patterns"
description: "REST API design, service layer architecture, dependency injection, async processing, and queue-based decoupling for Node.js and TypeScript backends. Use when user says 'backend architecture', 'API design patterns', 'service layer', 'dependency injection Node', 'async queue processing', 'REST resource naming', 'error handling middleware'."
tab: "personal"
domain: "backend-data"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "backend", "api", "architecture"]
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


# Backend Patterns

Production backend architecture is about clear layers, predictable error handling, and decoupled components. These patterns work at scale.

## REST Resource Design

Name resources as nouns, not verbs. Use plural. Keep it hierarchical:

```
GET    /users              # List users
GET    /users/:id          # Get user
POST   /users              # Create user
PATCH  /users/:id          # Partial update
DELETE /users/:id          # Delete user

# Nested resources for relationships
GET    /users/:id/orders   # Orders belonging to user

# Actions that don't fit CRUD: use sub-resources
POST   /orders/:id/cancel  # Cancel an order
POST   /invoices/:id/send  # Send an invoice
```

**Versioning:** `/api/v1/...` in the URL path. Never break v1 after release.

**Pagination:** Always paginate list endpoints. Use cursor-based for large datasets:

```typescript
// Request: GET /users?limit=20&cursor=eyJpZCI6MTAwfQ==
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    total?: number;
  };
}
```

## Service Layer Architecture

Separate concerns: Route handlers receive requests, services execute business logic, repositories talk to data stores.

```typescript
// routes/users.ts — HTTP only
router.post('/users', async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);  // Centralized error handling
  }
});

// services/userService.ts — Business logic
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private auditLog: AuditLogService
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    // Validate
    if (await this.userRepo.findByEmail(data.email)) {
      throw new ConflictError('Email already registered');
    }

    // Business logic
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({ ...data, password: hashedPassword });

    // Side effects (non-blocking)
    setImmediate(() => {
      this.emailService.sendWelcome(user).catch(console.error);
      this.auditLog.record('user.created', user.id).catch(console.error);
    });

    return user;
  }
}

// repositories/userRepository.ts — Data access only
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.users.findFirst({ where: { email } });
  }
  
  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return db.users.create({ data });
  }
}
```

## Dependency Injection

Avoid `new` inside service classes. Inject dependencies at construction:

```typescript
// container.ts — wire everything together once
import { Container } from 'inversify';

const container = new Container();

container.bind(UserRepository).toSelf().inSingletonScope();
container.bind(EmailService).toSelf().inSingletonScope();
container.bind(UserService).toSelf().inTransientScope();

export { container };

// Usage in route
const userService = container.get(UserService);
```

Benefits: testable (swap real services for mocks), loosely coupled, easier to manage lifetimes.

## Centralized Error Handling

All errors funnel to one Express error middleware:

```typescript
// middleware/errorHandler.ts
interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const isOperational = statusCode < 500;

  // Log server errors
  if (!isOperational) {
    logger.error({ err, req: { method: req.method, url: req.url } });
  }

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: isOperational ? err.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

// Custom error classes
export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';
}

export class ConflictError extends Error {
  statusCode = 409;
  code = 'CONFLICT';
}

export class ValidationError extends Error {
  statusCode = 422;
  code = 'VALIDATION_ERROR';
}
```

## Async Queue Processing

For operations that shouldn't block the HTTP response, use a queue:

```typescript
import Bull from 'bull';

const emailQueue = new Bull('email', {
  redis: { host: process.env.REDIS_HOST, port: 6379 }
});

// Producer: enqueue from service
await emailQueue.add('welcome', { userId: user.id, email: user.email }, {
  attempts: 3,           // Retry 3 times on failure
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: 100  // Keep last 100 completed jobs
});

// Consumer: process in worker process
emailQueue.process('welcome', async (job) => {
  const { userId, email } = job.data;
  await sendWelcomeEmail(email);
  await db.users.update({ where: { id: userId }, data: { welcomeEmailSent: true } });
});
```

Use queues for: email sending, PDF generation, webhook delivery, bulk data processing, anything that can fail and needs retry.

## Request Validation

Validate at the boundary (route handler), not deep in the service:

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'viewer']).default('user')
});

router.post('/users', validate(CreateUserSchema), async (req, res, next) => {
  // req.body is typed and validated here
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError(result.error.message));
    }
    req.body = result.data;
    next();
  };
}
```

## Trigger Phrases

- "backend architecture"
- "API design patterns"
- "service layer"
- "dependency injection Node"
- "async queue processing"
- "REST resource naming"
- "error handling middleware"
- "request validation TypeScript"

## Quick Example

> See `backend-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Route handlers contain business logic | No service layer, handlers doing everything | Extract all logic into service classes; routes should only handle HTTP parsing and response |
| Unhandled promise rejections | Async route handlers without try/catch | Use express-async-errors or wrap all async routes in a tryCatch helper |
| Slow endpoints under load | Synchronous operations blocking event loop | Move heavy operations (PDF, email, bulk processing) to queue workers |
| Validation errors leaking stack traces | Error handler sending raw errors in production | Check NODE_ENV in error handler; only send stack trace in development |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
