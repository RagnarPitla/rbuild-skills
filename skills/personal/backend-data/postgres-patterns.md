---
name: "postgres-patterns"
slug: "postgres-patterns"
description: "PostgreSQL query optimization, index strategies, EXPLAIN ANALYZE, connection pooling, JSONB patterns, and full-text search. Use when user says 'Postgres optimization', 'slow query Postgres', 'EXPLAIN ANALYZE', 'index strategy', 'partial index', 'covering index', 'PgBouncer', 'JSONB query', 'Postgres full-text search'."
tab: "personal"
domain: "backend-data"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "backend", "postgres", "query-optimization"]
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


# PostgreSQL Patterns

Postgres is powerful, but slow queries in production are almost always caused by missing indexes or inefficient query patterns. Know your EXPLAIN ANALYZE output.

## Reading EXPLAIN ANALYZE

Always run EXPLAIN ANALYZE (not just EXPLAIN) to get actual row counts and timing:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2026-01-01'
  AND u.status = 'active'
GROUP BY u.id;
```

Key things to look for:

| Output | What it Means |
|---|---|
| `Seq Scan` | Full table scan — usually needs an index |
| `Index Scan` | Using an index — good |
| `Index Only Scan` | Using a covering index — best |
| `Rows=10000 (actual 1)` | Row estimate way off — stale statistics |
| `Hash Join` vs `Nested Loop` | Hash join better for large sets; Nested Loop better for small |
| `cost=0.00..8000.00` | High cost number = expensive operation |

Run `ANALYZE table_name;` to refresh statistics if estimates are wildly wrong.

## Index Strategies

**Standard B-tree (default):** Good for equality, ranges, ORDER BY.

```sql
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Composite index:** Column order matters. Put the most selective column first, then the column used for range scans.

```sql
-- Supports: WHERE status = ? AND created_at > ?
-- Also supports: WHERE status = ?  (prefix match)
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
```

**Partial index:** Index only the rows you actually query. Smaller, faster:

```sql
-- Only index active users — if 90% are inactive, this is 10x smaller
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

**Covering index (Index Only Scan):** Include all columns the query needs so Postgres never hits the table:

```sql
-- Query: SELECT id, email, name FROM users WHERE status = 'active'
-- This covers the query entirely — no table access needed
CREATE INDEX idx_users_active_covering ON users(status) INCLUDE (id, email, name);
```

## Connection Pooling with PgBouncer

Postgres handles hundreds of connections poorly. Every connection uses ~5-10MB RAM and adds overhead. Use PgBouncer in transaction mode:

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction          # Most efficient — connection returned after each transaction
max_client_conn = 1000           # Max clients connecting to PgBouncer
default_pool_size = 20           # Max connections to Postgres per database
min_pool_size = 5
reserve_pool_size = 5
```

Application connects to PgBouncer (port 6432), not Postgres directly. PgBouncer manages the actual Postgres connection pool.

**Important:** In transaction mode, `SET` statements, advisory locks, and `LISTEN/NOTIFY` don't work reliably. Use session mode for those.

## JSONB Patterns

JSONB is first-class in Postgres. Use it for semi-structured data, not as a dump for everything:

```sql
-- Store metadata as JSONB
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'
);

-- Query JSONB fields
SELECT * FROM products
WHERE metadata->>'category' = 'electronics'
  AND (metadata->>'price')::numeric > 100;

-- Index a specific JSONB field
CREATE INDEX idx_products_category ON products((metadata->>'category'));

-- GIN index for general JSONB querying (containment, key existence)
CREATE INDEX idx_products_metadata ON products USING gin(metadata);

-- Array containment query (requires GIN index)
SELECT * FROM products WHERE metadata @> '{"tags": ["sale"]}';
```

## Full-Text Search

Postgres has built-in full-text search. Good enough for most use cases without Elasticsearch:

```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Populate it
UPDATE articles SET search_vector = to_tsvector('english', title || ' ' || body);

-- Create GIN index for fast FTS
CREATE INDEX idx_articles_fts ON articles USING gin(search_vector);

-- Search query
SELECT id, title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'agent & copilot') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;

-- Keep it updated via trigger
CREATE TRIGGER update_search_vector
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', title, body);
```

## Common Query Patterns

```sql
-- Upsert (insert or update)
INSERT INTO users (email, name, updated_at)
VALUES ('user@example.com', 'Alice', NOW())
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name, updated_at = EXCLUDED.updated_at;

-- Window function: rank within group
SELECT
  user_id,
  order_total,
  RANK() OVER (PARTITION BY user_id ORDER BY order_total DESC) as rank
FROM orders;

-- Recursive CTE: hierarchical data
WITH RECURSIVE org_tree AS (
  SELECT id, name, parent_id, 1 as depth
  FROM departments WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT d.id, d.name, d.parent_id, t.depth + 1
  FROM departments d
  JOIN org_tree t ON d.parent_id = t.id
)
SELECT * FROM org_tree ORDER BY depth, name;
```

## Trigger Phrases

- "Postgres optimization"
- "slow query Postgres"
- "EXPLAIN ANALYZE"
- "index strategy"
- "partial index"
- "covering index"
- "PgBouncer"
- "JSONB query"
- "Postgres full-text search"

## Quick Example

> See `postgres-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Sequential scan despite existing index | Index not selective enough, or query uses function on indexed column | Avoid wrapping indexed columns in functions (use `WHERE created_at > ?` not `WHERE DATE(created_at) > ?`); add partial index for filtered queries |
| EXPLAIN estimates wildly wrong | Stale table statistics | Run `ANALYZE table_name;` or enable autovacuum for the table |
| Connection pool exhausted | Too many app connections, no pooler | Add PgBouncer in transaction mode; reduce app connection pool size |
| JSONB queries slow | No index on queried JSONB fields | Add expression index on specific field: `CREATE INDEX ON t((jsonb_col->>'field'))` |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
