# Production Scheduling — Example

## Scenario: Three Production Orders Competing for the Same CNC Machine Next Week

**Who:** Tomasz Bielak, Production Planner, discrete manufacturer (precision metal components, $95M revenue)
**Where:** D365 Supply Chain Management, Production Control, Work Center scheduling
**The Problem:** Tomasz has three production orders all competing for Work Center 7 (their only 5-axis CNC machining center) next week. PO-4411 is for a defense customer with a contractual ship date of next Friday. PO-4408 is for a medical device OEM with a "no-substitute, no-delay" clause. PO-4415 is for a commercial HVAC customer with a 3-week float in their schedule. Work Center 7 has 40 available hours next week and the combined PO demand is 58 hours. Tomasz needs to sequence the orders, identify the 18-hour gap, and either find overflow capacity or negotiate a delay for the right order.

**Prerequisites:** D365 SCM Production Control configured. Work center capacity defined. Production orders linked to routes. production-scheduling skill loaded.

---

### What You Say to the Agent

> "Work Center 7 is overloaded next week. PO-4411 (defense, Friday ship), PO-4408 (medical OEM, no delay clause), and PO-4415 (HVAC, flexible) are all scheduled there. 58 hours of demand, 40 available. Show me the sequencing options and what happens to each order's delivery date."

### What the Agent Does

1. Reads Work Center 7 capacity: 40 hours next week (Monday-Friday, 2 shifts, 4 hours maintenance window Wednesday)
2. Pulls production order details:

```
PO-4411 | Defense customer | 18 hours WC7 | Ship date: Friday | Contract penalty: $22,000/week late
PO-4408 | Medical OEM | 24 hours WC7 | Ship date: Thursday | Contractual no-delay clause
PO-4415 | HVAC customer | 16 hours WC7 | Ship date: 3 weeks out | Float confirmed
```

3. Identifies that PO-4408 + PO-4411 = 42 hours, already 2 hours over capacity without PO-4415
4. Checks for alternate routing options: flags that 12 of PO-4411's 18 hours can run on Work Center 4 (3-axis CNC) with a 15% cycle time increase, using 14.4 hours instead
5. Models sequencing options:

```
RECOMMENDED SEQUENCE:
  Monday-Tuesday: PO-4408 (24 hours, medical OEM — no delay clause, highest risk)
  Wednesday: Maintenance + start PO-4411 on WC4 alternate routing (12 hours WC4, 6 hours WC7)
  Thursday-Friday: Complete PO-4411 on WC7 (6 hours remaining)
  PO-4415: Defer to following Monday — 4 days early against float, customer unaffected

  WC7 utilization: 30/40 hours (75%)
  WC4 additional load: 14.4 hours — confirmed available
  All three orders deliver on time
```

### The Business Impact

- **$22,000 contract penalty avoided** — PO-4411 shipped Friday as contracted using alternate routing
- **Medical OEM delivery maintained** — PO-4408 sequenced first, zero risk to no-delay clause
- **HVAC customer impact: zero** — PO-4415 delivered 4 days early within their float window
- **Work center utilization improved** — identified that WC4 can absorb 30% of WC7 overflow on standard tolerance jobs, reducing future bottleneck risk

### Try It Yourself

> "Run this same analysis for the next 4 weeks and show me every week where Work Center 7 is over 85% utilized. I want to see the problem before it becomes a crisis."
