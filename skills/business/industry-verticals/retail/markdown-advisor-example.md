# Markdown Advisor — Example

## Scenario: 8,400 Units of a Winter Jacket SKU With 34% Full-Price Sell-Through and 6 Weeks Left

**Who:** Priya Mehta, Merchandise Planner, Northgate Outfitters (specialty apparel, 140 stores plus e-commerce)
**Where:** D365 F&O Retail module, inventory and sales performance data by store cluster
**The Problem:** SKU WJ-4471 (the Cascade Ridge insulated jacket, full retail $148) had a season forecast of 24,000 units. 8,400 units remain unsold with 6 weeks left in the winter selling window. Full-price sell-through is at 34%, well below the 65% target at this point in the season. The options are a markdown, a promotional event, a channel shift to e-commerce, or holding price and accepting the carryover. Each choice has different margin and inventory health implications. Priya needs a recommendation with numbers before the weekly merch review.

**Prerequisites:** Store-level inventory and sales data by week in D365, historical markdown response rates loaded, e-commerce channel capacity visible

---

### What You Say to the Agent

> "SKU WJ-4471 has 8,400 units left, 6 weeks in the season, and 34% full-price sell-through. What markdown strategy do I need to clear this without destroying margin?"

### What the Agent Does

1. Calculates the current sell-through trajectory: at the trailing 3-week average velocity of 210 units per week, the remaining inventory would sell down to 6,140 units by season end with no action — leaving 73% of remaining stock as carryover
2. Models three markdown scenarios against historical price elasticity data for the outerwear category: a 20% markdown ($118.40) projects 420 units/week (2x velocity), a 30% markdown ($103.60) projects 680 units/week (3.2x velocity), and a 40% markdown ($88.80) projects 1,050 units/week (5x velocity)
3. Calculates that a phased approach — 20% markdown for weeks 1-3, then 30% for weeks 4-5, then 40% for the final week — clears approximately 7,100 units through the season, leaving 1,300 units for end-of-season clearance at a blended margin of 41.2% versus the 31% margin if a flat 40% markdown is taken immediately
4. Identifies that 1,200 units are concentrated in 3 stores in warm-climate markets (Phoenix, Las Vegas, and Miami) where the category has underperformed all season — recommends a store-to-store transfer of those units to 8 high-performing cold-climate stores before the markdown to increase sell-through probability before taking the price hit
5. Flags that carryover cost at the current AUC of $61.20/unit would be $187,000 for 3,060 unsold units, which exceeds the storage and reticket cost threshold that triggers a liquidation recommendation under company policy

### The Business Impact

- **$187,000 carryover cost avoided** — phased markdown clears to an acceptable 1,300 unit carryover versus 6,140 with no action
- **41.2% blended margin preserved** — structured phased approach versus 31% from an immediate flat 40% markdown
- **1,200 misallocated units repositioned** — warm-climate store inventory transferred before markdown execution, improving sell-through without additional margin sacrifice

### Try It Yourself

> "Show me every SKU in the outerwear category that is more than 20 percentage points below its sell-through target with more than 4 weeks left in the season."
