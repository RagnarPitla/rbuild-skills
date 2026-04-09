---
name: "D365 F&O Navigation Fundamentals"
slug: "d365-navigation-fundamentals"
description: "Navigate D365 Finance & Operations confidently — modules, workspaces, list pages, forms, search, and power user shortcuts."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["d365-fno", "navigation", "getting-started", "workspaces", "beginner"]
version: "1.0"
icon_emoji: "🗺️"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: "d365-fno-path"
learning_path_position: 1
prerequisites: []
references:
  - title: "Get started with Dynamics 365 Finance"
    url: "https://learn.microsoft.com/en-us/dynamics365/finance/get-started/learning-catalog-business-user"
  - title: "Navigation search in finance and operations apps"
    url: "https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/get-started/navigation-search"
---

# D365 F&O Navigation Fundamentals

D365 Finance & Operations is a deep system. Most users find their 3-4 daily screens and never venture further. But knowing how to navigate the full system makes you dramatically more effective — and it's essential for anyone building AI agents that interact with it.

## The Module Structure

D365 F&O organizes everything into modules, accessible from the navigation pane:

| Module | What It Covers |
|---|---|
| **Finance** | General ledger, accounts payable/receivable, budgeting, cash management |
| **Supply Chain Management** | Procurement, inventory, warehouse, transportation |
| **Manufacturing** | Production orders, BOM, routes, shop floor |
| **Project Management** | Projects, timesheets, resource management |
| **Human Resources** | Employees, positions, leave and absence |
| **Retail & Commerce** | Point of sale, channels, product catalog |

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

This is how I navigate. I almost never use the left menu.

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
