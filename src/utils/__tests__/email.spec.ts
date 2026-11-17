import { describe, expect, it } from 'vitest'

import { isValidEmail } from '../email'

describe('isValidEmail', () => {
  it('accepts ordinary addresses, ignoring surrounding spaces', () => {
    expect(isValidEmail('name@example.com')).toBe(true)
    expect(isValidEmail('  a.b+c@mail.co.th ')).toBe(true)
  })

  it.each(['', 'name', 'name@', '@example.com', 'name@example', 'na me@example.com'])(
    'rejects %j',
    (value) => {
      expect(isValidEmail(value)).toBe(false)
    },
  )
})
