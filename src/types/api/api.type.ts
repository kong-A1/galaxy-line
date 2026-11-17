/** What every answer from the backend has; some answers carry nothing more */
export interface ApiMessageResponse {
  status: boolean
  message: string
}

/** An answer that also carries data */
export interface ApiResponse<T> extends ApiMessageResponse {
  result: T
}

export interface ApiDataResponse<T> {
  status: boolean
  data: T
}

export interface ApiErrorResponse {
  status?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface ApiError {
  message: string
  status: number | null
  data: unknown
}
