# Dataverse Table Design — Example

## Scenario: Fixing a Field Service Solution That Put Everything in One Giant Table

**Who:** Nadia Osei, Power Platform Developer, system integrator working on a field service management solution
**Where:** Power Platform, Dataverse, Model-Driven App
**The Problem:** Nadia inherited a field service solution built 18 months ago. The original developer put all data into a single table: `cr044_fieldservicejob`. It has 87 columns covering job details, customer information, technician assignments, equipment records, parts used, and billing data. The app is slow, loading 12-15 seconds per record. Users are complaining. The Power Automate flows that pull job data are timing out on accounts with more than 200 jobs. A performance audit shows the main issue is that every form load retrieves 87 columns even when displaying a simple job list.

**Prerequisites:** Existing Dataverse solution to refactor. Power Platform admin access. Basic understanding of Dataverse relationships. dataverse-table-design skill loaded.

---

### What You Say to the Agent

> "I have a field service solution with one giant 87-column table. It's slow — 12-15 seconds per record load. The table mixes job info, customer data, technician assignments, equipment, parts, and billing. Help me redesign the table structure to fix the performance problem."

### What the Agent Does

1. Analyzes the 87-column table and identifies 6 distinct entity domains that should be separated
2. Designs a normalized 6-table structure:

```
TABLE: cr044_fs_job (core job record, ~15 columns)
  Core fields only: job number, status, type, priority, scheduled date, description
  Why: This is what loads in the job list view — keep it lean

TABLE: cr044_fs_customer (1:many to jobs)
  Customer name, address, contact, service tier, contract reference
  Why: Customer data rarely changes, no need to reload per job

TABLE: cr044_fs_technician (N:N to jobs via cr044_fs_jobassignment)
  Technician profile, certifications, region, availability status
  Why: One job can have multiple technicians; one technician has many jobs

TABLE: cr044_fs_equipment (1:many to jobs)
  Asset ID, make/model, serial number, install date, warranty expiry
  Why: One job often covers multiple pieces of equipment

TABLE: cr044_fs_partsused (child of job)
  Part number, quantity, unit cost, supplier
  Why: Variable number of parts per job — can't be columns, must be rows

TABLE: cr044_fs_billing (1:1 to job)
  Labor hours, parts total, invoice status, payment date
  Why: Billing is loaded separately on the finance view, not the technician view
```

3. Identifies the immediate quick win: create a job list view that only selects 6 columns from `cr044_fs_job` — eliminates 12 seconds of load time without full migration
4. Provides migration path: create new tables in dev, migrate data via Dataverse bulk import, update flows incrementally over 2-week sprint
5. Estimates load time improvement: 6-column list view target is under 1 second for 1,000+ records

### The Business Impact

- **Job list view load time: 14 seconds reduced to 0.8 seconds** — implemented in week 1 by fixing the view column selection before table migration
- **Power Automate timeout errors eliminated** — flows now query specific tables instead of the 87-column table, timeouts dropped from 15/week to zero
- **Data model now supports growth** — adding a new technician certification type is a new column on `cr044_fs_technician`, not an additional column on the master table
- **Full migration completed in 3 weeks** — table redesign done incrementally with zero downtime for field technicians

### Try It Yourself

> "The billing table needs to track partial payments and payment plan installments. Design the payment tracking sub-table and explain how it relates to cr044_fs_billing."
