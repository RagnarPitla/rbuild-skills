---
name: "skills4dataverse"
slug: "skills4dataverse"
description: "Converting skill markdown files to Dataverse Business Skills table entries — schema mapping, CSV generation for bulk import, and Power Automate direct API import. Use when user says \"skills4dataverse\", \"convert skills to Dataverse\", \"skill table schema\", \"generate skill CSV\", \"skill import pipeline\", \"skill markdown to Dataverse record\"."
tab: "business"
domain: "power-platform"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["intermediate", "dataverse", "skills", "csv-import"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Dataverse MCP, Power Automate"
mcp_tools: []
---


# Skills4Dataverse

Skills4Dataverse is the pipeline that converts skill `.md` files into Dataverse Business Skills table records. It is the backbone of the rbuild-skills platform's data layer — making skill metadata queryable, searchable, and consumable by agents, apps, and reports.

## The Full Schema

Every skill markdown file has frontmatter fields. Skills4Dataverse maps them to Dataverse columns:

| Frontmatter Field | Dataverse Column | Type | Notes |
|-------------------|-----------------|------|-------|
| `name` | `cr023_skill_name` | Text | Display name |
| `slug` | `cr023_slug` | Text (alternate key) | Unique kebab-case ID |
| `description` | `cr023_description` | Text (multiline) | Includes trigger phrases |
| `tab` | `cr023_tab` | Text | Top-level category |
| `domain` | `cr023_domain` | Text | Sub-domain |
| `industry_vertical` | `cr023_industry_vertical` | Text | Null if horizontal |
| `difficulty` | `cr023_difficulty` | Choice | starter/intermediate/advanced |
| `source_type` | `cr023_source_type` | Choice | ragnar-custom/community |
| `tags` | `cr023_tags` | Text (multiline) | JSON array as string |
| `version` | `cr023_version` | Text | Semver string |
| `icon_emoji` | `cr023_icon_emoji` | Text | Single emoji |
| `is_featured` | `cr023_is_featured` | Boolean | Featured on homepage |
| `is_coming_soon` | `cr023_is_coming_soon` | Boolean | Coming soon flag |
| `author` | `cr023_author` | Text | Author handle |
| `requires` | `cr023_requires` | Text (multiline) | Required MCP/integrations |
| `mcp_tools` | `cr023_mcp_tools` | Text (multiline) | JSON array |
| `has_example` | `cr023_has_example` | Boolean | Derived: example file exists |
| `learning_path` | `cr023_learning_path` | Text | Path identifier |
| `learning_path_position` | `cr023_learning_path_position` | Whole Number | Order in path |

## Deriving `has_example`

The `has_example` field is not in the frontmatter — it is derived by checking whether a corresponding `-example.md` file exists in the same directory:

```typescript
import * as fs from 'fs';
import * as path from 'path';

function hasExample(skillFilePath: string): boolean {
  const dir = path.dirname(skillFilePath);
  const slug = path.basename(skillFilePath, '.md');
  const examplePath = path.join(dir, `${slug}-example.md`);
  return fs.existsSync(examplePath);
}
```

## Generating Import-Ready CSV

The CSV generation script reads all skill files and outputs a single CSV ready for Dataverse import:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { createObjectCsvWriter } from 'csv-writer';

const SKILLS_DIR = './skills';
const OUTPUT_CSV = './output/skills-import.csv';

// Choice column value maps
const DIFFICULTY_MAP: Record<string, number> = {
  starter: 100000000,
  intermediate: 100000001,
  advanced: 100000002,
};

const SOURCE_TYPE_MAP: Record<string, number> = {
  'ragnar-custom': 100000000,
  community: 100000001,
};

function collectSkillFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectSkillFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('-example')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function generateCSV() {
  const files = collectSkillFiles(SKILLS_DIR);
  const records = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const fm = yaml.load(match[1]) as Record<string, unknown>;

    records.push({
      cr023_skill_name: fm.name ?? '',
      cr023_slug: fm.slug ?? '',
      cr023_description: fm.description ?? '',
      cr023_tab: fm.tab ?? '',
      cr023_domain: fm.domain ?? '',
      cr023_difficulty: DIFFICULTY_MAP[fm.difficulty as string] ?? '',
      cr023_source_type: SOURCE_TYPE_MAP[fm.source_type as string] ?? '',
      cr023_tags: fm.tags ?? '',
      cr023_version: fm.version ?? '',
      cr023_icon_emoji: fm.icon_emoji ?? '',
      cr023_is_featured: fm.is_featured ? 1 : 0,
      cr023_is_coming_soon: fm.is_coming_soon ? 1 : 0,
      cr023_author: fm.author ?? '',
      cr023_requires: fm.requires ?? '',
      cr023_mcp_tools: JSON.stringify(fm.mcp_tools ?? []),
      cr023_has_example: hasExample(file) ? 1 : 0,
      cr023_learning_path: fm.learning_path ?? '',
      cr023_learning_path_position: fm.learning_path_position ?? '',
    });
  }

  const writer = createObjectCsvWriter({
    path: OUTPUT_CSV,
    header: Object.keys(records[0]).map(id => ({ id, title: id })),
  });
  await writer.writeRecords(records);
  console.log(`Exported ${records.length} skills to ${OUTPUT_CSV}`);
}

generateCSV();
```

Run with: `npx tsx generate-csv.ts`

## Direct API Import via Power Automate

For ongoing sync (not just initial load), use a scheduled Power Automate flow:

```
Trigger: Recurrence — every day at 2:00 AM UTC

Step 1: List GitHub repository files
  Connector: GitHub
  Action: List repository contents
  Owner: RagnarPitla
  Repo: rbuild-skills
  Path: rbuild-skills/skills

Step 2: Apply to each file
  Filter: endsWith(item()?['name'], '.md') AND NOT contains(item()?['name'], '-example')

  Step 2a: Get file content
    Action: Get file content
    Returns: Base64 encoded content

  Step 2b: Decode content
    Expression: base64ToString(body('Get_file_content')?['content'])

  Step 2c: Extract frontmatter
    Expression: Use substring/indexOf to extract YAML between --- delimiters

  Step 2d: Upsert row in Dataverse
    Table: Business Skills (cr023_business_skills)
    Match column: cr023_slug (alternate key)
    Values: mapped from parsed frontmatter
```

## Query Examples

Once skills are in Dataverse, they are queryable via OData:

### All skills in a domain
```
GET /api/data/v9.2/cr023_business_skills?$filter=cr023_domain eq 'supply-chain'
  &$select=cr023_skill_name,cr023_slug,cr023_difficulty,cr023_description
```

### Skills that require a specific MCP tool
```
GET /api/data/v9.2/cr023_business_skills?$filter=contains(cr023_mcp_tools, 'd365-fno-mcp')
  &$select=cr023_skill_name,cr023_slug,cr023_requires
```

### Featured skills by category
```
GET /api/data/v9.2/cr023_business_skills?$filter=cr023_is_featured eq true AND cr023_tab eq 'business'
  &$select=cr023_skill_name,cr023_slug,cr023_icon_emoji
  &$orderby=cr023_skill_name
```

### Skills with examples
```
GET /api/data/v9.2/cr023_business_skills?$filter=cr023_has_example eq true
  &$select=cr023_skill_name,cr023_slug,cr023_domain
```

## Skill Count by Domain (Reporting)

Group skills by domain for platform coverage reporting:
```
GET /api/data/v9.2/cr023_business_skills?$apply=groupby((cr023_domain),aggregate($count as SkillCount))
  &$orderby=SkillCount desc
```

## Trigger Phrases

- "skills4dataverse"
- "convert skills to Dataverse"
- "skill table schema"
- "generate skill CSV"
- "skill import pipeline"
- "skill markdown to Dataverse record"
- "sync skills to Dataverse"
- "Business Skills table"

## Quick Example

> See `skills4dataverse-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Duplicate records created on re-import via CSV | Standard CSV import does not match on alternate key | Use Power Automate upsert method or delete-and-reimport; for production, always use the Power Automate flow with alternate key matching |
| YAML parse error on specific skill files | Multiline values not properly quoted in frontmatter, or special characters in description | Fix frontmatter YAML: wrap description values containing colons in double quotes; validate with an online YAML linter before running the import |
| `has_example` is false for skills that do have example files | Example file naming convention inconsistent | Verify example files are named exactly `{slug}-example.md` in the same directory as the skill file |
| OData filter on `cr023_mcp_tools` not returning expected results | `mcp_tools` stored as raw YAML array string, not as clean JSON | Normalize to clean JSON array on import: `JSON.stringify(Array.isArray(val) ? val : [val])`; ensure no YAML list syntax (dashes) leaks into the stored string |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
