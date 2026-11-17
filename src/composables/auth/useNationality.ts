import { useQuery } from '@tanstack/vue-query'

import { nationalityService } from '@/services/modules/auth/nationality.service'
import { apiErrorResponse } from '@/services/api/api-error'

import type { ApiError } from '@/types/api/api.type'
import type { NationalityResponse } from '@/types/auth/auth.type'

export const nationalityKeys = {
  all: ['auth'] as const,
  nationality: () => [...nationalityKeys.all, 'nationality'] as const,
}

export function useNationality() {
  return useQuery<NationalityResponse[], ApiError>({
    queryKey: nationalityKeys.nationality(),
    queryFn: async ({ signal }) => {
      try {
        return await nationalityService.getNationality(signal)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
  })
}
