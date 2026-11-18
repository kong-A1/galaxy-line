import { useI18n } from 'vue-i18n'

import { getLiffAccessToken } from '@/services/liff/liff'
import { usePdpaStore } from '@/stores/pdpa.store'

/**
 * What every request that ties a person to their LINE account sends along: the LINE token, the agreed terms, the
 * language, and where they came in from. Read it when sending, not when the page opens, so it is always current.
 */
export function useLineContext() {
  const { locale } = useI18n()
  const pdpa = usePdpaStore()

  function read() {
    return {
      line_id_token: getLiffAccessToken(),
      consent_pdpa_status: pdpa.consent?.privacy ?? false,
      consent_person_status: pdpa.consent?.terms ?? false,
      consent_news_status: pdpa.consent?.marketing ?? false,
      language: locale.value,
      ref_branch_code: localStorage.getItem('ref-branch-code') ?? '',
      entry_url: `https://liff.line.me/${import.meta.env.VITE_LIFF_ID}${localStorage.getItem('liff-state') ?? ''}`,
    }
  }

  return { read }
}
