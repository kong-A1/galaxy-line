import { createI18n } from 'vue-i18n'
import { watch } from 'vue'

import en from '@/i18n/locales/en'
import th from '@/i18n/locales/th'

const LOCALE_STORAGE_KEY = 'locale'
const LOCALES = ['th', 'en'] as const
type Locale = (typeof LOCALES)[number]

// Storage can throw (private mode, blocked site data): treat that as "nothing stored" and carry on
function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    return LOCALES.find((locale) => locale === saved) ?? 'th'
  } catch {
    return 'th'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: loadLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    th,
  },
})

// Whoever switches the language (the toolbar button) does not need to know about storage
watch(i18n.global.locale, (locale) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Nothing to do: the choice just will not survive a reload
  }
})
