# D365 Record to Report — Example

## Scenario: Tracing a $47,000 Month-End Trial Balance Variance

**Who:** Priya Kaur, GL Accountant, consumer goods company
**Where:** D365 F&O General Ledger; month-end close; the trial balance shows a $47,000 discrepancy between the subledger and GL for account 21000 (Accounts Payable)
**The Problem:** The AP subledger balance is $1,284,400. The GL account 21000 shows $1,237,400. The $47,000 gap showed up this morning and the Controller needs an explanation before the CFO review at 3 PM. Last month the trial balance reconciled perfectly. Priya has 4 hours to find the $47,000.

**Prerequisites:** D365 F&O GL and AP access; period is still open; the variance appeared after overnight batch processing.

---

### What You Say to the Agent

> "My trial balance doesn't reconcile at month end. AP subledger shows $1,284,400 but GL account 21000 shows $1,237,400 — $47,000 gap. This appeared overnight. Last month was clean. I have 4 hours before the CFO review. Help me trace where this $47,000 is coming from."

### What the Agent Does

1. Structures the investigation into 3 parallel diagnostic tracks, ordered by likelihood for an overnight appearance:
   - Track 1: Posted transactions that hit subledger but not GL — run the Vendor transactions vs. ledger reconciliation report in AP (Accounts Payable, Periodic Tasks, Vendor Statement, Vendor Ledger Reconciliation). Any transactions where "Posted" status doesn't have a corresponding ledger voucher are the culprit.
   - Track 2: Manual journal entries that hit GL account 21000 directly without going through AP — run the Ledger transaction list filtered to account 21000, period = current month, and look for any entries with a journal batch source rather than a vendor voucher source
   - Track 3: Intercompany transactions posted in the overnight batch where the intercompany offset didn't post correctly — if the company does intercompany AP, check whether last night's intercompany batch completed successfully

2. Provides the exact D365 navigation for the fastest diagnostic: General Ledger, Inquiries and Reports, Ledger Transactions — filter to account 21000, date range = yesterday (when the batch ran). Sort by amount descending. A single transaction close to $47,000 is likely the source.

3. Identifies the most common root cause for overnight appearance: a vendor invoice was posted via batch the previous night with a posting profile that had an incorrect main account mapping — the AP subledger recorded it correctly but the GL posting hit a different account (or failed to post). Check the posting profile for the vendor group of the invoice that was posted last night.

4. Once Priya finds the transaction, walks through the correction options: if the period is still open, a reversing entry on the incorrect GL account and a repost to 21000 will close the gap; if the period is being closed, the correction must be processed as a period adjustment with Controller approval

5. Produces a 3-bullet summary Priya can give the Controller at 3 PM: what the gap was, what caused it, and what the corrective action is — formatted for a non-technical audience

### The Business Impact

- **$47,000 variance traced in 90 minutes** instead of consuming the entire 4-hour window
- **Root cause identified** as a misconfigured posting profile on a new vendor group set up 2 days earlier by the implementation team
- **CFO review proceeds on schedule** with a clear explanation and corrective action already in progress
- **Posting profile corrected** before the next invoice batch runs, preventing a recurring variance

### Try It Yourself

> "At month end I always have a small difference between my Fixed Assets subledger and the FA account in the GL. This month it's $12,800. The difference seems to grow each month. What are the typical causes of a recurring FA subledger to GL variance in D365, and how do I trace which asset transactions are causing it?"
