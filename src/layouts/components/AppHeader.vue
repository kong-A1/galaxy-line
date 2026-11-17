<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { IconArrowLeft } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import LanguageSwitch from '@/components/ui/LanguageSwitch.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const props = withDefaults(
  defineProps<{
    isTitle?: boolean
    isGoBack?: boolean
    isChangLang?: boolean
    isThemeToggle?: boolean
  }>(),
  {
    isGoBack: true,
    isTitle: true,
    isChangLang: true,
    isThemeToggle: true,
  },
)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function goBack() {
  router.back()
}

const pageTitle = computed(() => {
  return route.meta.title ? t(route.meta.title as string) : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 text-foreground shadow-xs transition-colors"
  >
    <!-- Back Button -->
    <BaseButton
      v-if="props.isGoBack"
      variant="text"
      size="sm"
      :icon="IconArrowLeft"
      aria-label="Go back"
      @click="goBack"
    />

    <!-- App Title -->
    <h1 v-if="props.isTitle" class="text-xl text-primary font-semibold">{{ pageTitle }}</h1>

    <!-- Right Actions -->
    <div class="flex items-center gap-1">
      <ThemeToggle v-if="props.isThemeToggle" />

      <LanguageSwitch v-if="props.isChangLang" />
    </div>
  </header>
</template>
