<script setup lang="ts">
import { IconMoon, IconSun } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import GlassIconButton from '@/components/ui/GlassIconButton.vue'
import { useThemeStore } from '@/stores/theme'

/** `glass`: the round frosted look of the neon design */
defineProps<{ glass?: boolean }>()

const themeStore = useThemeStore()
</script>

<template>
  <GlassIconButton
    v-if="glass"
    :icon="themeStore.isDark ? IconSun : IconMoon"
    :aria-label="$t('a11y.toggleTheme')"
    @click="themeStore.toggleTheme"
  />
  <BaseButton
    v-else
    variant="text"
    size="sm"
    :icon="themeStore.isDark ? IconSun : IconMoon"
    :aria-label="$t('a11y.toggleTheme')"
    @click="themeStore.toggleTheme"
  />
</template>
