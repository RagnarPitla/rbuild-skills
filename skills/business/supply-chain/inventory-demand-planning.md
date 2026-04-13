---
name: "inventory-demand-planning"
slug: "inventory-demand-planning"
description: "Statistical demand forecasting, safety stock optimization, reorder point calculation, and replenishment planning integrated with D365 Master Planning. Use when user says \"demand planning\", \"safety stock\", \"reorder point\", \"forecast accuracy\", \"slow-moving inventory\", \"min/max replenishment\", \"MRP\", \"master planning\"."
tab: "business"
domain: "supply-chain"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "supply-chain", "demand-planning", "forecasting"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
---


# Inventory and Demand Planning

Demand planning is where data science meets supply chain operations. The goal is simple: have the right inventory in the right place at the right time, without tying up excess capital. The math is straightforward once you understand the formulas; the challenge is getting clean data from your ERP.

## Demand Forecasting Methods

### 1. Simple Moving Average (SMA)
Best for: Stable demand with no trend or seasonality.

```
SMA(n) = Sum of last n periods of demand / n

Example: Demand for last 4 weeks = [100, 120, 90, 110]
SMA(4) = (100 + 120 + 90 + 110) / 4 = 105 units/week
```

**Weakness:** Treats all periods equally. A spike 4 weeks ago has the same weight as last week.

### 2. Weighted Moving Average (WMA)
Best for: Demand with a recent trend.

```
WMA = (W1 x Period1) + (W2 x Period2) + ... / Sum of weights

Example weights (most recent = highest weight): [0.4, 0.3, 0.2, 0.1]
WMA = (110x0.4 + 90x0.3 + 120x0.2 + 100x0.1) = 44+27+24+10 = 105
```

### 3. Exponential Smoothing (Single)
Best for: Products where recent demand is more relevant but you want a smooth signal.

```
Forecast(t+1) = Alpha x Actual(t) + (1 - Alpha) x Forecast(t)

Alpha = smoothing factor (0.1 to 0.3 is typical for stable demand)
Higher Alpha = more responsive to recent changes
Lower Alpha = smoother, less reactive

Example: Alpha=0.2, Last forecast=100, Actual demand=120
New forecast = 0.2 x 120 + 0.8 x 100 = 24 + 80 = 104
```

### 4. Holt-Winters (Triple Exponential Smoothing)
Best for: Demand with both trend and seasonality. Requires at least 2 full seasonal cycles of history.

Three components: level (alpha), trend (beta), seasonality (gamma). Use this when your product has consistent seasonal patterns (summer/winter peaks, annual maintenance cycles).

### 5. Seasonal Decomposition
Best for: Understanding and removing seasonality before forecasting.

```
Seasonal Index for period p = Average demand in period p / Overall average demand

Example: Monthly average demand = 500 units
Average demand in December = 750 units
December seasonal index = 750 / 500 = 1.5 (50% above average)

Apply: Base forecast of 600 units x December index 1.5 = 900 units
```

Store seasonal indices in a Dataverse table (`cr023_inv_seasonality`) so planners can override calculated values.

## Safety Stock Calculation

Safety stock is the buffer inventory that protects against demand variability and supply variability during lead time.

### Standard Formula
```
Safety Stock = Z x sqrt(Lead Time) x sigma_demand

Where:
Z = Service level Z-score
  90% service level: Z = 1.28
  95% service level: Z = 1.65
  98% service level: Z = 2.05
  99% service level: Z = 2.33

sigma_demand = Standard deviation of daily demand

Lead Time = Supplier replenishment lead time in days
```

### Combined Demand and Supply Variability
```
Safety Stock = Z x sqrt(Avg_LT x sigma_demand^2 + Avg_demand^2 x sigma_LT^2)

Use this formula when lead time itself is variable (sigma_LT > 0).
```

### Service Level vs Cost Trade-off
| Service Level | Z-Score | Safety Stock Multiplier | Typical Use |
|--------------|---------|------------------------|-------------|
| 90% | 1.28 | 1x | Non-critical, cheap items |
| 95% | 1.65 | 1.3x | Standard items |
| 98% | 2.05 | 1.6x | Important items |
| 99% | 2.33 | 1.8x | Critical, high-value items |

Classify items by ABC (value) and XYZ (demand variability) to assign the right service level to each.

## Reorder Point (ROP) Calculation

```
ROP = (Average Daily Demand x Lead Time) + Safety Stock

Example:
Average daily demand = 15 units
Lead time = 10 days
Safety stock = 25 units (calculated above)
ROP = (15 x 10) + 25 = 175 units

Meaning: When on-hand inventory drops to 175 units, trigger a replenishment order.
```

## Economic Order Quantity (EOQ)

EOQ finds the order quantity that minimizes the total of ordering costs plus holding costs.

```
EOQ = sqrt(2 x Annual Demand x Ordering Cost / Holding Cost Rate x Unit Cost)

Where:
Ordering Cost = Cost per purchase order (admin, receiving, processing)
Holding Cost Rate = % of item value per year (storage, capital, obsolescence risk)
  Typical: 20-30% of item value per year

Example:
Annual demand = 5,000 units
Ordering cost = $75 per order
Unit cost = $10
Holding cost rate = 25%
EOQ = sqrt(2 x 5000 x 75 / 0.25 x 10) = sqrt(750000/2.5) = sqrt(300000) = 548 units
```

**Practical note:** EOQ is a starting point. Always check:
- Supplier minimum order quantities (may override EOQ)
- Volume discount breakpoints (ordering more may reduce total cost)
- Storage capacity constraints
- Shelf life / expiry dates

## Min/Max Replenishment

Min/Max is simpler than full ROP+EOQ and works well for items with stable, moderate demand.

```
Min = Reorder Point (same formula as ROP)
Max = Min + EOQ (or Min + desired coverage period x demand rate)

Replenishment order quantity = Max - Current On Hand
```

Use min/max in D365 by setting item coverage group to Min/Max and entering the Min/Max quantities on the item coverage record.

## Slow-Moving Inventory Identification

### ABC-XYZ Classification
- **A items**: Top 20% of SKUs by revenue value (80% of total value)
- **B items**: Next 30% of SKUs (15% of total value)
- **C items**: Bottom 50% of SKUs (5% of total value)

- **X items**: Demand standard deviation / mean demand < 0.5 (stable)
- **Y items**: Coefficient of variation 0.5 - 1.0 (moderate variability)
- **Z items**: Coefficient of variation > 1.0 (highly irregular)

**Slow-moving indicators:**
- Days of cover > 180 days
- No transactions in last 90 days
- Coefficient of variation > 2.0
- Forecast error (MAPE) > 50%

OData query to identify slow movers in D365:
```
GET /data/InventOnHandV2?$filter=AvailPhysical gt 0
  &$select=ItemId,InventSiteId,AvailPhysical,UnitCost
  &$expand=ItemDetails($select=LastPurchDate,LastSaleDate)
```

Then calculate: Days since last sale vs current on-hand / average daily demand.

## Integration with D365 Master Planning (MRP)

D365 Master Planning runs MRP/MPS to generate planned orders based on:
- Demand signals (sales orders, forecasts, dependent demand from BOMs)
- Supply: on-hand inventory, open POs, open production orders
- Item coverage parameters: reorder point, min/max, or period strategy

### Key Coverage Strategies in D365
| Strategy | D365 Setting | Best For |
|----------|-------------|----------|
| Reorder point | Min/Max with Min=ROP | Continuous replenishment |
| Period | Fixed period (weekly/monthly) | Items with batch purchasing |
| Requirement | Per requirement only | High-value, low-frequency |
| Dynamic lot sizing | Lot for lot | Make-to-order scenarios |

### Demand Forecast in D365
1. Generate forecast: Master planning > Forecasting > Demand forecasting
2. Review and adjust in the Forecast portal
3. Reduce forecast: Automatic reduction as actual orders come in
4. Run master planning with forecast included

## Trigger Phrases

- "demand planning"
- "safety stock calculation"
- "reorder point calculation"
- "EOQ formula"
- "inventory optimization"
- "slow-moving inventory"
- "min/max replenishment"
- "master planning MRP"

## Quick Example

> See `inventory-demand-planning-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Forecast accuracy is poor (MAPE > 40%) | Insufficient history or wrong forecasting method | Ensure at least 12 months of clean transaction history; switch to exponential smoothing for volatile items; use seasonal decomposition if seasonal patterns exist |
| Safety stock is too high and tying up capital | Service level set too high across all items or demand variability calculation using incorrect period | Classify items by ABC-XYZ, apply lower service levels to C and Z items; recalculate sigma_demand using only relevant demand periods (exclude promotions/one-time events) |
| Master planning generating too many small planned orders | Item coverage period too short or min/max not set | Review item coverage group settings; set minimum order period or increase min quantity to reduce order frequency |
| Reorder points triggering too early or too late | Lead time on vendor record is incorrect or not maintained | Audit vendor lead times in D365 against actuals from purchase order receipt history; update trade agreements with current lead times |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
