import type { ClockCity } from './data';

export type CityView = ClockCity & {
  /** Local time as fractional hours, `0 <= hours < 24`. */
  hours: number;
  hour: number;
  minute: number;
  /** Offset from UTC, in minutes. */
  offsetMin: number;
  isDay: boolean;
  /** Local solar hours; `sunset` may exceed 24 or `sunrise` be negative, keep them unwrapped. */
  sunrise: number;
  sunset: number;
  /** Whole-day length of daylight in hours (0 to 24). */
  dayLength: number;
  isHome: boolean;
  /** Offset from the home city, in hours (can be fractional). */
  deltaHours: number;
  /** -1, 0 or +1: the calendar day relative to the home city. */
  dayShift: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function zonedParts(date: Date, timeZone: string) {
  const parts = formatterFor(timeZone).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const hour = get('hour') % 24;
  const minute = get('minute');
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), hour, minute, get('second'));
  const offsetMin = Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  return { hour, minute, offsetMin, dayNumber: Math.floor(asUtc / 86_400_000) };
}

const RAD = Math.PI / 180;

/** Sunrise and sunset in local hours from a low-precision solar model (good to a few minutes). */
function solar(date: Date, lat: number, lon: number, offsetMin: number) {
  const dayOfYear = Math.floor(
    (date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86_400_000,
  );
  const declination = 23.44 * RAD * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);
  const cosHour = -Math.tan(lat * RAD) * Math.tan(declination);
  const halfDay = Math.acos(Math.min(1, Math.max(-1, cosHour))) / RAD / 15;
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const noon = 12 + offsetMin / 60 - lon / 15 - equationOfTime / 60;
  return { sunrise: noon - halfDay, sunset: noon + halfDay, dayLength: halfDay * 2 };
}

export function buildViews(cities: ClockCity[], homeId: string, now: Date): CityView[] {
  const home = cities.find((city) => city.id === homeId) ?? cities[0];
  const homeParts = zonedParts(now, home.timeZone);

  return cities.map((city) => {
    const parts = zonedParts(now, city.timeZone);
    const hours = parts.hour + parts.minute / 60;
    const sun = solar(now, city.lat, city.lon, parts.offsetMin);
    const sinceSunrise = (((hours - sun.sunrise) % 24) + 24) % 24;

    return {
      ...city,
      ...sun,
      hours,
      hour: parts.hour,
      minute: parts.minute,
      offsetMin: parts.offsetMin,
      isDay: sinceSunrise < sun.dayLength,
      isHome: city.id === home.id,
      deltaHours: (parts.offsetMin - homeParts.offsetMin) / 60,
      dayShift: Math.sign(parts.dayNumber - homeParts.dayNumber),
    };
  });
}

const MINUS = '−';

export function formatUtc(offsetMin: number) {
  const sign = offsetMin < 0 ? MINUS : '+';
  const abs = Math.abs(offsetMin);
  const minutes = abs % 60;
  return `UTC${sign}${Math.floor(abs / 60)}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
}

export function formatDelta(deltaHours: number) {
  const abs = Math.abs(deltaHours);
  const value = Number.isInteger(abs) ? String(abs) : abs.toFixed(1).replace(/\.0$/, '');
  return `${deltaHours < 0 ? MINUS : '+'}${value} h`;
}

export function to12h(hour: number) {
  return { hour12: hour % 12 || 12, meridiem: hour < 12 ? 'AM' : 'PM' } as const;
}

export function formatTime(view: Pick<CityView, 'hour' | 'minute'>) {
  const { hour12, meridiem } = to12h(view.hour);
  return `${hour12}:${String(view.minute).padStart(2, '0')} ${meridiem}`;
}

export function describeOffset(view: CityView) {
  if (view.isHome) return 'Home';
  const hours = Math.abs(view.deltaHours);
  const relation = view.deltaHours < 0 ? 'behind' : 'ahead';
  return `${hours} h ${relation}`;
}
