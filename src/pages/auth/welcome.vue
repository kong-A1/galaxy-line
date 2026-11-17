<route lang="yaml">
meta:
  title: meta.welcome
  header: false
  goBackButton: false
  fullBleed: true
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loading.store'

import WelcomeFeature from '@/features/auth/welcome/WelcomeFeature.vue'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.hideLoading()
})
</script>

<template>
  <WelcomeFeature />
</template>
