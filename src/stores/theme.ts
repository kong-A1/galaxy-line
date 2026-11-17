import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    return saved
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitialTheme())
  const isDark = computed(() => mode.value === 'dark')

  watch(
    mode,
    (value) => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', value === 'dark')
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', value)
      }
    },
    { immediate: true },
  )

  function toggleTheme() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  function setTheme(newMode: ThemeMode) {
    mode.value = newMode
  }

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
  }
})
