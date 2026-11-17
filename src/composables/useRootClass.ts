import { onBeforeUnmount, onMounted } from 'vue'

/** Puts a class on <html> while the calling component is on screen (for what only the page canvas can style) */
export function useRootClass(name: string) {
  onMounted(() => document.documentElement.classList.add(name))
  onBeforeUnmount(() => document.documentElement.classList.remove(name))
}
