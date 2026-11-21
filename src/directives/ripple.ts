import type { Directive } from 'vue'

/**
 * Ripple under the finger on press: a circle grows from the point that was pressed and fades out.
 * The element needs `relative overflow-hidden` so the circle stays inside it; the colour is the element's text colour.
 * Skipped when the person has asked for less motion.
 */
function onPointerDown(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const box = el.getBoundingClientRect()
  // Big enough to reach the farthest corner from wherever it was pressed
  const size =
    Math.hypot(
      Math.max(event.clientX - box.left, box.right - event.clientX),
      Math.max(event.clientY - box.top, box.bottom - event.clientY),
    ) * 2

  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  wave.setAttribute('aria-hidden', 'true')
  wave.style.width = wave.style.height = `${size}px`
  wave.style.left = `${event.clientX - box.left - size / 2}px`
  wave.style.top = `${event.clientY - box.top - size / 2}px`
  wave.addEventListener('animationend', () => wave.remove(), { once: true })
  el.appendChild(wave)
}

export const vRipple: Directive<HTMLElement> = {
  mounted: (el) => el.addEventListener('pointerdown', onPointerDown),
  beforeUnmount: (el) => el.removeEventListener('pointerdown', onPointerDown),
}
