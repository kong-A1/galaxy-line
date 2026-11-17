import { useQuery } from '@tanstack/vue-query'
import { memberService } from '@/services/modules/member/member.service'
import { apiErrorResponse } from '@/services/api/api-error'

import type { ApiError } from '@/types/api/api.type'
import type { Member } from '@/types/member/member.type'

export const memberKeys = {
  all: ['member'] as const,
  profile: () => [...memberKeys.all, 'profile'] as const,
}

export function useMember() {
  return useQuery<Member, ApiError>({
    queryKey: memberKeys.profile(),
    queryFn: async ({ signal }) => {
      try {
        return await memberService.getMemberProfile(signal)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
  })
}
