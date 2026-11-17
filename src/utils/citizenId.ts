/** Digits only, at most 13 */
export function normalizeCitizenId(input: string): string {
  return input.replace(/\D/g, '').slice(0, 13)
}

/** "1234567890123" -> "1-2345-67890-12-3" (formats as far as the digits go, so it works while typing) */
export function formatCitizenId(digits: string): string {
  const groups = [1, 4, 5, 2, 1]
  const parts: string[] = []
  let start = 0

  for (const size of groups) {
    parts.push(digits.slice(start, start + size))
    start += size
  }

  return parts.filter(Boolean).join('-')
}

/** 13 digits whose last one is the check digit of the first twelve (weights 13 down to 2, mod 11) */
export function isValidCitizenId(digits: string): boolean {
  if (!/^\d{13}$/.test(digits)) return false

  const sum = [...digits.slice(0, 12)].reduce(
    (total, digit, i) => total + Number(digit) * (13 - i),
    0,
  )
  return (11 - (sum % 11)) % 10 === Number(digits[12])
}
