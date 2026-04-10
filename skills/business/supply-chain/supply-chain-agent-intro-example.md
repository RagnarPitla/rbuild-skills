# Supply Chain Agent Intro — Example

## Scenario: VP of Supply Chain Wants to Know Where Agents Add the Most Value

**Who:** Alejandro Vega, VP of Supply Chain, mid-market industrial distributor ($310M revenue, 4 distribution centers)
**Where:** D365 Supply Chain Management (full suite), evaluating AI agent adoption
**The Problem:** Alejandro's team runs D365 SCM across procurement, warehousing, transportation, and demand planning. They have 12 supply chain staff handling about 800 transactions per day. He knows AI agents are coming but doesn't know where to start. His biggest operational pain points are: stockouts on fast-moving items (happening 3-4 times per month), manual exception handling on late shipments (2 hours per coordinator per day), and slow response to customer order status inquiries (average 4 hours to respond). He's been asked to present an AI agent roadmap to the CFO next week.

**Prerequisites:** D365 SCM active. Basic familiarity with Copilot Studio. supply-chain-agent-intro skill loaded.

---

### What You Say to the Agent

> "I run supply chain for a $310M industrial distributor on D365 SCM. My three biggest problems are stockouts on fast-movers, logistics exceptions taking 2 hours per coordinator per day to handle, and slow customer order status responses. Where should I deploy agents first to get the fastest ROI?"

### What the Agent Does

1. Maps Alejandro's three pain points to specific agent use cases with D365 SCM integration points
2. Calculates estimated ROI for each use case based on described operational volume
3. Prioritizes by implementation complexity vs business impact:

```
PRIORITY 1 — Inventory Reorder Advisor Agent (Highest ROI, 4-week build)
  Pain addressed: Stockouts on fast-moving items
  How it works: Monitors InventOnHandV2 daily, alerts before stockout, triggers purchase requisitions
  Estimated value: 3-4 stockout events/month * avg $45K revenue impact = $1.5M-$2.2M/year at risk
  D365 integration: InventOnHandV2, PurchReqTable, vendor lead time from trade agreements

PRIORITY 2 — Logistics Exception Agent (High ROI, 3-week build)
  Pain addressed: 2 hours/coordinator/day on exception handling
  How it works: Detects shipment delays automatically, finds alternate carriers, notifies customers proactively
  Estimated value: 2 coordinators * 2 hours * 250 days * $45/hr = $45,000/year in labor recovered
  D365 integration: Shipment tracking, SalesTable, customer SLA records

PRIORITY 3 — Order Status Agent (Quick win, 2-week build)
  Pain addressed: 4-hour response time to order status inquiries
  How it works: Connects to D365 SalesOrder and Shipment, answers in real time via Teams or email
  Estimated value: Response time drops from 4 hours to under 2 minutes, frees 1+ FTE equivalent
  D365 integration: SalesOrderHeaderV2, CustPackingSlipJour, carrier tracking
```

4. Recommends starting with Priority 1 (Inventory Reorder Advisor) because the business impact is highest and the D365 data is already clean
5. Provides a 90-day roadmap: build and deploy all three agents sequentially

### The Business Impact

- **CFO presentation built** — Alejandro had a prioritized, ROI-quantified agent roadmap ready in 30 minutes
- **Board-level framing** — three use cases mapped to dollar values, not just "AI could help with supply chain"
- **First agent deployed in week 5** — Inventory Reorder Advisor live, first stockout prevented in week 7
- **12-month ROI projection** — $1.8M in avoided stockout revenue + $45K labor recovery + customer satisfaction lift

### Try It Yourself

> "Add a fourth scenario: we're thinking about using agents for supplier performance tracking. What would that agent look like in D365 and what's the realistic build time?"
