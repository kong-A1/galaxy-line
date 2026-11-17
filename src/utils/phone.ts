/**
 * Thai mobile number as typed: with the trunk 0 (10 digits) or without it (9 digits). Both are common, and
 * refusing a 0 would look like a bug, so it is kept; `toE164` drops it. A country code is stripped, so
 * "081-234-5678", "+66 81 234 5678", "+66 081 234 5678" and "66812345678" all work.
 */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '')

  // Only a full number carries the country code; "66" on its own is the start of a national number
  if (digits.length >= 11 && digits.startsWith('66')) digits = digits.slice(2)

  return digits.slice(0, digits.startsWith('0') ? 10 : 9)
}

/** "0812345678" -> "081-234-5678", "812345678" -> "81-234-5678" (formats as far as the digits go, so it works while typing) */
export function formatPhone(digits: string): string {
  const groups = digits.startsWith('0') ? [3, 3, 4] : [2, 3, 4]
  const parts: string[] = []
  let start = 0

  for (const size of groups) {
    parts.push(digits.slice(start, start + size))
    start += size
  }

  return parts.filter(Boolean).join('-')
}

/** Mobile numbers start with 6, 8 or 9 (after the optional trunk 0) and have 9 digits */
export function isValidPhone(digits: string): boolean {
  return /^0?[689]\d{8}$/.test(digits)
}

/** "0812345678" and "812345678" both become "+66812345678" */
export function toE164(digits: string): string {
  return `+66${digits.replace(/^0/, '')}`
}
