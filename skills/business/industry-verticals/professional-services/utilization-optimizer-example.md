# Utilization Optimizer — Example

## Scenario: Three Senior Consultants at 45% Billable Utilization Against a 75% Target

**Who:** Fatima Al-Rashid, Resource Manager, Axiom Technology Partners (200-person IT consulting firm, Microsoft and SAP practices)
**Where:** D365 F&O Project Management module, resource scheduling and timesheet data
**The Problem:** Fatima is preparing the monthly utilization report for the leadership team. Three senior consultants (all at the L5 pay grade, billing at 1,650 USD/day) are tracking at 45% billable utilization for the month. The firm's target is 75%. At 45%, each consultant represents roughly $47,500 in foregone monthly revenue versus target. Fatima needs to understand why and present a recovery plan, not just the number.

**Prerequisites:** Timesheet entries current in D365, project pipeline visible in CRM, resource skills matrix loaded

---

### What You Say to the Agent

> "Three of my senior L5 consultants are at 45% billable utilization this month. The target is 75%. Show me what's driving the gap and where they could be placed."

### What the Agent Does

1. Pulls timesheet breakdown for all three consultants: billable project hours, internal hours (presales, training, admin), and unallocated time — finds that an average of 28% of their logged time is coded to presales activities, which is 3x the firm's 9% presales benchmark for L5 consultants
2. Identifies that Consultant 1 (D365 Finance specialist) has been assigned as the sole technical resource on a discovery engagement that billed only 12 hours in 4 weeks because the client keeps rescheduling workshops — the project is not formally on-hold but is functionally stalled
3. Finds that Consultant 2 (Azure Integration specialist) completed a project 3 weeks ago and has been waiting on the pipeline for a new assignment that requires both Azure and SAP BTP skills — the search has been manual and ongoing for 18 days with no match found
4. Discovers that Consultant 3 is available but not in the skills search results for two active project requests because her Dynamics 365 Commerce certification (earned 5 months ago) was never added to her skills matrix record in the resource module
5. Surfaces 3 active project requests in the pipeline that partially or fully match the three consultants' skills and availability, with estimated booking revenue of $312,000 over the next 8 weeks if placed

### The Business Impact

- **$142,500 in monthly foregone revenue explained** — three distinct root causes, not a single diagnosis, each with a specific action
- **Consultant 3 made searchable in 10 minutes** — a missing skills matrix entry was hiding her from every resource search for 5 months
- **Stalled discovery engagement escalated** — Consultant 1's project is flagged for a client success call rather than continuing to absorb L5 capacity on a non-progressing engagement

### Try It Yourself

> "Which project managers have had the most under-utilized resources assigned to their projects in the last quarter, and what were the primary time codes eating the billable hours?"
