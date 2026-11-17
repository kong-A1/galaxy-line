<script setup lang="ts">
import { computed, type Component } from 'vue'

type CardVariant = 'default' | 'neon'
type CardTone = 'pink' | 'blue' | 'gold'

const props = withDefaults(
  defineProps<{
    icon?: Component
    iconSize?: number
    title: string
    detail: string
    chip?: boolean
    condition: string
    /** `neon`: glass card with a glowing gradient icon tile (the neon design) */
    variant?: CardVariant
    /** Colour of the icon tile; `neon` only */
    tone?: CardTone
  }>(),
  {
    title: '',
    detail: '',
    condition: '',
    variant: 'default',
    tone: 'pink',
  },
)

const toneClasses: Record<CardTone, string> = {
  pink: 'neon-tone-pink',
  blue: 'neon-tone-blue',
  gold: 'neon-tone-gold',
}

const styles = computed(() =>
  props.variant === 'neon'
    ? {
        root: 'neon-glass rounded-[22px] p-4',
        icon: `size-12 rounded-2xl text-white ${toneClasses[props.tone]}`,
        title: 'text-base font-semibold text-neon-ink',
        chip: 'rounded-full bg-linear-to-r from-neon-magenta to-neon-purple px-2.5 py-1 text-xs leading-none font-semibold text-white',
        detail: 'mt-1 text-[13px] leading-snug text-neon-soft tablet:text-sm',
      }
    : {
        root: 'rounded-[14px] bg-surface p-3.5 shadow-[0_2px_12px_rgb(46_38_61/0.08)] transition-shadow hover:shadow-[0_4px_16px_rgb(46_38_61/0.14)]',
        icon: 'size-12 rounded-[10px] bg-background text-primary',
        title: 'text-[15px] leading-6 font-bold text-foreground tablet:text-base',
        chip: 'rounded-md bg-background px-2.5 py-0.5 text-[12px] leading-5 font-semibold text-primary',
        detail: 'mt-1 text-[13px] leading-5 text-muted-foreground tablet:text-sm',
      },
)
</script>

<template>
  <section class="flex items-center gap-3.5" :class="styles.root">
    <span v-if="props.icon" class="flex shrink-0 items-center justify-center" :class="styles.icon">
      <component
        :is="props.icon"
        :size="props.iconSize ?? 22"
        :stroke-width="variant === 'neon' ? 2.4 : 2"
        aria-hidden="true"
      />
    </span>

    <div class="min-w-0 flex-1">
      <!-- Title and chip share one row; the chip never wraps, a long title wraps beside it -->
      <div class="flex items-start justify-between gap-2">
        <h3 class="min-w-0 flex-1" :class="styles.title">
          {{ title }}
        </h3>

        <span v-if="props.chip" class="shrink-0 whitespace-nowrap" :class="styles.chip">
          {{ condition }}
        </span>
      </div>

      <p :class="styles.detail">{{ detail }}</p>
    </div>
  </section>
</template>
