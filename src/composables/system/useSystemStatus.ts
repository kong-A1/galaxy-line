import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { apiErrorResponse } from '@/services/api/api-error'
import { systemService } from '@/services/modules/system/system.service'

import type { ApiError } from '@/types/api/api.type'

/**
 * Asks whether the system is back. When it is, whatever was fetched (or failed) during the outage is stale,
 * so every cached query is invalidated.
 */
export function useCheckSystemStatus() {
  const queryClient = useQueryClient()

  return useMutation<boolean, ApiError>({
    mutationFn: async () => {
      try {
        return await systemService.checkStatus()
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
    onSuccess: (isBack) => (isBack ? queryClient.invalidateQueries() : undefined),
  })
}
