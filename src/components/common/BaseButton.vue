<script setup lang="ts">
import { computed, type Component } from 'vue'
import { IconLoader2 } from '@tabler/icons-vue'

type ButtonColor =
  'primary' | 'secondary' | 'danger' | 'line' | 'inverse' | 'neon' | 'neon-violet' | 'neon-ghost'
type ButtonVariant = 'flat' | 'outlined' | 'text' | 'plain' | 'tonal'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'button' | 'submit' | 'reset'
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
type ButtonIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    variant?: ButtonVariant
    rounded?: ButtonRounded
    size?: ButtonSize
    type?: ButtonType
    icon?: Component
    iconSize?: ButtonIconSize
    iconRight?: Component
    block?: boolean
    disabled?: boolean
    loading?: boolean
    loadingText?: string
  }>(),
  {
    color: 'primary',
    variant: 'flat',
    rounded: 'md',
    size: 'md',
    iconSize: 'md',
    type: 'button',
    block: false,
    disabled: false,
    loading: false,
  },
)

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-8 px-2 text-sm gap-1.5',
  md: 'min-h-10 px-3 text-sm gap-2',
  lg: 'min-h-12 px-5 text-base gap-2.5',
  xl: 'min-h-14 px-6 text-base gap-3',
}

const roundedClasses: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

const iconSizeClasses: Record<ButtonIconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
}

const variantClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
  flat: {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-secondary text-white hover:opacity-90',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    line: 'bg-line text-line-foreground hover:opacity-90',
    inverse: 'bg-white text-primary hover:opacity-90',
    neon: 'bg-linear-to-r from-neon-green to-neon-green-deep text-white shadow-[0_10px_30px_rgb(6_169_77/0.45)] hover:brightness-110',
    'neon-violet':
      'bg-linear-to-r from-neon-accent to-neon-green-deep text-white shadow-[0_10px_30px_rgb(123_47_247/0.5)] hover:brightness-110',
    'neon-ghost':
      'border border-neon-ghost-border bg-neon-ghost-bg text-neon-ink hover:brightness-110',
  },
  outlined: {
    primary: 'border border-primary text-primary hover:bg-primary/10',
    secondary: 'border border-border text-foreground hover:bg-muted/10',
    danger:
      'border border-red-600 text-red-600 hover:bg-red-600/10 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400/10',
    line: 'border border-line text-foreground hover:bg-line/10',
    inverse: 'border border-white/60 text-white hover:bg-white/10',
    neon: 'border border-neon-green text-neon-green hover:bg-neon-green/10',
    'neon-violet': 'border border-neon-accent text-neon-accent hover:bg-neon-accent/10',
    'neon-ghost': 'border border-neon-ghost-border text-neon-ink hover:bg-neon-ghost-bg',
  },
  text: {
    primary: 'text-primary hover:bg-primary/10',
    secondary: 'text-muted hover:text-foreground hover:bg-muted/10',
    danger: 'text-red-600 hover:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-400/10',
    line: 'text-foreground hover:bg-line/10',
    inverse: 'text-white hover:bg-white/15',
    neon: 'text-neon-green hover:bg-neon-green/10',
    'neon-violet': 'text-neon-accent hover:bg-neon-accent/10',
    'neon-ghost': 'text-neon-ink hover:bg-neon-ghost-bg',
  },
  plain: {
    primary: 'text-primary',
    secondary: 'text-muted hover:text-foreground',
    danger: 'text-red-600 dark:text-red-400',
    line: 'text-foreground',
    inverse: 'text-white',
    neon: 'text-neon-green',
    'neon-violet': 'text-neon-accent',
    'neon-ghost': 'text-neon-ink',
  },
  tonal: {
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-secondary/15 text-foreground hover:bg-secondary/25',
    danger:
      'bg-red-600/10 text-red-600 hover:bg-red-600/20 dark:bg-red-400/15 dark:text-red-400 dark:hover:bg-red-400/25',
    line: 'bg-line/15 text-foreground hover:bg-line/25',
    inverse: 'bg-white/15 text-white hover:bg-white/25',
    neon: 'bg-neon-green/15 text-neon-green hover:bg-neon-green/25',
    'neon-violet': 'bg-neon-accent/15 text-neon-accent hover:bg-neon-accent/25',
    'neon-ghost': 'bg-neon-ghost-bg text-neon-ink hover:brightness-110',
  },
}

const buttonClasses = computed(() => [
  sizeClasses[props.size],
  roundedClasses[props.rounded],
  variantClasses[props.variant][props.color],
  'hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex items-center justify-center rounded-lg font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    :class="[buttonClasses, block ? 'w-full' : 'w-fit']"
  >
    <span class="flex items-center justify-center gap-1.5">
      <component
        :is="IconLoader2"
        v-if="loading"
        :class="[iconSizeClasses[iconSize], 'shrink-0 animate-spin']"
      />

      <component :is="icon" v-else-if="icon" :class="[iconSizeClasses[iconSize], 'shrink-0']" />

      <template v-if="loadingText || loading">
        {{ loadingText }}
      </template>
      <slot v-else />

      <component
        :is="iconRight"
        v-if="iconRight && !loading"
        :class="[iconSizeClasses[iconSize], 'shrink-0']"
      />
    </span>
  </button>
</template>
