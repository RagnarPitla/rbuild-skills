# D365 Plan to Produce — Example

## Scenario: Production Order Firmed But No Capacity Allocated to Work Centers

**Who:** Henrik Larsen, Production Planner, industrial equipment manufacturer
**Where:** D365 F&O Production Control; capacity planning review for the upcoming 2-week production window
**The Problem:** Production order PRD-00847 for 500 units of Product A (assembly sub-component) was firmed 3 days ago. The planned start date is tomorrow. Henrik pulled up the work center load report this morning and sees zero hours booked for Assembly Line 3, which should have 160 hours of work from this order. The production manager is asking why the line appears empty on the schedule.

**Prerequisites:** D365 F&O Production Control access; the BOM and route for Product A are set up; work centers are configured.

---

### What You Say to the Agent

> "Production order PRD-00847 for 500 units of Product A was firmed 3 days ago, start date is tomorrow. The work center load report shows zero capacity allocated to Assembly Line 3. What could be causing this and how do I fix it?"

### What the Agent Does

1. Diagnoses the 5 causes for a firmed production order showing zero capacity on the work center load report:
   - Route version not active or not approved on the product: if the route for Product A has no approved version or the approved version's validity date doesn't cover today, D365 firms the order without scheduling it against a route
   - Finite capacity scheduling not selected during firming: if the planner firmed the order without selecting "Scheduling method: Operations scheduling with finite capacity," D365 creates the order but doesn't reserve capacity
   - Work center capacity is defined as zero for the period: check Assembly Line 3's capacity calendar — if the calendar shows no working hours for the planned start week, D365 can't allocate
   - Route operations have run time of 0: check the route operations for Product A — if the setup time and run time are both 0 for the assembly operation, no capacity is consumed
   - Operations scheduling ran but finite capacity was not checked: the load shows as scheduled but without resource reservation — visible in the production order's route card as "Scheduled" with no specific work center time slots

2. Provides the diagnostic navigation: Production Control, Production Orders, PRD-00847, Route card — check if operations show start/end times. If they show times but the work center load is empty, go to Organization Administration, Resources, Assembly Line 3, Capacity — check the working time calendar for the period.

3. Walks through the fix: delete the existing route scheduling, re-schedule the production order using Operations Scheduling with finite capacity enabled, confirm the route operations now show specific time slots, and verify Assembly Line 3 load report reflects the 160 hours

4. Identifies that the firming was likely done without finite capacity — a common mistake when planners are rushing through a large batch firm. Recommends adjusting the Master Planning parameters to always use finite capacity when firming, so this doesn't recur

5. Assesses the risk for tomorrow's start date: with 500 units and 160 hours of assembly work, if another order is already scheduled on Assembly Line 3, the rescheduled PRD-00847 may push the start date. Tells Henrik to check the work center load for Assembly Line 3 for the next 10 days before confirming the rescheduled start.

### The Business Impact

- **Root cause found in 20 minutes** instead of Henrik spending the day troubleshooting with the IT team
- **Production order correctly scheduled** before the start date, preventing a line startup with no work instructions or material staging plan
- **Assembly Line 3 load report accurate** — the production manager has a real picture of line utilization for the week
- **Recurring issue prevented** — Master Planning parameter updated so all future firmings use finite capacity by default

### Try It Yourself

> "My MRP run firmed 23 production orders last night. When I look at the capacity load for our paint line, it shows 340% utilization next week. How do I understand which orders are causing the overload and what options do I have to resolve it?"
