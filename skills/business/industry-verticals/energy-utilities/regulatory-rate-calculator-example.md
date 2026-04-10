# Regulatory Rate Calculator — Example

## Scenario: Commercial Customer Billed Under Wrong Rate Class for 6 Months

**Who:** Annette Sorrell, Senior Billing Analyst, Clearwater Electric Cooperative (serves 84,000 meters, mixed residential/commercial/industrial)
**Where:** D365 F&O billing and customer account management, utility rate engine
**The Problem:** During a routine account audit, Annette discovers that Hartfield Cold Storage (account #CC-00447, a 280,000 sq ft refrigerated warehouse) has been billed under Rate Schedule TOU-Medium (demand threshold up to 500 kW) since April. Hartfield's actual peak demand has been running between 620 and 710 kW every month, which qualifies them for Rate Schedule TOU-Large. The rate difference is significant: TOU-Large carries a lower energy charge (8.2 cents/kWh vs 9.6 cents/kWh) but a higher demand charge structure and a higher customer charge. Annette needs to know who owes whom money, and how much.

**Prerequisites:** Interval meter data for account CC-00447 imported, both rate schedules active in the rate engine, 6-month billing history on file

---

### What You Say to the Agent

> "Account CC-00447, Hartfield Cold Storage, has been on TOU-Medium since April but their peak demand has been above 500 kW every month. Recalculate their bills under TOU-Large and tell me the net difference."

### What the Agent Does

1. Retrieves 6 months of interval meter data for account CC-00447 and confirms peak demand readings of 621 kW (April), 648 kW (May), 703 kW (June), 697 kW (July), 671 kW (August), and 634 kW (September)
2. Recalculates each month's bill under TOU-Large rate schedule using actual kWh consumption by on-peak and off-peak period, actual peak demand for the demand charge, and the correct customer charge of $385/month versus the TOU-Medium customer charge of $210/month
3. Produces a side-by-side comparison showing that TOU-Large results in lower total bills for Hartfield in 5 of 6 months due to the lower energy charge, with the June bill being the only month where TOU-Large would have been higher (due to the higher demand charge during the 703 kW peak)
4. Calculates a net adjustment of $7,840 in Hartfield's favor over the 6-month period, with the largest monthly delta in August ($1,920 overbilled under TOU-Medium)
5. Identifies that the rate misclassification originated from the account setup in April when the service address was migrated from the legacy billing system with the wrong demand threshold flag, and flags 3 other accounts migrated in the same batch for proactive review

### The Business Impact

- **$7,840 customer credit calculated accurately** — processed before Hartfield's accounts payable team escalates or requests a regulatory complaint
- **3 additional accounts flagged proactively** — the same migration error may have affected other accounts; catching them now avoids compounding overbilling
- **Regulatory exposure contained** — billing errors on commercial accounts above a defined threshold trigger mandatory reporting in most state PUC jurisdictions; early identification and correction avoids a formal complaint filing

### Try It Yourself

> "Show me all commercial accounts with peak demand readings in the last 3 months that are within 10% of a rate schedule threshold, so I can review them for potential misclassification."
