import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCheckSystemStatus } from '@/composables/system/useSystemStatus'
import { getSafeRedirect } from '@/utils/redirect'

/** "Try again" on the maintenance page: on success go back to where the person was heading, else say it is still down */
export function useMaintenanceRetry(homeRoute: string) {
  const route = useRoute()
  const router = useRouter()
  const check = useCheckSystemStatus()

  const stillDown = ref(false)
  const isChecking = computed(() => check.isPending.value)

  async function retry() {
    stillDown.value = false

    try {
      if (await check.mutateAsync()) {
        await router.replace(getSafeRedirect(route.query.redirect, homeRoute, ['/maintenance']))
        return
      }
    } catch {
      // Network error or timeout: same outcome as the system still being down
    }

    stillDown.value = true
  }

  return { isChecking, stillDown, retry }
}
