import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMember } from '@/composables/member/useMember'

/** What the home screen shows about the member: name, card, points and progress to the next tier */
export function useHomeSummary() {
  const { locale } = useI18n()
  const { data: member, isPending, isError, error, refetch } = useMember()

  const number = computed(() => new Intl.NumberFormat(locale.value))
  const format = (value: number | string | null | undefined) =>
    number.value.format(Number(value) || 0)

  const fullName = computed(() => {
    const profile = member.value?.member_profile
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''
  })

  const tier = computed(() => {
    const info = member.value?.member_tier
    if (!info) return null

    // `limit_tier` is read as the spending needed to reach the next tier (to be confirmed with the API owner)
    const target = Number(info.limit_tier) || 0
    const spent = Number(info.total_spending) || 0
    const remaining = Math.max(target - spent, 0)

    return {
      current: info.tier_code,
      next: info.next_tier_name,
      remaining: format(remaining),
      spent: format(Math.min(spent, target)),
      target: format(target),
      percent: target > 0 ? Math.min(Math.round((spent / target) * 100), 100) : 0,
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
    // Points that expire first; null when nothing is about to expire
    expiringPoints: computed(() => {
      const expiring = member.value?.member_profile.earliest_point_expired
      return expiring?.point ? format(expiring.point) : null
    }),
    tier,
  }
}
