/**
 * Formats an ISO date (`2026-08-23`) for display, e.g. "23 août 2026" / "Aug 23, 2026".
 * UTC keeps server and client output identical, so it never causes a hydration mismatch.
 */
export function formatDate(isoDate: string, language: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
