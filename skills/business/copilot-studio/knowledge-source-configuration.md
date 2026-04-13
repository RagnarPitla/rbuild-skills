---
name: "knowledge-source-configuration"
slug: "knowledge-source-configuration"
description: "Configure and optimize Copilot Studio knowledge sources including SharePoint, websites, Dataverse, and files for accurate grounded answers. Use when user says 'add knowledge source to Copilot Studio', 'SharePoint not returning results', 'agent giving wrong answers from documents', 'how do I configure RAG in Copilot Studio', 'knowledge source escalation rate too high'."
tab: "business"
domain: "copilot-studio"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "copilot-studio", "knowledge", "configuration"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Copilot Studio VS Code Extension"
mcp_tools: []
---



# Knowledge Source Configuration

Knowledge sources are what turn a generic chatbot into an agent that actually knows your business. When a user asks something your topics don't explicitly handle, the agent searches your knowledge sources and generates a grounded answer. Done right, this is powerful. Done wrong, you get hallucinations and wrong answers.

## Trigger Phrases

- "add a knowledge source to Copilot Studio"
- "connect SharePoint to my Copilot Studio agent"
- "agent giving wrong answers from my documents"
- "how do I configure RAG in Copilot Studio"
- "knowledge source escalation rate too high"
- "SharePoint knowledge not returning results"
- "agent not searching my documents"
- "improve agent answer quality from documents"

## Source Types and When to Use Each

### Public Websites
Use for: Publicly accessible documentation, product pages, help articles.
Limit: 4 URLs per agent (as of 2026).
Crawl depth: Copilot Studio crawls linked pages up to a certain depth.

```
Good: https://docs.contoso.com/procurement-policies
Good: https://help.contoso.com/purchasing
Bad:  https://contoso.com (too broad, crawls everything including nav and footer noise)
```

Add the most specific URL possible. `/procurement-policies` is better than `/`.

### SharePoint
Use for: Internal documents, policies, SOPs, FAQs, HR content.
Requires: The agent's service account needs read access to the SharePoint site.
Best format: Pages and document libraries (Word, PDF).

Tips:
- Organize your SharePoint content before connecting — clean structure means better retrieval
- Use descriptive file and page names (not "Document1.docx")
- Keep documents under 512KB for best indexing
- Avoid scanned PDFs — they're images, not searchable text

### File Upload
Use for: Static documents that don't change often (policy PDFs, product manuals).
Limit: 512KB per file, up to 3 files.

Good for quick prototypes. For production, use SharePoint — it stays current automatically.

### Dataverse
Use for: Structured business data (product catalog, employee directory, FAQ table).
Requires: A Dataverse table with text columns the agent can search.

Create a Dataverse table with a `Question` column and an `Answer` column for FAQ-style knowledge. The agent retrieves matching rows and generates answers.

## Content Quality Checklist

Before connecting a knowledge source, verify:

- [ ] Content is accurate and up to date
- [ ] Content is written in plain language, not dense legalese
- [ ] Documents have meaningful headings and structure
- [ ] No personal data or confidential information that shouldn't be exposed to all users
- [ ] File names and page titles are descriptive
- [ ] No scanned PDFs (images are not searchable text)

## Grounding Quality Tips

**Write content for agents, not just humans.** Dense PDFs with lots of footnotes and legal disclaimers confuse retrieval. Add a plain-language summary section at the top of key documents.

**Be specific about scope in system instructions.** Tell the agent what knowledge sources it has and what to do when it can't find an answer:
```
You have access to the Contoso Procurement Policy document and the Vendor FAQ.
If you cannot find an answer in these sources, say:
"I don't have information on that. Please contact procurement@contoso.com."
```

**Test with real questions.** After adding a knowledge source, ask the same questions your users will ask. If the agent returns wrong content, refine the source material — don't just tweak the instructions.

## What NOT to Put in Knowledge Sources

| Wrong Use | Correct Approach |
|---|---|
| Executable procedures (step-by-step actions) | Use Topics with question nodes and connector actions |
| Confidential data (salaries, personal information) | Use security roles and row-level Dataverse security |
| Real-time data (stock levels, order status) | Use connector Actions to query live systems |
| Everything in your organization | Focused, relevant content beats broad coverage |

## Measuring Knowledge Quality

Check **Analytics** → **Knowledge sources** in Copilot Studio to see:
- Which sources are being hit most
- Escalation rate per source (users not satisfied with answers)
- Topics with no matched knowledge

A high escalation rate on knowledge answers almost always means the source content needs improvement, not the agent instructions.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent returns wrong answers from documents | Retrieval pulling irrelevant sections, poor document structure | Add plain-language summaries at document tops, improve heading structure, use more specific section titles |
| SharePoint knowledge source not returning results | Service account lacks read access or the knowledge connection is stale | Verify service account has SharePoint read permissions, remove and re-add the knowledge source |
| Knowledge source added but agent still ignores it | A topic is intercepting the request before generative answers can fire | Check that no topic trigger phrases match the knowledge query; ensure generative answers mode is enabled |
| High escalation rate despite good documents | Agent instructions don't scope knowledge use, or source content is contradictory | Add explicit knowledge-use instructions in system prompt, audit and fix contradictory content |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
