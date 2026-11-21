import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMember } from '@/composables/member/useMember'
import { resolveTierStatus } from '@/utils/memberTier'

/** What the home screen shows about the member: name, card, points and progress to the next tier */
export function useHomeSummary() {
  const { locale } = useI18n()
  const { data: member, isPending, isError, error, refetch } = useMember()

  const number = computed(() => new Intl.NumberFormat(locale.value))
  const format = (value: number | string | null | undefined) =>
    number.value.format(Number(value) || 0)

  // Short day, e.g. "31 ธ.ค. 2569" (the Thai locale counts years in the Buddhist era)
  const dateFormat = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short', year: 'numeric' }),
  )

  const fullName = computed(() => {
    const profile = member.value?.member_profile
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''
  })

  const tier = computed(() => {
    const info = member.value?.member_tier
    if (!info) return null

    // `limit_tier` is read as the spending needed to reach the next tier (to be confirmed with the API owner)
    const threshold = Number(info.limit_tier) || 0
    const spend = Number(info.total_spending) || 0
    // No next tier = the member is on the top tier. The API may leave the name empty or repeat the current tier there
    const nextName = info.next_tier_name?.trim() ?? ''
    const next =
      nextName && nextName.toLowerCase() !== String(info.tier_code).trim().toLowerCase()
        ? nextName
        : null
    const status = resolveTierStatus({
      nextTier: next ? { name: next, threshold } : null,
      spend,
      tierExpiryDate: info.tier_end_date || null,
      // The API gives no per-period figure or maintain requirement yet, so the "maintain" state stays off until it does
      spendThisPeriod: spend,
      maintainThreshold: null,
    })

    return {
      current: info.tier_code,
      next,
      threshold,
      spend,
      expiryDate: info.tier_end_date || null,
      spendThisPeriod: spend,
      maintainThreshold: null as number | null,
      remaining: format(status.kind === 'climbing' ? status.remaining : 0),
      // Spending has passed the next tier but the tier is not updated yet
      reached: status.kind === 'reached',
    }
  })

  return {
    member,
    isPending,
    isError,
    error,
    refetch,
    fullName,
    points: computed(() => format(member.value?.member_profile.point_balance)),
    // Points that expire first, with the day they do; null when nothing is about to expire
    expiring: computed(() => {
      const expiring = member.value?.member_profile.earliest_point_expired
      if (!expiring?.point) return null

      const day = new Date(expiring.expiration_date)
      return {
        points: format(expiring.point),
        date: Number.isNaN(day.getTime()) ? null : dateFormat.value.format(day),
      }
    }),
    tier,
  }
}
