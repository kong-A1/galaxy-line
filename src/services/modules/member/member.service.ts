import { apiClient } from '@/services/api/axios'
import type { ApiResponse } from '@/types/api/api.type'
import { memberMock } from './member.mock'
import type { Member } from '@/types/member/member.type'

export const memberService = {
  async getMemberProfile(signal?: AbortSignal): Promise<Member> {
    if (import.meta.env.VITE_USE_MOCK === 'true') return memberMock

    const response = await apiClient.get<ApiResponse<Member>>('/member', {
      signal,
    })

    return response.data.result
  },
}
