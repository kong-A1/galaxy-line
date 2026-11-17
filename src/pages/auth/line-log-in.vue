<route lang="yaml">
meta:
  title: meta.lineLogIn
  header: false
  goBackButton: false
  fullBleed: true
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loading.store'

import LineLogInFeature from '@/features/auth/line-log-in/LineLogInFeature.vue'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.hideLoading()
})
</script>

<template>
  <LineLogInFeature />
</template>
