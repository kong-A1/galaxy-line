import axios from 'axios'

import type { ApiError, ApiErrorResponse } from '@/types/api/api.type'

export function apiErrorResponse(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data

    const responseData = data as ApiErrorResponse | null

    return {
      message: responseData?.message ?? error.message ?? 'Something went wrong',
      status: error.response?.status ?? null,
      data,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: null,
      data: null,
    }
  }

  return {
    message: 'An unexpected error occurred',
    status: null,
    data: null,
  }
}

/** The backend answers 503 while it is down for maintenance. Accepts what services throw and what composables map it to. */
export function isServiceUnavailable(error: unknown): boolean {
  if (axios.isAxiosError(error)) return error.response?.status === 503

  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: unknown }).status === 503
  )
}
