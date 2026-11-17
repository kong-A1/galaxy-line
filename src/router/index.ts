import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { isLiffLoggedIn } from '@/services/liff/liff'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const LOGIN_PAGE = '/auth/line-log-in'
// Every path that ends up on the LINE login screen
const LOGIN_PATHS = ['/', '/auth', LOGIN_PAGE]

router.beforeEach((to) => {
  if (isLiffLoggedIn()) {
    // Signed in with LINE (returned from login, or opened inside the LINE app): skip the login screen
    if (LOGIN_PATHS.includes(to.path)) {
      return { path: '/auth/welcome', query: to.query, hash: to.hash }
    }
    return
  }

  // Not signed in: only the login page and routes marked `public` (404, maintenance) are reachable
  if (to.path !== LOGIN_PAGE && !to.meta.public) {
    return { path: LOGIN_PAGE, query: to.query, hash: to.hash }
  }
})
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
