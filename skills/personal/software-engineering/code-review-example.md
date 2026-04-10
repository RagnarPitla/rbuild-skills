# Code Review — Example

## Scenario: Finding a SQL Injection in a "Reviewed" PR

**Who:** Sasha Petrov, Senior Engineer, fintech startup
**Where:** Python/Django backend, GitHub PR review
**The Problem:** A PR came in from a junior dev adding a new search endpoint. Two other engineers had already approved it. Sasha was the third reviewer, doing it quickly before end of day. Standard rubber-stamp territory. But something felt off.

**Prerequisites:** Familiarity with Python and basic web security concepts. The structured checklist applies to any language.

---

### What You Say to the Agent

> "Review this PR for the new customer search endpoint. Pay special attention to security — we're in fintech and this endpoint will be publicly accessible."

```python
# The PR code
def search_customers(request):
    query = request.GET.get('q', '')
    sql = f"SELECT * FROM customers WHERE name LIKE '%{query}%'"
    customers = db.execute(sql).fetchall()
    return JsonResponse({'results': customers})
```

### What the Agent Does

1. **Correctness check:** Notes that `fetchall()` with no pagination could return millions of rows — performance issue
2. **Security scan (Blocker):** Flags the f-string SQL construction: `f"SELECT * FROM customers WHERE name LIKE '%{query}%'"` — this is a textbook SQL injection vulnerability. An attacker sending `query = "'; DROP TABLE customers; --"` would execute arbitrary SQL
3. **Security scan (Major):** Notes that `SELECT *` exposes all customer columns including potentially sensitive fields — should explicitly select needed columns
4. **Suggests fix:**
```python
def search_customers(request):
    query = request.GET.get('q', '')
    # Parameterized query prevents SQL injection
    customers = Customer.objects.filter(
        name__icontains=query
    ).values('id', 'name', 'email')[:50]  # Explicit fields + pagination
    return JsonResponse({'results': list(customers)})
```

### The Business Impact

- **SQL injection caught before merge** — despite two prior approvals missing it
- **Pattern identified:** Sasha added a mandatory security checklist item for any endpoint that concatenates user input into strings
- **Junior dev learned:** Instead of just rejecting, Sasha used the review as a teaching moment with a specific explanation of why parameterized queries matter

### Try It Yourself

> "Review this authentication middleware — I want to check for: JWT token validation weaknesses, missing rate limiting, and any places where we might be leaking user information in error messages."
