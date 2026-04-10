# Prompt Engineering 101 — Example

## Scenario: Business Analyst Extracting Structured Data From Purchase Orders

**Who:** Rachel Torres, Business Analyst at a food distribution company (no ML background, advanced Excel user)
**Where:** Claude API via a simple Python script, PDF purchase orders from 12 different supplier formats
**The Problem:** Rachel is trying to get Claude to extract vendor name, PO number, line items (product, quantity, unit price), and total amount from free-text purchase orders. She pasted a PO into Claude and asked "extract the data from this PO." The output format changes every time — sometimes it's a list, sometimes a paragraph, sometimes JSON, sometimes a table. She can't pipe the results into her Excel automation because the structure is unpredictable.

**Prerequisites:** Python 3.10+, `anthropic` SDK installed (`pip install anthropic`), API key. No ML knowledge required.

---

### What You Say to the Agent

> "I'm a business analyst with no ML background. I'm trying to get Claude to extract structured data from purchase orders but the output format keeps changing. I need consistent JSON output every time. Can you help me write the right prompt?"

### What the Agent Does

1. **Diagnoses the root cause:** The current prompt ("extract the data from this PO") has no output specification. Claude is filling the format gap with reasonable guesses that vary based on what it saw in the document. The fix is an explicit output schema in the prompt, not a model change

2. **Writes the structured output prompt:** System prompt specifies: "You are a purchase order data extractor. Always respond with valid JSON only. No prose, no markdown fences, no explanation. Use exactly this schema:" followed by a JSON schema object with required fields and types. Adds `"additionalProperties": false` to prevent Claude from adding extra fields

3. **Adds few-shot examples:** Appends 2 complete examples in the prompt: one simple PO and one with multiple line items and a discount field. Shows both the input format and the exact expected JSON output. This reduces format errors from ~40% to under 3% in testing

4. **Implements output validation:** Wraps the API call in a `try/except` that attempts `json.loads(response)` and validates required keys are present. If validation fails, it retries once with "The previous response was not valid JSON. Please respond with only a JSON object matching this schema: [schema]" appended to the conversation

5. **Handles edge cases:** Adds explicit instructions for common PO variations: "If a field is not present, use null. If quantity is written as 'a dozen', convert to 12. If currency is not specified, assume USD." This prevents silent data quality issues downstream

### The Business Impact

- **Output format consistency went from 60% to 98%** across 200 test POs from 12 supplier formats
- **Rachel's Excel automation pipeline unblocked** — she can now process 300 POs/day automatically instead of manually entering data for 4 hours/day
- **Time saved: 3.5 hours/day** — $210/day at her effective hourly rate, pipeline paid for itself in the first week

### Try It Yourself

> "The JSON extraction is working well for standard POs. But some of our suppliers send POs as scanned images, not text. How do I modify the prompt and API call to handle image-based POs using Claude's vision capability?"
