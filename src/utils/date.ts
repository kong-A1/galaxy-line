/** "5 พฤศจิกายน 2569 เวลา 18:00" / "5 November 2026 at 18:00"; null when missing or not a valid date */
export function formatDateTime(value: string | null | undefined, locale: string): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}
