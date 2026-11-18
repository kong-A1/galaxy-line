import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { memberKeys } from '@/composables/member/useMember'
import { authService } from '@/services/modules/auth/auth.service'
import { apiErrorResponse } from '@/services/api/api-error'

import type { ApiError } from '@/types/api/api.type'
import type {
  LineLoginPayload,
  LineLoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth/auth.type'

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

/** Creates the member. They exist now, so whatever was cached about "the member" is stale. */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: async (payload) => {
      try {
        return await authService.register(payload)
      } catch (error: unknown) {
        throw apiErrorResponse(error)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  })
}
