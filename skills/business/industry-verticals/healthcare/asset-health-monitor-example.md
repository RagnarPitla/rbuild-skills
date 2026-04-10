# Asset Health Monitor — Example

## Scenario: Q2 Preventive Maintenance Planning Across 200+ GMP-Critical Assets

**Who:** Rafael Montoya, Maintenance Engineer, NovaBio Therapeutics (pharmaceutical manufacturer, FDA-registered facility)
**Where:** D365 F&O Asset Management module, GMP production facility
**The Problem:** Rafael is responsible for preventive maintenance across 214 GMP-critical assets including bioreactors, lyophilizers, HVAC units, and filling lines. The maintenance calendar lives in multiple spreadsheets, open work orders are tracked in a separate system, and some PM schedules were last updated before the facility's capacity expansion 18 months ago. He has 6 weeks to complete Q2 PMs before the summer audit window and no clear picture of where to start.

**Prerequisites:** D365 F&O MCP Server, asset register with GMP criticality classifications loaded, maintenance plan schedules configured in D365

---

### What You Say to the Agent

> "Show me all GMP-critical assets with preventive maintenance due in Q2 and flag any that also have open work orders. Prioritize by asset criticality and last service date."

### What the Agent Does

1. Queries D365 Asset Management for all assets tagged with GMP-critical classification (214 total) and filters for PM forecast dates falling within April 1 to June 30
2. Identifies 67 assets with Q2 PM due dates; cross-references each against the open work order table to flag concurrent issues
3. Finds 11 assets with both a Q2 PM due and at least one open corrective work order — these are flagged as high-priority: a bioreactor (WO-2024-1147, temperature probe calibration drift, open 34 days) and a lyophilizer (WO-2024-1203, vacuum pump anomaly, open 19 days) are the most critical
4. Sorts the full list by: GMP criticality tier (Tier 1 = product-contact, Tier 2 = environmental control, Tier 3 = support utilities), days since last service, and days until PM due date
5. Surfaces that 8 assets are overdue for PM (last service more than 365 days ago, including 2 Tier-1 product-contact assets) with no scheduled work order assigned

### The Business Impact

- **Maintenance plan built in minutes, not days** — Rafael had a prioritized 67-asset Q2 schedule with criticality tiers and open-WO conflicts surfaced in one query instead of reconciling three spreadsheets
- **GMP risk reduced** — the 2 overdue Tier-1 assets were discovered before the audit window; work orders created and completed before the FDA inspection
- **No PM gaps during audit** — 100% of Q2 PMs completed on schedule; audit observation count for maintenance gaps: zero

### Try It Yourself

> "Which assets have not had a PM completed in the last 12 months and are classified Tier 1 or Tier 2? List them with their last service date and the name of the assigned technician."
