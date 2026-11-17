<script setup lang="ts">
import BaseLogo from '@/components/common/BaseLogo.vue'
import StarField, { type Star } from '@/components/ui/StarField.vue'
import FloatingToolbar from '@/components/ui/FloatingToolbar.vue'

defineProps<{
  title: string
  eyebrow?: string
  subtitle?: string
  compact?: boolean
  back?: boolean
}>()

const emit = defineEmits<{
  back: []
}>()

// Stars around the logo (x/y are % of the hero box). They twinkle out of step: delay/duration in seconds
const sparkles: Star[] = [
  { x: 12, y: 40, size: 18, delay: 0, duration: 3 },
  { x: 86, y: 28, size: 14, delay: 1.2, duration: 3.6 },
  { x: 16, y: 82, size: 12, delay: 2.1, duration: 2.8 },
  { x: 84, y: 78, size: 20, delay: 0.6, duration: 3.3 },
]
</script>

<template>
  <header class="relative overflow-hidden bg-neon-glass text-center text-neon-ink">
    <FloatingToolbar variant="neon" :back="back" @back="emit('back')" />

    <!-- The background spans the full width; the content stays a readable column -->
    <div
      class="relative mx-auto max-w-md px-6 pt-[54px] md:max-w-xl"
      :class="compact ? 'pb-[58px]' : 'pb-[90px]'"
    >
      <StarField variant="outline" y-unit="%" :stars="sparkles" class="inset-0" />

      <div class="relative flex justify-center">
        <div class="flex rounded-tile bg-logo-tile p-1.5 shadow-lg ring-4 ring-neon-magenta/40">
          <BaseLogo variant="light" size="lg" rounded="lg" />
        </div>
      </div>

      <p v-if="eyebrow" class="relative mt-8 text-base tablet:text-lg">{{ eyebrow }}</p>

      <h1
        class="relative text-[28px] leading-10 font-bold tablet:text-[40px] tablet:leading-[48px]"
        :class="eyebrow ? 'mt-2' : 'mt-5'"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="relative mt-4.5 text-base text-neon-soft tablet:text-lg">
        {{ subtitle }}
      </p>

      <!-- Extra content under the title, e.g. the step indicator -->
      <div v-if="$slots.default" class="relative mt-[19px]">
        <slot />
      </div>
    </div>
  </header>
</template>
