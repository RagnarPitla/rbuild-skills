---
name: "D365 Data Migration"
slug: "d365-data-migration"
description: "Plan and execute D365 F&O data migration — data entities, DIXF packages, cutover strategy, and validation patterns."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["d365-fno", "data-migration", "dixf", "implementation", "cutover"]
version: "1.0"
icon_emoji: "📦"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: "d365-fno-path"
learning_path_position: 8
prerequisites: ["d365-navigation-fundamentals"]
references:
  - title: "Data management and integration in D365"
    url: "https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/data-entities"
  - title: "Data import/export framework (DIXF)"
    url: "https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/data-import-export-job"
---

# D365 Data Migration

Data migration is one of the highest-risk activities in any D365 implementation. Bad data on day one creates years of downstream problems. Here's how to do it right.

## The Data Migration Framework

**Four phases:**
1. **Inventory** — what data exists in the source system?
2. **Map** — how does source data map to D365 entities?
3. **Transform** — clean, enrich, and format source data for D365
4. **Load + Validate** — import data and verify it's correct

Never skip the validation phase. It's where most migrations fail.

## D365 Data Entities

D365 provides hundreds of pre-built data entities for migration. Each entity imports data for a specific business object.

**Key migration entities:**

| Entity | Data It Imports |
|---|---|
| `CustomersV3` | Customer master records |
| `VendorsV2` | Vendor master records |
| `ReleasedProductsV2` | Item/product master |
| `InventJournalTableEntity` | Opening inventory balances |
| `LedgerJournalEntity` | Opening financial balances |
| `SalesOrderHeadersV2` | Open sales orders |
| `PurchaseOrderHeaderV2` | Open purchase orders |

Find entities: **Data management → Data entities** — search by name or module.

## DIXF (Data Import/Export Framework)

**Data management → Import** — the primary tool for bulk data migration.

**Import job setup:**
1. Name the job, select entity
2. Choose file format (Excel, CSV, XML)
3. Upload your data file
4. Map source columns to entity fields
5. Set error handling (stop on first error vs continue)
6. Run the import

**File format recommendation:** Excel for small datasets (<10K rows), CSV for large datasets. Always use the entity's template file as your starting point — download it from the entity details page.

## Mapping and Transformation

The hardest part of migration is transformation — converting source system values to D365-valid values.

**Common transformations needed:**
- Account numbers: Legacy format → D365 chart of accounts structure
- Customer/Vendor codes: Old codes → new codes (if renumbering)
- Unit of measure: Legacy UOM codes → D365 UOM codes
- Dates: Various formats → D365 date format
- Financial dimensions: Old cost center codes → new dimension values

**Build a mapping spreadsheet** for each entity:
```
Source field → Target field → Transformation rule → Notes
"CUST_NUM"  → "CustomerAccount" → Prefix with "C-" → Max 20 chars
"STATE"     → "State" → US state code lookup → Must match D365 state table
```

## Cutover Strategy

**Mock cutovers (practice runs):**
Run the full migration at least twice before go-live:
- Mock 1: Test the process, find issues
- Mock 2: Fix issues, validate timing (how long does it take?)
- Mock 3 (optional): Final dress rehearsal

**Cutover checklist:**
- [ ] Source system frozen (no new transactions during migration window)
- [ ] All transformation scripts finalized and tested
- [ ] DIXF import jobs ready to run
- [ ] Validation scripts ready
- [ ] Rollback plan documented (what if go-live fails?)
- [ ] Business key users available to validate

**Migration order matters:**
```
1. Reference data first: UOM, payment terms, currency
2. Master data: Customers, vendors, items, chart of accounts
3. Opening balances: GL, AR, AP, inventory
4. Open transactions: Open orders, open invoices
```

Each layer depends on the previous one existing.

## Validation

After each entity import, run validation:

**Record count check:** Source count = D365 count? If not, find what's missing.

**Key field check:** All required fields populated? No nulls where not allowed?

**Business logic check:** Balances reconcile? AR total = GL AR account? Inventory value = GL inventory account?

**Sample review:** Manually review 5-10% of imported records — spot check that the data looks correct.

**Automated validation queries:** Write SQL/OData queries that compare critical aggregates between source and D365.
