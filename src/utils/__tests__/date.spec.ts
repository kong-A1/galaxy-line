import { describe, expect, it } from 'vitest'

import { formatDateTime } from '../date'

describe('formatDateTime', () => {
  it('returns null when missing or invalid', () => {
    expect(formatDateTime(null, 'th')).toBeNull()
    expect(formatDateTime('', 'th')).toBeNull()
    expect(formatDateTime('not a date', 'en')).toBeNull()
  })

  it('formats in the active language', () => {
    const iso = '2026-11-05T11:00:00Z'

    expect(formatDateTime(iso, 'th')).toContain('2569')
    expect(formatDateTime(iso, 'en')).toContain('2026')
    expect(formatDateTime(iso, 'en')).toContain('November')
  })
})
