const read = (value: string | undefined) => value?.trim() || null

/** Where the two documents live; each is shown as plain text instead of a link when its URL is not set */
export const TERMS_URL = read(import.meta.env.VITE_TERMS_URL)
export const PRIVACY_URL = read(import.meta.env.VITE_PRIVACY_URL)
export const MARKETING_URL = read(import.meta.env.VITE_MARKETING_URL)
