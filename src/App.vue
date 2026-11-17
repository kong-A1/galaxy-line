<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '@/stores/loading.store'
import FullPageLoading from '@/components/ui/FullPageLoading.vue'

const loadingStore = useLoadingStore()
const { locale } = useI18n()

// Keep <html lang> in step with the language button so screen readers pick the right voice
watchEffect(() => {
  document.documentElement.lang = locale.value
})

onMounted(() => {
  loadingStore.showLoading()
})
</script>
<template>
  <FullPageLoading v-if="loadingStore.isLoading" />
  <RouterView />
</template>
