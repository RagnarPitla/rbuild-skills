---
name: python-patterns
description: Pythonic idioms, PEP 8 standards, type hints, dataclasses, and best practices for robust Python applications. Use when user says 'Python best practices', 'Pythonic code', 'Python type hints', 'Python patterns', 'idiomatic Python', 'Python async await'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, language, python, patterns]
---


# Python Patterns

Pythonic code is readable code. These patterns use Python's strengths: expressive syntax, rich standard library, and a type system that catches bugs at development time.

## Type Hints: Make Intent Explicit

```python
# Without type hints: guessing game
def process_order(order, user, options=None):
    pass

# With type hints: self-documenting
from typing import Optional
from dataclasses import dataclass

def process_order(
    order: Order,
    user: User,
    options: Optional[ProcessOptions] = None
) -> ProcessResult:
    pass

# Generics
from typing import TypeVar, Generic

T = TypeVar('T')

def first_or_default(items: list[T], default: T) -> T:
    return items[0] if items else default
```

## Dataclasses Over Dicts

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Order:
    id: str
    customer_id: str
    items: list['OrderItem'] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    status: str = 'pending'

    def total(self) -> float:
        return sum(item.price * item.quantity for item in self.items)

@dataclass(frozen=True)  # Immutable
class Money:
    amount: float
    currency: str = 'USD'

    def __add__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} and {other.currency}")
        return Money(self.amount + other.amount, self.currency)
```

## Context Managers

```python
# Use contextlib.contextmanager for simple context managers
from contextlib import contextmanager

@contextmanager
def database_transaction(db):
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise

with database_transaction(db) as txn:
    txn.insert(order)
    txn.insert(order_items)
    # Commits on success, rolls back on exception

# As a class (when you need state)
class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.elapsed = time.perf_counter() - self.start

with Timer() as t:
    expensive_operation()
print(f"Took {t.elapsed:.2f}s")
```

## Generators for Memory Efficiency

```python
# Bad: loads all records into memory
def get_all_users() -> list[User]:
    return db.query("SELECT * FROM users").fetchall()

# Good: yields one at a time
def stream_users() -> Generator[User, None, None]:
    offset = 0
    batch_size = 1000
    while True:
        batch = db.query("SELECT * FROM users LIMIT ? OFFSET ?",
                         batch_size, offset).fetchall()
        if not batch:
            break
        yield from batch
        offset += batch_size

# Usage
for user in stream_users():
    process_user(user)
```

## Async/Await for I/O-Bound Code

```python
import asyncio
import httpx

async def fetch_user_data(user_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/api/users/{user_id}")
        response.raise_for_status()
        return response.json()

# Parallel execution with asyncio.gather
async def load_dashboard(user_id: str) -> Dashboard:
    orders, profile, stats = await asyncio.gather(
        fetch_orders(user_id),
        fetch_profile(user_id),
        fetch_stats(user_id),
    )
    return Dashboard(orders=orders, profile=profile, stats=stats)

# Error handling in parallel tasks
results = await asyncio.gather(
    fetch_orders(user_id),
    fetch_profile(user_id),
    return_exceptions=True  # Don't cancel others if one fails
)
for result in results:
    if isinstance(result, Exception):
        logger.error(f"Task failed: {result}")
```

## Exception Handling Patterns

```python
# Custom exception hierarchy
class AppError(Exception):
    """Base exception for application errors."""
    pass

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__(f"{resource} with id '{id}' not found")
        self.resource = resource
        self.id = id

class ValidationError(AppError):
    def __init__(self, field: str, message: str):
        super().__init__(f"Validation failed for '{field}': {message}")
        self.field = field

# Catching specific exceptions
try:
    user = get_user(user_id)
except NotFoundError:
    return Response(status=404)
except ValidationError as e:
    return Response(status=422, body={"field": e.field, "error": str(e)})
except AppError as e:
    logger.error(f"Application error: {e}")
    return Response(status=500)
```

## List Comprehensions vs Generators

```python
# List comprehension: when you need all results
squares = [x**2 for x in range(100)]

# Generator expression: when you're iterating once
total = sum(x**2 for x in range(100))

# Dict comprehension
user_map = {user.id: user for user in users}

# Nested comprehension (readable limit: 2 levels)
flat = [item for sublist in matrix for item in sublist]
```

## Trigger Phrases

- "Python best practices"
- "Pythonic code"
- "Python type hints"
- "Python patterns"
- "idiomatic Python"
- "Python async await"
- "Python dataclasses"
- "Python generators"

## Quick Example

> See `python-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Mutable default argument bug | Using `def f(items=[])` — the list is created once at definition | Use `def f(items=None): items = items or []` or `field(default_factory=list)` in dataclasses |
| Async function called without await | Forgetting `await` returns a coroutine object, not the result | Add `await`; enable `asyncio.get_event_loop().set_debug(True)` to warn about unawaited coroutines |
| Memory error on large datasets | Loading all rows into a list | Switch to generators or database cursors with `fetchmany(batch_size)` |
| Type hints ignored at runtime | Type hints are not enforced by Python | Use `mypy` or `pyright` in CI to catch type errors; `pydantic` for runtime validation of external data |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
