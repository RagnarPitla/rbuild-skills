# GxP Compliance Checker — Example

## Scenario: FDA Inspection Readiness Verification for GMP-Critical Systems

**Who:** Dr. Amara Singh, Quality Assurance Manager, Pinnacle BioPharm (contract pharmaceutical manufacturer, 21 CFR Part 211 regulated)
**Where:** D365 F&O Quality Management module and integrated document management system
**The Problem:** An FDA pre-approval inspection is scheduled in 4 weeks. Amara needs to verify that all 38 GMP-critical computerized systems have current validation documentation (IQ, OQ, PQ), that audit trails are enabled and intact, and that no periodic review is overdue. The last internal audit identified 6 documentation gaps that were supposed to be closed 90 days ago. She does not know if those gaps are resolved or if new ones have appeared.

**Prerequisites:** D365 F&O MCP Server, validated systems register in Dataverse, document management integration configured

---

### What You Say to the Agent

> "Run a GxP compliance check across all 38 validated computerized systems. Flag any with expired validation documents, missing audit trail configuration, or periodic review overdue. I need this inspection-ready."

### What the Agent Does

1. Pulls the validated systems register from D365 and checks each of the 38 systems against three compliance dimensions: current validation status (IQ/OQ/PQ documentation active and within revalidation period), audit trail configuration status (enabled, periodic review completed within 12 months), and periodic revalidation due date
2. Identifies 4 systems with expired or missing validation documents: the laboratory information management system (LIMS) has an OQ that expired 47 days ago; the environmental monitoring system has no PQ on record; two manufacturing execution system (MES) workstations have IQ documents referencing the old hardware configuration before a server migration 8 months ago
3. Finds 3 systems where audit trail periodic review is overdue: the ERP dispensing module (review last completed 14 months ago), the HPLC data system in QC Lab 2 (overdue 6 months), and the label printing system (no review record at all)
4. Confirms that all 6 gaps from the previous internal audit are now closed with supporting documentation dated and signed
5. Generates an inspection-readiness summary: 31 of 38 systems fully compliant; 7 systems with specific gaps; estimated remediation effort per gap with suggested document owner assignments and a 4-week completion timeline

### The Business Impact

- **Inspection readiness assessed in 45 minutes** — a manual records review of 38 systems typically takes 3-4 days; the agent completed it before the end of the morning
- **7 gaps remediated before FDA arrives** — all gaps identified with enough lead time to resolve; MES workstation IQs updated, LIMS OQ reissued, and audit trail reviews completed within the 4-week window
- **483 observation risk eliminated** — the 7 findings, if discovered during the inspection, could each generate a Form 483 observation; none appeared in the inspection report

### Try It Yourself

> "Show me all periodic review tasks for computerized systems that are due in the next 60 days and assign each to the responsible system owner."
