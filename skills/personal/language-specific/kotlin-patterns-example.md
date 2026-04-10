# Kotlin Patterns — Example

## Scenario: Mutable Data Classes, Missing Sealed Classes, and Crashing Coroutines in a D365 Mobile Backend

**Who:** Ananya Krishnan, Android/Backend Developer, retail tech startup
**Where:** Kotlin 1.9, Ktor backend, D365 F&O OData integration, Android mobile client
**The Problem:** Ananya is building a Kotlin backend that integrates with D365 for a mobile retail app. Three issues are compounding: data classes for D365 API responses are mutable (`var` instead of `val`), UI state is tracked with nullable booleans (`isLoading: Boolean?`) instead of sealed classes, and coroutines crash silently when the D365 endpoint returns an error — the crash is caught by a global handler but the coroutine scope keeps running.

**Prerequisites:** Kotlin 1.9+, kotlinx.coroutines, Ktor or Spring Boot. The patterns apply to any Kotlin backend or Android project.

---

### What You Say to the Agent

> "My D365 data classes are mutable, I'm using nullable booleans to track screen state, and my coroutines keep crashing silently when D365 returns an error. Help me fix all three with proper Kotlin patterns."

### What the Agent Does

1. **Converts mutable data classes to immutable:** Replaces `var` with `val` across all D365 response data classes. Flags a specific bug that the mutability was hiding: two places in the codebase were modifying `vendorResponse.paymentTerms` after deserialization to apply a business rule. These mutations are now compile errors, forcing the business logic to be explicit in a mapping layer instead of scattered post-deserialization edits.

2. **Replaces nullable boolean state with a sealed class:**
```kotlin
// Before: isLoading: Boolean?, isError: Boolean?, data: Vendor?
// After:
sealed class VendorState {
    object Loading : VendorState()
    data class Success(val vendor: Vendor) : VendorState()
    data class Error(val message: String, val code: Int) : VendorState()
}
```
The sealed class makes impossible states unrepresentable. `isLoading = true` and `isError = true` simultaneously was a reachable (and crashing) state in the original code.

3. **Fixes coroutine crash with structured concurrency:** The original code used `GlobalScope.launch` for D365 calls. When D365 returned an HTTP 503, the coroutine threw an uncaught exception that bypassed the try/catch in the calling function. Replaces with `viewModelScope.launch` (Android) or a supervisor scope with an explicit `CoroutineExceptionHandler`:
```kotlin
val handler = CoroutineExceptionHandler { _, throwable ->
    _state.value = VendorState.Error(throwable.message ?: "Unknown", 503)
}
scope.launch(handler) { fetchVendor(vendorId) }
```

4. **Catches a data class `equals()` trap:** Two `Vendor` data classes with different `id` fields but the same `name` and `paymentTerms` were comparing as equal in a `Set`. The `id` field was nullable (`String?`) and was null during a partially-loaded state, causing set deduplication to collapse two different vendors into one. Adds `id: String` (non-nullable) and moves null handling to the deserialization layer.

5. **Adds `@Serializable` annotations with explicit field names:** D365 OData uses PascalCase JSON keys (`VendorName`) while Kotlin uses camelCase. Without explicit `@SerialName("VendorName")` annotations, kotlinx.serialization silently sets fields to null rather than throwing a deserialization error.

### The Business Impact

- **Two vendor mutation bugs surfaced by immutability** — business logic that was silently corrupting vendor payment terms after load is now a compile error
- **Impossible UI states eliminated** — the `isLoading=true + isError=true` crash that appeared 3-5 times per day in production is now structurally impossible
- **Silent coroutine crashes now surface as state transitions** — error states are visible in the UI rather than swallowed by GlobalScope's default exception handler

### Try It Yourself

> "I need to fetch vendor data, inventory levels, and pricing from D365 in parallel for a product detail screen. Show me how to use async/await in Kotlin coroutines with proper error handling so a failure in any one call shows a partial state rather than crashing the whole screen."
