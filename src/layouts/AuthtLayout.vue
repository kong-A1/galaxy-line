<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const isHeader = computed(() => route.meta.header ?? true)
const isGoBack = computed(() => route.meta.goBackButton ?? true)
const isFullBleed = computed(() => route.meta.fullBleed ?? false)
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground transition-colors">
    <AppHeader v-if="isHeader" :is-go-back="isGoBack" />

    <!-- Fixed to the viewport: if the page is ever taller than the screen, only this scrolls, not the body -->
    <main v-if="isFullBleed" class="h-dvh w-full overflow-y-auto overscroll-contain">
      <slot />
    </main>

    <main
      v-else
      class="flex min-h-dvh w-full justify-center p-6"
      :class="isHeader ? 'pt-22' : 'items-center'"
    >
      <div class="my-auto w-full flex justify-center">
        <slot />
      </div>
    </main>
  </div>
</template>
