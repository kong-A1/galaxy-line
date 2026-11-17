/** Letters and digits only, upper case, at most 9 */
export function normalizePassport(input: string): string {
  return input
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 9)
}

/** Passport numbers differ by country; 6 to 9 letters or digits covers them without guessing a country's pattern */
export function isValidPassport(value: string): boolean {
  return /^[A-Z0-9]{6,9}$/.test(value)
}
