import type { SignInMethod } from '@/types/auth/auth.type'

export const OTP_LENGTH = 6

export const OTP_MAX_ATTEMPTS = 3

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * What typing, pasting or an autofilled code does to the boxes. Pure, so the rules can be tested:
 * - typing over a filled box arrives as two characters (old + new) and keeps only the new one
 * - several characters (paste, SMS autofill) spread from this box onwards
 * - emptying a box leaves a hole instead of shifting the rest
 * `focusIndex` is the box that should be focused next.
 */
export function applyOtpInput(
  current: string[],
  index: number,
  raw: string,
  length = OTP_LENGTH,
): { digits: string[]; focusIndex: number } {
  const digits = Array.from({ length }, (_, i) => current[i] ?? '')
  let typed = digitsOnly(raw)

  if (typed === '') {
    digits[index] = ''
    return { digits, focusIndex: index }
  }

  const old = digits[index]
  if (old && typed.length === 2 && typed.includes(old)) {
    typed = typed.replace(old, '')
  }

  for (let offset = 0; offset < typed.length && index + offset < length; offset++) {
    digits[index + offset] = typed[offset] as string
  }

  return { digits, focusIndex: Math.min(index + typed.length, length - 1) }
}

/** "+66812345678" -> "081-234-5678" (the way people write it); an email is shown as it is */
export function formatDestination(method: SignInMethod, destination: string): string {
  if (method === 'email') return destination

  const national = destination.replace(/^\+66/, '')
  const local = `0${national}`

  return [local.slice(0, 3), local.slice(3, 6), local.slice(6, 10)].filter(Boolean).join('-')
}
