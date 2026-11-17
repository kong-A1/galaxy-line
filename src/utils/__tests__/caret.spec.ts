import { describe, expect, it } from 'vitest'

import { caretPosition } from '../caret'

describe('caretPosition', () => {
  it.each([
    ['033-439-980', 0, 0],
    ['033-439-980', 2, 2],
    ['033-439-980', 3, 3],
    ['033-439-980', 4, 5],
    ['033-439-980', 9, 11],
    ['033-439-980', 20, 11],
    ['', 3, 0],
  ])('%s with %i digits to the left -> %i', (formatted, digits, expected) => {
    expect(caretPosition(formatted, digits)).toBe(expected)
  })
})
