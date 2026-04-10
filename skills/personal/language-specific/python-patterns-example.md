# Python Patterns — Example

## Scenario: D365 Vendor Batch Processor With No Types, Global State, and Silent API Failures

**Who:** Ravi Subramaniam, Data Scientist turned Python developer, finance automation team
**Where:** Python 3.11, D365 F&O OData API, Azure Functions, pandas
**The Problem:** Ravi wrote a Python script to batch-process D365 vendor data for a monthly reporting job. It works in dev. In production, it fails silently when the D365 API is down — the script completes with exit code 0 and an empty output file. It uses global variables for configuration, has no type hints (so function signatures are guesswork), and crashes in ways that are hard to debug because there is no structured logging.

**Prerequisites:** Python 3.10+, `mypy` for type checking, `structlog` or `logging` for structured logs. The patterns apply to any Python data processing script.

---

### What You Say to the Agent

> "My D365 vendor batch processor runs successfully but produces an empty output when the API is down. It has no type hints, uses global variables for config, and I can't tell what went wrong from the logs. Help me make it production-grade."

### What the Agent Does

1. **Finds the silent failure root cause:** The API call is wrapped in a broad `except Exception: pass` block. When the D365 OData endpoint returns a connection timeout (`requests.exceptions.ConnectionError`), the exception is silently swallowed, the vendor list stays empty, and processing continues. The output file is written with zero records and exit code 0.

2. **Replaces global config with a typed dataclass:**
```python
from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class D365Config:
    tenant_id: str
    client_id: str
    base_url: str
    batch_size: int = 100
    timeout_seconds: int = 30
```
`frozen=True` prevents mutation after construction. Config is now explicitly passed to functions rather than read from globals.

3. **Adds type hints throughout:** The original `def process_vendors(data)` becomes `def process_vendors(data: list[VendorRecord]) -> ProcessingResult`. Running `mypy` immediately after adding types finds 3 places where the function was being called with `None` instead of an empty list, which caused `AttributeError: 'NoneType' object is not iterable` in certain edge cases.

4. **Implements structured error handling with specific exception types:**
```python
try:
    vendors = fetch_vendors(config)
except requests.exceptions.ConnectionError as e:
    logger.error("D365 API unreachable", error=str(e), config_url=config.base_url)
    raise SystemExit(1)  # Fail loudly, not silently
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 429:
        logger.warning("D365 rate limited", retry_after=e.response.headers.get("Retry-After"))
        raise  # Let the retry decorator handle it
```

5. **Catches a subtle pandas mutation bug:** The original code filtered the vendor DataFrame with `df = df[df['status'] == 'Active']` and then immediately modified the original `df` in the next line. This is operating on a pandas view (not a copy), which sometimes silently fails with `SettingWithCopyWarning` and produces incorrect data. Adds `.copy()` to make the intent explicit.

### The Business Impact

- **Silent empty-output failure eliminated** — the script now exits with code 1 and a structured log entry when the API is unreachable; the Azure Function alerting catches the failure
- **3 hidden NoneType bugs found by mypy** — two were in code paths that only triggered on the last day of the month (empty vendor batch edge case), never caught in testing
- **Pandas mutation bug fixed** — the SettingWithCopyWarning had been suppressed in the config; the actual data mutation was corrupting ~0.3% of vendor records silently

### Try It Yourself

> "I have a Python function that calls D365 OData, transforms the response with pandas, and writes to Azure Blob Storage. Help me add retry logic with exponential backoff for transient failures, and make sure any unhandled exception writes a failure record to a dead-letter blob container."
