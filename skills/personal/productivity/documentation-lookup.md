---
name: "Documentation Lookup"
slug: "documentation-lookup"
description: "Get accurate, current docs for any library or framework via Context7 MCP — stop relying on outdated training data for API signatures and syntax."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["documentation", "context7", "mcp", "libraries", "api-reference", "current"]
version: "1.0.1"
icon_emoji: "📖"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Context7 MCP"
    url: "https://context7.com"
requires: "Context7 MCP"
mcp_tools: ["context7-mcp"]
---

# Documentation Lookup

Claude's training data has a cutoff. Libraries ship breaking changes. APIs get deprecated. The version Claude thinks is current might be 2 versions old.

This skill fetches live, current documentation directly — so you get the right API signature, the right config option, the right import path — not what existed 12 months ago.

## When to Use This

Use this whenever you're working with a library, framework, SDK, or API — especially for:
- API method signatures (has this changed?)
- Configuration options (new options added, old ones removed)
- Installation commands (package names change)
- Migration guides (v2 → v3 breaking changes)
- Setup and getting-started instructions

**Do NOT use for:** General programming concepts, architecture decisions, debugging your own code logic — those don't need live docs.

## Trigger Phrases

- "Look up docs for [library]"
- "What's the current API for [function]?"
- "Get me the latest [framework] documentation on [topic]"
- "How do I configure [library] in the latest version?"
- "Check the docs — has [method] changed in [library] v[N]?"
- "Documentation lookup: [library/SDK name]"
- "Current syntax for [library]"

## Examples

```
"Look up docs for Framer Motion — specifically how to do 
layout animations in v11. I think the API changed."

"Get me the current Anthropic SDK docs for streaming 
with tool use. Check what's changed in the latest version."

"How do I configure Tailwind v4? The v3 config doesn't work."

"Look up the current Next.js 16 App Router docs for 
server actions with form submissions."
```

## How It Works

With Context7 MCP installed in Claude Code:
1. You ask the question
2. Skill calls Context7 to resolve the library and fetch current docs
3. Claude answers using the live documentation — not training data

Without Context7: Claude answers from training data (may be outdated — it will say so).

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Still getting old API | Context7 MCP not installed | Install via: `claude mcp add context7` |
| Wrong library version | Multiple versions in registry | Specify version explicitly: "React 19 docs for useOptimistic" |
| Docs not found | Obscure/private library | Fall back to web search or paste the docs directly |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill |
