<script setup lang="ts">
defineProps<{
  message: string | null
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    role="alert"
  >
    <p>{{ message }}</p>

    <button type="button" class="mt-3 underline" @click="$emit('retry')">Try again</button>
  </div>
</template>
