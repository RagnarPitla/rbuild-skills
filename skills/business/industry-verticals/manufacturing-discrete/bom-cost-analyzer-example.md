# BOM Cost Analyzer — Example

## Scenario: Explaining a 23% Standard Cost Increase Before the Pricing Committee Meeting

**Who:** Jennifer Osei, Cost Accountant, Hardwick Precision Manufacturing (discrete manufacturer, aerospace and defense subcomponents)
**Where:** D365 F&O Cost Management, standard cost rollup for Product PA-3300
**The Problem:** The latest standard cost rollup increased the standard cost for Product PA-3300 (a machined titanium bracket assembly) from $284.10 to $349.40 — a 23% jump. The pricing committee meets tomorrow and needs to know whether to pass the increase to the customer, absorb it, or challenge the calculation. Jennifer has the new standard cost figure but not the driver breakdown. A manual BOM trace across a 4-level structure with 31 components will take all day.

**Prerequisites:** D365 F&O MCP Server, active costing version with new standard costs, prior costing version retained for comparison

---

### What You Say to the Agent

> "Explain the 23% standard cost increase for Product PA-3300 from the latest cost rollup. Show me which components drove the change and whether any are substitutable."

### What the Agent Does

1. Pulls the BOM cost detail for PA-3300 from both the prior and current costing versions in D365, traversing all 4 levels of the BOM structure (31 components total)
2. Computes the cost delta per component: identifies that 89% of the $65.30 increase is attributable to three items: titanium billet Grade 5 (TA-101) increased from $78.40 to $114.60 per kg (46% raw material price increase, reflecting the aerospace titanium spot price surge in Q1); machining labor on Work Center 4 (5-axis CNC) increased from $68/hr to $74/hr following a new labor agreement; and a new QC step added to the routing in January adds $8.20 per unit in inspection labor
3. Confirms the remaining 11% ($7.10) is spread across 6 minor components with price increases of 3-8%, consistent with general inflation
4. Checks the D365 approved substitutes list for titanium billet TA-101: one approved substitute exists (TA-201, Grade 23 ELI titanium) at $101.80/kg — using the substitute would reduce the standard cost to $336.10, a $13.30/unit savings, but Jennifer flags that Grade 23 is restricted to medical applications per the customer's engineering specification
5. Generates a pricing committee briefing table: driver breakdown, percentage attribution, market context note for the titanium spike, and three options (full pass-through at $349.40, partial pass-through using the substitute at $336.10 pending engineering approval, or absorb and revisit at next quarterly pricing review)

### The Business Impact

- **Pricing committee fully briefed with 12 hours notice** — Jennifer walked into the meeting with a complete driver analysis instead of a single number
- **23% increase validated as legitimate** — all drivers traced to documented inputs; no calculation errors found in the rollup
- **$13.30/unit cost reduction path identified** — the Grade 23 substitute option was referred to the customer's engineering team for qualification; if approved, it saves $66,500 annually at 5,000 units per year

### Try It Yourself

> "Run a cost rollup comparison for all items in product family PA-3000 to PA-3500 and flag any where the latest rollup increased standard cost by more than 10%. Include the top two cost drivers for each."
