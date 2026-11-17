import { describe, expect, it } from 'vitest'

import { formatPhone, isValidPhone, normalizePhone, toE164 } from '../phone'

describe('normalizePhone', () => {
  it.each([
    ['812345678', '812345678'],
    ['081-234-5678', '0812345678'],
    ['0812345678', '0812345678'],
    ['+66 81 234 5678', '812345678'],
    ['66812345678', '812345678'],
    ['+66 081-234-5678', '0812345678'],
    ['81-234-5678', '812345678'],
    ['0', '0'],
  ])('reads %s as %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it('does not mistake a national number starting with 66 for the country code', () => {
    expect(normalizePhone('66')).toBe('66')
    expect(normalizePhone('661234567')).toBe('661234567')
  })

  it('drops letters and caps the length (10 digits with a 0, 9 without)', () => {
    expect(normalizePhone('8a1b2')).toBe('812')
    expect(normalizePhone('81234567899999')).toBe('812345678')
    expect(normalizePhone('0812345678999')).toBe('0812345678')
  })
})

describe('formatPhone', () => {
  it('groups as 2-3-4 without a leading 0, while typing', () => {
    expect(formatPhone('')).toBe('')
    expect(formatPhone('8')).toBe('8')
    expect(formatPhone('81')).toBe('81')
    expect(formatPhone('812')).toBe('81-2')
    expect(formatPhone('81234')).toBe('81-234')
    expect(formatPhone('812345')).toBe('81-234-5')
    expect(formatPhone('812345678')).toBe('81-234-5678')
  })

  it('groups as 3-3-4 with a leading 0, while typing', () => {
    expect(formatPhone('0')).toBe('0')
    expect(formatPhone('081')).toBe('081')
    expect(formatPhone('0812')).toBe('081-2')
    expect(formatPhone('081234')).toBe('081-234')
    expect(formatPhone('0812345')).toBe('081-234-5')
    expect(formatPhone('0812345678')).toBe('081-234-5678')
  })
})

describe('isValidPhone', () => {
  it('accepts mobile numbers starting with 6, 8 or 9, with or without the 0', () => {
    expect(isValidPhone('812345678')).toBe(true)
    expect(isValidPhone('0812345678')).toBe(true)
    expect(isValidPhone('0912345678')).toBe(true)
    expect(isValidPhone('612345678')).toBe(true)
  })

  it('rejects other prefixes and wrong lengths', () => {
    expect(isValidPhone('712345678')).toBe(false)
    expect(isValidPhone('0712345678')).toBe(false)
    expect(isValidPhone('81234567')).toBe(false)
    expect(isValidPhone('081234567')).toBe(false)
    expect(isValidPhone('08123456789')).toBe(false)
    expect(isValidPhone('0')).toBe(false)
    expect(isValidPhone('')).toBe(false)
  })
})

describe('toE164', () => {
  it('adds the country code and drops the trunk 0', () => {
    expect(toE164('812345678')).toBe('+66812345678')
    expect(toE164('0812345678')).toBe('+66812345678')
  })
})
