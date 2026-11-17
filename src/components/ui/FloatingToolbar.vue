<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import GlassIconButton from '@/components/ui/GlassIconButton.vue'
import LanguageSwitch from '@/components/ui/LanguageSwitch.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

withDefaults(
  defineProps<{
    /** Also show a back button in the opposite corner */
    back?: boolean
    /** `neon`: the round glass buttons of the neon design (42px, follow the light/dark template colours) */
    variant?: 'hero' | 'neon'
  }>(),
  { back: false, variant: 'hero' },
)

const emit = defineEmits<{
  back: []
}>()

// Frosted glass of the purple hero: the tint keeps the white icon visible over both the purple hero and the light sheet.
// The ::after grows the touch target from 36px to 44px without changing how it looks.
const heroButton = {
  color: 'inverse',
  variant: 'plain',
  class:
    'pointer-events-auto relative min-h-9! rounded-full! bg-[#12002a]/40 ring-1 ring-galaxy-light/40 backdrop-blur-2xl after:absolute after:-inset-1 hover:bg-[#12002a]/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
} as const
</script>

<template>
  <!-- Fixed so it stays put while the page scrolls. Below lg (phones and iPad portrait) the page is full width (screen corner);
       from lg up the page is a centered column, so the buttons follow that column's corner -->
  <div class="pointer-events-none fixed inset-x-0 top-0 z-20">
    <div
      class="flex justify-between gap-3 pt-4 lg:mx-auto lg:max-w-md"
      :class="variant === 'neon' ? 'px-5' : 'px-3.5'"
    >
      <template v-if="back">
        <GlassIconButton
          v-if="variant === 'neon'"
          :icon="IconChevronLeft"
          :aria-label="$t('a11y.back')"
          @click="emit('back')"
        />
        <BaseButton
          v-else
          v-bind="heroButton"
          size="sm"
          :icon="IconChevronLeft"
          :aria-label="$t('a11y.back')"
          @click="emit('back')"
        />
      </template>
      <span v-else />

      <div class="flex gap-3">
        <template v-if="variant === 'neon'">
          <ThemeToggle glass />
          <LanguageSwitch glass />
        </template>
        <template v-else>
          <ThemeToggle v-bind="heroButton" />
          <LanguageSwitch v-bind="heroButton" />
        </template>
      </div>
    </div>
  </div>
</template>
