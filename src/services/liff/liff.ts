import liff from '@line/liff'

let liffInitPromise: Promise<void> | null = null

export function initializeLiff(): Promise<void> {
  const liffId = import.meta.env.VITE_LIFF_ID?.trim()

  if (!liffId) {
    return Promise.reject(new Error('VITE_LIFF_ID is not configured'))
  }

  if (!liffInitPromise) {
    liffInitPromise = liff
      .init({
        liffId,
      })
      .catch((error: unknown) => {
        liffInitPromise = null
        throw error
      })
  }

  return liffInitPromise
}

export function ensureLiffLogin(): boolean {
  if (liff.isLoggedIn()) {
    return true
  }

  if (liff.isInClient()) {
    throw new Error('User is not logged in inside the LIFF browser')
  }

  liff.login()

  return false
}

export function isLiffInClient(): boolean {
  return liff.isInClient()
}

export function isLiffLoggedIn(): boolean {
  return liff.isLoggedIn()
}

export function getLiffAccessToken(): string | null {
  return liff.getAccessToken()
}
