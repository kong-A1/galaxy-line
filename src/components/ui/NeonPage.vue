<script setup lang="ts">
import NeonBackdrop from '@/components/ui/NeonBackdrop.vue'
import FloatingToolbar from '@/components/ui/FloatingToolbar.vue'
import StarField from '@/components/ui/StarField.vue'

/**
 * The frame of a neon-design screen: glow background, theme/language buttons, stars, and the content column
 * (full width below lg, centered 448px from lg up). Screens only fill the default slot.
 */
withDefaults(defineProps<{ back?: boolean; stars?: boolean }>(), { back: false, stars: true })

const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div class="relative min-h-dvh overflow-hidden text-neon-ink">
    <NeonBackdrop />
    <FloatingToolbar variant="neon" :back="back" @back="emit('back')" />
    <StarField v-if="stars" class="inset-x-0 top-0 mx-auto h-80 max-w-md md:max-w-xl lg:max-w-md" />

    <div
      class="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pt-[66px] pb-6 md:max-w-2xl"
    >
      <slot />
    </div>
  </div>
</template>
