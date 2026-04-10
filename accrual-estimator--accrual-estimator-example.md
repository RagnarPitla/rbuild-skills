# Accrual Estimator — Example

## Scenario: Month-End Scramble for Uninvoiced Receipts

**Who:** Maria Chen, Senior GL Accountant
**Where:** D365 Finance — General Ledger / Accounts Payable
**The problem:** It's the last day of the fiscal period. Maria knows there are dozens of purchase orders where goods were received but invoices haven't arrived yet. She needs accurate accrual estimates to close the books, but manually cross-referencing PO receipts against AP invoices across three legal entities takes her team two full days.

---

### What You Say to the Agent
> "Estimate all uninvoiced receipt accruals for Contoso US, Contoso Canada, and Contoso Mexico for period ending March 2026. Flag anything over $25,000 that needs controller review."

### What the Agent Does
1. Scans all purchase orders with product receipts posted in the period that have no matching vendor invoice — across all three legal entities
2. Calculates accrual amounts using the PO unit price multiplied by received quantity, grouping by vendor, procurement category, and financial dimensions
3. Identifies 14 line items exceeding the $25,000 threshold, including a $187,000 raw materials receipt from Fabrikam Supplies that was received on March 28 with no invoice in sight

### The Business Impact
- **Two days compressed to 20 minutes** — Maria's team gets a complete accrual schedule instantly instead of manually reconciling PO receipts
- **No missed accruals** — the agent caught a $187,000 receipt that was sitting in a secondary warehouse nobody was monitoring
- **Controller confidence** — flagged items above threshold are presented with full PO references, making review and sign-off straightforward

### Try It Yourself
> "Show me all expense accruals for USMF in February 2026 where the expense report was approved but not yet posted to GL, broken down by department."
