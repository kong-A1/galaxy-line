import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useGoBack } from '@/composables/useGoBack'
import { useSignInStore } from '@/stores/sign-in.store'

export type SignInStep = 'request' | 'verify' | 'register'

/**
 * Sign-in is one page with two sections. The step lives in `?step=verify` so the browser's back button returns to
 * step 1, and a reload on step 2 without a code on its way falls back to step 1 instead of an empty form.
 */
export function useSignInStep() {
  const route = useRoute()
  const router = useRouter()
  const signInStore = useSignInStore()
  const goBackFromRequest = useGoBack('/auth/welcome')

  // Step 3 exists only for someone who pressed the register button, and only after the code was verified
  const step = computed<SignInStep>(() => {
    if (!signInStore.destination) return 'request'
    if (route.query.step === 'register') {
      return signInStore.action === 'register' && signInStore.verified ? 'register' : 'verify'
    }
    return route.query.step === 'verify' ? 'verify' : 'request'
  })

  watch(
    () => [route.query.step, signInStore.destination] as const,
    ([queryStep, destination]) => {
      if ((queryStep === 'verify' || queryStep === 'register') && !destination) {
        void router.replace({ query: {} })
      }
    },
    { immediate: true },
  )

  // The sections slide the way the person is going
  const direction = ref<'forward' | 'back'>('forward')
  const order: Record<SignInStep, number> = { request: 0, verify: 1, register: 2 }
  watch(step, (next, previous) => {
    direction.value = order[next] > order[previous] ? 'forward' : 'back'
  })

  function goToVerify() {
    void router.push({ query: { step: 'verify' } })
  }

  function goBack() {
    if (step.value === 'request') {
      goBackFromRequest()
      return
    }

    const previous = router.options.history.state.back
    if (typeof previous === 'string' && previous.startsWith(route.path)) router.back()
    else void router.replace({ path: route.path })
  }

  function goToRegister() {
    void router.push({ query: { step: 'register' } })
  }

  return { step, direction, goToVerify, goToRegister, goBack }
}
