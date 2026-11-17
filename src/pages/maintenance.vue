<route lang="yaml">
meta:
  title: meta.maintenance
  public: true
  header: false
  goBackButton: false
  fullBleed: true
</route>

<script setup lang="ts">
import MaintenanceFeature from '@/features/maintenance/MaintenanceFeature.vue'
</script>

<template>
  <MaintenanceFeature />
</template>
