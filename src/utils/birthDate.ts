/** Digits only, at most "ddmmyyyy" */
export function normalizeBirthDate(input: string): string {
  return input.replace(/\D/g, '').slice(0, 8)
}

/** "01022000" -> "01/02/2000" (formats as far as the digits go, so it works while typing) */
export function formatBirthDate(digits: string): string {
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}

/** "dd/mm/yyyy" that is a real calendar day, not in the future, and not before 1900 */
export function isValidBirthDate(formatted: string, today = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted)
  if (!match) return false

  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  if (year < 1900) return false

  const date = new Date(year, month - 1, day)
  const isRealDay =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

  return isRealDay && date <= today
}
