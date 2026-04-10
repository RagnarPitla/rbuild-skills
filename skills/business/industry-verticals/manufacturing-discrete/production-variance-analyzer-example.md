# Production Variance Analyzer — Example

## Scenario: $127,000 Unfavorable Production Variance When "Nothing Changed"

**Who:** Lisa Carmichael, Manufacturing Controller, Summit Industrial Products (discrete manufacturer, industrial pumps and compressors)
**Where:** D365 F&O Cost Management, October production close
**The Problem:** October production variance is $127,000 unfavorable — compared to $12,000 last month. The plant manager insists nothing changed in October. Lisa has the variance total from the D365 production close report but cannot trace it to specific orders, work centers, or variance types without a manual production order review. The CFO wants a written explanation by end of day.

**Prerequisites:** D365 F&O MCP Server, October production orders closed, standard cost version active, routing and BOM configured

---

### What You Say to the Agent

> "Break down the $127,000 production variance for October. Separate it by variance type (material, labor, overhead) and identify the top 5 production orders driving it. The plant manager says nothing changed — I need to know if that's true."

### What the Agent Does

1. Queries all October production orders in D365 with closed or reported-as-finished status — 184 orders in scope; pulls variance postings by variance type for each order
2. Splits the $127,000 total: material price variance $41,200 unfavorable, material quantity variance $18,700 unfavorable, labor efficiency variance $53,400 unfavorable, overhead absorption variance $13,700 unfavorable
3. Identifies the top 5 production orders by total variance: Order PRD-10441 (stainless pump assembly, $31,800 unfav), PRD-10388 ($24,100 unfav), PRD-10502 ($19,400 unfav), PRD-10477 ($14,200 unfav), PRD-10491 ($11,600 unfav) — these 5 orders account for $101,100 (80%) of the total variance
4. Drills into labor efficiency variance on PRD-10441: routing standard = 6.2 hours per unit; actual reported hours = 9.8 hours per unit across 22 units. Cross-references with D365 maintenance work orders: Work Center 3 (horizontal machining center) had an unplanned breakdown on October 14-15, generating 38 hours of idle labor charged to active production orders before the work order was created
5. Finds the material price variance: steel bar stock (Item STL-0882) was purchased in October at $1.84/kg versus standard cost of $1.42/kg — a 29% price spike tied to a spot purchase when the primary supplier had an allocation delay; 42 production orders consumed this material at the elevated price

### The Business Impact

- **Plant manager was right — and wrong** — no process change occurred, but two external events (equipment breakdown, spot purchase) combined to drive 80% of the variance; the controller had a defensible explanation with evidence within 35 minutes
- **$53,400 labor variance traced to a recoverable cause** — the idle labor from the WC-3 breakdown was identified as a one-time event; standard cost was not at fault; no pricing action required
- **$41,200 material price variance flagged for purchasing review** — the spot purchase decision was escalated to procurement; standard cost update and supplier contract amendment initiated for November

### Try It Yourself

> "Compare labor efficiency variances for Work Center 3 across the last 6 months and show me if October is a statistical outlier or part of a deteriorating trend."
