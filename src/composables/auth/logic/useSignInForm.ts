import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRequestOtp } from '@/composables/auth/useOtp'
import { useSignInStore } from '@/stores/sign-in.store'
import { isValidEmail } from '@/utils/email'
import { isValidPhone, toE164 } from '@/utils/phone'

import type { SignInMethod } from '@/types/auth/auth.type'

/** Step 1 of sign-in: which way the code is sent, what was typed, whether it is valid, and sending the request */
export function useSignInForm() {
  const { t } = useI18n()
  const signInStore = useSignInStore()
  const requestOtp = useRequestOtp()

  const method = ref<SignInMethod>(signInStore.destination ? signInStore.method : 'phone')
  const values = ref<Record<SignInMethod, string>>({
    phone: signInStore.method === 'phone' ? signInStore.destination.replace(/^\+66/, '0') : '',
    email: signInStore.method === 'email' ? signInStore.destination : '',
  })

  const isReturning = Boolean(signInStore.destination)
  const touched = ref(false)
  const requestError = ref('')

  const value = computed({
    get: () => values.value[method.value],
    set: (next: string) => {
      values.value[method.value] = next
    },
  })

  const isValid = computed(() =>
    method.value === 'phone' ? isValidPhone(value.value) : isValidEmail(value.value),
  )

  const validationError = computed(() => {
    if (!touched.value || isValid.value) return ''
    return t(method.value === 'phone' ? 'auth.signIn.phoneError' : 'auth.signIn.emailError')
  })
  const error = computed(() => requestError.value || validationError.value)
  const isSubmitting = computed(() => requestOtp.isPending.value)

  watch(method, () => {
    touched.value = false
    requestError.value = ''
  })

  watch(value, () => {
    requestError.value = ''
  })

  function markTouched() {
    touched.value = true
  }

  /** Resolves true when the code is on its way; false when the input is not valid or the request failed */
  async function submit(): Promise<boolean> {
    touched.value = true
    if (!isValid.value) return false

    const destination = method.value === 'phone' ? toE164(value.value) : value.value.trim()
    requestError.value = ''

    const payload = {
      action_type: 'line' as const,
      type: method.value,
      value: destination.replace(/^\+66/, '0'),
    }

    try {
      const { ref_code } = await requestOtp.mutateAsync(payload)
      signInStore.setOtpRequest(method.value, destination, ref_code)
      return true
    } catch {
      requestError.value = t('auth.signIn.requestFailed')
      return false
    }
  }

  return { method, value, isValid, error, isSubmitting, isReturning, markTouched, submit }
}
