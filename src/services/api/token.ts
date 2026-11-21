/** Where the backend token is kept between visits (the axios client and the router read it without needing the stores) */
export const TOKEN_KEY = '_bearer_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function hasStoredToken(): boolean {
  return Boolean(getStoredToken())
}
