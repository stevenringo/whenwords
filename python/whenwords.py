"""
whenwords - Human-friendly time formatting and parsing library
Version 0.1.0
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Union

# Type alias for timestamps
Timestamp = Union[int, float, str, datetime]

# Constants
SECONDS_PER_MINUTE = 60
SECONDS_PER_HOUR = 3600
SECONDS_PER_DAY = 86400
SECONDS_PER_WEEK = 604800
SECONDS_PER_MONTH = 2592000  # 30 days
SECONDS_PER_YEAR = 31536000  # 365 days

WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]


def _normalize_timestamp(timestamp: Timestamp) -> int:
    """Normalizes a timestamp to Unix seconds."""
    if isinstance(timestamp, (int, float)):
        return int(timestamp)
    if isinstance(timestamp, datetime):
        return int(timestamp.timestamp())
    if isinstance(timestamp, str):
        # Try ISO 8601 parsing
        try:
            # Handle various ISO 8601 formats
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            return int(dt.timestamp())
        except ValueError:
            raise ValueError(f"Invalid timestamp format: {timestamp}")
    raise TypeError(f"Invalid timestamp type: {type(timestamp).__name__}")


def _round_half_up(n: float) -> int:
    """Rounds a number using half-up rounding (2.5 → 3, 2.4 → 2)."""
    return int(n + 0.5)


def _pluralize(count: int, singular: str, plural: str) -> str:
    """Returns singular or plural form based on count."""
    return singular if count == 1 else plural


def timeago(timestamp: Timestamp, reference: Timestamp | None = None) -> str:
    """
    Converts timestamps to relative time strings like "3 hours ago" or "in 2 days".

    Args:
        timestamp: Unix seconds, ISO 8601 string, or datetime object
        reference: Optional comparison time (defaults to timestamp, returning "just now")

    Returns:
        Human-readable relative time string
    """
    ts = _normalize_timestamp(timestamp)
    ref = _normalize_timestamp(reference) if reference is not None else ts

    diff = ref - ts
    abs_diff = abs(diff)
    is_future = diff < 0

    if abs_diff < 45:
        return 'just now'
    elif abs_diff < 90:
        value = 1
        unit = 'minute'
    elif abs_diff < 45 * SECONDS_PER_MINUTE:
        value = _round_half_up(abs_diff / SECONDS_PER_MINUTE)
        unit = _pluralize(value, 'minute', 'minutes')
    elif abs_diff < 90 * SECONDS_PER_MINUTE:
        value = 1
        unit = 'hour'
    elif abs_diff < 22 * SECONDS_PER_HOUR:
        value = _round_half_up(abs_diff / SECONDS_PER_HOUR)
        unit = _pluralize(value, 'hour', 'hours')
    elif abs_diff < 36 * SECONDS_PER_HOUR:
        value = 1
        unit = 'day'
    elif abs_diff < 26 * SECONDS_PER_DAY:
        value = _round_half_up(abs_diff / SECONDS_PER_DAY)
        unit = _pluralize(value, 'day', 'days')
    elif abs_diff < 46 * SECONDS_PER_DAY:
        value = 1
        unit = 'month'
    elif abs_diff < 320 * SECONDS_PER_DAY:
        # Use half-up rounding but cap at 10 months to avoid showing "11 months"
        # since 320 days is already "1 year ago"
        value = min(10, _round_half_up(abs_diff / SECONDS_PER_MONTH))
        unit = _pluralize(value, 'month', 'months')
    elif abs_diff < 548 * SECONDS_PER_DAY:
        value = 1
        unit = 'year'
    else:
        value = _round_half_up(abs_diff / SECONDS_PER_YEAR)
        unit = _pluralize(value, 'year', 'years')

    if is_future:
        return f'in {value} {unit}'
    return f'{value} {unit} ago'


@dataclass
class DurationOptions:
    """Options for duration formatting."""
    compact: bool = False
    max_units: int = 2


def duration(seconds: int | float, options: DurationOptions | None = None) -> str:
    """
    Formats a duration in human-readable form.

    Args:
        seconds: Duration in seconds (must be non-negative)
        options: Optional formatting options (compact mode, max_units)

    Returns:
        Human-readable duration string

    Raises:
        ValueError: If seconds is negative
    """
    if seconds < 0:
        raise ValueError('Duration must be a non-negative number')

    opts = options or DurationOptions()
    compact = opts.compact
    max_units = opts.max_units

    if seconds == 0:
        return '0s' if compact else '0 seconds'

    units = [
        ('year', 'y', SECONDS_PER_YEAR),
        ('month', 'mo', SECONDS_PER_MONTH),
        ('day', 'd', SECONDS_PER_DAY),
        ('hour', 'h', SECONDS_PER_HOUR),
        ('minute', 'm', SECONDS_PER_MINUTE),
        ('second', 's', 1),
    ]

    parts: list[tuple[int, str, str]] = []
    remaining = int(seconds)

    for name, short, unit_seconds in units:
        if remaining >= unit_seconds:
            value = remaining // unit_seconds
            remaining = remaining % unit_seconds
            parts.append((value, name, short))

    # Limit to max_units and round if needed
    if len(parts) > max_units:
        kept_parts = list(parts[:max_units])
        dropped_parts = parts[max_units:]

        # Calculate total seconds of dropped parts
        dropped_seconds = 0
        for value, name, _ in dropped_parts:
            unit_info = next(u for u in units if u[0] == name)
            dropped_seconds += value * unit_info[2]

        # Round the last kept unit based on dropped seconds
        # Use > 0.5 (not >= 0.5) so exactly half rounds down
        if kept_parts and dropped_seconds > 0:
            last_value, last_name, last_short = kept_parts[-1]
            last_unit_info = next(u for u in units if u[0] == last_name)
            fraction = dropped_seconds / last_unit_info[2]
            if fraction > 0.5:
                kept_parts[-1] = (last_value + 1, last_name, last_short)

        parts = kept_parts

    if compact:
        return ' '.join(f'{value}{short}' for value, _, short in parts)

    return ', '.join(
        f'{value} {_pluralize(value, name, name + "s")}'
        for value, name, _ in parts
    )


def parse_duration(input_str: str) -> int:
    """
    Parses a human-written duration string into seconds.

    Args:
        input_str: Duration string (e.g., "2h30m", "2.5 hours", "1:30:00")

    Returns:
        Duration in seconds

    Raises:
        ValueError: If the string cannot be parsed
    """
    if not input_str or not input_str.strip():
        raise ValueError('Cannot parse empty string')

    normalized = input_str.strip().lower()

    # Check for negative values
    if normalized.startswith('-'):
        raise ValueError('Negative durations are not allowed')

    # Handle colon notation (h:mm or h:mm:ss)
    colon_match = re.match(r'^(\d+):(\d{1,2})(?::(\d{1,2}))?$', normalized)
    if colon_match:
        hours = int(colon_match.group(1))
        minutes = int(colon_match.group(2))
        seconds = int(colon_match.group(3)) if colon_match.group(3) else 0
        return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds

    # Unit patterns - use word boundary or lookahead for concatenated units like "2h30m"
    unit_patterns = [
        (r'(\d+(?:\.\d+)?)\s*(?:weeks?|wks?|w)(?:\b|(?=\d|$))', SECONDS_PER_WEEK),
        (r'(\d+(?:\.\d+)?)\s*(?:days?|d)(?:\b|(?=\d|$))', SECONDS_PER_DAY),
        (r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)(?:\b|(?=\d|$))', SECONDS_PER_HOUR),
        (r'(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)(?:\b|(?=\d|$))', SECONDS_PER_MINUTE),
        (r'(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|s)(?:\b|(?=\d|$))', 1),
    ]

    total_seconds = 0.0
    found_any = False

    for pattern, unit_seconds in unit_patterns:
        for match in re.finditer(pattern, normalized, re.IGNORECASE):
            value = float(match.group(1))
            if value < 0:
                raise ValueError('Negative durations are not allowed')
            total_seconds += value * unit_seconds
            found_any = True

    if not found_any:
        raise ValueError(f'Cannot parse duration: {input_str}')

    return round(total_seconds)


def _get_utc_date_components(timestamp: int) -> dict:
    """Gets UTC date components from a Unix timestamp."""
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return {
        'year': dt.year,
        'month': dt.month - 1,  # 0-indexed for consistency with MONTHS array
        'day': dt.day,
        'weekday': (dt.weekday() + 1) % 7,  # Convert Monday=0 to Sunday=0
    }


def _get_start_of_day_utc(timestamp: int) -> int:
    """Gets the start of day (midnight UTC) for a Unix timestamp."""
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    midnight = datetime(dt.year, dt.month, dt.day, tzinfo=timezone.utc)
    return int(midnight.timestamp())


def human_date(timestamp: Timestamp, reference: Timestamp | None = None) -> str:
    """
    Returns a contextual date string.

    Args:
        timestamp: Unix seconds, ISO 8601 string, or datetime object
        reference: Optional comparison time (defaults to timestamp)

    Returns:
        Contextual date string ("Today", "Yesterday", "Last Tuesday", "March 5", etc.)
    """
    ts = _normalize_timestamp(timestamp)
    ref = _normalize_timestamp(reference) if reference is not None else ts

    ts_date = _get_utc_date_components(ts)
    ref_date = _get_utc_date_components(ref)

    ts_day_start = _get_start_of_day_utc(ts)
    ref_day_start = _get_start_of_day_utc(ref)
    day_diff = (ts_day_start - ref_day_start) // SECONDS_PER_DAY

    # Same day
    if day_diff == 0:
        return 'Today'

    # Yesterday
    if day_diff == -1:
        return 'Yesterday'

    # Tomorrow
    if day_diff == 1:
        return 'Tomorrow'

    # Within past 7 days (but not yesterday)
    if -6 <= day_diff < -1:
        return f'Last {WEEKDAYS[ts_date["weekday"]]}'

    # Within next 7 days (but not tomorrow)
    if 1 < day_diff <= 6:
        return f'This {WEEKDAYS[ts_date["weekday"]]}'

    # Same year
    if ts_date['year'] == ref_date['year']:
        return f'{MONTHS[ts_date["month"]]} {ts_date["day"]}'

    # Different year
    return f'{MONTHS[ts_date["month"]]} {ts_date["day"]}, {ts_date["year"]}'


def date_range(start: Timestamp, end: Timestamp) -> str:
    """
    Formats a date range with smart abbreviation.

    Args:
        start: Start timestamp
        end: End timestamp

    Returns:
        Formatted date range string
    """
    start_ts = _normalize_timestamp(start)
    end_ts = _normalize_timestamp(end)

    # Swap if start is after end
    if start_ts > end_ts:
        start_ts, end_ts = end_ts, start_ts

    start_date = _get_utc_date_components(start_ts)
    end_date = _get_utc_date_components(end_ts)

    start_day_start = _get_start_of_day_utc(start_ts)
    end_day_start = _get_start_of_day_utc(end_ts)

    # Same day
    if start_day_start == end_day_start:
        return f'{MONTHS[start_date["month"]]} {start_date["day"]}, {start_date["year"]}'

    # Same month and year
    if start_date['year'] == end_date['year'] and start_date['month'] == end_date['month']:
        return f'{MONTHS[start_date["month"]]} {start_date["day"]}–{end_date["day"]}, {start_date["year"]}'

    # Same year, different months
    if start_date['year'] == end_date['year']:
        return f'{MONTHS[start_date["month"]]} {start_date["day"]} – {MONTHS[end_date["month"]]} {end_date["day"]}, {start_date["year"]}'

    # Different years
    return f'{MONTHS[start_date["month"]]} {start_date["day"]}, {start_date["year"]} – {MONTHS[end_date["month"]]} {end_date["day"]}, {end_date["year"]}'
