<script setup lang="ts">
/**
 * Slides one element open and closed (height and opacity) when it is added or removed with `v-if`.
 * Height is animated by script because CSS cannot animate to `auto`; the clipping is only on while it moves,
 * so focus rings and glows around fields are not cut off once it is open.
 */
const props = withDefaults(defineProps<{ duration?: number }>(), { duration: 280 })

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function reset(el: HTMLElement) {
  el.style.height = ''
  el.style.opacity = ''
  el.style.overflow = ''
  el.style.transition = ''
}

function run(el: Element, opening: boolean, done: () => void) {
  const element = el as HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  const full = `${element.scrollHeight}px`
  element.style.overflow = 'hidden'
  element.style.height = opening ? '0px' : full
  element.style.opacity = opening ? '0' : '1'
  void element.offsetHeight // apply the start state before the transition is set

  element.style.transition = `height ${props.duration}ms ease, opacity ${props.duration}ms ease`
  element.style.height = opening ? full : '0px'
  element.style.opacity = opening ? '1' : '0'

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    clearTimeout(fallback)
    element.removeEventListener('transitionend', onEnd)
    if (opening) reset(element)
    done()
  }
  const onEnd = (event: TransitionEvent) => {
    if (event.target === element && event.propertyName === 'height') finish()
  }
  // A missed `transitionend` must never leave the element stuck half open
  const fallback = setTimeout(finish, props.duration + 120)
  element.addEventListener('transitionend', onEnd)
}
</script>

<template>
  <Transition
    :css="false"
    @enter="(el, done) => run(el, true, done)"
    @leave="(el, done) => run(el, false, done)"
  >
    <slot />
  </Transition>
</template>
