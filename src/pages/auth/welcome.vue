<route lang="yaml">
meta:
  title: meta.welcome
  header: false
  goBackButton: false
  fullBleed: true
</route>

<script setup lang="ts">
import WelcomeFeature from '@/features/auth/welcome/WelcomeFeature.vue'
</script>

<template>
  <WelcomeFeature />
</template>
