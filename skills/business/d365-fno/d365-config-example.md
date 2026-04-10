# D365 Config — Example

## Scenario: Pre-Go-Live Configuration Validation for a Distribution Company

**Who:** Rajan Mehta, D365 F&O Implementation Consultant, leading a go-live for a 3-site distribution company
**Where:** 2 weeks before go-live; the client has been live in their test environment for 6 weeks but no one has done a systematic configuration review against the go-live checklist
**The Problem:** Rajan has a 200-item configuration checklist but no structured way to work through it quickly. Past go-lives have failed or required emergency fixes because foundational config items were missed — number sequences not set up, posting profiles missing for a transaction type, or fiscal calendar not matching the client's period structure. He needs to validate that all critical configuration is complete and correct before the cutover weekend.

**Prerequisites:** D365 F&O test environment access; client's business requirements documentation.

---

### What You Say to the Agent

> "I need to validate that all foundational D365 F&O configuration is complete before going live with a 3-site distribution company. We use Inventory Management, Procurement and Sourcing, and Sales and Marketing modules. Help me work through the critical configuration areas systematically and identify anything that could block go-live."

### What the Agent Does

1. Organizes the validation into 7 foundational areas and sequences them in dependency order (you can't validate posting profiles before the chart of accounts is confirmed):
   - Legal entity and fiscal calendar setup
   - Number sequences (critical: every transaction type needs one — missing number sequences cause hard stops on day 1)
   - Chart of accounts and posting profiles
   - Inventory configuration (item groups, inventory posting, dimension groups, tracking dimension groups)
   - Procurement configuration (vendor posting profiles, procurement categories, purchase agreements setup)
   - Sales configuration (customer posting profiles, sales tax groups, delivery terms)
   - Multi-site inventory configuration (sites, warehouses, locations, location profiles)

2. For each area, provides the exact menu path in D365 F&O, the specific fields to verify, and the test transaction to run to confirm the configuration works end-to-end — not just that the record exists

3. Identifies 6 configuration items that are consistently missed in distribution go-lives: warehouse location profile with FIFO picking enabled, customer sales tax group assignment on the default customer account, landed cost tracking setup if the client imports goods, intercompany posting profiles if they have transactions between legal entities, item coverage groups for MRP if replenishment planning is in scope, and cash discount terms matching what was agreed with key vendors

4. Generates a go/no-go assessment with red/amber/green status for each area, with specific remediation steps for any gaps found

### The Business Impact

- **Configuration review completed in 1 day** instead of 3 days of ad-hoc checking
- **2 blocking issues found** before cutover weekend: number sequences not configured for sales quotations (amber — needed for week 2 operations), and the warehouse location profile for site 2 missing the replenishment policy (red — would have blocked all automated replenishment picks on day 3)
- **Go-live weekend runs clean** — no emergency support calls in the first 72 hours
- **Client confidence high** — systematic validation gives the steering committee evidence that the system is ready

### Try It Yourself

> "We're going live with D365 F&O Accounts Payable next month. The client processes 600 vendor invoices per week across 3 legal entities. What are the critical AP configuration items I must validate before go-live, and what test transactions should I run to confirm each one works?"
