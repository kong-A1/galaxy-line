import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLoginWithLine } from '@/composables/auth/useAuth'
import { getLiffAccessToken } from '@/services/liff/liff'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Trades the LINE token for the backend's own token.
 * Call `signIn()` as soon as LINE has signed the person in (whether they just came back from LINE or were already signed in).
 */
export function useLineSession() {
  const { t } = useI18n()
  const authStore = useAuthStore()
  const loginWithLine = useLoginWithLine()

  const errorMessage = ref('')
  const isLoading = computed(() => loginWithLine.isPending.value)

  /** Resolves true when the backend token is stored (new or from an earlier visit); false when it could not be got */
  async function signIn(): Promise<boolean> {
    if (authStore.hasToken()) return true

    errorMessage.value = ''

    try {
      const accessToken = getLiffAccessToken()
      if (!accessToken) throw new Error('LINE Access Token is unavailable')

      const response = await loginWithLine.mutateAsync({
        line_id_token: accessToken,
        ref_branch_code: localStorage.getItem('ref-branch-code'),
        entry_url: `https://liff.line.me/${import.meta.env.VITE_LIFF_ID}${localStorage.getItem('liff-state') ?? ''}`,
      })

      if (!response.status) throw new Error('Backend authentication failed')

      authStore.setAuthenticated(response.access_token)
      return true
    } catch (error: unknown) {
      authStore.setUnauthenticated()
      errorMessage.value = error instanceof Error ? error.message : t('message.errorMessage')
      return false
    }
  }

  return { isLoading, errorMessage, signIn }
}
