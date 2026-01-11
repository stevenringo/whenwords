# whenwords for TypeScript

Human-friendly time formatting and parsing.

## Installation

Copy the `src/whenwords.ts` file into your project and import the functions:

```typescript
import { timeago, duration, parse_duration, human_date, date_range } from './whenwords';
```

## Quick start

```typescript
import { timeago, duration, parse_duration, human_date, date_range } from './whenwords';

const now = Math.floor(Date.now() / 1000);

// Relative time
timeago(now - 3600, now);           // "1 hour ago"
timeago(now + 7200, now);           // "in 2 hours"

// Duration formatting
duration(5400);                      // "1 hour, 30 minutes"
duration(5400, { compact: true });   // "1h 30m"

// Parse durations
parse_duration("2h 30m");            // 9000
parse_duration("1 day, 2 hours");    // 93600

// Contextual dates
human_date(now, now);                // "Today"
human_date(now - 86400, now);        // "Yesterday"

// Date ranges
date_range(1705276800, 1705881600);  // "January 15–22, 2024"
```

## Functions

### timeago(timestamp, reference?) → string

Returns a human-readable relative time string.

```typescript
function timeago(timestamp: Timestamp, reference?: Timestamp): string
```

**Parameters:**
- `timestamp`: Unix seconds, ISO 8601 string, or Date object
- `reference`: Optional comparison time (defaults to timestamp, returning "just now")

**Examples:**
```typescript
timeago(1704067110, 1704067200);  // "2 minutes ago"
timeago(1704070200, 1704067200);  // "in 1 hour"
```

### duration(seconds, options?) → string

Formats a duration in human-readable form.

```typescript
function duration(seconds: number, options?: DurationOptions): string

interface DurationOptions {
  compact?: boolean;   // Use short format: "2h 30m"
  max_units?: number;  // Max units to show (default: 2)
}
```

**Examples:**
```typescript
duration(3661);                           // "1 hour, 1 minute"
duration(3661, { compact: true });        // "1h 1m"
duration(93661, { max_units: 3 });        // "1 day, 2 hours, 1 minute"
```

### parse_duration(string) → number

Parses a human-written duration string into seconds.

```typescript
function parse_duration(input: string): number
```

**Accepted formats:**
- Compact: `"2h30m"`, `"2h 30m"`
- Verbose: `"2 hours 30 minutes"`, `"2 hours and 30 minutes"`
- Decimal: `"2.5 hours"`, `"1.5h"`
- Colon: `"2:30"` (h:mm), `"1:30:00"` (h:mm:ss)

**Examples:**
```typescript
parse_duration("2h 30m");           // 9000
parse_duration("1.5 hours");        // 5400
parse_duration("1:30:00");          // 5400
```

### human_date(timestamp, reference?) → string

Returns a contextual date string.

```typescript
function human_date(timestamp: Timestamp, reference?: Timestamp): string
```

**Examples:**
```typescript
// Reference: Monday Jan 15, 2024
human_date(1705276800, 1705276800);  // "Today"
human_date(1705190400, 1705276800);  // "Yesterday"
human_date(1705104000, 1705276800);  // "Last Saturday"
human_date(1709251200, 1705276800);  // "March 1"
```

### date_range(start, end) → string

Formats a date range with smart abbreviation.

```typescript
function date_range(start: Timestamp, end: Timestamp): string
```

**Examples:**
```typescript
date_range(1705276800, 1705276800);  // "January 15, 2024"
date_range(1705276800, 1705881600);  // "January 15–22, 2024"
date_range(1705276800, 1707955200);  // "January 15 – February 15, 2024"
```

## Error handling

Functions throw `Error` for invalid inputs:

```typescript
try {
  parse_duration("");
} catch (e) {
  console.error(e.message);  // "Cannot parse empty string"
}

try {
  duration(-100);
} catch (e) {
  console.error(e.message);  // "Duration must be a non-negative finite number"
}
```

## Accepted types

All timestamp parameters accept:

| Type | Example |
|------|---------|
| Unix seconds (number) | `1704067200` |
| ISO 8601 string | `"2024-01-01T00:00:00Z"` |
| Date object | `new Date()` |

```typescript
const date = new Date('2024-01-01');
timeago(date, new Date());
timeago("2024-01-01T00:00:00Z", Date.now() / 1000);
timeago(1704067200, 1704153600);
```
