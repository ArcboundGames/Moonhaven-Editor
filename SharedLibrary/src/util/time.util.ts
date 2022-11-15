import { HOURS_IN_DAY, HOURS_IN_HALF_DAY, LENGTH_OF_HOUR, LENGTH_OF_MINUTE } from '../constants';

export function getTimeOfDay12Hour(time: number): { hours: number; minutes: number; ampm: string } {
  // eslint-disable-next-line prefer-const
  let { hours, minutes } = getTimeOfDay(time);

  let ampm = 'am';
  if (hours >= HOURS_IN_HALF_DAY) {
    hours %= HOURS_IN_HALF_DAY;
    ampm = 'pm';
  }

  return { hours, minutes, ampm };
}

export function getTimeOfDay(time: number): { hours: number; minutes: number } {
  let hours = Math.floor(time / LENGTH_OF_HOUR);
  const minutes = Math.floor((time - hours * LENGTH_OF_HOUR) / LENGTH_OF_MINUTE);

  if (hours >= HOURS_IN_DAY) {
    hours %= HOURS_IN_DAY;
  }

  return { hours, minutes };
}

export function formatTimeOfDay(time: number): string {
  const { hours, minutes, ampm } = getTimeOfDay12Hour(time);

  let hoursStr = hours >= 10 ? `${hours}` : `0${hours}`;
  if (hours == 0) {
    hoursStr = '12';
  }

  const minutesStr = minutes >= 10 ? `${minutes}` : `0${minutes}`;

  return `${hoursStr}:${minutesStr} ${ampm}`;
}
