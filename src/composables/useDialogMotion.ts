import { onMounted, type Ref } from 'vue'

// Longer than the closing animation in motion.css, so a missed `animationend` can never leave the popup stuck open
const CLOSE_FALLBACK_MS = 400

/**
 * Opens a native <dialog> when it is mounted and closes it with an animation (the opening one played backwards).
 * `close()` resolves `true` for the call that closed it and `false` when it was already closing, so a double tap
 * does not report the result twice.
 */
export function useDialogMotion(dialog: Readonly<Ref<HTMLDialogElement | null>>) {
  let isClosing = false

  onMounted(() => dialog.value?.showModal())

  function close(): Promise<boolean> {
    const element = dialog.value
    if (!element || isClosing) return Promise.resolve(false)
    isClosing = true

    element.setAttribute('data-closing', '')

    // With reduced motion the animation is switched off, so there is nothing to wait for
    if (getComputedStyle(element).animationName === 'none') {
      element.close()
      return Promise.resolve(true)
    }

    return new Promise((resolve) => {
      const finish = () => {
        element.removeEventListener('animationend', onEnd)
        clearTimeout(fallback)
        element.close()
        resolve(true)
      }
      const onEnd = (event: AnimationEvent) => {
        if (event.target === element) finish()
      }
      const fallback = setTimeout(finish, CLOSE_FALLBACK_MS)
      element.addEventListener('animationend', onEnd)
    })
  }

  return { close }
}
