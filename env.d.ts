/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_LIFF_ID: string
  readonly VITE_API_APP_DOMAIN: string
  readonly VITE_API_BASE_URL: string
  /** Where "Contact support" links to; the link is hidden when unset */
  readonly VITE_CONTACT_URL?: string
  /** Endpoint that answers 2xx when the system is back; "Try again" cannot succeed when unset */
  readonly VITE_STATUS_ENDPOINT?: string
  /** Membership terms and conditions; the label in the consent popup is plain text when unset */
  readonly VITE_TERMS_URL?: string
  /** Privacy policy; the label in the consent popup is plain text when unset */
  readonly VITE_PRIVACY_URL?: string
  /** ISO 8601 time the system is expected back; the time box is hidden when unset or invalid */
  readonly VITE_MAINTENANCE_END_AT?: string
  /** "true" serves mock member data instead of calling the API */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
