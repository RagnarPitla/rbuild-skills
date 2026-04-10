# Retail Agent Intro — Example

## Scenario: Building the Business Case for the First AI Agent in a 200-Store Chain

**Who:** Jonathan Park, VP of Retail Technology, Meridian Home Goods (200 stores, $1.1B annual revenue, SAP and D365 mixed environment)
**Where:** Executive presentation prep, D365 F&O retail and merchandising data
**The Problem:** Jonathan is building the internal business case for deploying AI agents across retail operations. The CFO wants specificity: which process should get the first agent, what is the financial case, and how does it scale? Jonathan has heard pitches from 3 vendors but none have anchored the recommendation in Meridian's actual data. He has the Q3 operational metrics and needs a defensible first-use-case recommendation before the Q4 capital planning cycle closes in 3 weeks.

**Prerequisites:** None

---

### What You Say to the Agent

> "I'm building the business case for our first retail AI agent deployment. We're a 200-store chain with D365. Based on what you know about retail operations, which process should get the first agent and what's the financial story I need to tell the CFO?"

### What the Agent Does

1. Evaluates the top 5 retail process candidates for first agent deployment against 4 criteria: data readiness (is the data already in D365), decision frequency (how often does the process require a human judgment call), cost of a wrong decision, and speed-to-value (weeks to measurable outcome)
2. Ranks markdown optimization as the highest-priority first use case: the process runs weekly on hundreds of SKUs, wrong decisions (marking down too early or too late) directly reduce gross margin, the data is already in the merchandising module, and comparable retailers report 2-4 percentage point margin improvement within the first full season
3. Calculates a baseline financial case for a 200-store chain at $1.1B revenue: assuming a 38% gross margin base and a conservative 1.5 percentage point improvement on clearance and promotional categories (typically 25-30% of revenue), the annual margin impact is $3.9M to $4.9M at $275M to $330M in affected revenue
4. Identifies the second-highest priority as inventory replenishment exception management: the process currently requires a buyer to manually review overstock and stockout alerts each morning, a task that takes 45-90 minutes per category and is often deferred — an agent that triage and prioritizes the exception queue recovers category manager capacity and reduces stockout-driven lost sales
5. Structures a 3-phase roadmap: Phase 1 (markdown optimization agent, 90 days), Phase 2 (replenishment exception agent, months 4-6), Phase 3 (planogram compliance agent across field reps, months 7-12), with each phase building on the same D365 data foundation and compounding the ROI case

### The Business Impact

- **CFO-ready financial case built** — $3.9M to $4.9M annual margin improvement estimate grounded in Meridian's own revenue and margin profile, not a vendor benchmark
- **First use case selected on data readiness** — markdown optimization wins because the data is already in D365, avoiding a 6-month data integration project before value is realized
- **3-phase roadmap ready for capital planning** — each phase has a distinct owner, metric, and time horizon, which is what capital committees need to approve phased investment

### Try It Yourself

> "Walk me through what a markdown optimization agent actually does step-by-step in a D365 retail environment, so I can explain it to a CFO who has never seen one."
