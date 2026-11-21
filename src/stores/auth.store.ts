import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { hasStoredToken, TOKEN_KEY } from '@/services/api/token'

export type AuthStatus = 'unknown' | 'checking' | 'authenticated' | 'unauthenticated'

export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus>('unknown')
  const errorMessage = ref('')

  const isAuthenticated = computed(() => status.value === 'authenticated')

  function setChecking() {
    status.value = 'checking'
    errorMessage.value = ''
  }

  function setAuthenticated(accessToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken)

    status.value = 'authenticated'
    errorMessage.value = ''
  }

  /** True when a backend token from an earlier visit is still stored */
  function hasToken() {
    return hasStoredToken()
  }

  function setUnauthenticated(message = '') {
    localStorage.removeItem(TOKEN_KEY)

    status.value = 'unauthenticated'
    errorMessage.value = message
  }

  return {
    status,
    errorMessage,
    isAuthenticated,
    setChecking,
    setAuthenticated,
    hasToken,
    setUnauthenticated,
  }
})
