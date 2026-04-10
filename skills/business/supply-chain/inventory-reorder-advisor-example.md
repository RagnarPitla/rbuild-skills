# Inventory Reorder Advisor — Example

## Scenario: Missing a $340K Stockout During Peak Season

**Who:** Carmen Torres, Supply Chain Planning Manager, consumer electronics distributor
**Where:** D365 Supply Chain Management — Inventory Management
**The Problem:** Carmen manages 8,400 active SKUs across 3 warehouses. Last Q4, they ran out of their #3 bestselling product (wireless earbuds) two weeks before Christmas — a $340,000 lost sales event. The reorder point had been set correctly, but no one noticed the consumption rate had tripled as holiday demand kicked in. Nobody was watching that item.

**Prerequisites:** D365 SCM with inventory management configured. Items must have on-hand inventory data and purchase history. D365 F&O MCP Server connected.

---

### What You Say to the Agent

> "It's October 15th. Analyze my inventory across all three warehouses for the top 500 SKUs by revenue. Flag anything that will stock out before December 31st based on current demand trends. I want to see critical items first."

### What the Agent Does

1. Queries `InventOnHandV2` for on-hand quantities across WAREHOUSE-A, WAREHOUSE-B, WAREHOUSE-C
2. Pulls 90 days of sales transactions to calculate current weekly demand rate (not historical averages — recent actuals)
3. Compares demand rate trend: flags items where demand in last 30 days is >30% above 90-day average (early holiday signal)
4. Calculates days-of-supply for each SKU using trending demand, not static average
5. Cross-references vendor lead times from trade agreements in D365
6. Outputs prioritized list:

```
CRITICAL (stockout risk before Nov 30):
SKU WE-4421 (Wireless Earbuds Pro) | On hand: 847 units | Trending demand: 180/week | Days supply: 4.7 | REORDER 3,000 units from VEND-Apex (14-day lead time)

HIGH (stockout risk before Dec 15):
SKU BT-887 (Bluetooth Speaker) | On hand: 2,100 units | Trending demand: 380/week | Days supply: 5.5 | REORDER 5,000 units
[...14 more items...]

MONITOR (risk Dec 15-31):
[...43 items...]
```

### The Business Impact

- **Carmen caught the wireless earbuds issue on October 15th** — 10 weeks earlier than last year's stockout
- **Reorder placed for 3,000 units** — arrives November 5th, enough buffer for holiday demand
- **Estimated avoided stockout value: $510,000** — based on projected demand during the at-risk period
- **New weekly ritual:** Agent runs every Monday morning, Carmen reviews the Critical list before her 9am planning meeting

### Try It Yourself

> "Now filter to only show items where we have an approved vendor with available inventory AND the vendor lead time is under 7 days — I want to see the quick wins I can reorder today without expediting."
