<route lang="yaml">
meta:
  title: meta.signIn
  header: false
  goBackButton: false
  fullBleed: true
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loading.store'

import SignInFeature from '@/features/auth/sign-in/SignInFeature.vue'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.hideLoading()
})
</script>

<template>
  <SignInFeature />
</template>
