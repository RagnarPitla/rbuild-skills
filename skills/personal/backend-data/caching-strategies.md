---
name: Caching Strategies
slug: caching-strategies
description: Cache at every layer — CDN, Redis, query cache, HTTP headers — with invalidation patterns and the thundering herd solution.
tab: personal
domain: backend-data
industry_vertical: null
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"caching\", \"redis\", \"cdn\", \"performance\", \"invalidation\"]"
version: 1.0.1
icon_emoji: ⚡
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "Redis Documentation"
  - "title: "MDN Cache-Control"
requires: None
mcp_tools: []
---


# Caching Strategies

The right cache in the right place can take a 500ms API response to 5ms. The wrong cache in the wrong place creates stale data bugs that are hard to reproduce and harder to explain to your users.

## Where to Cache (Decision Tree)

```
Is it publicly accessible to all users?
  Yes → CDN cache
  
Is it user-specific but read-frequently?
  Yes → Application cache (Redis)
  
Is it a database query called repeatedly?
  Yes → Query result cache (Redis or in-memory)
  
Is it a static asset?
  Yes → CDN + aggressive browser cache (immutable)
```

## CDN Caching

Set Cache-Control headers on responses:

```
# Static assets (versioned URLs — cache forever)
Cache-Control: public, max-age=31536000, immutable

# HTML pages (cache briefly, revalidate)
Cache-Control: public, max-age=300, stale-while-revalidate=3600

# API responses (no cache by default for authenticated)
Cache-Control: private, no-store
```

**Cache-busting:** Append a content hash to asset filenames (`main.a3b4c5d.js`). When the file changes, the filename changes, busting the cache automatically.

## Redis Application Cache

The cache-aside pattern (most common):

```python
def get_user_profile(user_id: str):
    cache_key = f"user:profile:{user_id}"
    
    # Check cache first
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Cache miss — query database
    profile = db.query("SELECT * FROM users WHERE id = ?", user_id)
    
    # Store in cache with TTL
    redis.setex(cache_key, 3600, json.dumps(profile))  # 1 hour TTL
    
    return profile
```

**TTL Strategy:**
- User profiles: 1 hour
- Product catalog: 15 minutes
- Search results: 5 minutes
- Session data: 30 minutes (sliding window)
- Never cache: real-time inventory, account balances, financial data

## Cache Invalidation Patterns

**TTL-based (simplest):** Cache expires after N seconds. Data may be stale up to TTL. Use when slight staleness is acceptable.

**Write-through:** Update cache synchronously when data changes. Cache is always fresh. Adds latency to writes.

**Event-driven (best for accuracy):** When data changes, publish an event. Cache invalidation subscribes to events.

```python
# On data update
def update_product(product_id, data):
    db.update(product_id, data)
    redis.delete(f"product:{product_id}")  # Invalidate immediately
    event_bus.publish("product.updated", {"id": product_id})
```

## The Thundering Herd Problem

When a popular cache entry expires, thousands of requests hit the database simultaneously.

**Fix: Probabilistic Early Expiration**
```python
def get_with_early_expiry(key, ttl, fetch_fn, beta=1.0):
    cached = redis.get(key)
    if cached:
        data, expiry = json.loads(cached)
        # Recalculate early with some probability
        if time.time() - math.log(random.random()) * beta < expiry:
            return data
    
    # Fetch and cache
    data = fetch_fn()
    redis.setex(key, ttl, json.dumps([data, time.time() + ttl]))
    return data
```

Simpler fix: Add random jitter to TTLs so not all entries expire simultaneously.

## What NOT to Cache

- User-specific sensitive data (financial records, medical data) — session-scoped only
- Real-time inventory/availability — staleness has real business consequences
- Anything that changes more frequently than its TTL — you'll serve stale data more than fresh
- Authentication tokens — security risk

## Trigger Phrases

- "Help me with caching strategies"
- "Caching Strategies"
- "How do I caching strategies"

## Quick Example

> See `caching-strategies-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
