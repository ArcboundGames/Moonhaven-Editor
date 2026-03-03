import { getTimeOfDay, getTimeOfDay12Hour, formatTimeOfDay } from '../util/time.util';

// Constants from the codebase:
// DAY_LENGTH = 1080, HOURS_IN_DAY = 24, MINUTES_IN_HOUR = 60
// LENGTH_OF_HOUR = 1080 / 24 = 45
// LENGTH_OF_MINUTE = 45 / 60 = 0.75

describe('time.util', () => {
  describe('getTimeOfDay', () => {
    test('returns 0 hours and 0 minutes for time 0', () => {
      expect(getTimeOfDay(0)).toEqual({ hours: 0, minutes: 0 });
    });

    test('returns correct hours for exact hour values', () => {
      // 1 hour = 45 ticks
      expect(getTimeOfDay(45)).toEqual({ hours: 1, minutes: 0 });
      expect(getTimeOfDay(90)).toEqual({ hours: 2, minutes: 0 });
      expect(getTimeOfDay(540)).toEqual({ hours: 12, minutes: 0 });
    });

    test('returns correct minutes', () => {
      // 1 minute = 0.75 ticks, so 30 minutes = 22.5 ticks
      // getTimeOfDay(22) => hours=0, minutes=Math.floor(22/0.75)=29
      expect(getTimeOfDay(22)).toEqual({ hours: 0, minutes: 29 });
    });

    test('wraps hours past 24', () => {
      // 24 hours = 1080, so 1080 should wrap to 0
      expect(getTimeOfDay(1080)).toEqual({ hours: 0, minutes: 0 });
    });

    test('handles mid-day time', () => {
      // 9 AM = 45 * 9 = 405
      expect(getTimeOfDay(405)).toEqual({ hours: 9, minutes: 0 });
    });
  });

  describe('getTimeOfDay12Hour', () => {
    test('returns AM for morning hours', () => {
      // 9 AM = 405
      expect(getTimeOfDay12Hour(405)).toEqual({ hours: 9, minutes: 0, ampm: 'am' });
    });

    test('returns PM for afternoon hours', () => {
      // 1 PM = 45 * 13 = 585
      expect(getTimeOfDay12Hour(585)).toEqual({ hours: 1, minutes: 0, ampm: 'pm' });
    });

    test('returns PM for noon', () => {
      // 12 PM = 45 * 12 = 540
      expect(getTimeOfDay12Hour(540)).toEqual({ hours: 0, minutes: 0, ampm: 'pm' });
    });

    test('returns AM for midnight', () => {
      expect(getTimeOfDay12Hour(0)).toEqual({ hours: 0, minutes: 0, ampm: 'am' });
    });

    test('returns AM for 11 AM', () => {
      // 11 AM = 45 * 11 = 495
      expect(getTimeOfDay12Hour(495)).toEqual({ hours: 11, minutes: 0, ampm: 'am' });
    });
  });

  describe('formatTimeOfDay', () => {
    test('formats midnight', () => {
      expect(formatTimeOfDay(0)).toBe('12:00 am');
    });

    test('formats 9 AM', () => {
      // 9 AM = 405
      expect(formatTimeOfDay(405)).toBe('09:00 am');
    });

    test('formats noon', () => {
      // 12 PM = 540
      // getTimeOfDay12Hour(540) => hours=0, so hoursStr='12', ampm='pm'
      expect(formatTimeOfDay(540)).toBe('12:00 pm');
    });

    test('formats 5 PM', () => {
      // 5 PM = 45 * 17 = 765
      expect(formatTimeOfDay(765)).toBe('05:00 pm');
    });

    test('formats time with minutes', () => {
      // 9:30 AM = 405 + 22.5 = 427.5 => Math.floor(427.5) = 427
      // hours = Math.floor(427/45) = 9, minutes = Math.floor((427 - 405)/0.75) = Math.floor(29.33) = 29
      expect(formatTimeOfDay(427)).toBe('09:29 am');
    });
  });
});
