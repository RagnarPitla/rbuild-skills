# Lease Accounting Assistant — Example

## Scenario: 12 Retail Leases with Variable Payments and Extension Options Before Year-End

**Who:** Daniel Ferreira, Lease Accountant, Brightstone Retail Group (specialty retail, 94 store locations)
**Where:** D365 F&O Asset leasing module, IFRS 16 compliance workflow
**The Problem:** Brightstone just signed 12 new retail leases as part of a regional expansion. Each lease has a base term of 5 years, a renewal option of 3 years (reasonably certain to exercise for 9 of the 12 locations based on market analysis), and variable lease payments tied to a percentage of annual store revenue. Year-end is in 3 weeks. Daniel needs the right-of-use asset values and lease liabilities posted in D365 before the auditors arrive. Manual calculation across 12 leases with these features would take 2 weeks.

**Prerequisites:** D365 F&O MCP Server, signed lease agreements uploaded, IBR (incremental borrowing rate) approved by Treasury at 5.8%

---

### What You Say to the Agent

> "Set up IFRS 16 lease records for all 12 new retail leases. Use IBR 5.8%. For the 9 locations where we're reasonably certain to exercise the renewal option, include the 3-year extension in the lease term. Exclude variable revenue-based payments from the liability calculation."

### What the Agent Does

1. Reads lease commencement dates, base rent schedules, extension option terms, and variable payment clauses for all 12 leases from the uploaded agreement data
2. Classifies each lease: all 12 qualify as IFRS 16 operating leases; short-term and low-value exemptions do not apply (all leases exceed 12 months and the underlying assets are retail premises)
3. For the 9 leases with reasonably certain extension options, sets the lease term to 8 years (5 base + 3 extension); for the remaining 3, uses the 5-year base term only
4. Excludes variable revenue-linked payments from the lease liability (IFRS 16 paragraph 38 — only fixed and in-substance fixed payments are included); flags these as variable lease expenses to be recognized in the period incurred
5. Calculates ROU assets and lease liabilities: 9 extended-term leases generate a combined lease liability of $14.7M (NPV of fixed payments discounted at 5.8%); 3 base-term leases generate $2.1M; total initial recognition is $16.8M ROU asset and $16.8M lease liability across all 12 leases
6. Creates all 12 lease records in D365 Asset leasing with commencement journal entries ready for posting, and generates an amortization schedule through the full lease term for audit support

### The Business Impact

- **12 leases fully set up in D365 in under 2 hours** — versus an estimated 10-14 days of manual calculation and data entry
- **Year-end deadline met** — all lease entries posted and supporting schedules available for auditors before the fieldwork start date
- **Compliance risk eliminated** — extension option assessment and variable payment exclusion applied consistently per IFRS 16; no risk of understating the lease liability by using only base term dates

### Try It Yourself

> "Run a lease modification analysis for Store #47 — the landlord has agreed to reduce the monthly rent by $2,200 effective January 1. Show me the remeasurement journal entry and updated amortization schedule."
