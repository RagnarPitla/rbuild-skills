---
name: rust-patterns
description: Rust ownership, borrowing, lifetimes, error handling with Result and Option, and idiomatic patterns for safe concurrent systems. Use when user says 'Rust ownership', 'Rust borrowing', 'Rust patterns', 'Rust error handling', 'Result Option Rust', 'idiomatic Rust'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, language, rust, ownership]
---


# Rust Patterns

Rust's ownership system is not a restriction — it's a constraint that eliminates entire categories of bugs. Once it clicks, you can't go back.

## Ownership and Borrowing

The rules:
1. Each value has exactly one owner
2. When the owner goes out of scope, the value is dropped
3. You can have either one mutable reference OR any number of immutable references (not both)

```rust
// Move semantics
let s1 = String::from("hello");
let s2 = s1; // s1 is MOVED to s2 — s1 is no longer valid
// println!("{}", s1); // Compile error: value used after move

// Clone when you need a copy
let s1 = String::from("hello");
let s2 = s1.clone(); // Deep copy — both valid
println!("{} {}", s1, s2); // Fine

// Borrowing: temporary reference without ownership
fn calculate_length(s: &String) -> usize { // Takes a reference
    s.len()
}

let s = String::from("hello");
let len = calculate_length(&s); // Borrow s
println!("{} has {} characters", s, len); // s still valid

// Mutable reference: exclusive access
fn append_world(s: &mut String) {
    s.push_str(" world");
}

let mut s = String::from("hello");
append_world(&mut s);
```

## Error Handling with Result and Option

```rust
use std::num::ParseIntError;

// Result<T, E> for operations that can fail
fn parse_port(s: &str) -> Result<u16, ParseIntError> {
    s.parse::<u16>()
}

// ? operator: propagate errors up the call stack
fn get_config() -> Result<Config, Box<dyn std::error::Error>> {
    let port_str = std::env::var("PORT")?;  // Returns Err if not set
    let port = port_str.parse::<u16>()?;    // Returns Err if not a number
    Ok(Config { port })
}

// Option<T> for values that may not exist
fn find_user(id: u64) -> Option<User> {
    USERS.iter().find(|u| u.id == id).cloned()
}

// Chaining Option methods
let email_domain = find_user(123)
    .and_then(|user| user.email)
    .map(|email| email.split('@').last().unwrap_or("unknown").to_string())
    .unwrap_or_else(|| "no email".to_string());
```

## Custom Error Types

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum OrderError {
    #[error("order {id} not found")]
    NotFound { id: u64 },
    
    #[error("insufficient stock: need {needed}, have {available}")]
    InsufficientStock { needed: u32, available: u32 },
    
    #[error("database error: {0}")]
    Database(#[from] sqlx::Error),
}

fn process_order(order_id: u64) -> Result<Order, OrderError> {
    let order = db.find_order(order_id)
        .map_err(|e| OrderError::Database(e))?  // or use #[from]
        .ok_or(OrderError::NotFound { id: order_id })?;
    
    Ok(order)
}
```

## Traits: Rust's Interfaces

```rust
// Define behavior through traits
trait Serialize {
    fn serialize(&self) -> String;
}

trait Deserialize: Sized {
    fn deserialize(s: &str) -> Result<Self, String>;
}

// Implement for your types
struct User { name: String, email: String }

impl Serialize for User {
    fn serialize(&self) -> String {
        format!("{{\"name\":\"{}\",\"email\":\"{}\"}}", self.name, self.email)
    }
}

// Generic functions constrained by traits
fn save_to_file<T: Serialize>(value: &T, path: &str) -> Result<(), std::io::Error> {
    std::fs::write(path, value.serialize())
}

// Multiple trait bounds
fn log_and_save<T: Serialize + std::fmt::Debug>(value: &T) {
    println!("{:?}", value);
    // ...
}
```

## Iterators and Functional Patterns

```rust
let orders: Vec<Order> = get_all_orders();

// Chain iterator adapters — lazy, zero-cost abstractions
let high_value_totals: Vec<f64> = orders.iter()
    .filter(|o| o.status == OrderStatus::Completed)
    .filter(|o| o.total > 1000.0)
    .map(|o| o.total)
    .collect();

// Fold for aggregations
let total_revenue: f64 = orders.iter()
    .filter(|o| o.status == OrderStatus::Completed)
    .map(|o| o.total)
    .sum();

// Partition into two collections
let (completed, pending): (Vec<&Order>, Vec<&Order>) = orders.iter()
    .partition(|o| o.status == OrderStatus::Completed);
```

## Concurrency with Arc and Mutex

```rust
use std::sync::{Arc, Mutex};
use std::thread;

// Arc: atomically reference-counted — shared ownership across threads
// Mutex: mutual exclusion — one thread at a time
let counter = Arc::new(Mutex::new(0u64));

let handles: Vec<_> = (0..10).map(|_| {
    let counter = Arc::clone(&counter);
    thread::spawn(move || {
        let mut count = counter.lock().unwrap();
        *count += 1;
    })
}).collect();

for handle in handles {
    handle.join().unwrap();
}

println!("Final count: {}", *counter.lock().unwrap()); // 10
```

## Trigger Phrases

- "Rust ownership"
- "Rust borrowing"
- "Rust patterns"
- "Rust error handling"
- "Result Option Rust"
- "idiomatic Rust"
- "Rust traits"
- "Rust lifetimes"

## Quick Example

> See `rust-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Borrow checker error: value used after move | Value moved into a function or assignment, then used again | Use `clone()` for types that need to be reused, or pass a reference `&value` instead of moving |
| Cannot borrow as mutable while immutable borrow exists | Immutable reference and mutable reference in same scope | End the immutable borrow before taking a mutable one; restructure code so borrows don't overlap |
| Lifetime annotation errors | Compiler cannot infer relationship between reference lifetimes | Start with explicit lifetime annotations `'a`; most cases are resolved by returning owned values instead of references |
| Mutex deadlock | Lock held while trying to acquire same lock | Use `drop(guard)` to release lock before acquiring again; or restructure to avoid nested locks |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
