# Verifying your whenwords implementation

After generating the library, verify correctness.

## 1. Run the generated tests

The agent should have created a test file from tests.yaml. Run it with your language's test runner:

```bash
# Python
pytest test_whenwords.py

# TypeScript/JavaScript
npm test
# or
vitest run

# Rust
cargo test

# Go
go test ./...

# Ruby
rspec spec/
# or
ruby -Itest test_whenwords.rb

# Java
mvn test
# or
gradle test
```

## 2. Check coverage

All functions must be tested:

| Function | Test count |
|----------|------------|
| timeago | 36 |
| duration | 26 |
| parse_duration | 33 |
| human_date | 21 |
| date_range | 9 |
| **Total** | **125** |

If your test run shows fewer tests, the agent may have missed some cases.

## 3. Manual smoke test

Quick sanity checks in a REPL or script:

```
# Relative time
> timeago(now - 3600, now)
"1 hour ago"

> timeago(now + 7200, now)
"in 2 hours"

# Duration formatting
> duration(9000)
"2 hours, 30 minutes"

> duration(9000, {compact: true})
"2h 30m"

# Duration parsing
> parse_duration("2h 30m")
9000

> parse_duration("2 hours and 30 minutes")
9000

# Human dates
> human_date(yesterday, today)
"Yesterday"

> human_date(two_weeks_ago, today)
"January 1"  # or appropriate date

# Date ranges
> date_range(jan_15, jan_20)
"January 15–20, 2024"
```

## 4. Edge cases to spot-check

### Pluralization
- `duration(1)` → "1 second" (singular)
- `duration(2)` → "2 seconds" (plural)
- `duration(0)` → "0 seconds" (plural)

### Boundaries
- 44 seconds → "just now"
- 45 seconds → "1 minute ago"
- 89 seconds → "1 minute ago"
- 90 seconds → "2 minutes ago"

### Future vs past
- Past: "3 hours ago"
- Future: "in 3 hours"
- Exactly now: "just now"

### Parse tolerance
- `parse_duration("2h30m")` = `parse_duration("2h 30m")` = `parse_duration("2 hours 30 minutes")`
- All should return 9000

### Error handling
- `parse_duration("")` → error
- `parse_duration("hello")` → error
- `duration(-100)` → error

## 5. Implementation checklist

Before shipping:

- [ ] All 125 tests.yaml tests pass
- [ ] Functions accept language-native datetime types
- [ ] Errors are idiomatic (exceptions, Result types, etc.)
- [ ] Pluralization correct throughout
- [ ] Future times say "in X" not "X ago"
- [ ] Zero duration returns "0 seconds" (or "0s" in compact)
- [ ] `parse_duration` handles all documented formats
- [ ] Code is idiomatic for target language
- [ ] No external dependencies (or minimal, documented ones)

## 6. Optional enhancements

The spec defines core behavior. Implementations MAY add:

- Timezone parameter for `human_date` and `date_range`
- Locale support (future spec version)
- Additional input types (language-specific datetime libraries)
- Async variants (if useful for the language)

Any enhancements must not break spec-defined behavior. All tests.yaml tests must still pass.

## Troubleshooting

**Tests fail on threshold boundaries:**
Check rounding. The spec uses half-up rounding (2.5 → 3). Verify your implementation rounds the same way.

**Date tests fail:**
The spec uses UTC. If your implementation defaults to local time, tests may fail depending on your timezone. Ensure tests run with UTC interpretation.

**Parse tests fail on whitespace:**
`parse_duration` should be tolerant of extra whitespace. Trim inputs and handle multiple spaces between tokens.

**Compact format wrong:**
Compact uses lowercase single letters: "2h 30m" not "2H 30M" or "2hr 30min".