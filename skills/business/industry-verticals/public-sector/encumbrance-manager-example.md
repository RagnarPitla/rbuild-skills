# Encumbrance Manager — Example

## Scenario: 89% Budget Encumbered, Only 62% Expended, Year-End Approaching

**Who:** Carolyn Thibodeau, Budget Analyst, Hargrove County Department of Public Works
**Where:** D365 F&O Public Sector General Ledger and Budget Control module
**The Problem:** It is 8 months into the fiscal year and the Public Works department has encumbered 89% of its $14.2M operating budget through open purchase orders and blanket contracts. However, actual expenditures (vouchers posted) are only at 62%. Year-end is 4 months away and county policy requires all encumbrances to be either expended or released before the fiscal close. Finance has flagged Public Works as a high-risk department for year-end carryover issues. Carolyn needs to identify which encumbrances are legitimate commitments and which are stale.

**Prerequisites:** Encumbrance ledger current in D365, purchase order status and vendor delivery data linked, budget periods defined

---

### What You Say to the Agent

> "We're 8 months into the fiscal year. I have 89% encumbered but only 62% expended. Identify which open POs are stale and need to be released before year-end."

### What the Agent Does

1. Pulls all open encumbrance records from the budget control module and joins them to PO activity data: last receipt date, last invoice date, vendor delivery status, and PO age
2. Identifies 47 purchase orders with no receipt activity in more than 90 days, representing $1.84M in encumbered budget — these are candidates for release or supplier follow-up
3. Finds a blanket PO for road maintenance materials (PO-BLK-2024-0112, $680,000 encumbered) where only $142,000 has been released to date against a contract that has 6 weeks remaining — the remaining $538,000 is encumbered but the vendor has confirmed no additional delivery is planned this fiscal year
4. Flags 12 capital encumbrances totaling $2.1M that are tied to a construction project delayed by permitting; these are legitimate but should be formally evaluated for reappropriation to next fiscal year to avoid lapsing under the county's use-or-lose rule
5. Calculates that releasing the stale and over-encumbered POs would free $2.38M in budget capacity, which could be redirected to 3 deferred maintenance projects that have unfunded requisitions sitting in the queue since month 4

### The Business Impact

- **$2.38M in budget capacity recovered** — specific POs identified, not an estimate, with the vendor delivery data to support each release decision
- **Year-end carryover risk eliminated for Public Works** — finance audit flag resolved with documentation 4 months ahead of close
- **3 deferred projects get funding** — pothole repair backlog and 2 facility HVAC replacements can now proceed within the current fiscal year

### Try It Yourself

> "Show me every open encumbrance over $50,000 where no activity has occurred in the last 60 days, sorted by department and budget line."
