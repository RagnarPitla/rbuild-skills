# Automotive Dealer Ops — Example

## Scenario: Service Bay Utilization Collapse Across a Multi-Dealership Group

**Who:** Marcus Delgado, Director of Fixed Operations, Premier Auto Group (12 dealerships, Ford and GM franchise mix)
**Where:** D365 F&O Service Management module, integrated with Reynolds & Reynolds DMS
**The Problem:** Service bay utilization dropped from 87% to 61% last month across 4 of the 12 stores. Three master technicians left within a 6-week window and appointment backlogs now stretch 11 days. Marcus is getting pressure from the dealer principal to explain the drop before the OEM performance review next Thursday.

**Prerequisites:** Service orders synced to D365, technician skill matrix loaded in the resource scheduling module

---

### What You Say to the Agent

> "Our service bay utilization dropped from 87% to 61% last month across stores 3, 5, 7, and 9. We lost three techs. Show me where the capacity gap is hitting hardest and what we can do before the OEM review on Thursday."

### What the Agent Does

1. Pulls open service order queue for stores 3, 5, 7, and 9 and segments by labor operation code (A-service, B-service, transmission, electrical, warranty repair)
2. Maps departed technician certifications against the current open WO backlog — identifies that 2 of the 3 departures held ASE Master certifications covering transmission and advanced electrical, which now have zero qualified coverage at store 7
3. Finds 142 open ROs waiting more than 5 days, with 67 of them flagged as warranty work that carries OEM clock-start penalties if not submitted within 30 days
4. Calculates that redistributing 18 appointment slots per week from stores 2 and 4 (both at 91% utilization but geographically adjacent) would recover 14 points of utilization within 3 weeks
5. Flags that store 9 has 2 technicians qualified for transmission work who are currently assigned only to oil changes due to a scheduling template that was never updated after a staffing change 4 months ago

### The Business Impact

- **Utilization recovery path identified** — rerouting 18 weekly slots from adjacent stores closes the gap before the OEM review without new hires
- **$34,000 warranty penalty risk avoided** — 67 aging warranty ROs flagged before the OEM submission deadline
- **Hidden capacity unlocked** — store 9 had 2 misassigned transmission techs; correcting the scheduling template adds ~22 productive labor hours per week at zero cost

### Try It Yourself

> "Which of my stores have technicians assigned below their certification level, and what's the labor revenue I'm leaving on the table?"
