<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  current: number
  labels: string[]
}>()

// Width of the whole row; the connectors between the circles take what the circles leave
const WIDTH = 292
const CIRCLE = 40
// Space kept clear between a circle and the line that leaves or reaches it
const GAP = 22
</script>

<template>
  <ol
    class="relative mx-auto flex max-w-full items-center justify-between pb-6"
    :style="{ width: `${WIDTH}px` }"
  >
    <li
      v-for="(label, idx) in labels"
      :key="label"
      class="relative"
      :aria-current="idx + 1 === current ? 'step' : undefined"
    >
      <!-- Connector to the next step: a short line with a gap on each side of it, so it floats between the circles instead of touching them;
           it fills with colour once that step is reached -->
      <span
        v-if="idx < labels.length - 1"
        aria-hidden="true"
        class="absolute top-5 h-[3px] -translate-y-1/2 overflow-hidden rounded-[3px] bg-neon-ink/15"
        :style="{
          left: `calc(100% + ${GAP}px)`,
          width: `calc((${WIDTH}px - ${labels.length * CIRCLE}px) / ${labels.length - 1} - ${GAP * 2}px)`,
        }"
      >
        <span
          class="block h-full bg-linear-to-r from-neon-mint to-neon-magenta transition-[width] duration-500 motion-reduce:transition-none"
          :style="{ width: idx + 2 <= current ? '100%' : '0%' }"
        />
      </span>

      <span
        class="relative flex size-10 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300 motion-reduce:transition-none"
        :class="
          idx + 1 === current
            ? 'border-white/40 bg-linear-to-br from-neon-magenta to-neon-accent text-base font-bold text-white shadow-[0_0_20px_rgb(224_64_251/0.6)]'
            : idx + 1 < current
              ? 'border-white/40 bg-linear-to-br from-neon-mint to-neon-green-deep text-white shadow-[0_0_20px_rgb(46_229_157/0.6)]'
              : 'border-neon-ghost-border bg-neon-ghost-bg text-[15px] font-semibold text-neon-soft'
        "
      >
        <IconCheck v-if="idx + 1 < current" :size="18" :stroke-width="3" aria-hidden="true" />
        <template v-else>{{ idx + 1 }}</template>
      </span>

      <span
        class="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 text-sm whitespace-nowrap tablet:text-base"
        :class="idx + 1 <= current ? 'text-neon-ink' : 'text-neon-muted'"
      >
        {{ label }}
      </span>
    </li>
  </ol>
</template>
