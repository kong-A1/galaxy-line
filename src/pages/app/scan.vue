<script setup lang="ts">
import { IconCamera } from '@tabler/icons-vue'
</script>

<template>
  <section class="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-16 text-center">
    <IconCamera :size="40" class="text-primary" aria-hidden="true" />
    <h2 class="text-fl-2xl font-semibold">{{ $t('app.nav.scan') }}</h2>
  </section>
</template>
