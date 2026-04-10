# Customs Trade Compliance — Example

## Scenario: 23 Shipments Held at Customs Due to Incorrect HTS Codes

**Who:** Priya Nambiar, Global Trade Compliance Manager, electronics distributor (mid-market, $420M revenue)
**Where:** D365 Supply Chain Management, Procurement, Trade and Logistics
**The Problem:** Priya's company onboarded a new Chinese supplier for USB-C charging modules in Q3. The freight broker assigned HTS code 8544.42 (insulated wire) instead of the correct 8504.40 (power converters). Customs held 23 inbound shipments at the port of Los Angeles. Duties are being assessed at the wrong rate, and two shipments are approaching the 5-day storage fee threshold.

**Prerequisites:** D365 SCM with Trade and Logistics configured. HTS code library accessible. customs-trade-compliance skill loaded.

---

### What You Say to the Agent

> "I have 23 shipments from supplier VEND-SH-4421 held at LA customs. They all used HTS code 8544.42 but our compliance team says the correct code is 8504.40. What's the duty rate difference, what documentation do I need to file a post-entry amendment, and which shipments are most urgent to resolve first?"

### What the Agent Does

1. Looks up both HTS codes: 8544.42 (duty rate 2.6%) vs 8504.40 (duty rate 0% under HTSUS for this product category with current trade status)
2. Calculates total duty overpayment exposure across 23 shipments based on declared customs value
3. Ranks the 23 shipments by urgency: 2 shipments hit 5-day storage threshold in 18 hours, 7 more within 48 hours
4. Identifies the correct CBP form: CF-19 post-summary correction for entries filed within the last 15 days, formal protest (CF-19 protest) for entries older than 180 days
5. Outputs a remediation plan:

```
CRITICAL (storage deadline < 24 hours):
Entry BL-2024-44821 | $184,200 declared value | Storage fee: $2,400/day | File CF-19 correction TODAY
Entry BL-2024-44819 | $97,600 declared value | Storage fee: $1,800/day | File CF-19 correction TODAY

URGENT (48-hour window):
7 entries totaling $1.2M declared value

STANDARD CORRECTION:
14 entries — file within 15-day post-summary correction window

TOTAL DUTY RECLAIM POTENTIAL: $38,400 (difference between 2.6% and 0% across all 23 entries)
```

### The Business Impact

- **$38,400 in duty overpayments recovered** — post-entry corrections filed before the 15-day window closed
- **$12,600 in storage fees avoided** — the 2 critical shipments released within 24 hours of filing corrections
- **Supplier onboarding process updated** — added HTS code validation step for all new supplier product categories, preventing recurrence
- **Freight broker contract amended** — added liability clause for incorrect tariff classifications after this incident

### Try It Yourself

> "For all future purchase orders from Chinese suppliers, what are the top 5 HTS code categories we should pre-validate before shipment leaves origin, based on our current product mix in D365?"
