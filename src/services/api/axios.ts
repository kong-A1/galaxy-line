import axios from 'axios'

import { getStoredToken } from '@/services/api/token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'app-domain': import.meta.env.VITE_API_APP_DOMAIN,
  },
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getStoredToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
