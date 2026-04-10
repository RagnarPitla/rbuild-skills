# PostgreSQL Patterns — Example

## Scenario: 8-Second Query on 2M-Row Orders Table Caused by Sequential Scan

**Who:** Erik Lindqvist, Backend Developer at a wholesale distributor (PostgreSQL 15, 2M orders, 8M order lines, 500K products, D365 sync running every 15 minutes)
**Where:** PostgreSQL 15 on AWS RDS db.r6g.xlarge, Node.js 20 API, Prisma ORM, orders dashboard used by 80 sales reps
**The Problem:** The orders dashboard runs a query joining `orders`, `order_lines`, and `products` to show each rep's open orders with line details. On 2M rows, the query takes 8 seconds. Sales reps are refreshing the page multiple times, causing query pile-up. `EXPLAIN ANALYZE` shows a sequential scan on `order_lines` (8.3M rows scanned). There is an index on `order_lines.order_id` but the query planner is ignoring it.

**Prerequisites:** PostgreSQL 15+, `EXPLAIN (ANALYZE, BUFFERS)` access, ability to run `CREATE INDEX CONCURRENTLY`. No ORM changes required — this is resolved at the database layer.

---

### What You Say to the Agent

> "My PostgreSQL query joining orders, order_lines, and products is taking 8 seconds on 2M rows. EXPLAIN ANALYZE shows a sequential scan on order_lines. Help me diagnose and fix it."

### What the Agent Does

1. **Runs a full EXPLAIN ANALYZE with BUFFERS:**
   ```sql
   EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
   SELECT o.order_number, o.status, ol.line_number, ol.quantity, p.product_name
   FROM orders o
   JOIN order_lines ol ON ol.order_id = o.id
   JOIN products p ON p.id = ol.product_id
   WHERE o.sales_rep_id = $1 AND o.status IN ('Open', 'Confirmed')
   ORDER BY o.created_at DESC
   LIMIT 50;
   ```
   Output reveals: the planner estimated 12,000 matching orders but actually found 180. Low estimate caused it to choose a nested loop plan that sequential-scanned `order_lines` instead of using the index

2. **Identifies stale statistics as the root cause:** Runs `SELECT reltuples, last_analyze FROM pg_stat_user_tables WHERE relname = 'orders'`. Last analyze: 19 days ago. Since then, 340,000 new orders were inserted (17% of the table) without triggering autovacuum analyze because `autovacuum_analyze_scale_factor` defaults to 0.2 (20% threshold). Statistics are badly out of date

3. **Runs immediate fix + configures ongoing maintenance:**
   ```sql
   ANALYZE orders;
   ANALYZE order_lines;
   -- Per-table autovacuum tuning for high-churn tables
   ALTER TABLE orders SET (autovacuum_analyze_scale_factor = 0.02);
   ALTER TABLE order_lines SET (autovacuum_analyze_scale_factor = 0.02);
   ```
   After `ANALYZE`, re-running `EXPLAIN ANALYZE` shows the planner now uses the `idx_order_lines_order_id` index correctly. Query drops to 420ms

4. **Adds a composite index for the filter pattern:**
   ```sql
   CREATE INDEX CONCURRENTLY idx_orders_rep_status_created
   ON orders (sales_rep_id, status, created_at DESC)
   WHERE status IN ('Open', 'Confirmed');
   ```
   Partial index only covers active orders (400K rows, not 2M). With the composite index, the query planner can satisfy the entire `WHERE` clause from the index without touching the main table. Query drops further to 38ms

5. **Adds a query performance regression test:** Creates a pg_stat_statements baseline snapshot. Sets up a weekly scheduled job that re-runs the top 20 slowest queries and alerts if any query's mean execution time doubles. This catches statistics staleness and index degradation before users notice

### The Business Impact

- **Query time dropped from 8,000ms to 38ms** — a 210x improvement. No code changes required, only database-layer fixes
- **Dashboard page load went from 9.2 seconds to 0.8 seconds** — sales reps stopped refreshing, which eliminated the query pile-up (peak concurrent queries dropped from 40 to 3)
- **Systematic fix, not a one-time patch** — the autovacuum tuning and regression test prevent this class of problem from recurring as data volumes grow

### Try It Yourself

> "The orders query is fast now. But I have a second slow query: a report that aggregates total order value by product category for the last 90 days. It joins 5 tables and takes 12 seconds. EXPLAIN ANALYZE shows it's recalculating the same aggregates on every request. How do I use a PostgreSQL materialized view to cache this result and refresh it on a schedule?"
