---
name: database-migrations
description: "Zero-downtime database schema changes — expand/contract pattern, backwards-compatible migrations, feature flags, rollback strategies, and testing. Use when user says 'database migration', 'zero-downtime migration', 'schema change production', 'rename column safely', 'expand contract pattern', 'rollback migration', 'migration testing'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, backend, migrations, zero-downtime]
---

# Database Migrations

Schema changes in production are where most database disasters happen. The Expand/Contract pattern eliminates downtime and makes rollbacks safe.

## The Expand/Contract Pattern

Never make breaking schema changes in a single deployment. Split them into three phases:

```
Phase 1: EXPAND (add new structure, keep old)
  - Add new column (nullable or with default)
  - Add new table
  - Add new index
  Application still uses old structure. New structure exists but unused.

Phase 2: MIGRATE (dual-write, backfill)
  - Deploy app that writes to BOTH old and new columns
  - Run backfill to populate new column from old data
  - Verify data integrity

Phase 3: CONTRACT (remove old structure)
  - Deploy app that reads/writes only new column
  - Drop old column in a separate migration
  - Old column gone, new structure stable
```

This approach means any single deployment can be rolled back without data loss.

## Example: Renaming a Column Safely

Renaming `users.full_name` to `users.display_name`:

```sql
-- Phase 1: EXPAND
-- Add new column (nullable initially)
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- Create index on new column immediately
CREATE INDEX CONCURRENTLY idx_users_display_name ON users(display_name);
```

```typescript
// Phase 2: App writes to BOTH columns
async function updateUserName(userId: string, name: string) {
  await db.users.update({
    where: { id: userId },
    data: {
      full_name: name,      // old — still writing
      display_name: name    // new — now also writing
    }
  });
}
```

```sql
-- Phase 2: Backfill existing rows
UPDATE users SET display_name = full_name WHERE display_name IS NULL;

-- Make it NOT NULL after backfill is verified
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
```

```sql
-- Phase 3: CONTRACT (separate deployment, after verification)
ALTER TABLE users DROP COLUMN full_name;
```

## Backwards-Compatible Migration Rules

| Change | Safe? | Notes |
|---|---|---|
| Add nullable column | Yes | Old app ignores it |
| Add column with default | Yes | Old app ignores it |
| Add index CONCURRENTLY | Yes | Non-locking in Postgres |
| Drop column | NO | Old app will break if it references it |
| Rename column | NO | Use expand/contract |
| Change column type | DEPENDS | Widening safe (INT to BIGINT), narrowing not safe |
| Add NOT NULL constraint | NO without default | Fails on insert from old app |

## Feature Flags During Migration

Use feature flags to control which code path is active:

```typescript
// feature-flags.ts
const flags = {
  USE_DISPLAY_NAME: process.env.USE_DISPLAY_NAME === 'true'
};

// In service
function getUserDisplayField(user: User): string {
  if (flags.USE_DISPLAY_NAME) {
    return user.display_name;
  }
  return user.full_name;
}
```

Deploy the migration, then flip the flag to cut over without redeployment. If something breaks, flip the flag back.

## Rollback Strategies

**Migration rollback script:** Every migration should have a matching down migration:

```typescript
// migrations/20260410_add_display_name.ts
export async function up(db: Knex) {
  await db.schema.table('users', (table) => {
    table.string('display_name', 255).nullable();
  });
}

export async function down(db: Knex) {
  await db.schema.table('users', (table) => {
    table.dropColumn('display_name');
  });
}
```

**Safe rollback window:** After a Phase 3 (drop column) migration runs, the old app code can no longer reference the old column. This is the point of no return. Ensure you never roll back to before Phase 3 unless you can also restore the data.

## Large Table Migrations

For tables with millions of rows, never do a full-table update in a single transaction:

```python
def backfill_in_batches(table: str, batch_size: int = 1000):
    """Backfill new column in small batches to avoid locking."""
    offset = 0
    
    while True:
        rows = db.execute(f"""
            UPDATE {table}
            SET display_name = full_name
            WHERE display_name IS NULL
            LIMIT {batch_size}
            RETURNING id
        """)
        
        if rows.rowcount == 0:
            break
        
        offset += rows.rowcount
        print(f"Backfilled {offset} rows...")
        time.sleep(0.1)  # Brief pause to reduce DB load
```

## Migration Testing Checklist

- [ ] Migration tested on a copy of production data before running on production
- [ ] Down migration verified (rollback works)
- [ ] Large table migration uses batches or CONCURRENTLY
- [ ] New columns are nullable or have defaults (backwards compatible)
- [ ] Index creation uses CREATE INDEX CONCURRENTLY in Postgres
- [ ] Feature flag in place to control cutover
- [ ] Monitoring in place to detect errors after each phase

## Trigger Phrases

- "database migration"
- "zero-downtime migration"
- "schema change production"
- "rename column safely"
- "expand contract pattern"
- "rollback migration"
- "migration testing"
- "backfill large table"

## Quick Example

> See `database-migrations-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Migration locks the table | ALTER TABLE without CONCURRENTLY on large table | Use CREATE INDEX CONCURRENTLY; for column changes use pg_repack or expand/contract |
| Rollback breaks the app | App code references dropped column | Never deploy Phase 3 drop until app code that references old column is already removed from all active deployments |
| Backfill times out | Updating millions of rows in one transaction | Switch to batch backfill with LIMIT and brief sleep between batches |
| Migration fails halfway | No transaction wrapping or interrupted connection | Wrap schema changes in transactions where possible; use idempotent migrations (IF NOT EXISTS, IF EXISTS) |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
