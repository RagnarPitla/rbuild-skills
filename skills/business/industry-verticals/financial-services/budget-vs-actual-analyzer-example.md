# Budget vs Actual Analyzer — Example

## Scenario: Explaining a $380,000 Unfavorable Variance Before the Board Meeting

**Who:** Sandra Kowalski, Financial Controller, Vertex Advisory Partners (professional services firm, $42M annual revenue, 280 FTEs)
**Where:** D365 F&O Financial Management, Q3 P&L reporting
**The Problem:** Sandra is presenting Q3 results to the board in 6 hours. The raw P&L shows Professional Fees expense at $1.74M actual versus $1.36M budget — a $380,000 unfavorable variance she cannot explain from the GL alone. The board will want a root cause breakdown, not a line item. She has the numbers but not the story.

**Prerequisites:** D365 F&O MCP Server, approved Q3 budget loaded in D365, actual postings complete through September 30

---

### What You Say to the Agent

> "Explain the $380,000 unfavorable variance in Professional Fees for Q3. Break it down by vendor, project, and month. I need board-ready language, not raw data."

### What the Agent Does

1. Queries the D365 F&O ledger for all Professional Fees postings (GL account range 6100-6199) for July, August, and September — actual vs budget by cost center and vendor
2. Identifies three primary drivers: an unbudgeted $210,000 legal retainer engagement (outside counsel for a client contract dispute, approved by the CEO in August but not reflected in the budget); $95,000 in M&A advisory fees for the acquisition of a 4-person consultancy that closed in September; and $75,000 in IT consulting overruns across three separate projects (SharePoint migration, CRM integration, and cybersecurity assessment)
3. Segments the variance: $305,000 (80%) is attributable to unbudgeted one-time items with board-approved business justifications; $75,000 (20%) is operational overrun requiring explanation
4. Generates a narrative paragraph: "Q3 Professional Fees of $1.74M exceeded budget by $380,000 (28%). Approximately $305,000 relates to two board-sanctioned initiatives not reflected in the original budget: $210,000 in legal fees for the Hargrove contract dispute and $95,000 in M&A advisory fees for the Clearpath acquisition. The remaining $75,000 represents IT consulting overruns across three active projects; scope changes on the CRM integration account for $48,000 of this amount."
5. Flags that the IT overrun trend continues into Q4 based on open purchase orders, projecting an additional $40,000 above budget by December 31

### The Business Impact

- **Board presentation prepared in 20 minutes** — Sandra had drill-down data, narrative language, and a Q4 risk flag before the meeting
- **Variance contextualized, not just reported** — 80% of the overage was traceable to approved decisions, not operational failure; board confidence maintained
- **Q4 risk surfaced proactively** — the $40,000 projected IT overrun gave the board an action item rather than a surprise at year-end

### Try It Yourself

> "Run a full Q3 budget vs actual for all expense categories. Flag any line item with a variance greater than 15% or $50,000, whichever is smaller, and give me a one-sentence explanation for each."
