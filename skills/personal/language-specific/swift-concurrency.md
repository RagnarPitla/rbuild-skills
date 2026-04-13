---
name: "swift-concurrency"
slug: "swift-concurrency"
description: "Swift 6.2 async/await, actors, structured concurrency, and single-threaded-by-default patterns for safe concurrent iOS and macOS apps. Use when user says 'Swift concurrency', 'Swift async await', 'Swift actors', 'async concurrent Swift', 'Swift structured concurrency', 'MainActor'."
tab: "personal"
domain: "language-specific"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "language", "swift", "concurrency"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Swift Concurrency

Swift 6.2 makes concurrency approachable with structured concurrency, actors, and `async/await`. The model is designed to eliminate data races at compile time.

## async/await Basics

```swift
// Async function: can be suspended while waiting
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Calling async functions
func loadProfile(userId: String) async {
    do {
        let user = try await fetchUser(id: userId)
        await updateUI(with: user)
    } catch {
        await showError(error)
    }
}

// Bridge from sync context
Task {
    await loadProfile(userId: "123")
}
```

## Structured Concurrency: async let

```swift
// Sequential: one completes before the next starts
let orders = try await fetchOrders(userId: userId)
let profile = try await fetchProfile(userId: userId)
let stats = try await fetchStats(userId: userId)

// Parallel: all start simultaneously, all must complete
async let orders = fetchOrders(userId: userId)
async let profile = fetchProfile(userId: userId)
async let stats = fetchStats(userId: userId)

// Wait for all results
let dashboard = try await Dashboard(
    orders: orders,
    profile: profile,
    stats: stats
)
```

## TaskGroup for Dynamic Parallelism

```swift
// When you have an unknown number of parallel tasks
func downloadImages(urls: [URL]) async throws -> [UIImage] {
    try await withThrowingTaskGroup(of: (Int, UIImage).self) { group in
        for (index, url) in urls.enumerated() {
            group.addTask {
                let image = try await downloadImage(from: url)
                return (index, image)
            }
        }

        // Collect results preserving order
        var images = [UIImage?](repeating: nil, count: urls.count)
        for try await (index, image) in group {
            images[index] = image
        }
        return images.compactMap { $0 }
    }
}
```

## Actors: Safe Shared State

Actors guarantee that only one task accesses their mutable state at a time — no locks needed.

```swift
actor OrderCache {
    private var cache: [String: Order] = [:]
    private var lastUpdated: Date = .distantPast

    func getOrder(id: String) -> Order? {
        return cache[id]
    }

    func storeOrder(_ order: Order) {
        cache[order.id] = order
        lastUpdated = Date()
    }

    func clearIfStale(olderThan threshold: TimeInterval) {
        if Date().timeIntervalSince(lastUpdated) > threshold {
            cache.removeAll()
        }
    }
}

// Usage — actor isolation is enforced at compile time
let orderCache = OrderCache()
let order = await orderCache.getOrder(id: "123") // await required
await orderCache.storeOrder(freshOrder)           // await required
```

## @MainActor: UI Updates

```swift
// Mark classes or functions that must run on the main thread
@MainActor
class OrderViewModel: ObservableObject {
    @Published var orders: [Order] = []
    @Published var isLoading = false
    @Published var error: Error?

    func loadOrders() {
        Task {
            isLoading = true
            do {
                let fetched = try await orderService.fetchOrders()
                orders = fetched  // Safe: @MainActor guarantees main thread
            } catch {
                self.error = error
            }
            isLoading = false
        }
    }
}

// Explicitly switch to main actor from background task
func processAndUpdateUI() async {
    let result = await heavyComputation()  // Runs on background
    await MainActor.run {
        self.displayResult(result)          // Runs on main thread
    }
}
```

## Task Cancellation

```swift
// Check for cancellation in long-running tasks
func processLargeDataset(items: [Item]) async throws -> [Result] {
    var results: [Result] = []
    for item in items {
        // Check if the task has been cancelled
        try Task.checkCancellation()
        let result = try await processItem(item)
        results.append(result)
    }
    return results
}

// Cancel a task from outside
let task = Task {
    try await processLargeDataset(items: items)
}

// Later...
task.cancel()

// In SwiftUI: tasks are automatically cancelled when view disappears
.task {
    await viewModel.loadOrders()
}
```

## Swift 6.2: Single-Threaded by Default

Swift 6.2 introduced approachable concurrency — code that doesn't explicitly use concurrency runs on the main thread by default.

```swift
// In Swift 6.2, this is safe without @MainActor on every property
// The default executor is the main thread unless you explicitly leave it
@Observable
class ViewModel {
    var items: [Item] = []  // Implicitly @MainActor in Swift 6.2

    func load() async {
        // Automatically dispatches to background for the fetch
        let data = await Task.detached(priority: .userInitiated) {
            try? await fetchFromNetwork()
        }.value
        items = data ?? []  // Back on main thread
    }
}
```

## Trigger Phrases

- "Swift concurrency"
- "Swift async await"
- "Swift actors"
- "async concurrent Swift"
- "Swift structured concurrency"
- "MainActor"
- "TaskGroup Swift"
- "Swift 6 concurrency"

## Quick Example

> See `swift-concurrency-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "Expression is 'async' but is not marked with 'await'" | Calling async function without await | Add `await` before the call; if in a synchronous context, wrap in `Task { await ... }` |
| UI updates cause purple thread warning | Updating UI from background thread | Mark the class `@MainActor` or use `await MainActor.run { }` for the update |
| Actor deadlock | Calling actor method from within the same actor using await | Actors are reentrant — calls from within the same actor do not need await; only cross-actor calls need await |
| Task group errors cancel all siblings | Using `withThrowingTaskGroup` — first error cancels all | Use `withTaskGroup` (non-throwing) and handle errors per task; or catch errors inside each `addTask` closure |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
