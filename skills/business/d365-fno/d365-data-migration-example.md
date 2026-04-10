# D365 Data Migration — Example

## Scenario: SAP to D365 Vendor Master Migration Failing with Cryptic Errors

**Who:** Nadia Volkova, Data Migration Lead, large Microsoft partner
**Where:** Week 3 of a data migration project; migrating 5 years of vendor master data from SAP S/4HANA to D365 F&O; data entity import keeps failing
**The Problem:** The vendor master extract from SAP has 4,847 vendor records. Nadia is importing using the VendVendorV2Entity data entity in D365. The import job runs for 22 minutes, then fails with the error "Record update failed. Buffer is not complete." 1,203 records failed, 3,644 imported. The error is the same for all 1,203 failures and gives no field-level detail. The go-live migration window is 8 weeks away.

**Prerequisites:** D365 F&O data management workspace access; the source extract file in Excel/CSV format; the failed records log from D365 data management.

---

### What You Say to the Agent

> "I'm migrating vendor master data from SAP to D365 F&O using VendVendorV2Entity. 4,847 records, 1,203 failing with 'Record update failed. Buffer is not complete.' The error is the same for all failures and gives no field detail. Go-live is 8 weeks away. Help me diagnose what's causing the failures and fix the data."

### What the Agent Does

1. Identifies the 5 most common root causes for "Buffer is not complete" on VendVendorV2Entity, ranked by frequency:
   - Missing or invalid `VendorOrganizationId` — required field that SAP often exports as blank when the vendor is an individual rather than an organization
   - `TaxRegistrationNumber` format mismatch — D365 validates against country-specific formats; SAP stores them without formatting
   - `CurrencyCode` value not matching D365's ISO currency setup — SAP often uses legacy currency codes (e.g., "DEM" for Deutsche Mark) that don't exist in D365
   - `MethodOfPayment` reference data not yet loaded — the vendor record references a payment method that hasn't been configured in D365 yet
   - `AddressCountryRegionId` not matching D365's country/region table — SAP country codes differ from D365's ISO standard

2. Provides the diagnostic process: export the failed records from the D365 data management error log, use the Entity staging table (direct SQL or data management workspace view) to see the exact field values that failed validation, cross-reference against D365's reference data tables

3. Writes the specific Excel/Power Query transformations to fix each root cause: how to populate missing `VendorOrganizationId` from the vendor name field, the regex to strip formatting from `TaxRegistrationNumber`, the country code mapping table from SAP to D365 ISO codes

4. Recommends loading order to prevent the `MethodOfPayment` foreign key failure: load payment methods, payment terms, and currency codes before attempting the vendor master — the entity dependencies must be resolved first

5. Provides a validation query to run against D365 after the corrected import to confirm posting profile assignment, address records linked correctly, and no orphaned vendor records without a vendor group

### The Business Impact

- **Root cause identified in 2 hours** instead of 3 days of trial-and-error re-imports
- **1,203 failures reduced to 11** after fixing the 5 root causes — the remaining 11 are genuine data quality issues in the source that need client sign-off
- **Migration timeline preserved** — 8-week window stays intact
- **Data quality improvement** as a side effect — the SAP data had 340 vendors with missing tax registration numbers that would have caused compliance issues in D365

### Try It Yourself

> "I'm importing open customer transactions from a legacy system to D365 using CustTransOpenPerDateEntity. The import is failing for about 15% of records. The errors say 'Posting type not found.' What does that mean and what do I need to fix in the data?"
