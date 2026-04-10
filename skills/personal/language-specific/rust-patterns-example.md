# Rust Patterns — Example

## Scenario: Borrow Checker Fights When Sharing State Between Threads in a D365 Event Processor

**Who:** Felix Wagner, Systems Developer, platform engineering team
**Where:** Rust 1.77, Tokio async runtime, D365 event subscription via Azure Service Bus
**The Problem:** Felix is rewriting a D365 event processor in Rust for throughput improvements. He is fighting the borrow checker on shared state: a connection pool and a metrics counter need to be accessible from multiple Tokio tasks simultaneously. His attempts to share state keep hitting `cannot move out of X because it is borrowed` and `the trait Send is not implemented`. He is fighting Rust instead of using it.

**Prerequisites:** Rust stable 1.70+, Tokio runtime, basic Rust familiarity. The patterns cover Arc/Mutex, message passing, and the decision between the two.

---

### What You Say to the Agent

> "I keep fighting the borrow checker when I try to share a D365 connection pool and a metrics counter across Tokio tasks. I'm getting 'cannot move out of' errors and trait bound errors. Help me understand the right pattern for shared state in async Rust."

### What the Agent Does

1. **Diagnoses the specific borrow checker errors:** Reads Felix's code and identifies two distinct problems being conflated. The connection pool error (`cannot move out of X`) is happening because he is trying to move the pool into each task closure, but it has already been moved into the first closure. The metrics error is a `Send` trait bound failure because he is using `Rc<RefCell<Metrics>>` which is not thread-safe.

2. **Explains the correct tool for each case:**
   - Shared read-heavy state (connection pool): `Arc<T>` where `T: Sync` — clone the `Arc` per task, share the underlying data without copying
   - Mutated shared state (metrics counter): `Arc<Mutex<Metrics>>` or `Arc<AtomicU64>` for simple counters

3. **Implements the connection pool pattern:**
```rust
#[derive(Clone)]
struct AppState {
    pool: Arc<D365ConnectionPool>,
    metrics: Arc<AtomicU64>,
}

// In the task spawn:
let state = state.clone(); // Clones the Arc, not the pool
tokio::spawn(async move {
    process_event(&state, event).await;
});
```

4. **Catches a deadlock Felix was about to create:** Felix planned to hold a `Mutex` lock across an `.await` point. In async Rust, this causes a deadlock because the executor cannot run other tasks while the lock is held across a yield point. The agent flags this with the exact error message he would have seen: `MutexGuard<T> cannot be held across an await point` and shows the fix: acquire the lock, copy the value needed, release the lock, then await.

5. **Suggests `DashMap` for the high-contention case:** The metrics counter is updated 10,000+ times per second. `Arc<Mutex<HashMap>>` at that rate will serialize all updates. Recommends `Arc<DashMap>` from the `dashmap` crate, which uses per-shard locking to allow concurrent writes without a global lock.

### The Business Impact

- **Processor throughput reached 85,000 events/second** — the Arc pattern eliminated the lock contention that was capping the original implementation at 12,000 events/second
- **Deadlock avoided before production** — the lock-across-await pattern would have caused an intermittent deadlock under load that would have been extremely difficult to debug in production
- **Compile-time safety fully leveraged** — the `Arc<AtomicU64>` change caught a numeric overflow edge case at compile time that would have silently wrapped in the original i32 counter

### Try It Yourself

> "I need to add a rate limiter to my D365 event processor that allows 1,000 events per second and queues the rest. Show me how to implement a token bucket rate limiter using Tokio primitives that is shared safely across tasks."
