import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * Open/close state for a panel that hangs under a trigger: closes on a press outside both, and opens upwards only
 * when there is no room below and more room above.
 */
type ElementRef = Readonly<Ref<HTMLElement | null>>

export function useDropdown(trigger: ElementRef, panel: ElementRef) {
  const open = ref(false)
  const dropUp = ref(false)

  async function show() {
    open.value = true

    await nextTick()
    const box = trigger.value?.getBoundingClientRect()
    if (!box || !panel.value) return
    const below = window.innerHeight - box.bottom
    dropUp.value = below < panel.value.offsetHeight + 8 && box.top > below
  }

  function hide() {
    open.value = false
  }

  function onPointerDown(event: PointerEvent) {
    const target = event.target as Node
    if (!trigger.value?.contains(target) && !panel.value?.contains(target)) hide()
  }

  watch(open, (isOpen) => {
    if (isOpen) document.addEventListener('pointerdown', onPointerDown)
    else document.removeEventListener('pointerdown', onPointerDown)
  })
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))

  return { open, dropUp, show, hide }
}
