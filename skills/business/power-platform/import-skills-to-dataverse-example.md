# Import Skills to Dataverse — Example

## Scenario: Loading 45 rbuild-skills Skill Definitions into the Skills4Dataverse Catalog

**Who:** Jordan Fitch, Power Platform Admin, independent consultant building a skills catalog for a client
**Where:** Power Platform, Dataverse, Skills4Dataverse solution
**The Problem:** Jordan has cloned the rbuild-skills repository and wants to import 45 specific skill markdown files into Dataverse as Business Skills records. The client is building an internal skills catalog called Skills4Dataverse that surfaces available agent skills inside their model-driven app. Jordan has never done a Dataverse bulk import of markdown content before and isn't sure how to map the skill metadata (name, description, category, triggers) to the Dataverse table columns. Manual data entry for 45 records would take most of a day.

**Prerequisites:** Skills4Dataverse solution installed in the target environment. rbuild-skills repo cloned locally. Power Platform CLI (pac) installed. import-skills-to-dataverse skill loaded.

---

### What You Say to the Agent

> "I have 45 rbuild-skills .md files I need to import into Dataverse as Business Skills records. The skills are across 6 categories: supply-chain, copilot-studio, d365-fno, power-platform, mcp, and enterprise-ai. I have the Skills4Dataverse solution installed. Walk me through how to do this efficiently."

### What the Agent Does

1. Confirms the Skills4Dataverse table schema: `rbai_businessskill` with columns `rbai_name`, `rbai_description`, `rbai_category`, `rbai_skillslug`, `rbai_triggerexamples`, `rbai_filename`, `rbai_isactive`
2. Reads the 45 .md files and extracts metadata from each: skill name from the H1 heading, description from the first paragraph, trigger phrases from the "TRIGGER when" section, category from the directory path
3. Generates a CSV file ready for Dataverse import:

```
rbai_name,rbai_description,rbai_category,rbai_skillslug,rbai_triggerexamples,rbai_filename,rbai_isactive
"Customs Trade Compliance","Codified expertise for customs documentation...","Supply Chain","customs-trade-compliance","HTS code review, duty calculation, restricted party screening","customs-trade-compliance.md","Yes"
"Inventory Demand Planning","Codified expertise for demand forecasting...","Supply Chain","inventory-demand-planning","safety stock, demand planning, seasonal forecast","inventory-demand-planning.md","Yes"
[...43 more rows...]
```

4. Validates the CSV: checks for missing required fields, duplicate slugs, and description length (Dataverse text field limit 4,000 characters — flags 2 skills that exceed this)
5. Imports using Power Platform CLI:

```bash
pac data import --data business-skills-import.csv --environment "prod-env-id"
```

6. Confirms: 43 records imported successfully, 2 flagged for truncation review

### The Business Impact

- **45 skill records imported in 12 minutes** — compared to an estimated 6-7 hours of manual data entry
- **Zero schema errors** — CSV validation step caught 2 oversized descriptions before they hit the API limit
- **Skills catalog live** — 45 skills now searchable in the model-driven app by category, slug, and trigger phrase
- **Repeatable process** — the same script runs every time new skills are added to the rbuild-skills repo, keeping Dataverse in sync

### Try It Yourself

> "The client wants to add a custom field to each skill record: 'compatible_agents' that lists which Copilot Studio agents can use this skill. How do I add that column to the table and include it in the next import run?"
