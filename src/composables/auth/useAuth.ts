import { useMutation } from '@tanstack/vue-query'

import { authService } from '@/services/modules/auth/auth.service'
import { apiErrorResponse } from '@/services/api/api-error'

import type { ApiError } from '@/types/api/api.type'
import type { LineLoginPayload, LineLoginResponse } from '@/types/auth/auth.type'

export function useLoginWithLine() {
  return useMutation<LineLoginResponse, ApiError, LineLoginPayload>({
    mutationFn: async (payload) => {
      try {
        return await authService.loginWithLine(payload)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
  })
}
