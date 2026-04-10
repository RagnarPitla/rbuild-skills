# Database Migrations — Example

## Scenario: Renaming a Column in a 50M-Row Orders Table Without Downtime

**Who:** Sam Novak, Senior Backend Developer at an e-commerce company (24/7 operations, 50M orders table, PostgreSQL 15 on RDS, Node.js API layer)
**Where:** PostgreSQL 15, Flyway for migrations, Node.js 20 API, AWS RDS Multi-AZ, Blue/Green deployments via CodeDeploy
**The Problem:** The column `order_ref` in the `orders` table needs to be renamed to `external_order_id` to match a new API contract with a third-party logistics provider. The table has 50M rows. The app runs 24/7 with zero scheduled downtime. A naive `ALTER TABLE orders RENAME COLUMN` takes a full table lock and would kill the app for 8-12 minutes. The last time a developer ran a locking migration, there was a P1 incident and a post-mortem.

**Prerequisites:** PostgreSQL 15+, Flyway or Liquibase for migration management, a Blue/Green or rolling deployment strategy in place. The rename must be reversible.

---

### What You Say to the Agent

> "I need to rename a heavily-used column in a 50M-row orders table without downtime. The app is running 24/7. The column is `order_ref` and it needs to become `external_order_id`. Walk me through a safe zero-downtime rename."

### What the Agent Does

1. **Designs the 3-phase expand-contract migration:** Phase 1 (Expand): Add the new column alongside the old one. Phase 2 (Migrate): Backfill data and update the app to write to both columns. Phase 3 (Contract): Once all app instances read from the new column only, drop the old column. This approach means no single step is destructive or requires a lock

2. **Writes Phase 1 migration (safe, seconds to execute):**
   ```sql
   -- V1__add_external_order_id.sql
   ALTER TABLE orders ADD COLUMN external_order_id VARCHAR(50);
   CREATE INDEX CONCURRENTLY idx_orders_external_order_id ON orders(external_order_id);
   ```
   `ADD COLUMN` on PostgreSQL 15 is instant (no table rewrite, no lock). `CREATE INDEX CONCURRENTLY` builds the index without blocking reads or writes — takes ~4 minutes on 50M rows but never blocks

3. **Writes the backfill script for Phase 2:** Batched update to avoid a single massive write lock:
   ```sql
   -- Run in batches of 10,000 rows
   UPDATE orders SET external_order_id = order_ref
   WHERE id BETWEEN $start AND $end AND external_order_id IS NULL;
   ```
   Each batch takes ~200ms, runs in a loop with a 50ms sleep between batches to avoid replication lag. Full backfill of 50M rows completes in ~3 hours without impacting production

4. **Updates the application code to dual-write:** Deploys app version that writes to BOTH `order_ref` and `external_order_id` on every insert/update. Reads come from `external_order_id` with a coalesce fallback: `COALESCE(external_order_id, order_ref)`. This makes the app forward-compatible before the backfill is complete

5. **Phase 3 contract migration (after backfill verified):**
   ```sql
   -- V2__drop_order_ref.sql (run 1 week after Phase 2 verified complete)
   ALTER TABLE orders DROP COLUMN order_ref;
   ```
   Only runs after monitoring confirms zero reads from `order_ref` in application logs for 48 hours

### The Business Impact

- **Zero downtime achieved** — the entire migration ran across 2 weeks with no P1 incidents, no lock contention alerts, and no customer-facing errors
- **Reversibility maintained throughout** — at any point during the 2-week window, rolling back required only deploying the previous app version; no destructive steps had been taken
- **Pattern documented and adopted** — the expand-contract migration approach became the team's standard for all column renames and type changes on tables over 1M rows

### Try It Yourself

> "The column rename worked perfectly. Now I have a harder problem: I need to change the `order_status` column from a VARCHAR enum ('pending', 'shipped', 'delivered') to a proper PostgreSQL ENUM type. Same 50M-row table, same zero-downtime requirement. Does the expand-contract approach work here, and what are the extra risks?"
