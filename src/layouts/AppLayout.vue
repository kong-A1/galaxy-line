<script setup lang="ts">
import { ref } from 'vue'

import NeonBackdrop from '@/components/ui/NeonBackdrop.vue'

import AppTopBar from './components/AppTopBar.vue'
import AppTabBar from './components/AppTabBar.vue'

const scrolled = ref(false)

function onScroll(event: Event) {
  scrolled.value = (event.target as HTMLElement).scrollTop > 4
}
</script>

<template>
  <!-- The page never scrolls: <main> does, with the header floating over it, and the tab bar stays below. From lg up everything sits in one centered column -->
  <div>
    <NeonBackdrop />
    <div
      class="@container relative mx-auto flex h-dvh flex-col text-neon-ink transition-colors [--app-top:4.5rem] tablet:[--app-top:5.25rem] lg:max-w-md lg:border-x lg:border-neon-glass-border"
    >
      <AppTopBar :scrolled="scrolled" />

      <main class="min-h-0 flex-1 overflow-y-auto overscroll-contain" @scroll.passive="onScroll">
        <!-- Room for the floating header -->
        <div class="h-(--app-top)" aria-hidden="true" />
        <slot />
      </main>

      <AppTabBar />
    </div>
  </div>
</template>
