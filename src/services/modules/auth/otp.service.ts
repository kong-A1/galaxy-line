import { apiClient } from '@/services/api/axios'
import type { ApiMessageResponse, ApiResponse } from '@/types/api/api.type'
import type {
  LinkMemberPayload,
  LoginOtpPayload,
  LoginOtpResponse,
  OtpErrorCode,
  OtpId,
  OtpRequestPayload,
  OtpVerifyPayload,
  RefCode,
} from '@/types/auth/auth.type'

export class OtpError extends Error {
  readonly code: OtpErrorCode

  constructor(code: OtpErrorCode) {
    super(code)
    this.name = 'OtpError'
    this.code = code
  }
}

export const otpService = {
  async requestOtp(payload: OtpRequestPayload): Promise<RefCode> {
    const response = await apiClient.post<ApiResponse<RefCode>>('/otp/sent', payload)

    return response.data.result
  },

  async verifyOtp(payload: OtpVerifyPayload): Promise<OtpId> {
    const response = await apiClient.post<ApiResponse<OtpId>>('/otp/verify', payload)

    return response.data.result
  },

  async loginOtp(payload: LoginOtpPayload): Promise<LoginOtpResponse> {
    const response = await apiClient.post<ApiResponse<LoginOtpResponse>>(
      '/member/login/otp',
      payload,
    )

    return response.data.result
  },

  async linkMember(payload: LinkMemberPayload): Promise<ApiMessageResponse> {
    const response = await apiClient.post<ApiMessageResponse>('/member/link', payload)

    return response.data
  },
}
