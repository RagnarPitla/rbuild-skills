# D365 Source to Pay — Example

## Scenario: Invoice Three-Way Match Failure Rate Jumping from 2% to 18%

**Who:** Linda Park, AP Manager, retail distribution company
**Where:** D365 F&O Accounts Payable; third week of the month; the AP team is manually resolving 6x more match exceptions than usual
**The Problem:** Last month, invoice three-way match failures (invoice vs. PO vs. product receipt) ran at 2% — approximately 12 failures per week out of 600 invoices. This month the failure rate jumped to 18% — roughly 108 failures per week. The AP team is spending 3 extra hours per day on manual exception resolution. Linda needs to find the root cause before the month-end close, when the backlog becomes a cash flow problem.

**Prerequisites:** D365 F&O AP access with match exception reports; the AP team can identify which vendors are generating the most failures.

---

### What You Say to the Agent

> "Our invoice three-way match failure rate jumped from 2% to 18% this month — going from 12 to 108 failures per week. The AP team is overwhelmed with manual exceptions. Help me diagnose the root cause and fix it."

### What the Agent Does

1. Recommends the first diagnostic: pull the Invoice matching details report in D365 (Accounts Payable, Inquiries and Reports, Invoice matching details) filtered to the current month's failures. Look at the failure type breakdown — D365 categorizes mismatches as price tolerance failures, quantity tolerance failures, or charges mismatches. The distribution of failure types tells you where to look next.

2. Analyzes the likely root causes based on the timing (started this month, was clean last month):
   - A vendor raised prices without a corresponding PO amendment — the most common cause of sudden price tolerance spikes. Pull the top 10 vendors by failure count and compare the invoice unit prices to the PO prices.
   - A buyer changed the match policy from 2-way to 3-way for a vendor group — this adds the product receipt check and fails all invoices where the receipt hasn't been posted yet
   - A new tolerance policy was applied: check if someone changed the invoice matching tolerance percentages in AP parameters this month (Accounts Payable, Setup, Accounts Payable Parameters, Invoice Validation tab)
   - Product receipt posting delays: if warehouse operations changed their posting frequency (e.g., went from daily to weekly receipts), invoices arrive before the receipt is in the system — triggers match failures that resolve themselves when receipts catch up

3. Identifies that a policy change is the most likely cause of a sharp step-change (as opposed to a gradual drift), and provides the navigation to check: Accounts Payable, Setup, Invoice Matching Validation, review the date the policy was last modified

4. If the root cause is vendor price increases, provides the resolution workflow: buyer reviews and amends the affected POs to the invoiced price (if approved), or AP creates a price variance posting using the AP parameters' price tolerance override process for invoices within the company's price variance authority

5. Builds the triage approach for the current 108-failure backlog: sort by amount descending, resolve the 20 largest failures first (likely 80% of the dollar value), batch-approve failures that are within the existing tolerance policy after the tolerance policy question is resolved, escalate only genuine disputes to the buyers

### The Business Impact

- **Root cause identified in 2 hours**: a tolerance policy change from 3% to 0% was made by a new AP supervisor 3 weeks ago without realizing the impact
- **Policy corrected to 3%** with Controller approval; 67 of the 108 outstanding failures auto-resolve on the next match validation run
- **Remaining 41 failures** triaged by amount — top 15 by value resolved by buyers amending POs, 26 small-value failures batch-approved within authority limits
- **AP team backlog cleared in 2 days** instead of a 2-week manual resolution effort heading into month-end close

### Try It Yourself

> "I have an AP vendor who sends invoices with different reference numbers than the POs we issue. D365 keeps failing the match because the vendor invoice number doesn't match our internal PO reference. Is there a way to handle this in D365 without failing the match every time?"
