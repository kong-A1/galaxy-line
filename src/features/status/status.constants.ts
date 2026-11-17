const read = (value: string | undefined) => value?.trim() || null

/** Where "Back to home" goes; the router decides between login and welcome from here */
export const HOME_ROUTE = '/'

/** Where "Contact support" links to; the link is hidden when this is not set */
export const CONTACT_URL = read(import.meta.env.VITE_CONTACT_URL)

/** ISO 8601 time the system is expected back; the time box is hidden when unset or invalid */
export const MAINTENANCE_END_AT = read(import.meta.env.VITE_MAINTENANCE_END_AT)
