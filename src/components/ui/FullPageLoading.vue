<script setup lang="ts">
import BaseLogo from '@/components/common/BaseLogo.vue'

defineProps<{
  message?: string
}>()
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-neon-glass text-neon-ink transition-colors"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="relative flex size-20 items-center justify-center">
        <div class="loader absolute inset-0" />

        <BaseLogo size="none" rounded="none" class="absolute z-10 size-[50px]" />
      </div>

      <p v-if="message" class="text-sm text-neon-soft">
        {{ message }}
      </p>
    </div>
  </div>
</template>
