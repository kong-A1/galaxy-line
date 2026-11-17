import { useRouter } from 'vue-router'

/** Back in this tab's history, or to `fallback` when it was opened straight on this page and has nothing to go back to */
export function useGoBack(fallback: string) {
  const router = useRouter()

  return function goBack() {
    // vue-router keeps the previous location in history.state; null means there is none
    if (router.options.history.state.back) {
      router.back()
    } else {
      void router.push(fallback)
    }
  }
}
