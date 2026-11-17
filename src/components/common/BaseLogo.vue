<script setup lang="ts">
import { computed } from 'vue'

import LogoDark from '@/assets/images/logo-neon-dark.png'
import LogoLight from '@/assets/images/logo-neon-light.png'

type LogoSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type LogoRounded = 'none' | 'sm' | 'md' | 'lg' | 'full'
type LogoVariant = 'auto' | 'light' | 'dark'

/**
 * The project logo. `src` / `srcDark` default to the brand files, so no caller imports an image itself.
 * `variant`: `auto` follows the theme; `light` / `dark` pin one version (e.g. the light logo on a white tile).
 * `size="none"` leaves the size to the caller's class.
 */
const props = withDefaults(
  defineProps<{
    src?: string
    srcDark?: string
    variant?: LogoVariant
    alt?: string
    size?: LogoSize
    rounded?: LogoRounded
    clickable?: boolean
    /** Soft coloured glow behind the logo (cyan in the dark version, violet in the light one) */
    glow?: boolean
  }>(),
  {
    src: LogoLight,
    srcDark: LogoDark,
    variant: 'auto',
    alt: undefined,
    size: 'md',
    rounded: 'md',
    clickable: false,
    glow: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses: Record<LogoSize, string> = {
  none: '',
  sm: 'size-12',
  md: 'size-16',
  lg: 'size-20',
  xl: 'size-24',
  '2xl': 'size-36',
}

const roundedClasses: Record<LogoRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

const logoClasses = computed(() => [
  sizeClasses[props.size],
  roundedClasses[props.rounded],
  // The glow reaches outside the box, so it must not be clipped
  !props.glow && 'overflow-hidden',
  props.clickable && 'cursor-pointer',
])
</script>

<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    class="inline-flex shrink-0"
    :class="logoClasses"
    @click="clickable && emit('click', $event)"
  >
    <img
      v-if="variant !== 'dark'"
      :src="src"
      :alt="alt ?? $t('common.brand')"
      class="size-full object-contain"
      :class="[
        variant === 'auto' && 'dark:hidden',
        glow && 'drop-shadow-[0_6px_14px_rgb(91_33_182/0.25)]',
      ]"
    />
    <img
      v-if="variant !== 'light'"
      :src="srcDark"
      :alt="alt ?? $t('common.brand')"
      class="size-full object-contain"
      :class="[
        variant === 'auto' && 'hidden dark:block',
        glow && 'drop-shadow-[0_0_15px_rgb(94_231_255/0.45)]',
      ]"
    />
  </component>
</template>
