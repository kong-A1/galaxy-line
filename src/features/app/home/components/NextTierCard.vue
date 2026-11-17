<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: string
  next: string
  remaining: string
  spent: string
  target: string
  percent: number
}>()

// How far along the member is decides the colour of the amount and the spending figure:
// 0-49% secondary, 50-89% warning, 90% and over success
const status = computed(() =>
  props.percent >= 90
    ? { text: 'text-success' }
    : props.percent >= 50
      ? { text: 'text-warning' }
      : { text: 'text-secondary' },
)

// The bar runs through the same three colours along its whole length and shows as much of it as has been reached
const BAR_COLOURS =
  'linear-gradient(to right, var(--secondary) 0%, var(--warning) 50%, var(--success) 90%)'
const barStyle = computed(() => ({
  width: `${props.percent}%`,
  backgroundImage: BAR_COLOURS,
  // Stretch the gradient over the whole track, not just over the filled part
  backgroundSize: props.percent > 0 ? `${10000 / props.percent}% 100%` : undefined,
}))
</script>

<template>
  <section class="neon-glass rounded-[22px] px-[18px] py-4">
    <!-- The amount is picked out in the text itself, so it works in every language order -->
    <i18n-t
      keypath="app.home.spendMore"
      tag="p"
      scope="global"
      class="text-fl-base font-medium break-words text-neon-ink"
    >
      <template #amount>
        <strong class="font-bold" :class="status.text">{{ remaining }}</strong>
      </template>
      <template #tier>{{ next }}</template>
    </i18n-t>

    <!-- Above the bar on its own line, so the sentence always has the whole width -->
    <p
      class="mt-3 text-right text-fl-sm font-bold whitespace-nowrap tabular-nums"
      :class="status.text"
    >
      {{ `${spent} / ${target}` }}
    </p>

    <div
      class="relative mt-1 h-2 rounded-full bg-neon-ink/12"
      role="progressbar"
      :aria-valuenow="percent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="$t('app.home.nextTier', { tier: next })"
    >
      <div
        class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
        :style="barStyle"
      />
    </div>

    <div class="mt-2 flex justify-between gap-3 text-fl-sm text-neon-muted">
      <span>{{ current }}</span>
      <span>{{ next }}</span>
    </div>
  </section>
</template>
