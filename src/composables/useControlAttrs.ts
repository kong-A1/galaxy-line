import { computed, useAttrs } from 'vue'

/**
 * For a form control wrapped in a field (`inheritAttrs: false`): `class` and `style` belong on the outer field, where
 * the parent positions it; every other attribute and listener belongs on the control itself.
 */
export function useControlAttrs() {
  const attrs = useAttrs()

  const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
  const controlAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
  )

  return { rootAttrs, controlAttrs }
}
