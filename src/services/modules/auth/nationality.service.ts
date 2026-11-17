import { apiClient } from '@/services/api/axios'
import type { ApiDataResponse } from '@/types/api/api.type'
import type { NationalityResponse } from '@/types/auth/auth.type'

export const nationalityService = {
  async getNationality(signal?: AbortSignal): Promise<NationalityResponse[]> {
    const response = await apiClient.get<ApiDataResponse<NationalityResponse[]>>(
      '/get/nationality',
      {
        signal,
      },
    )

    return response.data.data
  },
}
