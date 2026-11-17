import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLinkMember, useLoginOtp } from '@/composables/auth/useOtp'
import { getLiffAccessToken } from '@/services/liff/liff'
import { useAuthStore } from '@/stores/auth.store'
import { usePdpaStore } from '@/stores/pdpa.store'
import { useSignInStore } from '@/stores/sign-in.store'

/** Where the person goes once a verified code has been traded for a member */
export type MemberLoginOutcome = 'member' | 'register' | 'not-member'

/**
 * Step after a code is accepted: sign in with it, then link the LINE account to that member.
 * - sign-in fails: someone who pressed register carries on to the register step; anyone who pressed sign-in is not a member
 * - linking fails: not a member
 */
export function useMemberLogin() {
  const { locale } = useI18n()
  const authStore = useAuthStore()
  const pdpa = usePdpaStore()
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
      const lineToken = getLiffAccessToken()
      if (!lineToken) return 'not-member'

      const isPhone = signInStore.method === 'phone'
      const destination = signInStore.destination.replace(/^\+66/, '0')

      await linkMember.mutateAsync({
        action_type: 'line',
        email: isPhone ? null : destination,
        phone: isPhone ? destination : null,
        line_id_token: lineToken,
        consent_pdpa_status: pdpa.consent?.privacy ?? false,
        consent_person_status: pdpa.consent?.terms ?? false,
        consent_news_status: pdpa.consent?.marketing ?? false,
        language: locale.value,
        ref_branch_code: localStorage.getItem('ref-branch-code') ?? '',
        entry_url: `https://liff.line.me/${import.meta.env.VITE_LIFF_ID}${localStorage.getItem('liff-state') ?? ''}`,
      })
      return 'member'
    } catch {
      return 'not-member'
    }
  }

  return { isPending, complete }
}
