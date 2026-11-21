export type TierStatusInput = {
  /** Tier after the current one; null / empty when the member is already on the top tier */
  nextTier: { name: string; threshold: number } | null
  spend: number
  /** Last day the tier is held; null for a tier that never expires */
  tierExpiryDate: string | null
  spendThisPeriod: number
  /** Spending needed this period to keep the top tier; null / 0 when the tier has no yearly requirement */
  maintainThreshold: number | null
}

export type TierStatus =
  | { kind: 'climbing'; remaining: number; percent: number }
  // Spending already passed the next tier's threshold but the tier has not been updated yet
  | { kind: 'reached'; percent: 100 }
  | { kind: 'max'; showExpiry: boolean }
  | { kind: 'maintain'; remaining: number; percent: number }

const clampPercent = (value: number, total: number) =>
  total > 0 ? Math.min(Math.max(value / total, 0), 1) * 100 : 0

/** True when the date is a real, parseable day (a missing or invalid date means the tier does not expire) */
export const hasExpiry = (date: string | null | undefined): date is string =>
  !!date && !Number.isNaN(new Date(date).getTime())

/** Decides which of the tier card's states applies. The top tier is "no next tier", never a tier name */
export function resolveTierStatus(input: TierStatusInput): TierStatus {
  const { nextTier } = input
  const spend = Math.max(Number(input.spend) || 0, 0)

  if (nextTier) {
    const remaining = nextTier.threshold - spend
    // Never show "0 baht more" or a negative figure once the threshold is passed
    if (remaining <= 0) return { kind: 'reached', percent: 100 }
    return { kind: 'climbing', remaining, percent: clampPercent(spend, nextTier.threshold) }
  }

  const maintain = Number(input.maintainThreshold) || 0
  const period = Math.max(Number(input.spendThisPeriod) || 0, 0)
  if (maintain > 0 && hasExpiry(input.tierExpiryDate) && period < maintain) {
    return {
      kind: 'maintain',
      remaining: maintain - period,
      percent: clampPercent(period, maintain),
    }
  }

  return { kind: 'max', showExpiry: hasExpiry(input.tierExpiryDate) }
}
