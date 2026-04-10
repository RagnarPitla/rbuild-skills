# Capacity Planner — Example

## Scenario: Can We Accept a Rush Order for 150 Units in 3 Weeks?

**Who:** Tom Brinkley, Production Planner, Meridian Aerospace Components (aerospace subcontractor, AS9100D certified)
**Where:** D365 F&O Production Control and Resource scheduling
**The Problem:** A Tier-1 customer has requested a rush order for 150 units of Part #A7-2200 (a CNC-machined aluminum housing for avionics assemblies) with a required ship date in 21 calendar days. Tom needs to confirm feasibility before the sales team commits. Work Center 12 (5-axis CNC) is the production bottleneck — it runs two 8-hour shifts, has 3 machines, and is already running at 94% utilization for the next 4 weeks supporting existing production orders. Tom needs a real answer in the next hour before the customer calls back.

**Prerequisites:** D365 F&O MCP Server, routing and work center capacity configured in D365, current production schedule loaded

---

### What You Say to the Agent

> "Can we accept a rush order for 150 units of Part #A7-2200 with a 21-day ship date? Work Center 12 is the constraint. Tell me if it fits and what we'd have to move to make it work."

### What the Agent Does

1. Pulls the routing for Part #A7-2200 from D365: the part requires 2.4 hours of 5-axis CNC time per unit at Work Center 12, plus 0.8 hours of deburring (Work Center 7) and 1.1 hours of CMM inspection (Work Center 9) — total cycle time 4.3 hours per unit
2. Calculates gross machine hours required for 150 units: 360 hours of 5-axis CNC time (the binding constraint)
3. Queries Work Center 12's available capacity for the next 21 days: 3 machines x 2 shifts x 8 hours x 15 working days = 720 machine-hours total; current committed load = 677 hours (94%); available = 43 hours
4. Identifies the gap: 360 hours needed minus 43 hours available = 317 hours short. The order cannot be accepted as requested without displacing existing work
5. Models two options: Option A — defer Order #PRD-7841 (non-critical prototype run, 80 hours of CNC time, customer is internal R&D with flexible schedule) and add a Saturday overtime shift for 2 machines (3 Saturdays x 2 machines x 8 hours = 48 hours), yielding 171 hours of recovered capacity — still 146 hours short; Option B — split the order, confirm 60 units in 21 days from available capacity and offer 90 units in 35 days; Option C — subcontract the first 80 units of roughing operations to qualified subcontractor Apex Precision (AS9100D certified, D365 vendor record VND-0044) to free up finishing capacity

### The Business Impact

- **Feasibility answer delivered in 18 minutes** — Tom gave the sales team a data-backed response before the customer callback deadline
- **Split-order deal preserved** — the customer accepted Option B; 60 units shipped on day 21, 90 units on day 35; no existing orders disrupted
- **Subcontractor option documented** — Option C was filed as a contingency plan for future rush scenarios with Apex Precision, reducing response time for the next capacity crunch

### Try It Yourself

> "Show me Work Center 12's capacity utilization for the next 8 weeks and identify any 2-week windows where we have more than 15% available capacity that could absorb a new program."
