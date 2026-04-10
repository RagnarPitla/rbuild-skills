# D365 Solution Builder — Example

## Scenario: Designing a D365 F&O Solution for a Mid-Market Chemical Manufacturer

**Who:** Adrian Kowalski, Solution Architect, large Microsoft partner firm
**Where:** Scoping phase for a new D365 F&O implementation; the client is a chemical manufacturer, $180M revenue, 3 plants, 620 employees, currently on a 15-year-old on-premise ERP
**The Problem:** The client has signed with Adrian's firm for a D365 F&O implementation but the module selection and agent architecture haven't been locked down. The client's CFO wants batch traceability and regulatory compliance built in from day one. The operations team wants production scheduling that accounts for tank capacity constraints. Adrian needs to present the recommended solution design in 2 weeks.

**Prerequisites:** D365 F&O licenses procured; Copilot Studio licenses available; Azure tenant active.

---

### What You Say to the Agent

> "Help me design a D365 F&O solution for a mid-market chemical manufacturer. $180M revenue, 3 plants, 620 employees. They need batch traceability, regulatory compliance (REACH, GHS), production scheduling with tank capacity constraints, and they want AI agents from day one. What modules should I recommend and what does the agent architecture look like?"

### What the Agent Does

1. Recommends the core module set with justification for each:
   - Process Manufacturing (mandatory for chemicals — batch orders, formula management, co-products/by-products, CW items for variable weight batches)
   - Inventory Management with advanced warehouse management (needed for 3-plant operations and lot/serial traceability requirements)
   - Quality Management (for CoA generation, batch disposition, REACH compliance documentation)
   - Production Control with capacity planning (tank constraints require resource groups with finite capacity scheduling)
   - Procurement and Sourcing with vendor managed inventory (chemical raw material procurement patterns)
   - Compliance and regulatory features via the Environmental Sustainability and Process Compliance features in D365

2. Identifies the 3 configuration decisions that will define the implementation complexity: whether to enable Warehouse Management System (WMS) module at all 3 plants from day one or phase it (phasing reduces go-live risk), how to handle CW (catch weight) items if the client sells by volume but tracks by weight, and the dimension group setup for chemical batches (lot traceability requires Lot ID on storage and tracking dimensions)

3. Designs the agent architecture for the AI-first requirement:
   - Parent agent (Copilot Studio): orchestrates incoming queries across 4 child agents
   - Batch Traceability Agent: queries D365 batch genealogy via MCP, answers "which customers received batches from lot L-2024-0847?" — critical for recall scenarios
   - Quality Agent: monitors quality order results, flags batches that are out of specification before they ship, surfacing disposition decisions to the QA manager
   - Production Scheduling Agent: reads tank capacity via MCP, checks batch order conflicts, recommends schedule adjustments when a tank cleaning is required between production runs
   - Compliance Agent: Dataverse policy table stores REACH/GHS thresholds, agent checks each batch against the policy and flags export documentation requirements

4. Flags the 3 implementation risks specific to chemical manufacturing: batch rounding rules for formula scaling must be tested with the client's actual production tolerances before go-live; co-product cost allocation method (either actual or estimated) will affect the P&L significantly and needs CFO sign-off in week 2; regulatory report formats (SDS, CoA) require a document management configuration that is often scoped out and then becomes a go-live blocker

### The Business Impact

- **Solution design presented in 2 weeks** with module justification, agent architecture, and risk register — client steering committee approves the design in one session
- **Batch recall capability designed in** from the requirements stage, not retrofitted after the client's first regulatory inspection
- **Agent architecture scoped for the real use cases** the operations and quality teams actually need, not generic AI features
- **3 critical risks surfaced before scoping is locked** — cost allocation method decision alone prevents a 3-week delay that typically hits in month 4 of these projects

### Try It Yourself

> "I'm designing a D365 F&O solution for a food and beverage manufacturer. They have 2 plants, sell both branded and private label products, and need lot traceability for food safety compliance. What modules do I need and what are the configuration decisions I should resolve in the first 2 weeks of the project?"
