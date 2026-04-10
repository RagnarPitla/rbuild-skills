---
name: import-skills-to-dataverse
description: Process for importing skill definition markdown files into Dataverse as Business Skills records — creating structured table entries with category, description, complexity, and MCP tool metadata. Use when user says "import skills to Dataverse", "skills4dataverse import", "upload skill definitions", "create skill records in Dataverse", "bulk import skills", "Power Automate skill import".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, dataverse, import, business-skills]
requires: Dataverse MCP, Power Automate
mcp_tools:
  - "dataverse-mcp"
  - "power-automate"
---

# Import Skills to Dataverse

Skills defined in markdown files have structured frontmatter metadata — name, description, category, difficulty, requires, mcp_tools. This skill covers taking those definitions and creating corresponding Business Skills records in Dataverse, making them queryable by agents and visible in model-driven apps.

## Why Import Skills to Dataverse

The rbuild-skills platform stores skill definitions as markdown files in a GitHub repo. To surface these skills in:
- Copilot Studio agents that recommend skills
- Power Apps portals for skill browsing
- Power BI reports on skill coverage by domain
- D365 F&O integration for business process coverage mapping

The skills need to live in Dataverse as structured records — not just as flat files.

## Business Skills Table Schema

The target Dataverse table for imported skills:

| Column | Schema Name | Type | Description |
|--------|-------------|------|-------------|
| Skill Name | `cr023_skill_name` | Text (single line) | Display name of the skill |
| Slug | `cr023_slug` | Text (single line, alternate key) | Kebab-case identifier |
| Description | `cr023_description` | Text (multiline) | What it does and trigger phrases |
| Category | `cr023_category` | Choice | Tab/domain grouping |
| Domain | `cr023_domain` | Text (single line) | Sub-domain (e.g., supply-chain) |
| Difficulty | `cr023_difficulty` | Choice | starter / intermediate / advanced |
| Requires | `cr023_requires` | Text (multiline) | Required MCP servers / integrations |
| MCP Tools | `cr023_mcp_tools` | Text (multiline) | JSON array of MCP tool names |
| Has Example | `cr023_has_example` | Boolean | Whether an example file exists |
| Version | `cr023_version` | Text (single line) | Current version (e.g., 1.1.0) |
| Author | `cr023_author` | Text (single line) | Skill author |
| Source Type | `cr023_source_type` | Choice | ragnar-custom / community / etc. |
| Is Featured | `cr023_is_featured` | Boolean | Featured on platform homepage |
| Icon Emoji | `cr023_icon_emoji` | Text (single line) | Display emoji |

Set `cr023_slug` as the alternate key so records can be upserted by slug without needing the GUID.

## Import Methods

### Method 1: CSV Bulk Import (Fastest for Initial Load)

1. Parse all skill markdown files and extract frontmatter
2. Generate a CSV with one row per skill, columns matching the Dataverse schema
3. Import via Power Platform Admin Center > Data > Import data

CSV format:
```csv
cr023_skill_name,cr023_slug,cr023_description,cr023_category,cr023_domain,cr023_difficulty,cr023_requires,cr023_version
"Inventory Reorder Advisor","inventory-reorder-advisor","EOQ calculations...","business","supply-chain","intermediate","D365 F&O MCP Server","1.1.0"
```

**Limitations:** No upsert support in standard CSV import — duplicate slugs create new records. Use only for initial load or after clearing the table.

### Method 2: Power Automate Flow (Best for Ongoing Sync)

A Power Automate flow triggered by a GitHub webhook or scheduled run:

```
Trigger: Recurrence (daily) or HTTP webhook from GitHub

Step 1: Get skill files
  - List files in GitHub repo via GitHub connector
  - Filter to .md files in /skills/ directory

Step 2: For each file
  - Get file content (GitHub connector: Get file content)
  - Parse frontmatter: extract YAML between --- delimiters
  - Map fields to Dataverse columns

Step 3: Upsert to Dataverse
  - Action: "Update a row" (Dataverse) using alternate key on slug
  - If slug does not exist: creates new record
  - If slug exists: updates existing record

Step 4: Log results
  - Write to a Dataverse import log table
  - Send summary notification to admin
```

### Method 3: Dataverse MCP Direct Write (Best for Ad-Hoc Updates)

When adding or updating a single skill, use the Dataverse MCP server to write directly:

```
Tool: dataverse_upsert_row
Table: cr023_business_skills
Alternate key: cr023_slug = "inventory-reorder-advisor"
Fields:
  cr023_skill_name: "Inventory Reorder Advisor"
  cr023_description: "EOQ calculations, reorder points..."
  cr023_difficulty: 1 (choice value for "intermediate")
  cr023_version: "1.1.0"
```

## Parsing Skill Frontmatter

Skill markdown files use YAML frontmatter between `---` delimiters. Parsing logic (TypeScript/Node):

```typescript
import * as fs from 'fs';
import * as yaml from 'js-yaml';

function parseSkillFrontmatter(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`No frontmatter found in ${filePath}`);
  return yaml.load(match[1]) as Record<string, unknown>;
}

// Map to Dataverse columns
function mapToDataverse(frontmatter: Record<string, unknown>) {
  return {
    cr023_skill_name: frontmatter.name,
    cr023_slug: frontmatter.slug,
    cr023_description: frontmatter.description,
    cr023_domain: frontmatter.domain,
    cr023_difficulty: frontmatter.difficulty,
    cr023_requires: frontmatter.requires,
    cr023_mcp_tools: JSON.stringify(frontmatter.mcp_tools),
    cr023_version: frontmatter.version,
  };
}
```

## Handling Choice Columns

Dataverse Choice columns store integer values, not text. You need a lookup map:

| Display Value | Integer Value |
|---------------|---------------|
| starter | 100000000 |
| intermediate | 100000001 |
| advanced | 100000002 |

When importing, convert the string from frontmatter to the corresponding integer before writing to Dataverse.

## Verification After Import

After import, verify records are correct:

1. Open the model-driven app for Business Skills
2. Check total record count matches number of skill files
3. Spot-check 3-5 records for correct field mapping
4. Test an OData query: `GET /api/data/v9.2/cr023_business_skills?$filter=cr023_domain eq 'supply-chain'`
5. Verify alternate key works: `GET /api/data/v9.2/cr023_business_skills(cr023_slug='inventory-reorder-advisor')`

## Trigger Phrases

- "import skills to Dataverse"
- "skills4dataverse import"
- "upload skill definitions"
- "create skill records in Dataverse"
- "bulk import skills"
- "Power Automate skill import"
- "sync skill markdown to Dataverse"
- "skill frontmatter to Dataverse"

## Quick Example

> See `import-skills-to-dataverse-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| CSV import creates duplicate records instead of updating | CSV import does not use alternate key for matching | Use the Power Automate upsert method instead; or delete existing records before re-importing from CSV |
| Choice column values failing on import | String values used instead of integer option set values | Map string difficulty/category values to their integer equivalents before writing to Dataverse |
| Frontmatter parsing fails on some skill files | YAML formatting inconsistency (quotes, special characters) | Validate YAML syntax in all skill files before import; use `js-yaml` with strict mode to catch errors |
| MCP tools column truncated | `mcp_tools` is a JSON array that exceeds single-line text limit | Change `cr023_mcp_tools` column type to Text (multiline) to handle arrays; or store as comma-separated string |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
