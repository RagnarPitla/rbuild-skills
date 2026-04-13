---
name: "production-scheduling"
slug: "production-scheduling"
description: "Job sequencing, capacity planning, setup time optimization, and constraint identification for D365 Production Control — production orders, BOMs, routes, work centers, and capacity load. Use when user says \"production schedule\", \"job sequencing\", \"work center capacity\", \"production order\", \"BOM\", \"routing\", \"setup time optimization\", \"capacity load\"."
tab: "business"
domain: "supply-chain"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "supply-chain", "production", "scheduling"]
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


# Production Scheduling

Production scheduling answers one question: given what we need to make, when can we make it, with what resources? Get it right and you hit delivery dates with optimal efficiency. Get it wrong and you have overtime, idle work centers, missed customer commitments, and a shop floor full of WIP that is not moving.

## D365 Production Control: Core Concepts

### Production Order Lifecycle
```
Created > Estimated > Released > Started > Report as Finished > Ended

Estimated: System calculates material requirements and capacity needs
Released: Materials picked, job cards printed, shop floor notified
Started: Work begins, time/quantity feedback can start
Report as Finished: Output quantity confirmed, moved to finished goods
Ended: All costs finalized, WIP closed
```

### Bill of Materials (BOM)
The BOM defines what materials are needed to make a product. Key fields:
- **BOM line type**: Item (physical component), Phantom (sub-assembly, explodes through), Vendor (purchased service)
- **Quantity**: Per output quantity, or per series
- **Scrap %**: Expected material waste to factor into requirements
- **Effective dates**: Support multiple BOM versions (e.g., product revisions)

OData query for BOM lines:
```
GET /data/BOMVersions?$filter=ItemId eq 'PRODUCT-001' AND BOMVersionStatus eq 'Approved'
  &$expand=BOMLines($select=ItemId,BOMQty,ScrapPercent,BOMLineType)
```

### Routes and Operations
Routes define the sequence of work center operations needed to produce a product.

| Route Field | Purpose |
|-------------|---------|
| Operation | The task being performed |
| Work center | Which machine/cell/team does it |
| Setup time | One-time preparation time per batch |
| Run time | Per-unit processing time |
| Queue time | Waiting time before/after operation |
| Transfer time | Time to move to next operation |

**Total operation time = Setup time + (Run time x Quantity) + Queue time + Transfer time**

## Capacity Planning

### Capacity Load Calculation
```
Capacity Required = Setup time + (Run time x Planned quantity)

Capacity Available = Working hours x Number of machines/workers x Efficiency %

Load % = Capacity Required / Capacity Available x 100

Overloaded: Load % > 100
Optimal:    Load % = 75-90
Underloaded: Load % < 60
```

### Identifying Bottlenecks
A bottleneck is a work center consistently running at > 95% capacity. Everything upstream will queue. Everything downstream will idle.

In D365, view capacity load:
- Production control > Inquiries > Capacity > Work center load

OData query for capacity load by work center:
```
GET /data/WorkCenterCapacityLoad?$filter=ScheduleDate ge [start] AND ScheduleDate le [end]
  &$select=WorkCenterId,ScheduleDate,CapacityRequired,CapacityAvailable,LoadPercent
  &$orderby=LoadPercent desc
```

**Bottleneck response options:**
1. Split the job across multiple work centers (if applicable)
2. Add overtime (if capacity = people, not machines)
3. Outsource the operation (add a vendor operation to the route)
4. Move the order to a different date
5. Use an alternate work center with a different route version

### Finite vs Infinite Scheduling
| Approach | Description | Use When |
|----------|-------------|----------|
| Infinite scheduling | Ignores capacity constraints, schedules by demand date | Planning phase, rough-cut capacity |
| Finite scheduling (forward) | Schedules from today forward, respects capacity limits | Detailed production scheduling |
| Finite scheduling (backward) | Schedules backward from due date | When due date is fixed |

D365 supports both via Operations scheduling (rough) and Job scheduling (detailed, finite).

## Job Sequencing Strategies

### Sequencing Rules
| Rule | Logic | Best For |
|------|-------|----------|
| First Come First Served (FCFS) | Schedule in order received | Simple, fair |
| Earliest Due Date (EDD) | Schedule by due date ascending | Minimize late orders |
| Shortest Processing Time (SPT) | Schedule shortest jobs first | Maximize throughput |
| Critical Ratio (CR) | (Due date - Today) / Remaining processing time | Balance urgency and time |

**Critical Ratio interpretation:**
- CR < 1.0: Behind schedule (critical)
- CR = 1.0: Exactly on schedule
- CR > 1.0: Ahead of schedule

Sort your production orders by CR ascending. The most critical (lowest CR) get scheduled first.

### Setup Time Optimization
When multiple jobs run on the same work center, sequence similar jobs together to reduce changeover time.

**Sequence-dependent setup:** Setup time depends on both the current job and the previous job (e.g., color sequence in paint lines, product family in food manufacturing).

Create a setup time matrix in Dataverse (`cr023_prod_setup_matrix`):
| From Product | To Product | Setup Minutes |
|-------------|------------|---------------|
| PROD-A | PROD-B | 45 |
| PROD-A | PROD-C | 120 |
| PROD-B | PROD-C | 30 |

An agent can optimize the production sequence to minimize total setup time (Traveling Salesman Problem variant — use nearest-neighbor heuristic for practical implementations).

## Line Balancing

For assembly lines, balance work across stations to eliminate bottlenecks.

```
Takt Time = Available production time / Customer demand rate

Example:
Available time = 450 minutes/shift
Customer demand = 90 units/shift
Takt time = 450/90 = 5 minutes per unit

Each station must complete its work within 5 minutes.
If any station exceeds takt time, it is a bottleneck.
```

**Line balancing steps:**
1. List all operations and their times
2. Calculate takt time from demand
3. Group operations into stations where total time <= takt time
4. Minimize the number of stations
5. Balance workload across stations (minimize idle time)

## D365 Production Scheduling Configuration

### Work Calendar Setup
- Organization administration > Work calendars
- Define working days, shifts, holidays
- Assign to work centers
- **Critical:** If calendar is wrong, all scheduling calculations are wrong

### Capacity Settings on Work Centers
- Production control > Setup > Resources > Work centers
- Capacity: Set in hours per day
- Efficiency %: Account for non-productive time (maintenance, breaks)
- Input and output warehouses: Where materials come from and go to

### MRP and Master Scheduling
- Master planning generates planned production orders from demand
- Planners firm up planned orders into actual production orders
- Operations scheduling gives start/end dates
- Job scheduling gives detailed hour-by-hour schedule

## Trigger Phrases

- "production schedule"
- "job sequencing"
- "work center capacity"
- "production order"
- "BOM explosion"
- "routing and operations"
- "setup time optimization"
- "capacity load"

## Quick Example

> See `production-scheduling-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Production orders scheduled in the past (negative lead time) | Work calendar not set up or capacity not defined on work centers | Verify work center has an assigned work calendar with working hours; check that efficiency % is not set to 0 |
| Capacity load shows overloaded work centers every week | Setup times not included in route operations or capacity is set too optimistically | Add realistic setup times to route operations; reduce efficiency % on work center to reflect actual productive time; consider adding a second shift or alternate work center |
| Jobs finishing later than scheduled | Run times in the route are too optimistic (set in the past when efficiency was higher) | Pull actual vs standard time from job card feedback (`ProdRouteTrans`); update route operation times with actuals |
| Critical ratio calculation showing wrong urgency | Production order start/end dates not recalculated after demand changes | Re-run operations scheduling on affected orders; set up automatic re-scheduling trigger when sales order delivery date changes |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
