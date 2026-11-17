import { describe, expect, it } from 'vitest'

import { isValidPassport, normalizePassport } from '../passport'

describe('normalizePassport', () => {
  it.each([
    ['ab 123-456', 'AB123456'],
    ['aa1234567890', 'AA1234567'],
    ['', ''],
  ])('%s -> %s', (input, expected) => {
    expect(normalizePassport(input)).toBe(expected)
  })
})

describe('isValidPassport', () => {
  it.each([
    ['AB123456', true],
    ['123456789', true],
    ['AB123', false],
    ['AB1234567890', false],
    ['ab123456', false],
    ['', false],
  ])('%s -> %s', (value, expected) => {
    expect(isValidPassport(value)).toBe(expected)
  })
})
