import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { isValidBirthDate } from '@/utils/birthDate'
import { isValidCitizenId } from '@/utils/citizenId'
import { isValidPassport } from '@/utils/passport'

import type { RegisterFormValues } from '@/types/auth/auth.type'

type Field = keyof RegisterFormValues

/** Step 3 of sign-in (register only): the personal details, and which of them are wrong */
export function useRegisterForm() {
  const { t } = useI18n()

  const values = reactive<RegisterFormValues>({
    firstName: '',
    lastName: '',
    gender: 'unspecified',
    nationality: '',
    citizenId: '',
    passportId: '',
    birthDate: '',
  })
  // A field stays quiet until the person has left it or pressed the button once
  const touched = reactive<Record<Field, boolean>>({
    firstName: false,
    lastName: false,
    gender: false,
    nationality: false,
    citizenId: false,
    passportId: false,
    birthDate: false,
  })
  const isSubmitting = ref(false)

  // Names are the only required fields (Figma marks them with *); the other fields are optional but must be right when given
  const problems = computed<Partial<Record<Field, string>>>(() => {
    const result: Partial<Record<Field, string>> = {}

    if (!values.firstName.trim()) result.firstName = t('auth.register.firstNameError')
    if (!values.lastName.trim()) result.lastName = t('auth.register.lastNameError')
    if (values.citizenId && !isValidCitizenId(values.citizenId)) {
      result.citizenId = t('auth.register.citizenIdError')
    }
    if (values.passportId && !isValidPassport(values.passportId)) {
      result.passportId = t('auth.register.passportIdError')
    }
    if (values.birthDate && !isValidBirthDate(values.birthDate)) {
      result.birthDate = t('auth.register.birthDateError')
    }

    return result
  })

  const errors = computed(() => {
    const shown: Partial<Record<Field, string>> = {}
    for (const field of Object.keys(problems.value) as Field[]) {
      if (touched[field]) shown[field] = problems.value[field]
    }
    return shown
  })

  const isValid = computed(() => Object.keys(problems.value).length === 0)

  function markTouched(field: Field) {
    touched[field] = true
  }

  /** The first field that is wrong, in the order they appear on screen */
  const firstInvalid = computed<Field | undefined>(() =>
    (['firstName', 'lastName', 'citizenId', 'passportId', 'birthDate'] as const).find(
      (field) => problems.value[field],
    ),
  )

  const isSelectedThai = computed(() => values.nationality === 'THA')

  async function submit(): Promise<boolean> {
    for (const field of Object.keys(touched) as Field[]) touched[field] = true
    if (!isValid.value) return false

    isSubmitting.value = true
    try {
      return true
    } finally {
      isSubmitting.value = false
    }
  }

  watch(
    () => values.nationality,
    (newVal) => {
      if (newVal !== 'THA') {
        values.citizenId = ''
      }

      if (newVal === 'THA') {
        values.passportId = ''
      }
    },
  )

  return {
    values,
    isSelectedThai,
    errors,
    isValid,
    isSubmitting,
    firstInvalid,
    markTouched,
    submit,
  }
}
