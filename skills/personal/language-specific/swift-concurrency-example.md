# Swift Concurrency — Example

## Scenario: UI Freezes and Purple Warnings in a D365 Mobile Companion App

**Who:** Caitlin Murphy, iOS Developer, enterprise mobility team
**Where:** Swift 5.9, SwiftUI, Xcode 15, D365 F&O OData API, iPhone/iPad
**The Problem:** Caitlin is building a D365 mobile companion app for field agents. The app fetches vendor and purchase order data. The UI freezes for 2-3 seconds when switching tabs. Xcode shows purple runtime warnings: "Main thread checker: UI API called on a background thread." and "Publishing changes from background threads is not allowed." Two different approaches to async data fetching are fighting each other.

**Prerequisites:** Swift 5.5+, Xcode 14+, iOS 15+ deployment target. The patterns use Swift's structured concurrency (`async/await`, `@MainActor`, `Task`).

---

### What You Say to the Agent

> "My D365 companion app freezes the UI for 2-3 seconds when fetching data. Xcode shows purple warnings about UI calls on background threads and publishing changes from background threads. I have async/await code but it's clearly not structured correctly. Help me fix it."

### What the Agent Does

1. **Identifies the two conflicting patterns:** Reads the ViewModel and finds two things happening simultaneously. The `fetchVendors()` function uses `DispatchQueue.global().async` (old GCD pattern) and then tries to update `@Published` properties on that background queue. Separately, a `Task { }` block is calling a synchronous URLSession method. The old and new concurrency systems are conflating thread boundaries.

2. **Marks the ViewModel with `@MainActor`:**
```swift
@MainActor
final class VendorViewModel: ObservableObject {
    @Published var vendors: [Vendor] = []
    @Published var isLoading = false
    @Published var error: Error?

    func fetchVendors() async {
        isLoading = true
        do {
            vendors = try await D365Client.shared.fetchVendors()
        } catch {
            self.error = error
        }
        isLoading = false
    }
}
```
`@MainActor` guarantees all property updates happen on the main thread, eliminating the purple warnings.

3. **Moves the network call off the main actor:** The D365 client is marked `nonisolated` so the OData network call runs on a cooperative thread pool, not the main thread. The `await` in `fetchVendors()` suspends the main actor during the network call (not blocking it), which is why the UI stays responsive.

4. **Catches a task cancellation gap:** The original code started a `Task { await fetchVendors() }` in `onAppear` but never cancelled it when the view disappeared. If the user navigates away and back quickly, two fetch tasks are running simultaneously, racing to write to `vendors`. Adds `task { await viewModel.fetchVendors() }` view modifier, which automatically cancels the task when the view disappears.

5. **Finds the actual freeze source:** Beyond the threading issues, Xcode Instruments reveals the 2-3 second freeze is caused by JSON decoding 2,400 vendor records synchronously on the main thread (the old code path). The new `async` decoder offloads this to a background thread. Decoding 2,400 records takes 180ms on the main thread but is invisible to the UI when done off-actor.

### The Business Impact

- **2-3 second UI freeze eliminated** — JSON decoding moved off the main thread; tab switching is now instantaneous
- **All purple warnings resolved** — zero `Main thread checker` violations in the final build, which is a requirement for enterprise App Store submission
- **Task racing condition fixed** — the uncancelled task bug would have caused intermittent data corruption (two fetches overwriting each other) that would have been very difficult to reproduce

### Try It Yourself

> "My D365 companion app needs to fetch vendor data, purchase orders, and inventory levels simultaneously when the dashboard loads. Show me how to use async let to run all three calls in parallel and handle the case where one call fails without cancelling the others."
