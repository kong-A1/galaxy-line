<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 p-6">
    <div class="size-8 animate-spin rounded-full border-3 border-border border-t-primary" />
    <span class="text-muted">{{ message }}</span>
  </div>
</template>
