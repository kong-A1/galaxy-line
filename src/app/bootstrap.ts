import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from '../App.vue'
import router from '../router'

import { i18n } from './providers/i18n'
import { queryClient } from './providers/query'

import { initializeLiff } from '@/services/liff/liff'

function persistEntryParams() {
  const params = new URLSearchParams(window.location.search)

  const liffState = params.get('liff.state')
  if (liffState) {
    localStorage.setItem('liff-state', liffState)
  }

  const branchCode = params.get('ref-branch-code')
  if (branchCode) {
    localStorage.setItem('ref-branch-code', branchCode)
  }
}

export async function bootstrap() {
  persistEntryParams()

  await initializeLiff()

  const app = createApp(App)

  app.use(createPinia())
  app.use(i18n)
  app.use(VueQueryPlugin, { queryClient })
  app.use(router)

  app.mount('#app')

  return app
}
