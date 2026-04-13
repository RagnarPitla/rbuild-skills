---
name: "cs-knowledge-sources"
slug: "cs-knowledge-sources"
description: "Configure SharePoint, website, and Dataverse knowledge sources for accurate grounded answers in Copilot Studio agents. Use when user says 'add knowledge to my agent', 'connect SharePoint to Copilot Studio', 'agent giving wrong answers', 'my agent is hallucinating', 'configure RAG for Copilot Studio', 'knowledge source not returning results'."
tab: "business"
domain: "copilot-studio"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "copilot-studio", "knowledge", "sharepoint"]
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



# CS Knowledge Sources

Knowledge sources turn a generic chatbot into an agent that knows your business. When a user asks a question your topics don't handle, the agent searches knowledge sources and generates a grounded answer.

## Trigger Phrases

- "add knowledge to my Copilot Studio agent"
- "connect SharePoint to my agent"
- "my agent is giving wrong answers"
- "my agent is hallucinating"
- "configure knowledge sources in Copilot Studio"
- "knowledge source not returning results"
- "add a website as a knowledge source"
- "agent not finding answers in my documents"

## Source Types

### Public Website
Best for: External documentation, help articles, product pages.

- Crawls the URL and linked pages
- Use specific URLs, not the homepage (too broad)
- Maximum 4 URLs per agent

```
Good: https://docs.contoso.com/procurement-policy
Bad:  https://contoso.com  (crawls everything including nav, footer noise)
```

### SharePoint
Best for: Internal policies, SOPs, HR content, procedures.

- Requires agent service account has read access to the SharePoint site
- Best document formats: Word (.docx), PDF with real selectable text (not scanned images)
- Keep documents under 512KB for best indexing
- Use descriptive file names: "Procurement-Policy-2026.docx" not "Doc1.docx"
- Organize the SharePoint site before connecting — clean structure means better retrieval

### File Upload
Best for: Static reference documents that change rarely.

- Limit: 3 files, 512KB each
- Good for quick prototypes — use SharePoint for production
- File names matter for retrieval quality

### Dataverse Table
Best for: FAQ-style Q&A, structured reference data.

- Create a table with a `Question` column and an `Answer` column
- Agent retrieves matching rows and generates responses from them
- Good for controlled, specific factual responses

## Content Quality Tips

**Write for agents, not just humans.** Dense legalese confuses retrieval. Add plain-language summaries at the top of key documents.

**Scope the agent in system instructions:**
```
You have access to the Contoso Procurement Policy and Vendor FAQ.
If you cannot find the answer in these sources, say:
"I don't have that information. Please contact procurement@contoso.com."
```

**Test with real questions.** After adding a source, ask the exact questions your users will ask. High escalation rate means your source content needs improvement, not the agent instructions.

## Content Quality Checklist

- [ ] Content is accurate and current
- [ ] Documents use plain language (not dense legalese)
- [ ] Meaningful headings and section structure
- [ ] No confidential or personal data that shouldn't be exposed to all users
- [ ] File and page names are descriptive
- [ ] No scanned PDFs (images are not searchable text)
- [ ] SharePoint site is organized before connecting

## What NOT to Put in Knowledge Sources

| Wrong Use | Correct Approach |
|---|---|
| Real-time data (inventory levels, order status) | Use connector actions to query live systems |
| Confidential data (salaries, personal records) | Use Dataverse row-level security with filtered topics |
| Step-by-step executable procedures | Use Topics with question nodes and actions |
| Everything in your organization | Focused, relevant content beats broad coverage |

## Measuring Knowledge Quality

Check **Analytics** → **Knowledge sources** in Copilot Studio:

- Which sources are hit most often
- Escalation rate per source (users not satisfied)
- Topics with no matched knowledge

A high escalation rate on knowledge answers almost always means the source content needs improvement, not more prompting.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent returns wrong answers from documents | Retrieval pulling irrelevant sections | Improve document structure, add plain-language summaries, use more specific section headings |
| SharePoint knowledge source not returning results | Service account lacks read access to site or library | Verify the agent's service account has SharePoint read permissions, check site sharing settings |
| Knowledge source added but agent still doesn't use it | Agent instructions don't reference knowledge, or topic is handling request before generative answers | Check that the topic isn't intercepting the intent; verify generative answers mode is enabled |
| Agent hallucinating despite knowledge source | Source content too sparse, outdated, or contradictory | Review and improve source documents, add explicit "if not found" instruction in system instructions |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
