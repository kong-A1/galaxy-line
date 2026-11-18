import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Gender } from '@/types/auth/auth.type'

/** Shared gender options for any select. Labels follow the current locale */
export function useGenderOptions() {
  const { t } = useI18n()

  const options = computed<{ value: Gender; label: string }[]>(() => [
    { value: 'unknown', label: t('auth.register.genderUnknown') },
    { value: 'male', label: t('auth.register.genderMale') },
    { value: 'female', label: t('auth.register.genderFemale') },
  ])

  return { options }
}
