/** Where the caret belongs in a formatted number once `digitCount` digits are to its left (the dashes do not count) */
export function caretPosition(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0

  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) seen++
    if (seen === digitCount) return i + 1
  }

  return formatted.length
}
