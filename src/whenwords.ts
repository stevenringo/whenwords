/**
 * whenwords - Human-friendly time formatting and parsing library
 * Version 0.1.0
 */

// Type definitions
export type Timestamp = number | string | Date;

export interface DurationOptions {
  compact?: boolean;
  max_units?: number;
}

// Constants
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_WEEK = 604800;
const SECONDS_PER_MONTH = 2592000; // 30 days
const SECONDS_PER_YEAR = 31536000; // 365 days

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Normalizes a timestamp to Unix seconds
 */
function normalizeTimestamp(timestamp: Timestamp): number {
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  if (timestamp instanceof Date) {
    return Math.floor(timestamp.getTime() / 1000);
  }
  if (typeof timestamp === 'string') {
    const parsed = Date.parse(timestamp);
    if (isNaN(parsed)) {
      throw new Error(`Invalid timestamp format: ${timestamp}`);
    }
    return Math.floor(parsed / 1000);
  }
  throw new Error(`Invalid timestamp type: ${typeof timestamp}`);
}

/**
 * Rounds a number using half-up rounding (2.5 → 3, 2.4 → 2)
 */
function roundHalfUp(n: number): number {
  return Math.floor(n + 0.5);
}

/**
 * Returns singular or plural form based on count
 */
function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * Converts timestamps to relative time strings like "3 hours ago" or "in 2 days"
 */
export function timeago(timestamp: Timestamp, reference?: Timestamp): string {
  const ts = normalizeTimestamp(timestamp);
  const ref = reference !== undefined ? normalizeTimestamp(reference) : ts;

  const diff = ref - ts;
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  let value: number;
  let unit: string;

  if (absDiff < 45) {
    return 'just now';
  } else if (absDiff < 90) {
    value = 1;
    unit = 'minute';
  } else if (absDiff < 45 * SECONDS_PER_MINUTE) {
    value = roundHalfUp(absDiff / SECONDS_PER_MINUTE);
    unit = pluralize(value, 'minute', 'minutes');
  } else if (absDiff < 90 * SECONDS_PER_MINUTE) {
    value = 1;
    unit = 'hour';
  } else if (absDiff < 22 * SECONDS_PER_HOUR) {
    value = roundHalfUp(absDiff / SECONDS_PER_HOUR);
    unit = pluralize(value, 'hour', 'hours');
  } else if (absDiff < 36 * SECONDS_PER_HOUR) {
    value = 1;
    unit = 'day';
  } else if (absDiff < 26 * SECONDS_PER_DAY) {
    value = roundHalfUp(absDiff / SECONDS_PER_DAY);
    unit = pluralize(value, 'day', 'days');
  } else if (absDiff < 46 * SECONDS_PER_DAY) {
    value = 1;
    unit = 'month';
  } else if (absDiff < 320 * SECONDS_PER_DAY) {
    // Use half-up rounding but cap at 10 months to avoid showing "11 months"
    // since 320 days is already "1 year ago"
    value = Math.min(10, roundHalfUp(absDiff / SECONDS_PER_MONTH));
    unit = pluralize(value, 'month', 'months');
  } else if (absDiff < 548 * SECONDS_PER_DAY) {
    value = 1;
    unit = 'year';
  } else {
    value = roundHalfUp(absDiff / SECONDS_PER_YEAR);
    unit = pluralize(value, 'year', 'years');
  }

  if (isFuture) {
    return `in ${value} ${unit}`;
  }
  return `${value} ${unit} ago`;
}

/**
 * Formats a duration in human-readable form
 */
export function duration(seconds: number, options?: DurationOptions): string {
  if (seconds < 0 || !isFinite(seconds) || isNaN(seconds)) {
    throw new Error('Duration must be a non-negative finite number');
  }

  const compact = options?.compact ?? false;
  const maxUnits = options?.max_units ?? 2;

  if (seconds === 0) {
    return compact ? '0s' : '0 seconds';
  }

  const units: { name: string; short: string; seconds: number }[] = [
    { name: 'year', short: 'y', seconds: SECONDS_PER_YEAR },
    { name: 'month', short: 'mo', seconds: SECONDS_PER_MONTH },
    { name: 'day', short: 'd', seconds: SECONDS_PER_DAY },
    { name: 'hour', short: 'h', seconds: SECONDS_PER_HOUR },
    { name: 'minute', short: 'm', seconds: SECONDS_PER_MINUTE },
    { name: 'second', short: 's', seconds: 1 },
  ];

  const parts: { value: number; name: string; short: string }[] = [];
  let remaining = seconds;

  for (const unit of units) {
    if (remaining >= unit.seconds) {
      const value = Math.floor(remaining / unit.seconds);
      remaining = remaining % unit.seconds;
      parts.push({ value, name: unit.name, short: unit.short });
    }
  }

  // Limit to max_units and round the last unit if needed
  if (parts.length > maxUnits) {
    // Calculate what remains after the units we're keeping
    const keptParts = parts.slice(0, maxUnits);
    const droppedParts = parts.slice(maxUnits);

    // Calculate total seconds of dropped parts
    let droppedSeconds = 0;
    for (const part of droppedParts) {
      const unitInfo = units.find(u => u.name === part.name)!;
      droppedSeconds += part.value * unitInfo.seconds;
    }

    // Round the last kept unit based on dropped seconds
    // Use > 0.5 (not >= 0.5) so exactly half rounds down
    if (keptParts.length > 0 && droppedSeconds > 0) {
      const lastKeptUnit = keptParts[keptParts.length - 1];
      const lastUnitInfo = units.find(u => u.name === lastKeptUnit.name)!;
      const fraction = droppedSeconds / lastUnitInfo.seconds;
      if (fraction > 0.5) {
        lastKeptUnit.value += 1;
      }
    }

    parts.length = maxUnits;
  }

  if (compact) {
    return parts.map(p => `${p.value}${p.short}`).join(' ');
  }

  return parts
    .map(p => `${p.value} ${pluralize(p.value, p.name, p.name + 's')}`)
    .join(', ');
}

/**
 * Parses a human-written duration string into seconds
 */
export function parse_duration(input: string): number {
  if (!input || input.trim() === '') {
    throw new Error('Cannot parse empty string');
  }

  const normalized = input.trim().toLowerCase();

  // Check for negative values
  if (normalized.startsWith('-')) {
    throw new Error('Negative durations are not allowed');
  }

  // Handle colon notation (h:mm or h:mm:ss)
  const colonMatch = normalized.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (colonMatch) {
    const hours = parseInt(colonMatch[1], 10);
    const minutes = parseInt(colonMatch[2], 10);
    const seconds = colonMatch[3] ? parseInt(colonMatch[3], 10) : 0;
    return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
  }

  // Unit mappings - use word boundary or lookahead to handle concatenated units like "2h30m"
  const unitPatterns: { pattern: RegExp; seconds: number }[] = [
    { pattern: /(\d+(?:\.\d+)?)\s*(?:weeks?|wks?|w)(?:\b|(?=\d|$))/gi, seconds: SECONDS_PER_WEEK },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:days?|d)(?:\b|(?=\d|$))/gi, seconds: SECONDS_PER_DAY },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)(?:\b|(?=\d|$))/gi, seconds: SECONDS_PER_HOUR },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)(?:\b|(?=\d|$))/gi, seconds: SECONDS_PER_MINUTE },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|s)(?:\b|(?=\d|$))/gi, seconds: 1 },
  ];

  let totalSeconds = 0;
  let foundAny = false;

  for (const { pattern, seconds } of unitPatterns) {
    let match;
    // Reset pattern since we're reusing it
    pattern.lastIndex = 0;
    while ((match = pattern.exec(normalized)) !== null) {
      const value = parseFloat(match[1]);
      if (value < 0) {
        throw new Error('Negative durations are not allowed');
      }
      totalSeconds += value * seconds;
      foundAny = true;
    }
  }

  if (!foundAny) {
    throw new Error(`Cannot parse duration: ${input}`);
  }

  return Math.round(totalSeconds);
}

/**
 * Gets UTC date components from a Unix timestamp
 */
function getUTCDateComponents(timestamp: number): { year: number; month: number; day: number; weekday: number } {
  const date = new Date(timestamp * 1000);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  };
}

/**
 * Gets the start of day (midnight UTC) for a Unix timestamp
 */
function getStartOfDayUTC(timestamp: number): number {
  const date = new Date(timestamp * 1000);
  const midnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor(midnight / 1000);
}

/**
 * Returns a contextual date string
 */
export function human_date(timestamp: Timestamp, reference?: Timestamp): string {
  const ts = normalizeTimestamp(timestamp);
  const ref = reference !== undefined ? normalizeTimestamp(reference) : ts;

  const tsDate = getUTCDateComponents(ts);
  const refDate = getUTCDateComponents(ref);

  const tsDayStart = getStartOfDayUTC(ts);
  const refDayStart = getStartOfDayUTC(ref);
  const dayDiff = Math.floor((tsDayStart - refDayStart) / SECONDS_PER_DAY);

  // Same day
  if (dayDiff === 0) {
    return 'Today';
  }

  // Yesterday
  if (dayDiff === -1) {
    return 'Yesterday';
  }

  // Tomorrow
  if (dayDiff === 1) {
    return 'Tomorrow';
  }

  // Within past 7 days (but not yesterday)
  if (dayDiff >= -6 && dayDiff < -1) {
    return `Last ${WEEKDAYS[tsDate.weekday]}`;
  }

  // Within next 7 days (but not tomorrow)
  if (dayDiff > 1 && dayDiff <= 6) {
    return `This ${WEEKDAYS[tsDate.weekday]}`;
  }

  // Same year
  if (tsDate.year === refDate.year) {
    return `${MONTHS[tsDate.month]} ${tsDate.day}`;
  }

  // Different year
  return `${MONTHS[tsDate.month]} ${tsDate.day}, ${tsDate.year}`;
}

/**
 * Formats a date range with smart abbreviation
 */
export function date_range(start: Timestamp, end: Timestamp): string {
  let startTs = normalizeTimestamp(start);
  let endTs = normalizeTimestamp(end);

  // Swap if start is after end
  if (startTs > endTs) {
    [startTs, endTs] = [endTs, startTs];
  }

  const startDate = getUTCDateComponents(startTs);
  const endDate = getUTCDateComponents(endTs);

  const startDayStart = getStartOfDayUTC(startTs);
  const endDayStart = getStartOfDayUTC(endTs);

  // Same day
  if (startDayStart === endDayStart) {
    return `${MONTHS[startDate.month]} ${startDate.day}, ${startDate.year}`;
  }

  // Same month and year
  if (startDate.year === endDate.year && startDate.month === endDate.month) {
    return `${MONTHS[startDate.month]} ${startDate.day}–${endDate.day}, ${startDate.year}`;
  }

  // Same year, different months
  if (startDate.year === endDate.year) {
    return `${MONTHS[startDate.month]} ${startDate.day} – ${MONTHS[endDate.month]} ${endDate.day}, ${startDate.year}`;
  }

  // Different years
  return `${MONTHS[startDate.month]} ${startDate.day}, ${startDate.year} – ${MONTHS[endDate.month]} ${endDate.day}, ${endDate.year}`;
}
