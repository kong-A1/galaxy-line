import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useHomeSummary } from '@/composables/member/logic/useHomeSummary'

export type NotificationKind = 'points' | 'expiring' | 'tier'

/**
 * The notification list, built from what the member API already says about the member: the points balance, points about to
 * expire and how far the next tier is. There is no notification API yet, so there is nothing else to list and no time to show;
 * read/unread only lives on this screen (it starts unread again after a reload).
 * When a notification API arrives, replace `items` with its list; the shape the screen reads can stay.
 */
export function useNotifications() {
  const { t } = useI18n()
  const { points, expiring, tier } = useHomeSummary()
  const readKinds = ref(new Set<NotificationKind>())

  const items = computed(() => {
    const list: { id: NotificationKind; kind: NotificationKind; title: string; detail: string }[] =
      [
        {
          id: 'points',
          kind: 'points',
          title: t('app.notifications.points.title', { points: points.value }),
          detail: t('app.notifications.points.detail'),
        },
      ]

    if (expiring.value) {
      list.push({
        id: 'expiring',
        kind: 'expiring',
        title: t('app.notifications.expiring.title', { points: expiring.value.points }),
        detail: expiring.value.date
          ? t('app.notifications.expiring.detail', { date: expiring.value.date })
          : t('app.notifications.expiring.detailNoDate'),
      })
    }

    if (tier.value?.next && !tier.value.reached) {
      list.push({
        id: 'tier',
        kind: 'tier',
        title: t('app.notifications.tier.title', { tier: tier.value.next }),
        detail: t('app.notifications.tier.detail', { amount: tier.value.remaining }),
      })
    }

    return list.map((item) => ({ ...item, read: readKinds.value.has(item.id) }))
  })

  const unreadCount = computed(() => items.value.filter((item) => !item.read).length)

  function markRead(id: NotificationKind) {
    readKinds.value = new Set(readKinds.value).add(id)
  }

  function markAllRead() {
    readKinds.value = new Set(items.value.map((item) => item.id))
  }

  return { items, unreadCount, markRead, markAllRead }
}
