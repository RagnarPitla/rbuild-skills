# Batch Order Manager — Example

## Scenario: Three Products, One Reactor, and 4-Hour Changeover Cycles

**Who:** Carlos Herrera, Production Supervisor, Aldrich Specialty Chemicals (specialty chemicals manufacturer, REACH and ISO 9001 certified)
**Where:** D365 F&O Production Control, process manufacturing batch scheduling
**The Problem:** Next week's production plan requires three products — Reactor Batch Products RX-401 (ester solvent), RX-512 (polymer additive), and RX-780 (release agent) — all scheduled on Reactor Line 2. Each changeover between products requires a 4-hour CIP (clean-in-place) cycle, and switching from RX-780 to RX-401 requires an additional 2-hour nitrogen purge due to incompatible residue chemistry. Carlos needs to sequence next week's 11 batch orders to minimize downtime. Doing this by hand with the changeover matrix takes most of a Friday afternoon.

**Prerequisites:** D365 F&O MCP Server, batch orders created in D365, changeover matrix configured in Dataverse resource policy table, Reactor Line 2 available hours defined

---

### What You Say to the Agent

> "Sequence next week's 11 batch orders on Reactor Line 2 to minimize total changeover time. RX-780 to RX-401 transitions need a 6-hour changeover, not 4. Give me the optimized sequence and total available production hours versus scheduled production hours."

### What the Agent Does

1. Pulls all 11 batch orders for Reactor Line 2 from D365: 4 orders of RX-401 (total 48 hours production time), 4 orders of RX-512 (total 36 hours), and 3 orders of RX-780 (total 27 hours); total production time 111 hours
2. Reads the changeover matrix from the Dataverse resource policy table: RX-401 to RX-512 = 4 hrs, RX-512 to RX-401 = 4 hrs, RX-401 to RX-780 = 4 hrs, RX-780 to RX-401 = 6 hrs, RX-512 to RX-780 = 4 hrs, RX-780 to RX-512 = 4 hrs
3. Models all feasible sequences and calculates total changeover cost; identifies the optimal sequence: RX-401 (x4) then RX-512 (x4) then RX-780 (x3) — total changeovers: 2 transitions (one 4-hour changeover between product families) = 8 hours total changeover time
4. Compares to the current draft schedule (which has RX-780 batches interspersed): the current schedule generates 5 changeovers including two RX-780-to-RX-401 transitions = 28 hours total changeover time
5. Calculates weekly capacity: Reactor Line 2 runs 24/7 with scheduled maintenance Sunday 06:00-10:00 = 164 available hours; optimized schedule uses 119 hours (111 production + 8 changeover) = 72.6% utilization, with 45 hours of buffer; current draft schedule would use 139 hours, leaving only 25 hours of buffer

### The Business Impact

- **20 hours of changeover time eliminated** — the optimized sequence saves 20 hours versus the draft schedule, equivalent to 1.5 additional batches of capacity per week
- **Schedule built in 12 minutes** — Carlos had the sequenced schedule, capacity utilization summary, and D365 batch order update ready before the Friday planning meeting
- **Buffer capacity preserved** — the 45-hour buffer protects against batch yield failures requiring reruns, which occur approximately once every 3 weeks on Reactor Line 2

### Try It Yourself

> "Show me next week's Reactor Line 2 schedule as a Gantt view with changeover blocks highlighted, and flag any batch orders where raw material inventory coverage is less than 110% of the batch requirement."
