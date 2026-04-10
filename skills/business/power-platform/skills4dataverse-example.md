# Skills4Dataverse — Example

## Scenario: Syncing 116 Skill Markdown Files into the Dataverse Business Skills Catalog

**Who:** Tariq Mensah, Power Platform Admin, managing the skills.rbuild.ai catalog environment
**Where:** Power Platform, Dataverse, rbuild-skills GitHub repository, Skills4Dataverse solution
**The Problem:** The rbuild-skills repository now has 116 skill markdown files across 9 category directories. The skills.rbuild.ai catalog is backed by a Dataverse Business Skills table (`rbai_businessskill`). Tariq runs the sync manually every few weeks, but it's becoming error-prone: he's missed 12 new skills added in the last month, three records have stale descriptions because the source .md files were updated, and two records were accidentally duplicated during a manual import. He needs a reliable, repeatable sync process that handles inserts for new skills, updates for changed skills, and skips unchanged records without creating duplicates.

**Prerequisites:** Skills4Dataverse solution installed. Power Platform CLI (pac) installed and authenticated. rbuild-skills repo cloned and current (git pull). skills4dataverse skill loaded.

---

### What You Say to the Agent

> "I need to sync all 116 skill .md files from the rbuild-skills repo into the Dataverse Business Skills table. New skills should be inserted, changed skills should be updated, and unchanged skills should be skipped. No duplicates. I've been doing this manually and it's a mess. Help me build a reliable sync."

### What the Agent Does

1. Reads all 116 .md files from the repo and builds an index: skill slug (derived from filename), name, description, category, last modified date
2. Queries the existing Dataverse table to get all current records: returns 104 records, with `rbai_skillslug` as the unique key
3. Compares the two sets:

```
SYNC ANALYSIS:
  Total skills in repo: 116
  Current Dataverse records: 104
  New skills to INSERT: 12
    - foundation-models-on-device (apple)
    - liquid-glass-design (frontend)
    - [10 more...]
  Changed skills to UPDATE: 8
    - customs-trade-compliance (description updated 3 days ago)
    - niyam-worker-v2 (trigger examples updated)
    - [6 more...]
  Unchanged skills to SKIP: 96
  Duplicate records detected: 2 (customs-trade-compliance appears twice — will deduplicate)
  
  TOTAL OPERATIONS: 12 inserts + 8 updates + 2 deletes (duplicates) = 22 changes
```

4. Generates the upsert payload using `rbai_skillslug` as the match key — Dataverse upsert prevents duplicate creation even if the sync runs twice
5. Executes the sync:

```bash
# Delete duplicate records first
pac data delete --environment "prod" --table rbai_businessskill --filter "rbai_skillslug eq 'customs-trade-compliance' and statecode eq 0" --top 1

# Run upsert for all 116 skills
pac data import --data skills-sync-upsert.csv --environment "prod" --upsert-match-column rbai_skillslug
```

6. Outputs a sync report: 12 inserted, 8 updated, 96 skipped, 2 duplicates removed, 0 errors

### The Business Impact

- **Catalog is now accurate and complete** — all 116 skills visible in skills.rbuild.ai for the first time, including 12 that had been missing for weeks
- **Zero duplicates** — upsert pattern using skill slug as the match key makes the sync idempotent
- **Sync time: 4 minutes** — versus 45-60 minutes of manual work per sync cycle
- **Scheduled weekly** — Tariq set up a GitHub Actions workflow that runs the sync every Monday, keeping Dataverse current without manual intervention

### Try It Yourself

> "The repo just added a new category directory called 'healthcare'. It has 8 new skill files. Run a targeted sync for just that category and show me what will be inserted."
