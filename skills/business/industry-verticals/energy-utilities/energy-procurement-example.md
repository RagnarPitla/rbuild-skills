# Energy Procurement — Example

## Scenario: Three Sites Coming Off Contract During Volatile Spot Market Conditions

**Who:** Dimitri Vasquez, Corporate Energy Manager, Allcast Manufacturing (15-site precision parts manufacturer, total electricity spend $4.2M annually)
**Where:** D365 F&O procurement and cost management modules, integrated with the company's energy data platform
**The Problem:** Three of Allcast's sites (Tulsa OK, Evansville IN, and Dayton OH) have electricity supply contracts expiring in Q2. Combined annual load is 18.4 GWh. Spot market forward prices for the MISO and SPP regions are showing unusual volatility due to extreme weather forecasts and a large coal plant retirement scheduled for April. Dimitri needs to decide whether to fix rates now, buy partial hedges, or ride spot for a portion of load. He has 6 weeks before the broker's lock-in deadline.

**Prerequisites:** Historical consumption data by site in D365, current broker quotes loaded, tariff structure for each utility on file

---

### What You Say to the Agent

> "My Tulsa, Evansville, and Dayton sites come off contract in Q2. Spot prices are volatile. Help me decide whether to fix now or hedge partially given our load profile and the current forward curve."

### What the Agent Does

1. Pulls 24 months of interval meter data for all three sites and calculates load shape by hour-of-day and day-of-week, identifying that Tulsa runs a 3-shift operation with an 87% load factor while Dayton is a 1-shift facility with a 52% load factor and significant demand peaks on Monday mornings
2. Retrieves current broker fixed-price quotes for Q2-Q4 and compares them against the MISO and SPP forward curves at the 12-month and 24-month tenor, showing that current fixed quotes are 11% above the 18-month historical average but 8% below the 90th percentile stress scenario
3. Calculates that a full fixed-price strategy across all three sites locks in $1.86M in annual supply cost with zero upside if prices fall, while a 70/30 fixed-to-index blend reduces locked-in cost by $148,000 annually with a downside exposure cap of $94,000 if the stress scenario materializes
4. Identifies that Dayton's Monday demand peaks consistently trigger the Utility's demand ratchet clause, which has added an average $3,400 per month in excess demand charges over the past 8 months — a demand response or load-shifting program would eliminate this regardless of which supply strategy is chosen
5. Flags that the Tulsa facility qualifies for a large-load interruptible rate (Rate Schedule LI-2) that the current contract does not utilize, with estimated annual savings of $41,000 if Allcast accepts 4 curtailment events per year with 2-hour advance notice

### The Business Impact

- **$148,000 in supply cost flexibility preserved** — the blended hedge strategy is modeled with full downside risk quantified, not just qualitative advice
- **$41,000 rate optimization identified** — Tulsa's LI-2 eligibility was sitting in the tariff schedule undiscovered
- **Demand ratchet eliminated** — Dayton's recurring $3,400/month excess charge has a fix that's independent of supply strategy

### Try It Yourself

> "Which of my 15 sites have the highest cost-per-kWh and are any of them on rate schedules that no longer match their actual load profile?"
