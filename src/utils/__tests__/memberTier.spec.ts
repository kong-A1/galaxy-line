import { describe, expect, it } from 'vitest'

import { resolveTierStatus, type TierStatusInput } from '../memberTier'

const base: TierStatusInput = {
  nextTier: { name: 'Diamond', threshold: 20000 },
  spend: 12450,
  tierExpiryDate: '2027-01-14',
  spendThisPeriod: 0,
  maintainThreshold: null,
}

describe('resolveTierStatus', () => {
  it('climbs towards the next tier', () => {
    const status = resolveTierStatus(base)
    expect(status).toMatchObject({ kind: 'climbing', remaining: 7550 })
    expect(status).toHaveProperty('percent', expect.closeTo(62.25, 5))
  })

  it('starts at 0% with nothing spent', () => {
    expect(resolveTierStatus({ ...base, spend: 0 })).toEqual({
      kind: 'climbing',
      remaining: 20000,
      percent: 0,
    })
  })

  it('never shows 0 or a negative amount once the threshold is passed', () => {
    expect(resolveTierStatus({ ...base, spend: 20000 }).kind).toBe('reached')
    expect(resolveTierStatus({ ...base, spend: 25000 }).kind).toBe('reached')
  })

  it('is the top tier when there is no next tier, with an expiry row', () => {
    expect(resolveTierStatus({ ...base, nextTier: null })).toEqual({
      kind: 'max',
      showExpiry: true,
    })
  })

  it('hides the expiry row for a tier that never expires', () => {
    expect(resolveTierStatus({ ...base, nextTier: null, tierExpiryDate: null })).toEqual({
      kind: 'max',
      showExpiry: false,
    })
    expect(resolveTierStatus({ ...base, nextTier: null, tierExpiryDate: 'nope' })).toEqual({
      kind: 'max',
      showExpiry: false,
    })
  })

  it('asks to maintain the tier while this period is below the requirement', () => {
    expect(
      resolveTierStatus({
        ...base,
        nextTier: null,
        spendThisPeriod: 5000,
        maintainThreshold: 20000,
      }),
    ).toEqual({ kind: 'maintain', remaining: 15000, percent: 25 })
  })

  it('is plain max once the maintain requirement is met', () => {
    expect(
      resolveTierStatus({
        ...base,
        nextTier: null,
        spendThisPeriod: 20000,
        maintainThreshold: 20000,
      }).kind,
    ).toBe('max')
  })
})
