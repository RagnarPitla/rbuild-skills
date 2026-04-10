# Go Patterns — Example

## Scenario: Goroutine Leaks and Silent Panics in a D365 MCP Server

**Who:** Lars Henriksson, Backend Engineer, supply chain platform team
**Where:** Go 1.22, MCP server, D365 F&O OData endpoint, deployed on Azure Container Apps
**The Problem:** Lars built his first Go MCP server. Under load testing, memory grows without bound and the process eventually OOMs. Profiling shows goroutines accumulating — a new one created per request, none ever terminated. When the D365 OData endpoint returns HTTP 429 (rate limited), the server logs nothing and subsequent requests return empty results with HTTP 200. The bugs are invisible until the server dies.

**Prerequisites:** Go 1.21+, `pprof` for profiling, basic Go familiarity. The MCP SDK pattern applies to any Go HTTP handler, not just MCP.

---

### What You Say to the Agent

> "My Go MCP server leaks goroutines on every request and silently returns empty results when D365 returns a 429. I can see the goroutine count climbing in pprof but I don't know where they're leaking. Help me find and fix both issues."

### What the Agent Does

1. **Finds the goroutine leak source:** Reads the handler code and identifies that every incoming MCP tool call spawns a goroutine with `go fetchFromD365()` but there is no mechanism to wait for completion or cancel it. When the HTTP handler returns (on timeout), the goroutine continues running with a reference to the now-closed response writer. The fix is a context-aware call with `context.WithTimeout`:
```go
ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
defer cancel()
result, err := fetchFromD365(ctx, vendorID)
```

2. **Diagnoses the silent 429 handling:** The `fetchFromD365` function checks `err != nil` but D365's OData service returns 429 as a valid HTTP response with `err == nil`. The function reads `body` from the 429 response, gets an empty JSON object, and returns empty results. A 4xx status code is not a Go error unless you check `resp.StatusCode`.

3. **Adds explicit status code handling:**
```go
if resp.StatusCode == http.StatusTooManyRequests {
    retryAfter := resp.Header.Get("Retry-After")
    return nil, fmt.Errorf("D365 rate limited: retry after %s", retryAfter)
}
if resp.StatusCode != http.StatusOK {
    return nil, fmt.Errorf("D365 OData error: %d %s", resp.StatusCode, resp.Status)
}
```

4. **Catches a response body leak:** The original code reads the body but never calls `resp.Body.Close()`. In Go, unclosed response bodies hold the underlying TCP connection open, gradually exhausting the connection pool. Adds `defer resp.Body.Close()` immediately after the `http.Get` call.

5. **Adds exponential backoff for 429 responses:** Implements a retry loop with `time.Sleep(time.Duration(retryAfter) * time.Second)` for up to 3 retries, respecting the `Retry-After` header D365 sends with every rate limit response.

### The Business Impact

- **Memory leak fixed** — goroutine count stabilized at under 20 in production, previously grew to 8,000+ before OOM kill
- **Silent data loss eliminated** — 429 errors now surface as logged warnings with the Retry-After value; operations team can see D365 rate limiting in dashboards
- **TCP connection pool leak closed** — the `Body.Close()` fix resolved a secondary issue where the server ran out of available connections after 2 hours of load

### Try It Yourself

> "My Go MCP server needs to make 3 D365 OData calls in parallel for a single tool invocation: fetch the vendor, fetch their payment terms, and fetch their open purchase orders. Show me how to run them concurrently with errgroup and cancel all three if any one fails."
