import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

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
    localStorage.setItem('_bearer_token', accessToken)

    status.value = 'authenticated'
    errorMessage.value = ''
  }

  /** True when a backend token from an earlier visit is still stored */
  function hasToken() {
    return Boolean(localStorage.getItem('_bearer_token'))
  }

  function setUnauthenticated(message = '') {
    localStorage.removeItem('_bearer_token')

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
