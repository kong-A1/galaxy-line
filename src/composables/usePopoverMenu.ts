import { onBeforeUnmount, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useDropdown } from '@/composables/useDropdown'

/**
 * A menu that hangs under a button (the top bar's profile and notifications): opens and closes, closes on a press outside,
 * on Esc (focus goes back to the button) and when the page changes, a moment later so a press ripple can still be seen.
 * Pass the names of the button and panel template refs.
 */
export function usePopoverMenu(triggerRef: string, panelRef: string) {
  const route = useRoute()
  const trigger = useTemplateRef<HTMLElement>(triggerRef)
  const panel = useTemplateRef<HTMLElement>(panelRef)
  const { open, dropUp, show, hide } = useDropdown(trigger, panel)

  function toggle() {
    if (open.value) hide()
    else void show()
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !open.value) return
    hide()
    trigger.value?.focus()
  }
  watch(open, (isOpen) => {
    if (isOpen) document.addEventListener('keydown', onKeydown)
    else document.removeEventListener('keydown', onKeydown)
  })

  let closeTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => route.fullPath,
    () => {
      clearTimeout(closeTimer)
      closeTimer = setTimeout(hide, 220)
    },
  )

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    clearTimeout(closeTimer)
  })

  return { open, dropUp, toggle, hide }
}
