# rbuild-skills

> The skills content repository for [skill.rbuild.ai](https://skill.rbuild.ai)
> All skill `.md` files live here. Push a file → site updates automatically.

## How It Works

```
You push a .md file  →  GitHub Action runs  →  skills-index.json rebuilt  →  site shows new skill
```

The website fetches `skills-index.json` for browsing and individual `.md` files for detail views.
**Never edit `skills-index.json` manually** — it's auto-generated.

## Folder Structure

```
skills/
├── personal/           ← Developer, AI engineer, content creator skills
│   ├── software-engineering/
│   ├── ai-agent-dev/
│   ├── frontend/
│   ├── language-specific/
│   ├── backend-data/
│   ├── content-creation/
│   ├── productivity/
│   ├── security/
│   └── devops/
└── business/           ← Enterprise, D365, Copilot Studio skills
    ├── copilot-studio/
    ├── d365-fno/
    ├── mcp/
    ├── power-platform/
    ├── enterprise-ai/
    ├── supply-chain/
    ├── content-business/
    └── industry-verticals/
        ├── automotive/
        ├── manufacturing-discrete/
        ├── manufacturing-process/
        ├── healthcare/
        ├── financial-services/
        ├── distribution-logistics/
        ├── energy-utilities/
        ├── professional-services/
        ├── public-sector/
        └── retail/
```

## Adding a Skill

1. Create a `.md` file in the correct folder
2. Add the required frontmatter (see template below)
3. Push to `main` — the GitHub Action rebuilds the index automatically

## Frontmatter Template

```yaml
---
name: "Skill Name"
slug: "skill-slug"
description: "One sentence — what this skill does."
tab: "personal"                    # personal | business
domain: "software-engineering"     # maps to category on site
industry_vertical: null            # only for business/industry-verticals/
difficulty: "intermediate"         # starter | intermediate | advanced
source_type: "ragnar-custom"       # ragnar-custom | ragnar-curated | ragnar-modified | community
tags: ["tag1", "tag2"]
version: "1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Source Title"
    url: "https://github.com/..."
---

# Skill content here...
```

## Rules

- **Mandatory fields:** `name`, `slug`, `description`, `tab`, `domain`, `difficulty`, `source_type`
- **References required** for any skill sourced from an external repo or marketplace
- `is_coming_soon: true` = shows as placeholder on site (no content needed beyond frontmatter)
- Slugs must be unique across the entire repo

## Local Development

```bash
# Rebuild the index locally after adding skills
node scripts/build-index.js

# Check how many skills are indexed
cat skills-index.json | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.total + ' skills')"
```

---

Built by [Ragnar Pitla](https://linkedin.com/in/ragnarpitla) · [skill.rbuild.ai](https://skill.rbuild.ai)
