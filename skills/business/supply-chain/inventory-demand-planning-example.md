# Inventory Demand Planning — Example

## Scenario: Setting Q4 Safety Stock After Last Year's Christmas Stockout

**Who:** Marcus Webb, Demand Planner, seasonal consumer goods company (outdoor and camping gear, $180M revenue)
**Where:** D365 Supply Chain Management, Master Planning, Inventory Management
**The Problem:** Last year Marcus's team stocked out of their top SKU (a portable camping stove, SKU CS-7700) on December 2nd, three weeks before Christmas. They had set safety stock using a flat 30-day coverage formula. The problem was that December demand was 4.2x the annual average and the formula never accounted for seasonal variance. Lost revenue: $290,000. The buying team is pushing Marcus to get Q4 safety stock levels right this year, and the board is watching.

**Prerequisites:** D365 SCM Master Planning configured. At least 2 years of sales history in D365. Items linked to item coverage groups. inventory-demand-planning skill loaded.

---

### What You Say to the Agent

> "I need to set safety stock levels for our top 80 SKUs going into Q4. Last year we stocked out of CS-7700 on December 2nd. Pull the last 2 years of weekly sales data and set safety stock using a seasonal demand model, not a flat average. Flag any SKU where our current setting is dangerously low for November-December."

### What the Agent Does

1. Pulls 104 weeks of `InventTransferJournal` and sales order history for the top 80 SKUs by Q3 revenue
2. Calculates a seasonal index for each SKU: compares each week's demand to the 52-week average to produce week-by-week multipliers
3. For SKU CS-7700, identifies the seasonal peak: weeks 44-52 (Nov through Christmas week) average 4.2x the annual mean
4. Calculates safety stock using the formula: (lead time demand at peak * seasonal multiplier) + (safety factor * standard deviation at peak)
5. Compares calculated safety stock against current D365 item coverage settings
6. Outputs a prioritized correction list:

```
CRITICAL — Current safety stock will fail during peak:
CS-7700 (Camping Stove Pro) | Current SS: 450 units | Required SS: 2,100 units | Gap: 1,650 units | Supplier lead time: 21 days | ORDER NOW
OL-3310 (Solar Lantern) | Current SS: 180 units | Required SS: 890 units | Gap: 710 units | Lead time: 18 days | ORDER BY OCT 28

HIGH — Reorder within 2 weeks:
[...14 more SKUs...]

ADEQUATE — No action needed:
[...58 SKUs...]
```

### The Business Impact

- **Safety stock for CS-7700 increased from 450 to 2,100 units** — ordered October 15th, arrived November 5th, fully stocked through December 26th
- **Zero stockouts across the top 80 SKUs in Q4** — compared to 7 stockouts the previous year
- **$290,000 revenue recovered** — CS-7700 alone delivered full December sell-through at projected demand
- **Demand planning cycle improved** — seasonal index model now runs automatically every August for Q4 prep

### Try It Yourself

> "Now model a scenario where our top supplier has a 2-week delay starting November 1st. Which SKUs go critical first and what's the revenue exposure?"
