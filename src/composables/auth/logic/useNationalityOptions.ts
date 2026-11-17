import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useNationality } from '@/composables/auth/useNationality'

export function useNationalityOptions() {
  const { locale } = useI18n()
  const { data, isPending, isError, refetch } = useNationality()

  const options = computed(() => {
    if (!data.value?.length) return []

    return data.value.map((item) => {
      const text = locale.value === 'th' ? item.text_th : item.text_en

      return {
        value: item.value,
        label: `${text} (${item.value})`,
      }
    })
  })

  return { options, isPending, isError, refetch }
}
