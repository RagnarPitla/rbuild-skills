---
name: "axtr-reader"
slug: "axtr-reader"
description: "Reads, parses, and analyzes D365 Task Recorder .axtr files (ZIP archives containing XML) to extract business process steps, system actions, field values, and generate process documentation or test scripts. Use when user says \"parse axtr file\", \"read task recorder file\", \"analyze axtr\", \"extract process steps from axtr\", \"convert axtr to test script\", \"open task recorder recording\"."
tab: "business"
domain: "d365-fno"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "d365", "task-recorder", "process-documentation"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
---


# AXTR Reader

Parse, analyze, and document D365 Task Recorder .axtr files. Extracts process steps, field values, form names, and menu item paths from the XML inside the .axtr archive.

## What Is an .axtr File?

An .axtr file is a Task Recorder recording from D365 Finance and Operations. Structurally it is a ZIP archive containing an XML document that captures every user action taken during the recording session.

Key characteristics:
- File extension: `.axtr`
- Internal format: ZIP archive with one primary XML file
- Created via: D365 Settings menu (gear icon) → Task recorder → Record
- Used for: process documentation, help content, test script generation, and training material

## .axtr XML Structure

When unzipped, the XML contains a hierarchy of task steps. Each step has these key fields:

| XML Element / Attribute | Description |
|---|---|
| `Task` | Top-level container for the entire recording |
| `TaskStep` | A single recorded action |
| `MenuItemName` | The D365 menu item (form) where the action occurred |
| `FormName` | The form class name in AOT (e.g., `LedgerJournalTable`) |
| `Action` | What happened: `Click`, `SetValue`, `Select`, `Validate` |
| `ControlType` | UI element type: `Button`, `Field`, `Grid`, `Tab` |
| `ControlName` | The field or button label |
| `Value` | Value entered or selected during recording |
| `UserDescription` | Optional description the recorder typed |
| `Screenshot` | Base64 encoded screenshot at time of step (optional) |

Example XML fragment:
```xml
<TaskStep>
  <MenuItemName>LedgerJournalTable</MenuItemName>
  <FormName>LedgerJournalTable</FormName>
  <Action>SetValue</Action>
  <ControlType>Field</ControlType>
  <ControlName>Description</ControlName>
  <Value>Monthly accrual journal</Value>
</TaskStep>
```

## Core Tasks

### 1. Parse .axtr File
```text
GIVEN user provides an .axtr file path
WHEN skill processes the file
THEN open the ZIP archive
AND locate the primary XML document inside
AND parse the XML into structured step objects
AND return step count, form names visited, and action summary
```

### 2. Extract Process Steps
```text
GIVEN parsed .axtr XML
WHEN skill extracts steps
THEN list each step with: step number, form name, action type, control name, value
AND format as ordered list for human readability
AND flag any SetValue steps where Value is empty (possible data entry gaps)
```

### 3. Generate Process Documentation
```text
GIVEN extracted steps
WHEN skill generates documentation
THEN produce a navigation-path-first description of each step
AND write in plain English: "Navigate to [Module] → [Form]. In the [Field] field, enter [Value]."
AND group steps by form/screen to reduce repetition
AND include expected outcomes after each major action
```

### 4. Generate Test Script
```text
GIVEN extracted steps
WHEN skill creates test script
THEN convert each recorded action to a test case assertion
AND include: step description, expected field state, expected system response
AND mark steps with hardcoded values as "test data parameters" for easy substitution
AND output in structured format (table or GIVEN/WHEN/THEN blocks)
```

### 5. Validate Process Coverage
```text
GIVEN process steps and a known business process flow
WHEN skill validates coverage
THEN check that required forms were visited (e.g., for a sales order: SalesTable, WMSPickingRegistration, SalesEditLines)
AND identify steps that appear incomplete (action recorded but no value)
AND flag forms visited out of expected sequence
```

## Parser Implementation Pattern

```typescript
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';

async function parseAxtrFile(filePath: string) {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();

  // The main recording XML is typically named "Recording.xml" or the first XML entry
  const xmlEntry = entries.find(e => e.entryName.endsWith('.xml'));
  if (!xmlEntry) throw new Error('No XML found in .axtr archive');

  const xmlContent = xmlEntry.getData().toString('utf8');
  const parsed = await parseStringPromise(xmlContent);

  const steps = parsed?.Task?.TaskStep ?? [];
  return steps.map((step: any, index: number) => ({
    stepNumber: index + 1,
    menuItemName: step.MenuItemName?.[0] ?? '',
    formName: step.FormName?.[0] ?? '',
    action: step.Action?.[0] ?? '',
    controlType: step.ControlType?.[0] ?? '',
    controlName: step.ControlName?.[0] ?? '',
    value: step.Value?.[0] ?? '',
    description: step.UserDescription?.[0] ?? ''
  }));
}
```

## Common Process Recordings and Their Forms

| Business Process | Forms Typically Recorded |
|---|---|
| Create general journal | `LedgerJournalTable`, `LedgerJournalTrans` |
| Create vendor invoice | `VendEditInvoice`, `VendInvoiceInfoTable` |
| Create sales order | `SalesTable`, `SalesLine`, `SalesEditLines` |
| Run payment run | `VendPaymJournal`, `VendTransOpen` |
| Post product receipt | `PurchEditLines`, `VendPackingSlipJour` |
| Run master planning | `ReqTransPoMarkFirm`, `ReqPlanData` |

## Output Formats

### Step List (Plain Text)
```
Step 1: Navigate to General ledger → Journal entries → General journals
Step 2: Click New
Step 3: In the Name field, select "ACCRUAL"
Step 4: Click Lines
Step 5: In the Account field, enter "600100"
Step 6: In the Description field, enter "Monthly accrual"
Step 7: In the Debit field, enter "5000"
Step 8: In the Offset account field, enter "214000"
Step 9: Click Validate → Validate
Step 10: Click Post → Post
```

### Test Script Table
| Step | Form | Action | Field | Test Value | Expected Result |
|---|---|---|---|---|---|
| 1 | LedgerJournalTable | Click New | - | - | New journal row created |
| 2 | LedgerJournalTable | SetValue | Name | ACCRUAL | Journal type set |
| 3 | LedgerJournalTrans | SetValue | LedgerDimension | 600100 | Account validated |

## Trigger Phrases

- "parse axtr file"
- "read task recorder file"
- "analyze axtr"
- "extract process steps from axtr"
- "convert axtr to test script"
- "open task recorder recording"
- "what's in this axtr file"
- "document this task recorder recording"

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "No XML found in .axtr archive" | File is corrupted or not a valid .axtr | Re-export the recording from D365 Task Recorder; check file is not truncated |
| Steps show empty values | Recording was paused or user skipped entering values during recording | Identify steps with blank Value fields; re-record those sections |
| FormName is blank | Older .axtr format or recording captured at menu level only | Use MenuItemName as the fallback identifier; correlate to D365 form catalog |
| Step count mismatches expected process | Recording captured extra navigation or missed steps | Filter out `Action = Navigate` steps for a cleaner step count; review manually |
| XML parse error | Non-standard characters or encoding in user-entered values | Strip or escape special characters before parsing; use UTF-8 with BOM handling |
| Screenshot elements bloat memory | Each step has a base64 screenshot | Strip `<Screenshot>` elements before parsing if only process steps are needed |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — full .axtr file structure, parser pattern, output formats, process tables |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
