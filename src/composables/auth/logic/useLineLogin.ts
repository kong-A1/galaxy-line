import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { ensureLiffLogin } from '@/services/liff/liff'
import { useLineSession } from '@/composables/auth/logic/useLineSession'

/** The LINE login button: starts LIFF login, or goes on to welcome when the person is already signed in */
export function useLineLogin() {
  const { t } = useI18n()
  const router = useRouter()
  const session = useLineSession()

  const isLoading = ref(false)
  const errorMessage = ref('')

  async function login() {
    errorMessage.value = ''
    isLoading.value = true

    try {
      // Not signed in yet: LINE takes over the page, and welcome picks up with the token when the person is back
      if (!ensureLiffLogin()) return

      if (await session.signIn()) {
        void router.push('/auth/welcome')
        return
      }
      errorMessage.value = session.errorMessage.value
    } catch (error: unknown) {
      errorMessage.value = error instanceof Error ? error.message : t('message.errorMessage')
    }

    isLoading.value = false
  }

  // Pressing the browser's back button after the LINE login page was opened can bring this page back from the browser's cache exactly as
  // it was left: the button still "loading" and the entrance animations replaying half way. Start it fresh instead.
  function onPageShow(event: PageTransitionEvent) {
    if (event.persisted) window.location.reload()
  }

  onMounted(() => window.addEventListener('pageshow', onPageShow))
  onBeforeUnmount(() => window.removeEventListener('pageshow', onPageShow))

  return { isLoading, errorMessage, login }
}
