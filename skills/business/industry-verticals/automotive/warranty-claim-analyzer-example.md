# Warranty Claim Analyzer — Example

## Scenario: Single Component Driving Disproportionate Warranty Spend

**Who:** Priya Nair, Warranty Administrator, Strattec Seating Systems (Tier 1 OEM supplier, seating systems for 3 platforms)
**Where:** D365 F&O Quality Management and Returns modules, OEM warranty portal data imported weekly
**The Problem:** Priya is reviewing 90 days of warranty claims from the Q3 submission cycle. Total claims are up 18% over Q2, but she can't identify the root cause without digging through 1,400 line items manually. Her quality engineer suspects part #ST-4892 (the lateral seat adjuster bracket, introduced 7 months ago on the Platform B program) but the warranty system doesn't automatically group by component. Monthly management review is in 5 days.

**Prerequisites:** OEM warranty claim data imported into D365, parts master linked to claim lines

---

### What You Say to the Agent

> "Analyze the last 3 months of warranty claims. I need to know if part ST-4892 is driving the increase and whether it's isolated to one vehicle platform or spreading."

### What the Agent Does

1. Aggregates 1,400 warranty claim lines across the Q3 period and groups by part number, failure mode code, vehicle platform, and production date range
2. Identifies that part #ST-4892 accounts for 214 claims out of 1,400 total (15.3% of all claims by count, 22.7% by dollar value at an average claim cost of $312 per unit)
3. Maps the 214 claims by vehicle production date and finds a step-change in failure rate beginning in week 28, coinciding with a raw material supplier change from Vendor A to Vendor B for the bracket steel stock
4. Confirms that 191 of the 214 claims are concentrated on Platform B (Meridian SUV program); the remaining 23 are Platform C, where the same part was adopted 6 weeks later
5. Calculates that at the current claim rate and remaining production volume, projected Q4 warranty exposure for ST-4892 alone is $187,000, which crosses the OEM's threshold for a formal SCAR (Supplier Corrective Action Request)

### The Business Impact

- **Root cause isolated in minutes** — 1,400 claims resolved to a single part, a specific production week, and a supplier material change, not a design flaw
- **$187,000 exposure quantified** — finance can accrue correctly and procurement can begin material requalification with Vendor A or a third source
- **SCAR avoided or prepared** — Priya enters the management review with data, not suspicion; if a SCAR is issued, she has the evidence to respond within the OEM's 30-day window

### Try It Yourself

> "Show me the top 5 parts by warranty dollar spend this quarter and whether any of them have a production-date correlation that would suggest a batch or process change issue."
