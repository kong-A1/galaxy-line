<script setup lang="ts">
import type { Component } from 'vue'

import BaseButton from '@/components/common/BaseButton.vue'

/** The round frosted button of the neon design (42px). `aria-label` and click listeners pass through to the button. */
defineProps<{ icon: Component }>()
</script>

<template>
  <BaseButton
    color="inverse"
    variant="plain"
    size="sm"
    icon-size="md"
    :icon="icon"
    class="neon-glass pointer-events-auto relative h-[42px]! backdrop-blur-xl min-h-[42px]! w-[42px]! rounded-full! px-0! text-neon-icon! after:absolute after:-inset-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-link"
  />
</template>
