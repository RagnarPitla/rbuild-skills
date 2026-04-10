---
name: d365-navigation-fundamentals
description: Navigate D365 Finance and Operations confidently — modules, workspaces, list pages, forms, search, and power user shortcuts. Use when user says "how do I navigate D365", "find a form in D365", "D365 navigation", "D365 workspaces", "get started with D365", "find menu in D365 F&O", "D365 search bar".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, d365, navigation, fundamentals]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
---

# D365 F&O Navigation Fundamentals

D365 Finance and Operations is a deep system. Most users find their 3-4 daily screens and never venture further. But knowing how to navigate the full system makes you dramatically more effective — and it's essential for anyone building AI agents that interact with it.

## The Module Structure

D365 F&O organizes everything into modules, accessible from the navigation pane:

| Module | What It Covers |
|---|---|
| **Finance** | General ledger, accounts payable/receivable, budgeting, cash management |
| **Supply Chain Management** | Procurement, inventory, warehouse, transportation |
| **Manufacturing** | Production orders, BOM, routes, shop floor |
| **Project Management** | Projects, timesheets, resource management |
| **Human Resources** | Employees, positions, leave and absence |
| **Retail and Commerce** | Point of sale, channels, product catalog |

Each module has its own **workspace** — a dashboard showing the most important data and actions for that domain.

## Workspaces: Your Daily Home

Workspaces are the single most useful navigation feature in D365. They show you:
- **KPI tiles** — key metrics at a glance (open invoices, overdue POs, pending approvals)
- **Lists** — filtered views of the most important records
- **Quick links** — one-click access to common tasks

To find workspaces: click the grid icon (top left) → search for your module → look for pages ending in "workspace."

**Personalize your workspace:** Right-click any tile → **Personalize**. You can pin tiles, add fields, and configure filters. Set this up in the first week — it pays off for years.

## List Pages vs Detail Forms

**List pages** show multiple records (all purchase orders, all vendors, all invoices). They're your starting point for finding things.

**Detail forms** show a single record with all its fields and related data. You navigate from a list page to a detail form by clicking a record.

Key navigation on detail forms:
- **Fast tabs** — collapsible sections (General, Lines, Setup). Click the header to expand/collapse
- **Action pane** — buttons at the top for actions (Confirm, Post, Cancel, Print)
- **FactBox pane** — right side panel showing related data (attachments, related records, history)

## The Navigation Search Bar

The most powerful navigation tool in D365. Press **Ctrl + /** or click the magnifying glass in the top navigation.

Type anything — a menu name, a field, a form name:
- "All vendors" → jumps directly to the vendor list
- "Posted invoices" → finds the right inquiry
- "Number sequences" → finds the setup form instantly

This is how experienced users navigate. Almost never use the left menu.

## How to Find Anything

When you don't know where something is:

1. **Navigation search** (Ctrl + /) — type what you're looking for
2. **Module workspace** — open the relevant module, browse the workspace
3. **Microsoft Learn** — search "D365 Finance [thing you need]" — Microsoft's docs are excellent
4. **Tell me** — some D365 versions have a "Tell me what you want to do" search bar at the top

## Inquiries vs Reports

**Inquiries** — real-time views of current data. Use these for "what is the status right now?" questions. Examples: Vendor transactions inquiry, Customer balance inquiry, On-hand inventory.

**Reports** — formatted output for printing or sharing. Use these for period summaries, financial statements, compliance documents.

For AI agents, inquiries are more useful — they return live data via OData.

## Power User Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + /` | Navigation search |
| `Alt + F4` | Close current form |
| `Ctrl + Shift + F5` | Refresh the current page |
| `Alt + Right Arrow` | Navigate to next record |
| `Alt + Left Arrow` | Navigate to previous record |
| `Ctrl + G` | Go to main menu |
| `F2` | Edit mode on a field |

## Saved Views

One of the best features in modern D365: **Saved Views**. Create a personalized view of any list page — your filters, column layout, and sort order — and save it.

On any list page: **Options** → **Views** → **Save current view**

Create views for:
- "My open POs this week"
- "Invoices pending my approval"
- "Vendors in Germany"

These views persist across sessions and can be shared with your team.

## Trigger Phrases

- "how do I navigate D365"
- "find a form in D365"
- "D365 navigation"
- "D365 workspaces"
- "get started with D365"
- "find menu in D365 F&O"
- "D365 search bar"
- "what module is X in D365"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Menu item not visible | Security role does not include the privilege for that form | Ask your system administrator to check your assigned roles and add the relevant duty |
| Form opens but all fields are greyed out | Read-only security permission, or form is in view mode | Check if an Edit button exists on the action pane; confirm your role has update access |
| Navigation search returns no results | Search term too specific or using an alias not matching D365 menu label | Try broader search terms; use the module workspace to browse instead |
| Workspace tiles show no data | Filters on the workspace are too restrictive, or data does not exist for your legal entity | Right-click the tile → Personalize → check filter criteria; confirm you are in the right legal entity |
| Cannot switch legal entity | Your user account is not assigned to the target legal entity | Ask your admin to add your user to the legal entity under System administration → Users |
| Saved view not available for another user | Views are user-specific by default | Publish the view: Options → Views → Publish — requires Saved views admin privilege |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting — D365-specific troubleshooting table, updated trigger phrases |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
