import { apiClient } from '@/services/api/axios'
import type { LineLoginPayload, LineLoginResponse } from '@/types/auth/auth.type'

export const authService = {
  async loginWithLine(payload: LineLoginPayload): Promise<LineLoginResponse> {
    const response = await apiClient.post<LineLoginResponse>('/member/login/line', payload)

    return response.data
  },
}
