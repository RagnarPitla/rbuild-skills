# Dataverse Table Design for Agents — Example

## Scenario: Designing a Procurement Compliance Policy Table for the Niyam Pattern

**Who:** Ravi Sundaram, Copilot Studio Developer, Microsoft partner building agents for a manufacturing client
**Where:** Power Platform, Dataverse, Copilot Studio
**The Problem:** Ravi is building a procurement compliance agent using the Niyam pattern. The agent needs to enforce procurement policies: vendor approval thresholds, category spend limits, preferred vendor requirements, and three-quote rules. He's never designed a Dataverse table specifically for agent consumption before. His first instinct is to mirror the structure of the client's existing Excel policy document, but that creates a table with 40 columns that's hard for the agent to query and reason over. He needs the right schema design before he builds.

**Prerequisites:** Power Platform environment with Dataverse. Solution created. Basic Dataverse table creation skills. dataverse-table-design-for-agents skill loaded.

---

### What You Say to the Agent

> "I'm building a procurement compliance agent using the Niyam pattern. The agent needs to enforce policies around vendor approvals, spend thresholds, preferred vendors, and three-quote requirements. Help me design the Dataverse table schema. I want to get the structure right before I start building."

### What the Agent Does

1. Explains the core Niyam pattern principle for policy tables: the agent reads policies at runtime, so the table needs to be optimized for natural language retrieval, not normalized relational design
2. Recommends a two-table structure:

```
TABLE 1: cr023_pc_policy (Procurement Compliance Policy)
  cr023_policyid (GUID, primary key, auto)
  cr023_policyname (Single Line of Text, required) — "Three-Quote Rule for Capital Expenditures"
  cr023_policycategory (Choice: VendorApproval | SpendThreshold | PreferredVendor | QuoteRequirement)
  cr023_policydescription (Multiple Lines of Text) — full plain-English rule the agent reads
  cr023_thresholdvalue (Currency) — dollar amount trigger, if applicable
  cr023_isactive (Yes/No, default Yes) — lets you deactivate without deleting
  cr023_effectivedate (Date Only)
  cr023_exceptionallowed (Yes/No) — whether agent can flag exceptions for human approval

TABLE 2: cr023_pc_policyexception (Policy Exception Log)
  cr023_exceptionid (GUID, primary key)
  cr023_policy (Lookup to cr023_pc_policy)
  cr023_requestedbv (Lookup to SystemUser)
  cr023_exceptionreason (Multiple Lines of Text)
  cr023_approvalstatus (Choice: Pending | Approved | Rejected)
  cr023_approvedby (Lookup to SystemUser)
  cr023_purchaseorder (Single Line of Text) — D365 PO reference
```

3. Explains why `cr023_policydescription` should be written as a full sentence the agent can quote directly, not a code or reference number
4. Shows how to use `cr023_isactive` and `cr023_policycategory` as the agent's filter parameters so it doesn't load all 40+ policies on every query
5. Provides the Copilot Studio topic snippet that reads the policy table using Power Automate

### The Business Impact

- **Agent built on correct schema** — no redesign needed after the first prototype, saving 2 days of rework
- **Policy retrieval optimized** — agent queries by category + active status, returning 5-8 relevant policies instead of all 40
- **Exception workflow included from day one** — the exception log table means the agent can escalate to a human approver without a custom-built approval flow
- **Client reuse** — the same two-table pattern was reused for the client's travel policy agent 3 weeks later

### Try It Yourself

> "Now design the equivalent policy table structure for a travel and expense compliance agent. The policies cover per diem rates by country, approval thresholds by employee level, and preferred hotel programs."
