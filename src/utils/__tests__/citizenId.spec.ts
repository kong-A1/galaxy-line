import { describe, expect, it } from 'vitest'

import { formatCitizenId, isValidCitizenId, normalizeCitizenId } from '../citizenId'

describe('normalizeCitizenId', () => {
  it.each([
    ['1-2345-67890-12-3', '1234567890123'],
    ['12345678901234567', '1234567890123'],
    ['ab1 2', '12'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizeCitizenId(input)).toBe(expected)
  })
})

describe('formatCitizenId', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['12', '1-2'],
    ['123456', '1-2345-6'],
    ['1234567890123', '1-2345-67890-12-3'],
  ])('%s -> %s', (digits, expected) => {
    expect(formatCitizenId(digits)).toBe(expected)
  })
})

describe('isValidCitizenId', () => {
  it.each([
    ['1101700230678', true],
    ['3101000000013', true],
    ['1101700230673', false],
    ['1234567890123', false],
    ['110170023067', false],
    ['11017002306731', false],
    ['abcdefghijklm', false],
    ['', false],
  ])('%s -> %s', (value, expected) => {
    expect(isValidCitizenId(value)).toBe(expected)
  })
})
