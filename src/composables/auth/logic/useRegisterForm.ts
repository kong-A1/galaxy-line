import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLineSession } from '@/composables/auth/logic/useLineSession'
import { useLineContext } from '@/composables/auth/logic/useLineContext'
import { useRegister } from '@/composables/auth/useAuth'
import { useSignInStore } from '@/stores/sign-in.store'
import { toPersonalDetails } from '@/utils/register'
import { isValidBirthDate } from '@/utils/birthDate'
import { isValidCitizenId } from '@/utils/citizenId'
import { isValidPassport } from '@/utils/passport'

import type { RegisterFormValues } from '@/types/auth/auth.type'

type Field = keyof RegisterFormValues

/** Tells the backend which front end the sign-up came from */
const REGISTER_SOURCE_NAME = `line-${import.meta.env.VITE_API_APP_DOMAIN}`

/** Step 3 of sign-in (register only): the personal details, and which of them are wrong */
export function useRegisterForm() {
  const { t } = useI18n()
  const signInStore = useSignInStore()
  const lineContext = useLineContext()
  const register = useRegister()
  const lineSession = useLineSession()
  // Registering worked but signing in after it did not: pressing the button again must not register a second time
  const isRegistered = ref(false)

  const values = reactive<RegisterFormValues>({
    firstName: '',
    lastName: '',
    gender: 'unknown',
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
  const isSubmitting = computed(() => register.isPending.value || lineSession.isLoading.value)
  /** Why the last attempt to register failed; empty until it does */
  const submitError = ref('')

  // Names and date of birth are required (the backend rejects a sign-up without a date of birth); the other fields are optional but must be right when given
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
    if (!values.birthDate) result.birthDate = t('auth.register.birthDateRequired')
    else if (!isValidBirthDate(values.birthDate))
      result.birthDate = t('auth.register.birthDateError')

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

  /** Resolves true once the member is created and signed in; false when the details are wrong or a request failed */
  async function submit(): Promise<boolean> {
    submitError.value = ''
    for (const field of Object.keys(touched) as Field[]) touched[field] = true
    if (!isValid.value) return false

    if (!isRegistered.value && !(await createMember())) return false

    // The member exists now: trade the LINE token again so the token we hold is theirs
    if (await lineSession.signIn({ force: true })) return true

    submitError.value = t('auth.register.loginFailed')
    return false
  }

  async function createMember(): Promise<boolean> {
    const { line_id_token, ...context } = lineContext.read()
    // Nothing to register with: the code was never accepted on this page, or LINE has not signed the person in
    if (!signInStore.verificationId || !line_id_token) {
      submitError.value = t('auth.register.failed')
      return false
    }

    try {
      await register.mutateAsync({
        ...toPersonalDetails(values),
        verification_id: signInStore.verificationId,
        verification_type: signInStore.method,
        source_name: REGISTER_SOURCE_NAME,
        line_id_token,
        ...context,
      })
      isRegistered.value = true
      return true
    } catch {
      submitError.value = t('auth.register.failed')
      return false
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
    submitError,
    firstInvalid,
    markTouched,
    submit,
  }
}
