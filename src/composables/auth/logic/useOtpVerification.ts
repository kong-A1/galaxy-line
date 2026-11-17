import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCountdown } from '@/composables/useCountdown'
import { useRequestOtp, useVerifyOtp } from '@/composables/auth/useOtp'
import { OtpError } from '@/services/modules/auth/otp.service'
import { useSignInStore } from '@/stores/sign-in.store'
import { formatDestination, OTP_LENGTH, OTP_MAX_ATTEMPTS } from '@/utils/otp'

const RESEND_SECONDS = 59

/** Step 2 of sign-in: the code being typed, checking it, asking for a new one and the wait before that is allowed */
export function useOtpVerification() {
  const { t } = useI18n()
  const signInStore = useSignInStore()
  const countdown = useCountdown(RESEND_SECONDS)
  const verifyOtp = useVerifyOtp()
  const requestOtp = useRequestOtp()

  const code = ref('')
  const error = ref('')
  const notice = ref('')
  const isLocked = ref(false)
  // Wrong codes on this screen since the last code was sent; the backend's own count (if it sends one) also locks
  const failedAttempts = ref(0)

  const isVerifying = computed(() => verifyOtp.isPending.value)
  const isResending = computed(() => requestOtp.isPending.value)
  const isBusy = computed(() => isVerifying.value || isResending.value)

  const shownDestination = computed(() =>
    formatDestination(signInStore.method, signInStore.destination),
  )

  const refCode = computed(() => signInStore.refCode)

  const isWaiting = computed(() => countdown.isRunning.value && !isLocked.value)

  function startCountdown() {
    countdown.start()
  }

  /** Resolves true when the code was accepted. Otherwise `error` says why and the boxes are cleared. */
  async function verify(): Promise<boolean> {
    if (isLocked.value) return false

    error.value = ''
    notice.value = ''

    if (code.value.length < OTP_LENGTH) {
      error.value = t('auth.verify.incomplete')
      return false
    }

    try {
      await verifyOtp.mutateAsync({
        type: signInStore.method,
        otp_code: code.value,
        ref_code: signInStore.refCode,
      })
      return true
    } catch (err: unknown) {
      failedAttempts.value += 1

      if (
        (err instanceof OtpError && err.code === 'locked') ||
        failedAttempts.value >= OTP_MAX_ATTEMPTS
      ) {
        isLocked.value = true
        error.value = t('auth.verify.locked')
      } else {
        error.value = t('auth.verify.invalid')
      }
      code.value = ''
      return false
    }
  }

  /** Resolves true when a new code is on its way (the wait starts again and the boxes are cleared) */
  async function resend(): Promise<boolean> {
    error.value = ''
    notice.value = ''

    const payload = {
      action_type: 'line' as const,
      type: signInStore.method,
      value: signInStore.destination.replace(/^\+66/, '0'),
    }

    try {
      const { ref_code } = await requestOtp.mutateAsync(payload)
      signInStore.setRefCode(ref_code)
      isLocked.value = false
      failedAttempts.value = 0
      code.value = ''
      countdown.start()
      notice.value = t('auth.verify.resent')
      return true
    } catch {
      error.value = t('auth.verify.failed')
      return false
    }
  }

  return {
    code,
    error,
    notice,
    isVerifying,
    isResending,
    isBusy,
    isLocked,
    shownDestination,
    refCode,
    secondsLeft: countdown.remaining,
    isWaiting: isWaiting,
    startCountdown,
    verify,
    resend,
  }
}
