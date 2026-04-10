---
name: kotlin-patterns
description: Idiomatic Kotlin patterns covering coroutines, sealed classes, extension functions, data classes, and KMP-ready architecture. Use when user says 'Kotlin patterns', 'idiomatic Kotlin', 'Kotlin coroutines', 'sealed classes', 'Kotlin extension functions', 'Kotlin best practices'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, language, kotlin, patterns]
---


# Kotlin Patterns

Kotlin lets you write expressive, safe code without ceremony. These patterns make the most of Kotlin's type system and coroutines model.

## Sealed Classes for State Modeling

Sealed classes make illegal states unrepresentable.

```kotlin
// Bad: string or nullable type for state
data class UiState(
    val isLoading: Boolean,
    val data: List<Order>?,
    val error: String?
)

// Good: sealed class — every state is explicit and exhaustive
sealed class OrderUiState {
    object Loading : OrderUiState()
    data class Success(val orders: List<Order>) : OrderUiState()
    data class Error(val message: String) : OrderUiState()
}

// Usage in ViewModel
class OrderViewModel : ViewModel() {
    private val _state = MutableStateFlow<OrderUiState>(OrderUiState.Loading)
    val state: StateFlow<OrderUiState> = _state.asStateFlow()

    fun loadOrders() {
        viewModelScope.launch {
            _state.value = OrderUiState.Loading
            try {
                val orders = repository.getOrders()
                _state.value = OrderUiState.Success(orders)
            } catch (e: Exception) {
                _state.value = OrderUiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

// Usage in UI — when is exhaustive
when (val state = viewModel.state.collectAsState().value) {
    is OrderUiState.Loading -> LoadingSpinner()
    is OrderUiState.Success -> OrderList(state.orders)
    is OrderUiState.Error -> ErrorMessage(state.message)
}
```

## Coroutines: Structured Concurrency

```kotlin
// Parallel execution with async/await
suspend fun loadDashboard(userId: String): Dashboard {
    return coroutineScope {
        val ordersDeferred = async { orderRepository.getRecentOrders(userId) }
        val profileDeferred = async { userRepository.getProfile(userId) }
        val statsDeferred = async { analyticsRepository.getStats(userId) }

        // All three run in parallel, all three must complete
        Dashboard(
            orders = ordersDeferred.await(),
            profile = profileDeferred.await(),
            stats = statsDeferred.await()
        )
    }
}

// Error handling with supervisor scope
// (one child failure doesn't cancel siblings)
val supervisorJob = SupervisorJob()
val scope = CoroutineScope(Dispatchers.IO + supervisorJob)

scope.launch {
    try {
        performCriticalTask()
    } catch (e: Exception) {
        logger.error("Critical task failed", e)
    }
}
```

## Extension Functions

Extension functions add behavior to existing classes without inheritance.

```kotlin
// Extending String
fun String.toSlug(): String =
    this.lowercase()
        .replace(Regex("[^a-z0-9\\s-]"), "")
        .replace(Regex("\\s+"), "-")
        .trim('-')

// "Hello World!" -> "hello-world"

// Extending List
fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

// Extending your own types (useful for mapping)
fun Order.toSummary() = OrderSummary(
    id = this.id,
    total = this.items.sumOf { it.price * it.quantity },
    itemCount = this.items.size
)

// Scope functions: let, run, with, apply, also
val user = User(id = "123").apply {
    name = "Alice"
    email = "alice@example.com"
    createdAt = Instant.now()
}

// let: transform nullable values
val displayName = user.nickname?.let { "($it)" } ?: user.fullName
```

## Data Classes and Copy

```kotlin
data class OrderLine(
    val productId: String,
    val quantity: Int,
    val unitPrice: BigDecimal
) {
    val total: BigDecimal get() = unitPrice * BigDecimal(quantity)
}

// copy() for immutable updates
val updatedLine = orderLine.copy(quantity = orderLine.quantity + 1)

// Destructuring
val (productId, quantity, price) = orderLine
```

## Result Type for Error Handling

```kotlin
// Use Result<T> instead of throwing exceptions from repository layer
suspend fun getUser(id: String): Result<User> = runCatching {
    apiClient.getUser(id)
}

// In the caller
getUser("123")
    .onSuccess { user -> showProfile(user) }
    .onFailure { error -> showError(error.message) }
    .getOrDefault(User.empty())

// Custom sealed result for richer errors
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class NetworkError(val cause: Throwable) : ApiResult<Nothing>()
    data class ApiError(val code: Int, val message: String) : ApiResult<Nothing>()
}
```

## Flows for Reactive Streams

```kotlin
// Cold flow — executes on each collector
fun searchProducts(query: StateFlow<String>): Flow<List<Product>> =
    query
        .debounce(300)       // Wait 300ms after last keystroke
        .filter { it.length >= 2 }
        .distinctUntilChanged()
        .flatMapLatest { q -> productRepository.search(q) }

// In ViewModel
val searchResults: StateFlow<List<Product>> = searchQuery
    .debounce(300)
    .flatMapLatest { repository.search(it) }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = emptyList()
    )
```

## Trigger Phrases

- "Kotlin patterns"
- "idiomatic Kotlin"
- "Kotlin coroutines"
- "sealed classes"
- "Kotlin extension functions"
- "Kotlin best practices"
- "Kotlin Flow"
- "coroutineScope async await"

## Quick Example

> See `kotlin-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Coroutine leaks on screen rotation | Using GlobalScope instead of viewModelScope | Replace GlobalScope.launch with viewModelScope.launch — it's automatically cancelled when ViewModel is cleared |
| when expression is not exhaustive | Sealed class in when without else branch | The compiler should catch this; ensure when is an expression (assigned to a variable) not just a statement |
| StateFlow not emitting updates | Emitting the same object reference with modified internal state | Use data class with copy() for immutable updates; StateFlow uses structural equality and won't emit if reference equals the previous value |
| Flow collecting on wrong dispatcher | Default dispatcher is Dispatchers.Default | Use `.flowOn(Dispatchers.IO)` to move upstream operations to IO; the collector's dispatcher handles downstream |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
