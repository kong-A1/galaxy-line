import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { memberKeys } from '@/composables/member/useMember'
import { apiErrorResponse } from '@/services/api/api-error'
import { OtpError, otpService } from '@/services/modules/auth/otp.service'

import type { ApiError, ApiMessageResponse } from '@/types/api/api.type'
import type {
  LinkMemberPayload,
  LoginOtpPayload,
  LoginOtpResponse,
  OtpRequestPayload,
  OtpVerifyPayload,
  RefCode,
} from '@/types/auth/auth.type'

import { OTP_MAX_ATTEMPTS } from '@/utils/otp'

// A wrong code is an OtpError the screen reacts to; anything else is mapped like every other API error
function toOtpFailure(error: unknown): ApiError | OtpError {
  return error instanceof OtpError ? error : apiErrorResponse(error)
}

function attemptsOf(failure: ApiError | OtpError): number {
  if (failure instanceof OtpError) return 0

  const result = (failure.data as { result?: { otp_attempts?: unknown } } | null)?.result

  return typeof result?.otp_attempts === 'number' ? result.otp_attempts : 0
}

/** Sends a one-time code. No query depends on it, so there is no cache to invalidate. */
export function useRequestOtp() {
  return useMutation<RefCode, ApiError | OtpError, OtpRequestPayload>({
    mutationFn: async (payload) => {
      try {
        return await otpService.requestOtp(payload)
      } catch (error: unknown) {
        const failure = toOtpFailure(error)
        throw attemptsOf(failure) >= OTP_MAX_ATTEMPTS ? new OtpError('locked') : failure
      }
    },
  })
}

/** Checks a code. Passing it signs the person in, so whatever was cached about "the member" is stale. */
export function useVerifyOtp() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError | OtpError, OtpVerifyPayload>({
    mutationFn: async (payload) => {
      try {
        await otpService.verifyOtp(payload)
      } catch (error: unknown) {
        const failure = toOtpFailure(error)
        throw attemptsOf(failure) >= OTP_MAX_ATTEMPTS ? new OtpError('locked') : failure
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  })
}

/** Signs a verified code in as an existing member. A failure means this contact is not a member yet. */
export function useLoginOtp() {
  return useMutation<LoginOtpResponse, ApiError, LoginOtpPayload>({
    mutationFn: async (payload) => {
      try {
        return await otpService.loginOtp(payload)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
  })
}

/** Links the LINE account to the member found by `useLoginOtp`, so whatever was cached about "the member" is stale. */
export function useLinkMember() {
  const queryClient = useQueryClient()

  return useMutation<ApiMessageResponse, ApiError, LinkMemberPayload>({
    mutationFn: async (payload) => {
      try {
        return await otpService.linkMember(payload)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  })
}
