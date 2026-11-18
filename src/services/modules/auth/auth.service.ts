import { apiClient } from '@/services/api/axios'
import type { ApiResponse } from '@/types/api/api.type'
import type {
  LineLoginPayload,
  LineLoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth/auth.type'

export const authService = {
  async loginWithLine(payload: LineLoginPayload): Promise<LineLoginResponse> {
    const response = await apiClient.post<LineLoginResponse>('/member/login/line', payload)

    return response.data
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      '/member/register/otpverified/v2',
      payload,
    )

    return response.data.result
  },
}
