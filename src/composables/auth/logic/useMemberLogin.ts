import { computed } from 'vue'

import { useLineContext } from '@/composables/auth/logic/useLineContext'
import { useLinkMember, useLoginOtp } from '@/composables/auth/useOtp'
import { useAuthStore } from '@/stores/auth.store'
import { useSignInStore } from '@/stores/sign-in.store'

/** Where the person goes once a verified code has been traded for a member */
export type MemberLoginOutcome = 'member' | 'register' | 'not-member'

/**
 * Step after a code is accepted: sign in with it, then link the LINE account to that member.
 * - sign-in fails: someone who pressed register carries on to the register step; anyone who pressed sign-in is not a member
 * - linking fails: not a member
 */
export function useMemberLogin() {
  const authStore = useAuthStore()
  const lineContext = useLineContext()
  const signInStore = useSignInStore()
  const loginOtp = useLoginOtp()
  const linkMember = useLinkMember()

  const isPending = computed(() => loginOtp.isPending.value || linkMember.isPending.value)

  async function complete(code: string): Promise<MemberLoginOutcome> {
    try {
      const { token } = await loginOtp.mutateAsync({
        ref_code: signInStore.refCode,
        otp_code: code,
      })
      // The link request is sent with this token
      authStore.setAuthenticated(token)
    } catch {
      return signInStore.action === 'register' ? 'register' : 'not-member'
    }

    try {
      const { line_id_token, ...context } = lineContext.read()
      if (!line_id_token) return 'not-member'

      const isPhone = signInStore.method === 'phone'
      const destination = signInStore.destination.replace(/^\+66/, '0')

      await linkMember.mutateAsync({
        action_type: 'line',
        email: isPhone ? null : destination,
        phone: isPhone ? destination : null,
        line_id_token,
        ...context,
      })
      return 'member'
    } catch {
      return 'not-member'
    }
  }

  return { isPending, complete }
}
