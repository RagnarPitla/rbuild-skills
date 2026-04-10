---
name: Copilot Studio Knowledge Sources
slug: cs-knowledge-sources
description: Configure SharePoint, website, and Dataverse knowledge sources for accurate grounded answers in your Copilot Studio agent.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"knowledge\", \"sharepoint\", \"grounding\", \"rag\"]"
version: 1.0.1
icon_emoji: 📚
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 3
prerequisites: "[\"cs-first-agent\"]"
references:
  - "title: "Add knowledge to your agent"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Copilot Studio Knowledge Sources

Knowledge sources turn a generic chatbot into an agent that knows your business. When a user asks a question your topics don't handle, the agent searches knowledge sources and generates a grounded answer.

## Source Types

### Public Website
Best for: External documentation, help articles, product pages
- Crawls the URL and linked pages
- Use specific URLs, not homepage (too broad)
- Max 4 URLs per agent

```
✅ https://docs.contoso.com/procurement-policy
❌ https://contoso.com (crawls everything including nav, footer noise)
```

### SharePoint
Best for: Internal policies, SOPs, HR content, procedures
- Requires agent service account has read access to the site
- Best document formats: Word (.docx), PDF with real text (not scanned)
- Keep documents under 512KB for best indexing
- Use descriptive file names — "Procurement-Policy-2026.docx" not "Doc1.docx"

### File Upload
Best for: Static reference documents that rarely change
- Limit: 3 files, 512KB each
- Good for quick prototypes — use SharePoint for production

### Dataverse Table
Best for: FAQ-style Q&A, structured reference data the agent should know
- Create a table with `Question` and `Answer` columns
- Agent retrieves matching rows and generates responses

## Content Quality Tips

**Write for agents, not just humans.** Dense legalese confuses retrieval. Add plain-language summaries at the top of key documents.

**Be specific about scope in system instructions:**
```
You have access to the Contoso Procurement Policy and Vendor FAQ.
If you cannot find the answer in these sources, say:
"I don't have that information. Please contact procurement@contoso.com"
```

**Test with real questions.** After adding a source, ask the same questions your users will ask. High escalation rate = your source content needs improvement.

## What NOT to Put in Knowledge

- Real-time data (inventory levels, order status) → use connector actions instead
- Confidential data (salaries, personal records) → use row-level Dataverse security
- Everything → focused content beats broad coverage every time

## Check Analytics

**Analytics → Knowledge sources** shows which sources are hit most, escalation rates, and topics with no matched knowledge. A high escalation rate means the content needs improvement, not the agent instructions.

## Trigger Phrases

- "Help me with copilot studio knowledge sources"
- "Copilot Studio Knowledge Sources"
- "How do I copilot studio knowledge sources"

## Quick Example

> See `cs-knowledge-sources-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
