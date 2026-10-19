export type ClockCity = {
  id: string;
  name: string;
  /** Short label printed next to its marker on the dial. */
  short: string;
  /** IANA time zone; DST is handled by `Intl`. */
  timeZone: string;
  lat: number;
  lon: number;
};

export const DEFAULT_CITIES: ClockCity[] = [
  {
    id: 'nyc',
    name: 'New York',
    short: 'NYC',
    timeZone: 'America/New_York',
    lat: 40.71,
    lon: -74.01,
  },
  {
    id: 'sf',
    name: 'San Francisco',
    short: 'SF',
    timeZone: 'America/Los_Angeles',
    lat: 37.77,
    lon: -122.42,
  },
  { id: 'lon', name: 'London', short: 'LON', timeZone: 'Europe/London', lat: 51.51, lon: -0.13 },
  { id: 'tyo', name: 'Tokyo', short: 'TYO', timeZone: 'Asia/Tokyo', lat: 35.68, lon: 139.69 },
];

export const DEFAULT_HOME_ID = 'nyc';
