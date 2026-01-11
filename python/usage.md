# whenwords for Python

Human-friendly time formatting and parsing.

## Installation

Copy the `whenwords.py` file into your project and import the functions:

```python
from whenwords import timeago, duration, parse_duration, human_date, date_range
```

## Quick start

```python
import time
from whenwords import timeago, duration, parse_duration, human_date, date_range, DurationOptions

now = int(time.time())

# Relative time
timeago(now - 3600, now)           # "1 hour ago"
timeago(now + 7200, now)           # "in 2 hours"

# Duration formatting
duration(5400)                                    # "1 hour, 30 minutes"
duration(5400, DurationOptions(compact=True))    # "1h 30m"

# Parse durations
parse_duration("2h 30m")            # 9000
parse_duration("1 day, 2 hours")    # 93600

# Contextual dates
human_date(now, now)                # "Today"
human_date(now - 86400, now)        # "Yesterday"

# Date ranges
date_range(1705276800, 1705881600)  # "January 15–22, 2024"
```

## Functions

### timeago(timestamp, reference=None) → str

Returns a human-readable relative time string.

```python
def timeago(timestamp: Timestamp, reference: Timestamp | None = None) -> str
```

**Parameters:**
- `timestamp`: Unix seconds, ISO 8601 string, or datetime object
- `reference`: Optional comparison time (defaults to timestamp, returning "just now")

**Examples:**
```python
timeago(1704067110, 1704067200)  # "2 minutes ago"
timeago(1704070200, 1704067200)  # "in 1 hour"
```

### duration(seconds, options=None) → str

Formats a duration in human-readable form.

```python
def duration(seconds: int | float, options: DurationOptions | None = None) -> str

@dataclass
class DurationOptions:
    compact: bool = False   # Use short format: "2h 30m"
    max_units: int = 2      # Max units to show
```

**Examples:**
```python
duration(3661)                                    # "1 hour, 1 minute"
duration(3661, DurationOptions(compact=True))    # "1h 1m"
duration(93661, DurationOptions(max_units=3))    # "1 day, 2 hours, 1 minute"
```

### parse_duration(input_str) → int

Parses a human-written duration string into seconds.

```python
def parse_duration(input_str: str) -> int
```

**Accepted formats:**
- Compact: `"2h30m"`, `"2h 30m"`
- Verbose: `"2 hours 30 minutes"`, `"2 hours and 30 minutes"`
- Decimal: `"2.5 hours"`, `"1.5h"`
- Colon: `"2:30"` (h:mm), `"1:30:00"` (h:mm:ss)

**Examples:**
```python
parse_duration("2h 30m")           # 9000
parse_duration("1.5 hours")        # 5400
parse_duration("1:30:00")          # 5400
```

### human_date(timestamp, reference=None) → str

Returns a contextual date string.

```python
def human_date(timestamp: Timestamp, reference: Timestamp | None = None) -> str
```

**Examples:**
```python
# Reference: Monday Jan 15, 2024
human_date(1705276800, 1705276800)  # "Today"
human_date(1705190400, 1705276800)  # "Yesterday"
human_date(1705104000, 1705276800)  # "Last Saturday"
human_date(1709251200, 1705276800)  # "March 1"
```

### date_range(start, end) → str

Formats a date range with smart abbreviation.

```python
def date_range(start: Timestamp, end: Timestamp) -> str
```

**Examples:**
```python
date_range(1705276800, 1705276800)  # "January 15, 2024"
date_range(1705276800, 1705881600)  # "January 15–22, 2024"
date_range(1705276800, 1707955200)  # "January 15 – February 15, 2024"
```

## Error handling

Functions raise `ValueError` for invalid inputs:

```python
try:
    parse_duration("")
except ValueError as e:
    print(e)  # "Cannot parse empty string"

try:
    duration(-100)
except ValueError as e:
    print(e)  # "Duration must be a non-negative number"
```

## Accepted types

All timestamp parameters accept:

| Type | Example |
|------|---------|
| Unix seconds (int/float) | `1704067200` |
| ISO 8601 string | `"2024-01-01T00:00:00Z"` |
| datetime object | `datetime.now()` |

```python
from datetime import datetime

date = datetime(2024, 1, 1)
timeago(date, datetime.now())
timeago("2024-01-01T00:00:00Z", int(time.time()))
timeago(1704067200, 1704153600)
```
