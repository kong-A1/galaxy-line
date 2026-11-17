<script setup lang="ts">
import { onMounted } from 'vue'

import AppLayout from '@/layouts/AppLayout.vue'
import { useLoadingStore } from '@/stores/loading.store'

// App.vue shows the full-page loader on start; the signed-in area is ready to show
const loadingStore = useLoadingStore()
onMounted(() => loadingStore.hideLoading())
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
