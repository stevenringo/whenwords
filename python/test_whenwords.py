"""Tests for whenwords library."""

import pytest
from whenwords import timeago, duration, parse_duration, human_date, date_range, DurationOptions


class TestTimeago:
    def test_just_now_identical_timestamps(self):
        assert timeago(1704067200, 1704067200) == 'just now'

    def test_just_now_30_seconds_ago(self):
        assert timeago(1704067170, 1704067200) == 'just now'

    def test_just_now_44_seconds_ago(self):
        assert timeago(1704067156, 1704067200) == 'just now'

    def test_1_minute_ago_45_seconds(self):
        assert timeago(1704067155, 1704067200) == '1 minute ago'

    def test_1_minute_ago_89_seconds(self):
        assert timeago(1704067111, 1704067200) == '1 minute ago'

    def test_2_minutes_ago_90_seconds(self):
        assert timeago(1704067110, 1704067200) == '2 minutes ago'

    def test_30_minutes_ago(self):
        assert timeago(1704065400, 1704067200) == '30 minutes ago'

    def test_44_minutes_ago(self):
        assert timeago(1704064560, 1704067200) == '44 minutes ago'

    def test_1_hour_ago_45_minutes(self):
        assert timeago(1704064500, 1704067200) == '1 hour ago'

    def test_1_hour_ago_89_minutes(self):
        assert timeago(1704061860, 1704067200) == '1 hour ago'

    def test_2_hours_ago_90_minutes(self):
        assert timeago(1704061800, 1704067200) == '2 hours ago'

    def test_5_hours_ago(self):
        assert timeago(1704049200, 1704067200) == '5 hours ago'

    def test_21_hours_ago(self):
        assert timeago(1703991600, 1704067200) == '21 hours ago'

    def test_1_day_ago_22_hours(self):
        assert timeago(1703988000, 1704067200) == '1 day ago'

    def test_1_day_ago_35_hours(self):
        assert timeago(1703941200, 1704067200) == '1 day ago'

    def test_2_days_ago_36_hours(self):
        assert timeago(1703937600, 1704067200) == '2 days ago'

    def test_7_days_ago(self):
        assert timeago(1703462400, 1704067200) == '7 days ago'

    def test_25_days_ago(self):
        assert timeago(1701907200, 1704067200) == '25 days ago'

    def test_1_month_ago_26_days(self):
        assert timeago(1701820800, 1704067200) == '1 month ago'

    def test_1_month_ago_45_days(self):
        assert timeago(1700179200, 1704067200) == '1 month ago'

    def test_2_months_ago_46_days(self):
        assert timeago(1700092800, 1704067200) == '2 months ago'

    def test_6_months_ago(self):
        assert timeago(1688169600, 1704067200) == '6 months ago'

    def test_10_months_ago_319_days(self):
        assert timeago(1676505600, 1704067200) == '10 months ago'

    def test_1_year_ago_320_days(self):
        assert timeago(1676419200, 1704067200) == '1 year ago'

    def test_1_year_ago_547_days(self):
        assert timeago(1656806400, 1704067200) == '1 year ago'

    def test_2_years_ago_548_days(self):
        assert timeago(1656720000, 1704067200) == '2 years ago'

    def test_5_years_ago(self):
        assert timeago(1546300800, 1704067200) == '5 years ago'

    def test_future_in_just_now_30_seconds(self):
        assert timeago(1704067230, 1704067200) == 'just now'

    def test_future_in_1_minute(self):
        assert timeago(1704067260, 1704067200) == 'in 1 minute'

    def test_future_in_5_minutes(self):
        assert timeago(1704067500, 1704067200) == 'in 5 minutes'

    def test_future_in_1_hour(self):
        assert timeago(1704070200, 1704067200) == 'in 1 hour'

    def test_future_in_3_hours(self):
        assert timeago(1704078000, 1704067200) == 'in 3 hours'

    def test_future_in_1_day(self):
        assert timeago(1704150000, 1704067200) == 'in 1 day'

    def test_future_in_2_days(self):
        assert timeago(1704240000, 1704067200) == 'in 2 days'

    def test_future_in_1_month(self):
        assert timeago(1706745600, 1704067200) == 'in 1 month'

    def test_future_in_1_year(self):
        assert timeago(1735689600, 1704067200) == 'in 1 year'


class TestDuration:
    def test_zero_seconds(self):
        assert duration(0) == '0 seconds'

    def test_1_second(self):
        assert duration(1) == '1 second'

    def test_45_seconds(self):
        assert duration(45) == '45 seconds'

    def test_1_minute(self):
        assert duration(60) == '1 minute'

    def test_1_minute_30_seconds(self):
        assert duration(90) == '1 minute, 30 seconds'

    def test_2_minutes(self):
        assert duration(120) == '2 minutes'

    def test_1_hour(self):
        assert duration(3600) == '1 hour'

    def test_1_hour_1_minute(self):
        assert duration(3661) == '1 hour, 1 minute'

    def test_1_hour_30_minutes(self):
        assert duration(5400) == '1 hour, 30 minutes'

    def test_2_hours_30_minutes(self):
        assert duration(9000) == '2 hours, 30 minutes'

    def test_1_day(self):
        assert duration(86400) == '1 day'

    def test_1_day_2_hours(self):
        assert duration(93600) == '1 day, 2 hours'

    def test_7_days(self):
        assert duration(604800) == '7 days'

    def test_1_month_30_days(self):
        assert duration(2592000) == '1 month'

    def test_1_year_365_days(self):
        assert duration(31536000) == '1 year'

    def test_1_year_2_months(self):
        assert duration(36720000) == '1 year, 2 months'

    def test_compact_1h_1m(self):
        assert duration(3661, DurationOptions(compact=True)) == '1h 1m'

    def test_compact_2h_30m(self):
        assert duration(9000, DurationOptions(compact=True)) == '2h 30m'

    def test_compact_1d_2h(self):
        assert duration(93600, DurationOptions(compact=True)) == '1d 2h'

    def test_compact_45s(self):
        assert duration(45, DurationOptions(compact=True)) == '45s'

    def test_compact_0s(self):
        assert duration(0, DurationOptions(compact=True)) == '0s'

    def test_max_units_1_hours_only(self):
        assert duration(3661, DurationOptions(max_units=1)) == '1 hour'

    def test_max_units_1_days_only(self):
        assert duration(93600, DurationOptions(max_units=1)) == '1 day'

    def test_max_units_3(self):
        assert duration(93661, DurationOptions(max_units=3)) == '1 day, 2 hours, 1 minute'

    def test_compact_max_units_1(self):
        assert duration(9000, DurationOptions(compact=True, max_units=1)) == '2h'

    def test_error_negative_seconds(self):
        with pytest.raises(ValueError):
            duration(-100)


class TestParseDuration:
    def test_compact_hours_minutes(self):
        assert parse_duration('2h30m') == 9000

    def test_compact_with_space(self):
        assert parse_duration('2h 30m') == 9000

    def test_compact_with_comma(self):
        assert parse_duration('2h, 30m') == 9000

    def test_verbose(self):
        assert parse_duration('2 hours 30 minutes') == 9000

    def test_verbose_with_and(self):
        assert parse_duration('2 hours and 30 minutes') == 9000

    def test_verbose_with_comma_and(self):
        assert parse_duration('2 hours, and 30 minutes') == 9000

    def test_decimal_hours(self):
        assert parse_duration('2.5 hours') == 9000

    def test_decimal_compact(self):
        assert parse_duration('1.5h') == 5400

    def test_single_unit_minutes_verbose(self):
        assert parse_duration('90 minutes') == 5400

    def test_single_unit_minutes_compact(self):
        assert parse_duration('90m') == 5400

    def test_single_unit_min(self):
        assert parse_duration('90min') == 5400

    def test_colon_notation_h_mm(self):
        assert parse_duration('2:30') == 9000

    def test_colon_notation_h_mm_ss(self):
        assert parse_duration('1:30:00') == 5400

    def test_colon_notation_with_seconds(self):
        assert parse_duration('0:05:30') == 330

    def test_days_verbose(self):
        assert parse_duration('2 days') == 172800

    def test_days_compact(self):
        assert parse_duration('2d') == 172800

    def test_weeks_verbose(self):
        assert parse_duration('1 week') == 604800

    def test_weeks_compact(self):
        assert parse_duration('1w') == 604800

    def test_mixed_verbose(self):
        assert parse_duration('1 day, 2 hours, and 30 minutes') == 95400

    def test_mixed_compact(self):
        assert parse_duration('1d 2h 30m') == 95400

    def test_seconds_only_verbose(self):
        assert parse_duration('45 seconds') == 45

    def test_seconds_compact_s(self):
        assert parse_duration('45s') == 45

    def test_seconds_compact_sec(self):
        assert parse_duration('45sec') == 45

    def test_hours_hr(self):
        assert parse_duration('2hr') == 7200

    def test_hours_hrs(self):
        assert parse_duration('2hrs') == 7200

    def test_minutes_mins(self):
        assert parse_duration('30mins') == 1800

    def test_case_insensitive(self):
        assert parse_duration('2H 30M') == 9000

    def test_whitespace_tolerance(self):
        assert parse_duration('  2 hours   30 minutes  ') == 9000

    def test_error_empty_string(self):
        with pytest.raises(ValueError):
            parse_duration('')

    def test_error_no_units(self):
        with pytest.raises(ValueError):
            parse_duration('hello world')

    def test_error_negative(self):
        with pytest.raises(ValueError):
            parse_duration('-5 hours')

    def test_error_just_number(self):
        with pytest.raises(ValueError):
            parse_duration('42')


class TestHumanDate:
    # Reference: 2024-01-15 00:00:00 UTC (Monday) = timestamp 1705276800

    def test_today(self):
        assert human_date(1705276800, 1705276800) == 'Today'

    def test_today_same_day_different_time(self):
        assert human_date(1705320000, 1705276800) == 'Today'

    def test_yesterday(self):
        assert human_date(1705190400, 1705276800) == 'Yesterday'

    def test_tomorrow(self):
        assert human_date(1705363200, 1705276800) == 'Tomorrow'

    def test_last_sunday_1_day_before_monday(self):
        assert human_date(1705190400, 1705276800) == 'Yesterday'

    def test_last_saturday_2_days_ago(self):
        assert human_date(1705104000, 1705276800) == 'Last Saturday'

    def test_last_friday_3_days_ago(self):
        assert human_date(1705017600, 1705276800) == 'Last Friday'

    def test_last_thursday_4_days_ago(self):
        assert human_date(1704931200, 1705276800) == 'Last Thursday'

    def test_last_wednesday_5_days_ago(self):
        assert human_date(1704844800, 1705276800) == 'Last Wednesday'

    def test_last_tuesday_6_days_ago(self):
        assert human_date(1704758400, 1705276800) == 'Last Tuesday'

    def test_last_monday_7_days_ago_becomes_date(self):
        assert human_date(1704672000, 1705276800) == 'January 8'

    def test_this_tuesday_1_day_future(self):
        assert human_date(1705363200, 1705276800) == 'Tomorrow'

    def test_this_wednesday_2_days_future(self):
        assert human_date(1705449600, 1705276800) == 'This Wednesday'

    def test_this_thursday_3_days_future(self):
        assert human_date(1705536000, 1705276800) == 'This Thursday'

    def test_this_sunday_6_days_future(self):
        assert human_date(1705795200, 1705276800) == 'This Sunday'

    def test_next_monday_7_days_future_becomes_date(self):
        assert human_date(1705881600, 1705276800) == 'January 22'

    def test_same_year_different_month(self):
        assert human_date(1709251200, 1705276800) == 'March 1'

    def test_same_year_end_of_year(self):
        assert human_date(1735603200, 1705276800) == 'December 31'

    def test_previous_year(self):
        assert human_date(1672531200, 1705276800) == 'January 1, 2023'

    def test_next_year(self):
        assert human_date(1736121600, 1705276800) == 'January 6, 2025'


class TestDateRange:
    def test_same_day(self):
        assert date_range(1705276800, 1705276800) == 'January 15, 2024'

    def test_same_day_different_times(self):
        assert date_range(1705276800, 1705320000) == 'January 15, 2024'

    def test_consecutive_days_same_month(self):
        assert date_range(1705276800, 1705363200) == 'January 15–16, 2024'

    def test_same_month_range(self):
        assert date_range(1705276800, 1705881600) == 'January 15–22, 2024'

    def test_same_year_different_months(self):
        assert date_range(1705276800, 1707955200) == 'January 15 – February 15, 2024'

    def test_different_years(self):
        assert date_range(1703721600, 1705276800) == 'December 28, 2023 – January 15, 2024'

    def test_full_year_span(self):
        assert date_range(1704067200, 1735603200) == 'January 1 – December 31, 2024'

    def test_swapped_inputs_should_auto_correct(self):
        assert date_range(1705881600, 1705276800) == 'January 15–22, 2024'

    def test_multi_year_span(self):
        assert date_range(1672531200, 1735689600) == 'January 1, 2023 – January 1, 2025'
