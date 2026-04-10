# Planogram Compliance Checker — Example

## Scenario: 40 Store Visit Photos to Review Before a Regional VP Tour

**Who:** Brianna Okafor, Field Merchandising Manager, Crestwood Consumer Brands (CPG company, snack and beverage division, shelf space in 600+ grocery accounts)
**Where:** D365 F&O retail execution module, planogram library, field photo submission workflow
**The Problem:** Brianna's team of 8 field reps visited 40 stores over the past week and submitted photos through the mobile app. The regional VP is touring 12 stores next Wednesday and Brianna needs to identify which locations have non-compliant planograms before the tour, not after. Manually reviewing 40 photo sets (typically 6-10 photos per store) to compare against the current planogram PDF takes her team a full day. She has 2 hours before her prep call.

**Prerequisites:** Current planogram version (PG-2024-Q4-Snack-B) uploaded to D365, field photo submissions linked to store IDs, compliance rule set defined

---

### What You Say to the Agent

> "Review the 40 store visit photos from this week against planogram PG-2024-Q4-Snack-B and flag any stores with compliance issues before Wednesday's VP tour."

### What the Agent Does

1. Processes all 40 store photo sets (214 images total) against the Q4 snack planogram specification, checking for product facings, shelf position by SKU, shelf tag presence, and promotional display placement
2. Identifies 11 stores with at least one compliance violation, ranked by severity: 4 stores have critical violations (wrong product in a primary position, blocking a promoted SKU), 5 stores have moderate violations (facing count below minimum, missing shelf talker), and 2 stores have minor issues (slight vertical position deviation within tolerance)
3. Finds that store #4471 (Greenfield Kroger) has the promoted SKU (Crestwood Ridgecrunch 8oz, the Q4 feature item) blocked by a competitor product placed in the second facing position — the display looks compliant from the aisle but the promotional position is not executing
4. Cross-references the 12 stores on the VP tour itinerary against the compliance findings: 3 of the 12 tour stores have violations — store #4471, store #4388, and store #4502 — with enough lead time for rep visits before Wednesday
5. Generates a field correction brief for each non-compliant store with annotated photos showing the current state, the required state per planogram, and the specific SKUs affected, formatted for the rep to use during a correction visit

### The Business Impact

- **3 tour stores corrected before the VP visits** — compliance issues found with 5 days of lead time, not discovered during the tour
- **11 total violations resolved this week** — including the blocked promotional SKU at Greenfield Kroger, which was invisible to a quick aisle check
- **2 hours versus 8 hours** — manual photo review replaced with a prioritized violation report, freeing the team for correction visits

### Try It Yourself

> "Which stores on my route have had 3 or more planogram violations in the last two quarters? I want to flag them as high-risk accounts for the next reset cycle."
