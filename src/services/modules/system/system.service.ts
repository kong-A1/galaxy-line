import axios from 'axios'

const TIMEOUT_MS = 5000

export const systemService = {
  /**
   * Whether the system is back: true on a 2xx answer, false while it still answers 503 (or no endpoint is set).
   * Throws on network errors and timeouts; callers treat that the same as "still down".
   * Plain axios, not `apiClient`: the endpoint is a full URL that may live elsewhere, and it must not get the
   * member's bearer token.
   */
  async checkStatus(): Promise<boolean> {
    const endpoint = import.meta.env.VITE_STATUS_ENDPOINT?.trim()
    if (!endpoint) return false

    const response = await axios.get(endpoint, {
      timeout: TIMEOUT_MS,
      headers: { Accept: 'application/json' },
      // A 503 is an answer ("still down"), not a failure
      validateStatus: () => true,
    })

    return response.status >= 200 && response.status < 300
  },
}
