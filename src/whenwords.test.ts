import { timeago, duration, parse_duration, human_date, date_range } from './whenwords';

describe('timeago', () => {
  test('just now - identical timestamps', () => {
    expect(timeago(1704067200, 1704067200)).toBe('just now');
  });

  test('just now - 30 seconds ago', () => {
    expect(timeago(1704067170, 1704067200)).toBe('just now');
  });

  test('just now - 44 seconds ago', () => {
    expect(timeago(1704067156, 1704067200)).toBe('just now');
  });

  test('1 minute ago - 45 seconds', () => {
    expect(timeago(1704067155, 1704067200)).toBe('1 minute ago');
  });

  test('1 minute ago - 89 seconds', () => {
    expect(timeago(1704067111, 1704067200)).toBe('1 minute ago');
  });

  test('2 minutes ago - 90 seconds', () => {
    expect(timeago(1704067110, 1704067200)).toBe('2 minutes ago');
  });

  test('30 minutes ago', () => {
    expect(timeago(1704065400, 1704067200)).toBe('30 minutes ago');
  });

  test('44 minutes ago', () => {
    expect(timeago(1704064560, 1704067200)).toBe('44 minutes ago');
  });

  test('1 hour ago - 45 minutes', () => {
    expect(timeago(1704064500, 1704067200)).toBe('1 hour ago');
  });

  test('1 hour ago - 89 minutes', () => {
    expect(timeago(1704061860, 1704067200)).toBe('1 hour ago');
  });

  test('2 hours ago - 90 minutes', () => {
    expect(timeago(1704061800, 1704067200)).toBe('2 hours ago');
  });

  test('5 hours ago', () => {
    expect(timeago(1704049200, 1704067200)).toBe('5 hours ago');
  });

  test('21 hours ago', () => {
    expect(timeago(1703991600, 1704067200)).toBe('21 hours ago');
  });

  test('1 day ago - 22 hours', () => {
    expect(timeago(1703988000, 1704067200)).toBe('1 day ago');
  });

  test('1 day ago - 35 hours', () => {
    expect(timeago(1703941200, 1704067200)).toBe('1 day ago');
  });

  test('2 days ago - 36 hours', () => {
    expect(timeago(1703937600, 1704067200)).toBe('2 days ago');
  });

  test('7 days ago', () => {
    expect(timeago(1703462400, 1704067200)).toBe('7 days ago');
  });

  test('25 days ago', () => {
    expect(timeago(1701907200, 1704067200)).toBe('25 days ago');
  });

  test('1 month ago - 26 days', () => {
    expect(timeago(1701820800, 1704067200)).toBe('1 month ago');
  });

  test('1 month ago - 45 days', () => {
    expect(timeago(1700179200, 1704067200)).toBe('1 month ago');
  });

  test('2 months ago - 46 days', () => {
    expect(timeago(1700092800, 1704067200)).toBe('2 months ago');
  });

  test('6 months ago', () => {
    expect(timeago(1688169600, 1704067200)).toBe('6 months ago');
  });

  test('10 months ago - 319 days', () => {
    expect(timeago(1676505600, 1704067200)).toBe('10 months ago');
  });

  test('1 year ago - 320 days', () => {
    expect(timeago(1676419200, 1704067200)).toBe('1 year ago');
  });

  test('1 year ago - 547 days', () => {
    expect(timeago(1656806400, 1704067200)).toBe('1 year ago');
  });

  test('2 years ago - 548 days', () => {
    expect(timeago(1656720000, 1704067200)).toBe('2 years ago');
  });

  test('5 years ago', () => {
    expect(timeago(1546300800, 1704067200)).toBe('5 years ago');
  });

  test('future - in just now (30 seconds)', () => {
    expect(timeago(1704067230, 1704067200)).toBe('just now');
  });

  test('future - in 1 minute', () => {
    expect(timeago(1704067260, 1704067200)).toBe('in 1 minute');
  });

  test('future - in 5 minutes', () => {
    expect(timeago(1704067500, 1704067200)).toBe('in 5 minutes');
  });

  test('future - in 1 hour', () => {
    expect(timeago(1704070200, 1704067200)).toBe('in 1 hour');
  });

  test('future - in 3 hours', () => {
    expect(timeago(1704078000, 1704067200)).toBe('in 3 hours');
  });

  test('future - in 1 day', () => {
    expect(timeago(1704150000, 1704067200)).toBe('in 1 day');
  });

  test('future - in 2 days', () => {
    expect(timeago(1704240000, 1704067200)).toBe('in 2 days');
  });

  test('future - in 1 month', () => {
    expect(timeago(1706745600, 1704067200)).toBe('in 1 month');
  });

  test('future - in 1 year', () => {
    expect(timeago(1735689600, 1704067200)).toBe('in 1 year');
  });
});

describe('duration', () => {
  test('zero seconds', () => {
    expect(duration(0)).toBe('0 seconds');
  });

  test('1 second', () => {
    expect(duration(1)).toBe('1 second');
  });

  test('45 seconds', () => {
    expect(duration(45)).toBe('45 seconds');
  });

  test('1 minute', () => {
    expect(duration(60)).toBe('1 minute');
  });

  test('1 minute 30 seconds', () => {
    expect(duration(90)).toBe('1 minute, 30 seconds');
  });

  test('2 minutes', () => {
    expect(duration(120)).toBe('2 minutes');
  });

  test('1 hour', () => {
    expect(duration(3600)).toBe('1 hour');
  });

  test('1 hour 1 minute', () => {
    expect(duration(3661)).toBe('1 hour, 1 minute');
  });

  test('1 hour 30 minutes', () => {
    expect(duration(5400)).toBe('1 hour, 30 minutes');
  });

  test('2 hours 30 minutes', () => {
    expect(duration(9000)).toBe('2 hours, 30 minutes');
  });

  test('1 day', () => {
    expect(duration(86400)).toBe('1 day');
  });

  test('1 day 2 hours', () => {
    expect(duration(93600)).toBe('1 day, 2 hours');
  });

  test('7 days', () => {
    expect(duration(604800)).toBe('7 days');
  });

  test('1 month (30 days)', () => {
    expect(duration(2592000)).toBe('1 month');
  });

  test('1 year (365 days)', () => {
    expect(duration(31536000)).toBe('1 year');
  });

  test('1 year 2 months', () => {
    expect(duration(36720000)).toBe('1 year, 2 months');
  });

  test('compact - 1h 1m', () => {
    expect(duration(3661, { compact: true })).toBe('1h 1m');
  });

  test('compact - 2h 30m', () => {
    expect(duration(9000, { compact: true })).toBe('2h 30m');
  });

  test('compact - 1d 2h', () => {
    expect(duration(93600, { compact: true })).toBe('1d 2h');
  });

  test('compact - 45s', () => {
    expect(duration(45, { compact: true })).toBe('45s');
  });

  test('compact - 0s', () => {
    expect(duration(0, { compact: true })).toBe('0s');
  });

  test('max_units 1 - hours only', () => {
    expect(duration(3661, { max_units: 1 })).toBe('1 hour');
  });

  test('max_units 1 - days only', () => {
    expect(duration(93600, { max_units: 1 })).toBe('1 day');
  });

  test('max_units 3', () => {
    expect(duration(93661, { max_units: 3 })).toBe('1 day, 2 hours, 1 minute');
  });

  test('compact max_units 1', () => {
    expect(duration(9000, { compact: true, max_units: 1 })).toBe('2h');
  });

  test('error - negative seconds', () => {
    expect(() => duration(-100)).toThrow();
  });
});

describe('parse_duration', () => {
  test('compact hours minutes', () => {
    expect(parse_duration('2h30m')).toBe(9000);
  });

  test('compact with space', () => {
    expect(parse_duration('2h 30m')).toBe(9000);
  });

  test('compact with comma', () => {
    expect(parse_duration('2h, 30m')).toBe(9000);
  });

  test('verbose', () => {
    expect(parse_duration('2 hours 30 minutes')).toBe(9000);
  });

  test('verbose with and', () => {
    expect(parse_duration('2 hours and 30 minutes')).toBe(9000);
  });

  test('verbose with comma and', () => {
    expect(parse_duration('2 hours, and 30 minutes')).toBe(9000);
  });

  test('decimal hours', () => {
    expect(parse_duration('2.5 hours')).toBe(9000);
  });

  test('decimal compact', () => {
    expect(parse_duration('1.5h')).toBe(5400);
  });

  test('single unit minutes verbose', () => {
    expect(parse_duration('90 minutes')).toBe(5400);
  });

  test('single unit minutes compact', () => {
    expect(parse_duration('90m')).toBe(5400);
  });

  test('single unit min', () => {
    expect(parse_duration('90min')).toBe(5400);
  });

  test('colon notation h:mm', () => {
    expect(parse_duration('2:30')).toBe(9000);
  });

  test('colon notation h:mm:ss', () => {
    expect(parse_duration('1:30:00')).toBe(5400);
  });

  test('colon notation with seconds', () => {
    expect(parse_duration('0:05:30')).toBe(330);
  });

  test('days verbose', () => {
    expect(parse_duration('2 days')).toBe(172800);
  });

  test('days compact', () => {
    expect(parse_duration('2d')).toBe(172800);
  });

  test('weeks verbose', () => {
    expect(parse_duration('1 week')).toBe(604800);
  });

  test('weeks compact', () => {
    expect(parse_duration('1w')).toBe(604800);
  });

  test('mixed verbose', () => {
    expect(parse_duration('1 day, 2 hours, and 30 minutes')).toBe(95400);
  });

  test('mixed compact', () => {
    expect(parse_duration('1d 2h 30m')).toBe(95400);
  });

  test('seconds only verbose', () => {
    expect(parse_duration('45 seconds')).toBe(45);
  });

  test('seconds compact s', () => {
    expect(parse_duration('45s')).toBe(45);
  });

  test('seconds compact sec', () => {
    expect(parse_duration('45sec')).toBe(45);
  });

  test('hours hr', () => {
    expect(parse_duration('2hr')).toBe(7200);
  });

  test('hours hrs', () => {
    expect(parse_duration('2hrs')).toBe(7200);
  });

  test('minutes mins', () => {
    expect(parse_duration('30mins')).toBe(1800);
  });

  test('case insensitive', () => {
    expect(parse_duration('2H 30M')).toBe(9000);
  });

  test('whitespace tolerance', () => {
    expect(parse_duration('  2 hours   30 minutes  ')).toBe(9000);
  });

  test('error - empty string', () => {
    expect(() => parse_duration('')).toThrow();
  });

  test('error - no units', () => {
    expect(() => parse_duration('hello world')).toThrow();
  });

  test('error - negative', () => {
    expect(() => parse_duration('-5 hours')).toThrow();
  });

  test('error - just number', () => {
    expect(() => parse_duration('42')).toThrow();
  });
});

describe('human_date', () => {
  // Reference: 2024-01-15 00:00:00 UTC (Monday) = timestamp 1705276800

  test('today', () => {
    expect(human_date(1705276800, 1705276800)).toBe('Today');
  });

  test('today - same day different time', () => {
    expect(human_date(1705320000, 1705276800)).toBe('Today');
  });

  test('yesterday', () => {
    expect(human_date(1705190400, 1705276800)).toBe('Yesterday');
  });

  test('tomorrow', () => {
    expect(human_date(1705363200, 1705276800)).toBe('Tomorrow');
  });

  test('last Sunday (1 day before Monday)', () => {
    expect(human_date(1705190400, 1705276800)).toBe('Yesterday');
  });

  test('last Saturday (2 days ago)', () => {
    expect(human_date(1705104000, 1705276800)).toBe('Last Saturday');
  });

  test('last Friday (3 days ago)', () => {
    expect(human_date(1705017600, 1705276800)).toBe('Last Friday');
  });

  test('last Thursday (4 days ago)', () => {
    expect(human_date(1704931200, 1705276800)).toBe('Last Thursday');
  });

  test('last Wednesday (5 days ago)', () => {
    expect(human_date(1704844800, 1705276800)).toBe('Last Wednesday');
  });

  test('last Tuesday (6 days ago)', () => {
    expect(human_date(1704758400, 1705276800)).toBe('Last Tuesday');
  });

  test('last Monday (7 days ago) - becomes date', () => {
    expect(human_date(1704672000, 1705276800)).toBe('January 8');
  });

  test('this Tuesday (1 day future)', () => {
    expect(human_date(1705363200, 1705276800)).toBe('Tomorrow');
  });

  test('this Wednesday (2 days future)', () => {
    expect(human_date(1705449600, 1705276800)).toBe('This Wednesday');
  });

  test('this Thursday (3 days future)', () => {
    expect(human_date(1705536000, 1705276800)).toBe('This Thursday');
  });

  test('this Sunday (6 days future)', () => {
    expect(human_date(1705795200, 1705276800)).toBe('This Sunday');
  });

  test('next Monday (7 days future) - becomes date', () => {
    expect(human_date(1705881600, 1705276800)).toBe('January 22');
  });

  test('same year different month', () => {
    expect(human_date(1709251200, 1705276800)).toBe('March 1');
  });

  test('same year end of year', () => {
    expect(human_date(1735603200, 1705276800)).toBe('December 31');
  });

  test('previous year', () => {
    expect(human_date(1672531200, 1705276800)).toBe('January 1, 2023');
  });

  test('next year', () => {
    expect(human_date(1736121600, 1705276800)).toBe('January 6, 2025');
  });
});

describe('date_range', () => {
  test('same day', () => {
    expect(date_range(1705276800, 1705276800)).toBe('January 15, 2024');
  });

  test('same day different times', () => {
    expect(date_range(1705276800, 1705320000)).toBe('January 15, 2024');
  });

  test('consecutive days same month', () => {
    expect(date_range(1705276800, 1705363200)).toBe('January 15–16, 2024');
  });

  test('same month range', () => {
    expect(date_range(1705276800, 1705881600)).toBe('January 15–22, 2024');
  });

  test('same year different months', () => {
    expect(date_range(1705276800, 1707955200)).toBe('January 15 – February 15, 2024');
  });

  test('different years', () => {
    expect(date_range(1703721600, 1705276800)).toBe('December 28, 2023 – January 15, 2024');
  });

  test('full year span', () => {
    expect(date_range(1704067200, 1735603200)).toBe('January 1 – December 31, 2024');
  });

  test('swapped inputs - should auto-correct', () => {
    expect(date_range(1705881600, 1705276800)).toBe('January 15–22, 2024');
  });

  test('multi-year span', () => {
    expect(date_range(1672531200, 1735689600)).toBe('January 1, 2023 – January 1, 2025');
  });
});
