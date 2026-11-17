import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Bump when the terms or the privacy notice change in a way people must agree to again:
 * anyone who accepted an older version is asked once more.
 */
export const PDPA_VERSION = '1.0'
export const PDPA_STORAGE_KEY = 'pdpa-consent'

export interface PdpaConsent {
  version: string
  acceptedAt: string
  terms: boolean
  privacy: boolean
  marketing: boolean
}

// localStorage can throw (private mode, blocked site data): treat that as "nothing stored" and carry on
function loadConsent(): PdpaConsent | null {
  try {
    const raw = localStorage.getItem(PDPA_STORAGE_KEY)
    const stored = raw ? (JSON.parse(raw) as Partial<PdpaConsent> | null) : null
    if (typeof stored?.version !== 'string') return null

    return {
      version: stored.version,
      acceptedAt: typeof stored.acceptedAt === 'string' ? stored.acceptedAt : '',
      terms: stored.terms === true,
      privacy: stored.privacy === true,
      marketing: stored.marketing === true,
    }
  } catch {
    return null
  }
}

function saveConsent(consent: PdpaConsent) {
  try {
    localStorage.setItem(PDPA_STORAGE_KEY, JSON.stringify(consent))
  } catch {
    // Not saved for next time: the popup will appear again then
  }
}

/** Client state shared by the welcome page (asks) and the sign-in page (checks) */
export const usePdpaStore = defineStore('pdpa', () => {
  // Also the in-memory copy for this visit: when storage is blocked the person still gets through this visit
  const consent = ref<PdpaConsent | null>(loadConsent())

  const needsConsent = computed(() => consent.value?.version !== PDPA_VERSION)

  function accept(terms = false, privacy = false, marketing = false, now = new Date()) {
    const next: PdpaConsent = {
      version: PDPA_VERSION,
      terms,
      privacy,
      marketing,
      acceptedAt: now.toISOString(),
    }

    consent.value = next
    saveConsent(next)
  }

  return { consent, needsConsent, accept }
})
