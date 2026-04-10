# AML Transaction Screener — Example

## Scenario: Payroll Noise Drowning Out Real Risk

**Who:** Marcus Okonkwo, BSA/AML Compliance Analyst, Regional Community Bank (assets: $2.4B)
**Where:** AML monitoring queue in the bank's compliance workstation, integrated with D365 F&O
**The Problem:** Last week's AML batch run flagged 340 transactions. Marcus has verified 323 of them as payroll disbursements from three employer clients whose ACH batches consistently split below the $10,000 CTR threshold. With 17 potentially real alerts buried in the noise, he has no way to prioritize his review queue before Thursday's BSA officer sign-off deadline.

**Prerequisites:** D365 F&O MCP Server, AML alert queue access, Dataverse policy table with counterparty whitelist

---

### What You Say to the Agent

> "I have 340 flagged transactions from this week's AML run. Filter out anything that matches known payroll processors and re-score the remaining alerts by risk. Show me the top 10 highest-risk transactions first."

### What the Agent Does

1. Pulls all 340 flagged transactions from the AML alert queue via D365 F&O MCP
2. Cross-references counterparty IDs against the Dataverse payroll-processor whitelist — suppresses 318 alerts matching three known ACH payroll originators (Employer IDs: EMP-0041, EMP-0078, EMP-0203)
3. Re-scores the remaining 22 transactions using the AML scoring model: sanctions match (0-10), structuring pattern, geographic risk, velocity anomaly, and behavioral deviation
4. Surfaces a score-9 alert: three wire transfers totaling $47,500 sent to a counterparty in a FATF grey-list jurisdiction within 48 hours, from an account with a 6-month average monthly outflow of $3,200
5. Identifies two additional score-7 alerts involving a newly opened business account with 14 round-dollar cash deposits in 8 days, ranging from $8,500 to $9,700

### The Business Impact

- **Review time cut from 3 days to 4 hours** — Marcus reviews 22 alerts instead of 340, focusing only on genuine risk
- **SAR filed same day** — the score-9 wire cluster auto-populated a SAR draft with transaction details, counterparty data, and a narrative; Marcus edited and filed within the same shift
- **Payroll clients protected** — false positives suppressed at source without manual tagging each cycle; the whitelist rule persists for future batch runs

### Try It Yourself

> "Show me all structuring-pattern alerts from the past 30 days for business accounts opened less than 6 months ago, scored 6 or higher."
