import type { RegisterFormValues, RegisterPayload } from '@/types/auth/auth.type'

/** "05/11/1990" -> "1990-11-05"; empty when it is not in the form's "dd/mm/yyyy" shape */
export function toApiBirthDate(formatted: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted)

  return match ? `${match[3]}-${match[2]}-${match[1]}` : ''
}

type PersonalDetails = Pick<
  RegisterPayload,
  | 'first_name'
  | 'last_name'
  | 'gender'
  | 'nationality'
  | 'citizen_id'
  | 'passport_id'
  | 'date_of_birth'
>

/** The details the form collects, as the register request expects them. Optional ones that were left empty are not sent. */
export function toPersonalDetails(values: RegisterFormValues): PersonalDetails {
  const birthDate = toApiBirthDate(values.birthDate)

  return {
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
    gender: values.gender,
    nationality: values.nationality,
    ...(values.citizenId && { citizen_id: values.citizenId }),
    ...(values.passportId && { passport_id: values.passportId }),
    ...(birthDate && { date_of_birth: birthDate }),
  }
}
