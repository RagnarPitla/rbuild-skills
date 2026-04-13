---
name: "golang-patterns"
slug: "golang-patterns"
description: "Idiomatic Go patterns covering goroutines, channels, error handling, interfaces, and production-ready concurrency patterns. Use when user says 'Go patterns', 'idiomatic Go', 'golang best practices', 'goroutines', 'Go error handling', 'Go interfaces'."
tab: "personal"
domain: "language-specific"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "language", "golang", "patterns"]
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



# Go Patterns

Go's simplicity is a feature. Idiomatic Go reads like English prose. The patterns here will make your Go code maintainable, testable, and production-ready.

## Error Handling: Explicit Over Exceptions

Go errors are values — handle them explicitly.

```go
// Bad: ignoring errors
data, _ := os.ReadFile("config.json")

// Bad: panic for recoverable errors
data, err := os.ReadFile("config.json")
if err != nil {
    panic(err)
}

// Good: explicit error handling
data, err := os.ReadFile("config.json")
if err != nil {
    return fmt.Errorf("reading config: %w", err)
}
```

**Wrapping errors:** Use `%w` to wrap errors for unwrapping with `errors.Is` and `errors.As`.

```go
// Define sentinel errors for specific cases
var ErrNotFound = errors.New("not found")
var ErrUnauthorized = errors.New("unauthorized")

// Wrap with context
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("user %s: %w", id, ErrNotFound)
        }
        return nil, fmt.Errorf("finding user %s: %w", id, err)
    }
    return user, nil
}

// Check for specific errors
user, err := GetUser("123")
if errors.Is(err, ErrNotFound) {
    // handle not found
}
```

## Interfaces: Small and Implicit

Go interfaces are implemented implicitly. Keep them small.

```go
// Bad: large interface (hard to implement, hard to mock)
type UserRepository interface {
    Create(user User) error
    GetByID(id string) (*User, error)
    Update(user User) error
    Delete(id string) error
    List(page, pageSize int) ([]User, error)
    Search(query string) ([]User, error)
    CountByStatus(status string) (int, error)
}

// Good: small, focused interfaces
type UserGetter interface {
    GetByID(id string) (*User, error)
}

type UserCreator interface {
    Create(user User) error
}

// Compose when needed
type UserStore interface {
    UserGetter
    UserCreator
}

// Function only depends on what it needs
func GetUserProfile(getter UserGetter, id string) (*Profile, error) {
    user, err := getter.GetByID(id)
    // ...
}
```

## Goroutines and Channels

```go
// Worker pool pattern — bounded concurrency
func processItems(items []Item) []Result {
    const workerCount = 10
    
    jobs := make(chan Item, len(items))
    results := make(chan Result, len(items))

    // Start workers
    var wg sync.WaitGroup
    for i := 0; i < workerCount; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for item := range jobs {
                results <- processItem(item)
            }
        }()
    }

    // Send jobs
    for _, item := range items {
        jobs <- item
    }
    close(jobs)

    // Wait for completion, then close results
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    var output []Result
    for result := range results {
        output = append(output, result)
    }
    return output
}
```

**Context for cancellation:**
```go
func fetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, fmt.Errorf("creating request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("doing request: %w", err)
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
```

## Struct Patterns

```go
// Use functional options for constructors with many optional params
type Server struct {
    addr    string
    timeout time.Duration
    maxConn int
}

type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) { s.timeout = d }
}

func WithMaxConnections(n int) Option {
    return func(s *Server) { s.maxConn = n }
}

func NewServer(addr string, opts ...Option) *Server {
    s := &Server{
        addr:    addr,
        timeout: 30 * time.Second, // sensible defaults
        maxConn: 100,
    }
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// Usage
server := NewServer(":8080",
    WithTimeout(60*time.Second),
    WithMaxConnections(500),
)
```

## Table-Driven Tests

```go
func TestCalculateDiscount(t *testing.T) {
    tests := []struct {
        name     string
        amount   float64
        tier     string
        expected float64
    }{
        {"standard tier no discount", 50.0, "standard", 50.0},
        {"gold tier 10% discount", 100.0, "gold", 90.0},
        {"zero amount returns zero", 0.0, "gold", 0.0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := calculateDiscount(tt.amount, tt.tier)
            if got != tt.expected {
                t.Errorf("calculateDiscount(%v, %v) = %v, want %v",
                    tt.amount, tt.tier, got, tt.expected)
            }
        })
    }
}
```

## Key Idioms

```go
// defer for cleanup — always pair open with close
f, err := os.Open("file.txt")
if err != nil { return err }
defer f.Close()

// Named return values for error documentation
func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = errors.New("division by zero")
        return
    }
    result = a / b
    return
}

// Blank identifier to satisfy interface check at compile time
var _ UserRepository = (*PostgresUserRepo)(nil)

// Short variable declaration in if
if user, err := getUser(id); err != nil {
    return err
} else {
    processUser(user)
}
```

## Trigger Phrases

- "Go patterns"
- "idiomatic Go"
- "golang best practices"
- "goroutines"
- "Go error handling"
- "Go interfaces"
- "Go concurrency"
- "Go worker pool"

## Quick Example

> See `golang-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Goroutine leak | Goroutine started but never exits because channel is never closed or context never cancelled | Always pair goroutine creation with a termination condition; use `context.WithCancel` and pass it to goroutines |
| Race condition | Multiple goroutines accessing shared memory without synchronization | Use `go test -race` to detect races; fix with `sync.Mutex`, `sync/atomic`, or channels |
| Interface not satisfied at compile time | Struct implements method with wrong signature | Add `var _ InterfaceName = (*StructName)(nil)` — this causes a compile error if the interface is not satisfied |
| Error context lost | Errors not wrapped with `%w` | Use `fmt.Errorf("operation context: %w", err)` to preserve the error chain for `errors.Is` and `errors.As` |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
