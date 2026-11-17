<script setup lang="ts">
import { computed } from 'vue'

import BaseSegmented from '@/components/common/BaseSegmented.vue'

import type { SignInMethod } from '@/types/auth/auth.type'

const method = defineModel<SignInMethod>({ required: true })

const props = defineProps<{
  labels: Record<SignInMethod, string>
  /** Prefix for the tab and panel ids, so the view can link its tabpanel back with aria-labelledby */
  idPrefix: string
}>()

const options = computed(() => [
  { value: 'phone' as const, label: props.labels.phone },
  { value: 'email' as const, label: props.labels.email },
])
</script>

<template>
  <BaseSegmented v-model="method" :options="options" :id-prefix="idPrefix" />
</template>
