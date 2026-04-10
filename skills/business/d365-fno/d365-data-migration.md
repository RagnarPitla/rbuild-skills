---
name: d365-data-migration
description: Plan and execute D365 F&O data migration — data entities, DIXF packages, cutover strategy, and validation patterns. Use when user says "data migration to D365", "import data into D365", "DIXF import", "data entity import", "migrate customers to D365", "opening balances migration", "cutover data strategy".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, d365, data-migration, dmf]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
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

**File format recommendation:** Excel for small datasets (under 10K rows), CSV for large datasets. Always use the entity's template file as your starting point — download it from the entity details page.

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

**Automated validation queries:** Write OData queries that compare critical aggregates between source and D365.

### OData Validation Queries

**Count imported customers:**
```
GET /data/CustomersV3?$select=CustomerAccount&$count=true
```

**Check vendors missing payment terms:**
```
GET /data/VendorsV2?$filter=PaymentTerms eq ''&$select=VendorAccountNumber,VendorName
```

**Check open inventory quantities:**
```
GET /data/InventoryOnHandEntries?$filter=InventLocationId eq 'MAIN'&$select=ItemNumber,AvailablePhysicalQuantity,UnitId
```

**Check GL opening balances posted:**
```
GET /data/LedgerJournalEntity?$filter=JournalBatchNumber eq 'OPEN-2026'&$select=JournalBatchNumber,AccountDisplayValue,AmountCurDebit,AmountCurCredit
```

## Core Tasks

### 1. Plan Migration Wave
```text
GIVEN list of data objects to migrate
WHEN skill plans migration
THEN order objects by dependency (reference data first, master data second, transactions last)
AND identify which D365 entity handles each object
AND flag objects with no matching D365 entity (need custom solution)
AND estimate import time based on record count and entity complexity
```

### 2. Validate Import File
```text
GIVEN a DIXF-formatted CSV or Excel file
WHEN skill validates before import
THEN check required columns are present against entity field list
AND check data types match (dates are dates, numbers are numbers)
AND check foreign key values exist in D365 (customer groups, UOM codes, currency codes)
AND return a validation report with row-level errors
```

### 3. Post-Import Reconciliation
```text
GIVEN imported data and source system totals
WHEN skill reconciles
THEN compare record counts by entity
AND compare financial totals (AR balance, AP balance, inventory value)
AND identify records in source not found in D365
AND produce a reconciliation report with variance detail
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Import job fails with "Staging to target" error | Required reference data missing (e.g., customer group, payment terms) | Check entity prerequisites; import reference data first before master data |
| Record count mismatch after import | Duplicate key violations caused records to skip silently | Check the import job execution log; filter by "Error" status; fix and re-import failed rows |
| Financial dimensions invalid on journal import | Dimension values used in source file do not exist in D365 | Pre-import dimension values first; validate all dimension codes against D365 before running journal import |
| "Batch number not found" on inventory import | Journal batch number format does not match D365 number sequence | Align the import file batch number format with the D365 number sequence for inventory journals |
| Vendor invoice matching fails post-migration | Open PO receipts imported but invoice matching tolerance not configured | Configure invoice matching policy in AP parameters before importing open invoices |
| Duplicate customer accounts after migration | Source had same customer in multiple systems with different codes | De-duplicate in the transformation layer; use a single canonical customer ID before importing |
| Opening balance journal does not post | Fiscal period for the balance date is closed or on hold | Open the relevant period in General ledger → Period close → Ledger calendar before importing |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — OData validation queries, GIVEN/WHEN/THEN tasks, D365-specific error table |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
