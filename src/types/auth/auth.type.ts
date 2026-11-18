/** Which welcome button the person pressed; the sign-in page reads it from `sign-in.store` */
export type SignInAction = 'sign-in' | 'register'

/** How the one-time code is delivered */
export type SignInActionType = 'line' | 'web'

export type SignInMethod = 'phone' | 'email'

export type OtpErrorCode = 'invalid' | 'unavailable' | 'locked'

export type Gender = 'unknown' | 'male' | 'female'

interface AuthPayload {
  ref_branch_code: string | null
  entry_url: string
}

export interface LineLoginPayload extends AuthPayload {
  line_id_token: string
}

export interface LineLoginResponse {
  access_token: string
  expires_at: number
  message: string
  status: boolean
  token_type: string
}

export interface TypeMethod {
  type: SignInMethod
}

export interface RefCode {
  ref_code: string
}

export interface OtpCode {
  otp_code: string
}

export interface OtpId {
  otp_id: string
}

export interface OtpRequestPayload extends TypeMethod {
  action_type: SignInActionType
  value: string
}

export interface OtpVerifyPayload extends RefCode, OtpCode {
  type: SignInMethod
}

export interface LoginOtpPayload extends RefCode, OtpCode {}

export interface LoginOtpResponse {
  token: string
}

export interface LinkMemberPayload {
  action_type: string
  email: string | null
  phone: string | null
  line_id_token: string
  consent_pdpa_status: boolean
  consent_person_status: boolean
  consent_news_status: boolean
  language: string
  ref_branch_code: string
  entry_url: string
}

/** What the register step collects. `birthDate` is "dd/mm/yyyy" or empty; `nationality` may be empty */
export interface RegisterFormValues {
  firstName: string
  lastName: string
  gender: Gender
  nationality: string
  citizenId: string
  passportId: string
  birthDate: string
}

export interface NationalityResponse {
  value: string
  text: string
  alpha_2_code: string
  text_th: string
  text_en: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  gender: string
  nationality: string
  citizen_id?: string
  passport_id?: string
  date_of_birth?: string
  verification_id: string
  verification_type: string
  consent_news_status: boolean
  consent_pdpa_status: boolean
  consent_person_status: boolean

  language: string
  source_name: string
  ref_branch_code: string
  line_id_token: string
  entry_url: string
}

export interface RegisterResponse {
  member_code: string
  coupons: number
}
