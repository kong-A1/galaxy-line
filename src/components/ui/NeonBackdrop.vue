<script setup lang="ts">
import { useRootClass } from '@/composables/useRootClass'

/**
 * The neon glow behind a screen. Pinned to the screen, not to the page: when the page is shorter than the screen (a phone keyboard
 * opened and closed and the browser has not resized the page back yet) the glow still fills everything behind it. It also makes the
 * page canvas neon while it is on screen, so no other colour can show through.
 */
useRootClass('neon-page')
</script>

<template>
  <div class="fixed inset-0 bg-neon-glass transition-colors duration-500" aria-hidden="true" />
</template>
