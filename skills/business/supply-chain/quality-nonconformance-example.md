# Quality Nonconformance — Example

## Scenario: 2,400 Units Failed pH Testing, Already in Warehouse Awaiting Shipment

**Who:** Keisha Drummond, Quality Engineer, food manufacturer (specialty sauces and condiments, $65M revenue)
**Where:** D365 Supply Chain Management, Inventory Management, Quality Management module
**The Problem:** Keisha's team ran final QC on batch B-2024-1187 of Product XJ-44 (Hot Sauce Original, 12 oz bottles). pH meter testing showed an average of 3.9 across 3 sample draws — the specification requires pH between 3.2 and 3.6. At pH 3.9, shelf stability is compromised and the product does not meet FDA acidified foods regulations (21 CFR 114). All 2,400 units are already in Warehouse C, tagged for a Monday shipment to a national grocery chain (Retailer RET-0044). If the shipment goes out, the company faces a potential FDA recall and a $200,000 breach of supply agreement clause.

**Prerequisites:** D365 Quality Management configured. Batch tracking enabled. Nonconformance workflow active. quality-nonconformance skill loaded.

---

### What You Say to the Agent

> "Batch B-2024-1187 of XJ-44 failed pH testing — result 3.9, spec is 3.2-3.6. All 2,400 units are in Warehouse C queued for Monday shipment to RET-0044. I need to quarantine the batch, open a nonconformance, and figure out if any of this batch already shipped."

### What the Agent Does

1. Creates a nonconformance record in D365 Quality Management: NCR-2024-0881, links to batch B-2024-1187, item XJ-44, test result pH 3.9, spec deviation flagged
2. Immediately updates inventory status for all 2,400 units from "Available" to "Quarantine" in Warehouse C, blocking the Monday shipment to RET-0044
3. Queries shipment history for batch B-2024-1187 across all sales orders in the last 14 days:

```
BATCH TRACEABILITY RESULTS:
  Total batch quantity: 2,400 units
  Currently in Warehouse C (quarantined): 2,400 units
  Units shipped to customers: 0
  CONCLUSION: Full batch is contained. No recall required.
```

4. Identifies the root cause investigation path: pulls production batch records for B-2024-1187, flags that the acetic acid addition step shows 0.3% below target concentration in the batch record — likely cause of elevated pH
5. Generates a corrective action draft (CAPA-2024-0112): tighten acidification process verification, add in-process pH check at 30 minutes before transfer to finishing

### The Business Impact

- **FDA compliance risk eliminated** — batch quarantined before a single unit reached retail, avoiding potential 21 CFR 114 violation
- **$200,000 breach of supply agreement avoided** — RET-0044 shipment blocked before Monday cutoff
- **Recall cost avoided** — industry average cost for a Class II recall in food/beverage is $10M+; full containment meant zero recall trigger
- **Root cause identified in 8 minutes** — acidification process deviation found in batch records, CAPA drafted same day

### Try It Yourself

> "Show me all quality test results for XJ-44 batches in the last 6 months. Are there any batches where pH was above 3.7 that we still shipped? I want to understand our trend before the FDA audit next month."
