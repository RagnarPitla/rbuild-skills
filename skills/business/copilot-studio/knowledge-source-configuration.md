---
name: Knowledge Source Configuration
slug: knowledge-source-configuration
description: Configure and optimize Copilot Studio knowledge sources — SharePoint, websites, Dataverse, and files — for accurate grounded answers.
tab: business
domain: copilot-studio
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"copilot-studio\", \"knowledge\", \"grounding\", \"sharepoint\", \"rag\"]"
version: 1.0.1
icon_emoji: 📚
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: copilot-studio-path
learning_path_position: 3
prerequisites: "[\"your-first-copilot-studio-agent\"]"
references:
  - "title: "Add knowledge to your agent"
  - "title: "Knowledge sources overview"
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Knowledge Source Configuration

Knowledge sources are what turn a generic chatbot into an agent that actually knows your business. When a user asks something your topics don't explicitly handle, the agent searches your knowledge sources and generates a grounded answer. Done right, this is powerful. Done wrong, you get hallucinations and wrong answers.

## Source Types and When to Use Each

### Public Websites
**Use for:** Publicly accessible documentation, product pages, help articles  
**Limit:** 4 URLs per agent (as of 2026)  
**Crawl depth:** Copilot Studio crawls linked pages up to a certain depth

```
Good: https://docs.contoso.com/procurement-policies
Good: https://help.contoso.com/purchasing
Bad: https://contoso.com (too broad, crawls everything including nav/footer noise)
```

Add the most specific URL possible. `/procurement-policies` is better than `/`.

### SharePoint
**Use for:** Internal documents, policies, SOPs, FAQs, HR content  
**Requires:** The agent's service account needs read access to the SharePoint site  
**Best format:** Pages and document libraries (Word, PDF)

Tips:
- Organize your SharePoint content before connecting it — clean structure = better retrieval
- Use descriptive file and page names (not "Document1.docx")
- Keep documents under 512KB for best indexing
- Avoid scanned PDFs — they're images, not searchable text

### File Upload
**Use for:** Static documents that don't change often (policy PDFs, product manuals)  
**Limit:** 512KB per file, up to 3 files  
**When to use:** When you don't have a SharePoint or public URL

Good for quick prototypes. For production, use SharePoint instead — it stays current.

### Dataverse
**Use for:** Structured business data (product catalog, employee directory, FAQ table)  
**Requires:** A Dataverse table with text columns the agent can search

Create a Dataverse table with a `Question` column and an `Answer` column for FAQ-style knowledge. The agent retrieves matching rows and generates answers from them.

## Content Quality Checklist

Before connecting a knowledge source, verify:

- [ ] Content is accurate and up to date
- [ ] Content is written in plain language (not legalese or code)
- [ ] Documents have meaningful headings and structure
- [ ] No personal data or confidential information that shouldn't be surfaced to all users
- [ ] File names and page titles are descriptive

## Grounding Quality Tips

**Write content for agents, not just humans.** Dense PDFs with lots of footnotes and legal disclaimers confuse the retrieval. Add a plain-language summary section at the top of key documents.

**Be specific about scope.** In your agent's system instructions, tell it what knowledge sources it has and what to do when it can't find an answer:
```
You have access to the Contoso Procurement Policy document and the Vendor FAQ.
If you cannot find an answer in these sources, say: "I don't have information
on that. Please contact procurement@contoso.com."
```

**Test with real questions.** After adding a knowledge source, ask the same questions your users will ask. If the agent hallucates or pulls wrong content, refine the source material — don't just tweak the instructions.

## What NOT to Put in Knowledge Sources

- **Executable procedures** (step-by-step system instructions) — use Topics instead
- **Confidential data** (salaries, personal information) — use security roles and row-level Dataverse security
- **Real-time data** (stock levels, current order status) — use connector Actions to query live systems
- **Everything** — more content ≠ better answers. Focused, relevant content wins

## Measuring Knowledge Quality

Check **Analytics** → **Knowledge sources** in Copilot Studio to see:
- Which sources are being hit most
- Escalation rate (users not satisfied with answers)
- Topics with no matched knowledge

A high escalation rate on knowledge answers usually means the source content needs improvement, not the agent instructions.

## Trigger Phrases

- "Help me with knowledge source configuration"
- "Knowledge Source Configuration"
- "How do I knowledge source configuration"

## Quick Example

> See `knowledge-source-configuration-example.md` in this folder for a full worked scenario with business impact.

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
