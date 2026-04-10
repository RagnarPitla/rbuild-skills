---
name: d365-config
description: D365 Finance and Operations initial configuration workflow covering legal entities, chart of accounts, fiscal calendar, number sequences, currencies, posting profiles, customer/vendor groups, and payment terms. Configuration order matters because later steps depend on earlier ones. Use when user says "configure D365", "set up legal entity", "configure number sequences", "set up chart of accounts", "D365 initial setup", "configure posting profiles", "set up fiscal calendar".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, d365, configuration, setup]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
  - "dataverse-mcp"
---

# D365 Configuration

D365 F&O initial configuration follows a strict dependency order. Configure in the wrong sequence and you will hit errors when setting up downstream components. This skill walks through the correct sequence with the navigation paths, key fields, and validation checks for each step.

## Configuration Dependency Map

```
Legal Entity
    ↓
Currency + Exchange Rates
    ↓
Fiscal Calendar + Ledger Calendar
    ↓
Chart of Accounts + Account Structures
    ↓
Financial Dimensions
    ↓
Number Sequences
    ↓
Posting Profiles (GL, AP, AR, FA, Inventory)
    ↓
Payment Terms + Methods of Payment
    ↓
Customer Groups + Vendor Groups
    ↓
Customer Master + Vendor Master
```

Each layer must be complete before configuring the layer below it.

## Step 1: Legal Entity

A legal entity is a company in D365. Every configuration and transaction belongs to a legal entity.

**Navigation:** System administration → Organizations → Legal entities → New

Key fields:
| Field | Description |
|---|---|
| Company | Short code (e.g., "USMF") — cannot be changed after transactions exist |
| Name | Full legal name |
| Country/region | Drives tax, address, and regulatory features |
| Primary address | Registered address |
| Currency | Default accounting currency |

**Post-creation steps:**
- Activate the legal entity via the company switcher (top right)
- Configure language settings: Organization administration → Setup → Language and locale
- Set up address books: Organization administration → Global address book → Configure

## Step 2: Currency and Exchange Rates

**Navigation:** General ledger → Currencies → Currencies

Add all currencies your legal entity will use. For each non-accounting currency:

**Exchange rates:** General ledger → Currencies → Currency exchange rates
- Create an exchange rate type (e.g., "Default", "Budget")
- Add rates with effective dates

**For agents:** Query current exchange rates via OData:
```
GET /data/ExchangeRates?$filter=ExchangeRateType eq 'Default' and FromCurrencyCode eq 'EUR'&$select=FromCurrencyCode,ToCurrencyCode,ExchangeRateValue,ValidFrom
```

## Step 3: Fiscal Calendar and Ledger Calendar

**Fiscal calendar:** General ledger → Fiscal calendars → Fiscal calendars → New

Key fields:
- Calendar name and description
- Start date of fiscal year (e.g., Jan 1 or Oct 1 for non-calendar year)
- Number of periods (typically 12 or 13)
- Period names (use consistent naming: "Jan-2026", "Feb-2026")

**Assign calendar to ledger:** General ledger → Ledger → Ledger → Fiscal calendar

**Open periods:** General ledger → Period close → Ledger calendar
- Set period status to Open for periods you want to post to
- Keep future periods On Hold until you are ready to open them

## Step 4: Chart of Accounts

**Navigation:** General ledger → Chart of accounts → Accounts → Main accounts

The chart of accounts is the backbone of all financial reporting. Design it before configuration.

| Account Type | Range (example) | Purpose |
|---|---|---|
| Assets | 100000-199999 | Balance sheet assets |
| Liabilities | 200000-299999 | Balance sheet liabilities |
| Equity | 300000-399999 | Owners equity |
| Revenue | 400000-499999 | Income statement revenue |
| Expenses | 500000-699999 | Income statement expenses |

**Account structures:** General ledger → Chart of accounts → Structures → Configure account structures
- Define which financial dimensions are valid with which main accounts
- Example: Expense accounts require Department + Cost Center; Balance sheet accounts require none

**Assign chart of accounts to legal entity:** General ledger → Ledger → Ledger → Chart of accounts

## Step 5: Financial Dimensions

**Navigation:** General ledger → Chart of accounts → Dimensions → Financial dimensions → New

Common dimensions used in D365 implementations:
| Dimension | Purpose | Example Values |
|---|---|---|
| BusinessUnit | Operating unit | 001, 002, 003 |
| Department | Functional area | HR, IT, Finance, Sales |
| CostCenter | Budget tracking | CC100, CC200 |
| Project | Project-based costing | PRJ-2026-001 |

**Dimension sets:** General ledger → Financial dimensions → Dimension sets
- Create named groupings for reporting (e.g., "P&L dimensions": BusinessUnit + Department)

**For agents:** Query dimension values via OData:
```
GET /data/DimensionAttributeValueEntities?$filter=DimensionAttributeName eq 'Department'&$select=DimensionAttributeValueCode,DimensionAttributeValueDescription
```

## Step 6: Number Sequences

Number sequences control how D365 auto-numbers documents (sales orders, purchase orders, invoices, vouchers).

**Navigation:** Organization administration → Number sequences → Number sequences → Generate

The Generate wizard creates sequences for all modules at once. For manual setup:

**Navigation:** Organization administration → Number sequences → Number sequences → New

Key fields:
| Field | Value / Notes |
|---|---|
| Number sequence code | Unique identifier (e.g., "SONUM") |
| Scope | Company (per legal entity) or Shared |
| Format | Prefix + segment + suffix (e.g., "SO-######") |
| Smallest / Largest | Range constraints |
| Continuous | Yes for financial documents (no gaps); No for operational docs |

**Assign sequences to modules:**
- Accounts receivable parameters: AR → Setup → AR parameters → Number sequences tab
- Accounts payable parameters: AP → Setup → AP parameters → Number sequences tab
- General ledger parameters: GL → Ledger setup → General ledger parameters → Number sequences tab

**OData check for gaps:**
```
GET /data/NumberSequenceTableEntity?$filter=NumberSequenceCode eq 'SONUM'&$select=CurrentNumber,LowestNumber,HighestNumber,Continuous
```

## Step 7: Posting Profiles

Posting profiles map business objects (customer groups, vendor groups, item groups) to GL accounts. They are the bridge between subledgers and the general ledger.

### Customer Posting Profile
**Navigation:** Accounts receivable → Setup → Customer posting profiles → New

| Field | Description |
|---|---|
| Posting profile | Profile code (e.g., "GEN" for general) |
| Account code | All, Group, or Table (individual customer) |
| Summary account | AR trade receivables account (e.g., 130000) |

### Vendor Posting Profile
**Navigation:** Accounts payable → Setup → Vendor posting profiles → New

| Field | Description |
|---|---|
| Summary account | AP trade payables account (e.g., 210000) |
| Settlement account | Discount and settlement offset account |

### Inventory Posting Profile
**Navigation:** Inventory management → Setup → Posting → Posting

Configure accounts for:
- Purchase expenditure, un-invoiced (GR/IR clearing)
- Inventory issue, cost of goods sold
- Inventory receipt, inventory asset account

### Fixed Asset Posting Profile
**Navigation:** Fixed assets → Setup → Fixed asset posting profiles → New

Configure accounts for: Acquisition, Depreciation expense, Accumulated depreciation, Disposal

## Step 8: Payment Terms

**Navigation:** Accounts payable → Payment setup → Terms of payment → New
(Same form exists in Accounts receivable for customer-side terms)

Common configurations:
| Code | Description | Setup |
|---|---|---|
| NET30 | Net 30 days | Due date = Invoice date + 30 |
| 2/10NET30 | 2% if paid in 10 days, else net 30 | Cash discount: 2%, discount days: 10 |
| COD | Cash on delivery | Due date = Invoice date |
| EOM | End of month | Due date = Last day of invoice month |

## Step 9: Customer and Vendor Groups

**Customer groups:** Accounts receivable → Setup → Customer groups → New
- Group code, description, terms of payment, posting profile assignment
- All customers must belong to a group

**Vendor groups:** Accounts payable → Setup → Vendor groups → New
- Group code, description, terms of payment, posting profile assignment

## Core Tasks

### 1. Validate Configuration Completeness
```text
GIVEN a legal entity has been created
WHEN skill validates configuration
THEN check fiscal calendar is assigned to ledger
AND check chart of accounts is assigned
AND check number sequences exist for all critical document types
AND check at least one customer posting profile exists
AND check at least one vendor posting profile exists
AND return a checklist with pass/fail for each item
```

### 2. Identify Missing Number Sequences
```text
GIVEN a legal entity configuration
WHEN skill checks number sequences
THEN query all required module references
AND identify references with no assigned sequence
AND flag continuous sequences that are running low
AND report any gaps in continuous sequences
```

### 3. Generate Configuration Checklist
```text
GIVEN a new D365 implementation
WHEN skill generates checklist
THEN produce ordered list of all configuration steps
AND include navigation path for each step
AND mark items as required vs optional
AND indicate which items block go-live if missing
```

## OData Queries for Configuration Validation

### Check Legal Entity Setup
```
GET /data/LegalEntities?$filter=DataAreaId eq 'USMF'&$select=Name,PrimaryAddressCountryRegionId,CurrencyCode
```

### Check Fiscal Periods Are Open
```
GET /data/FiscalCalendarPeriods?$filter=Status eq 'Open'&$select=FiscalCalendarId,StartDate,EndDate,Status
```

### Check Number Sequences
```
GET /data/NumberSequenceTableEntity?$select=NumberSequenceCode,Scope,NextNumber,LowestNumber,HighestNumber,Continuous&$orderby=NumberSequenceCode
```

### Check Posting Profiles Exist
```
GET /data/CustPostingProfileEntity?$select=PostingProfile,AccountCode,SummaryAccount
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "Period is not open" error on posting | Fiscal period status is On Hold or Closed | Navigate to General ledger → Period close → Ledger calendar, open the period for the relevant module |
| Number sequence exhausted | Sequence has reached its maximum number | Navigate to Org admin → Number sequences, extend the Highest value or create a new segment |
| "Posting profile not found" on invoice posting | Customer or vendor has a group with no posting profile | Check the customer/vendor group and assign the correct posting profile |
| Chart of accounts dimension validation error | Account structure does not allow the dimension combination entered | Review General ledger → Chart of accounts → Structures; update the allowed dimension segments |
| Missing accounts when posting | Inventory or fixed asset posting profile not configured for item group | Navigate to the relevant posting setup form and add the missing account entry |
| Exchange rate not found | Rate for a currency pair on the transaction date is missing | Add the missing rate to General ledger → Currencies → Currency exchange rates |
| Cannot assign fiscal calendar to ledger | Calendar has not been finalized (periods not created) | Create all periods in the fiscal calendar before assigning to the ledger |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content — full configuration workflow, dependency map, OData queries, posting profiles |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
