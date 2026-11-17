import { describe, expect, it } from 'vitest'

import { formatBirthDate, isValidBirthDate, normalizeBirthDate } from '../birthDate'

const today = new Date(2026, 10, 7)

describe('normalizeBirthDate', () => {
  it.each([
    ['01/02/2000', '01022000'],
    ['0102200099', '01022000'],
    ['ab1c', '1'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizeBirthDate(input)).toBe(expected)
  })
})

describe('formatBirthDate', () => {
  it.each([
    ['', ''],
    ['0', '0'],
    ['010', '01/0'],
    ['01022', '01/02/2'],
    ['01022000', '01/02/2000'],
  ])('%s -> %s', (digits, expected) => {
    expect(formatBirthDate(digits)).toBe(expected)
  })
})

describe('isValidBirthDate', () => {
  it.each([
    ['01/02/2000', true],
    ['29/02/2000', true],
    ['07/11/2026', true],
    ['29/02/2001', false],
    ['31/04/2000', false],
    ['00/01/2000', false],
    ['01/13/2000', false],
    ['08/11/2026', false],
    ['01/01/1899', false],
    ['01/02/200', false],
    ['', false],
  ])('%s -> %s', (value, expected) => {
    expect(isValidBirthDate(value, today)).toBe(expected)
  })
})
