import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'

import router from '@/router'
import { isServiceUnavailable } from '@/services/api/api-error'

// The backend answers 503 while it is down for maintenance: park the person on the maintenance page and remember
// where they were, so "Try again" can take them back. It lives here rather than in the services, which do not navigate.
function sendToMaintenance(error: unknown) {
  const { currentRoute } = router

  if (!isServiceUnavailable(error) || currentRoute.value.path === '/maintenance') return

  void router.replace({
    name: '/maintenance',
    query: { redirect: currentRoute.value.fullPath },
  })
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: sendToMaintenance }),
  mutationCache: new MutationCache({ onError: sendToMaintenance }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})
