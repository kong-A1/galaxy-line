<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

type ChipColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
type ChipVariant = 'flat' | 'outlined' | 'tonal'
type ChipSize = 'sm' | 'md' | 'lg' | 'xl'
type ChipRounded = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(
  defineProps<{
    color?: ChipColor
    variant?: ChipVariant
    size?: ChipSize
    rounded?: ChipRounded
    clickable?: boolean
    disabled?: boolean
    icon?: Component
    iconRight?: Component
    iconSize?: number
  }>(),
  {
    color: 'secondary',
    variant: 'tonal',
    size: 'md',
    rounded: 'md',
    clickable: false,
    disabled: false,
    iconSize: 16,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const colorClasses: Record<ChipColor, Record<ChipVariant, string>> = {
  primary: {
    flat: 'bg-primary text-white',
    outlined: 'border border-primary text-primary',
    tonal: 'bg-primary/10 text-primary',
  },
  secondary: {
    flat: 'bg-secondary text-white',
    outlined: 'border border-secondary text-secondary',
    tonal: 'bg-secondary/10 text-secondary',
  },
  success: {
    flat: 'bg-success text-white',
    outlined: 'border border-success text-success',
    tonal: 'bg-success/10 text-success',
  },
  info: {
    flat: 'bg-info text-white',
    outlined: 'border border-info text-info',
    tonal: 'bg-info/10 text-info',
  },
  warning: {
    flat: 'bg-warning text-white',
    outlined: 'border border-warning text-warning',
    tonal: 'bg-warning/10 text-warning',
  },
  error: {
    flat: 'bg-error text-white',
    outlined: 'border border-error text-error',
    tonal: 'bg-error/10 text-error',
  },
}

const sizeClasses: Record<ChipSize, string> = {
  sm: 'p-1.5 text-xs',
  md: 'p-3 text-sm',
  lg: 'p-4 text-base',
  xl: 'p-5 text-lg',
}

const roundedClasses: Record<ChipRounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

const chipClasses = computed(() => [
  'inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-colors',
  sizeClasses[props.size],
  colorClasses[props.color][props.variant],
  roundedClasses[props.rounded],
  props.clickable && !props.disabled
    ? 'cursor-pointer hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    : '',
  props.disabled ? 'cursor-not-allowed opacity-50' : '',
])

function handleClick(event: MouseEvent) {
  if (props.disabled) return

  emit('click', event)
}
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    :class="chipClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <component :is="icon" v-if="icon" :size="iconSize" />

    <slot />

    <component :is="iconRight" v-if="iconRight" :size="iconSize" />
  </button>

  <span v-else :class="chipClasses">
    <component :is="icon" v-if="icon" :size="iconSize" />

    <slot />

    <component :is="iconRight" v-if="iconRight" :size="iconSize" />
  </span>
</template>
