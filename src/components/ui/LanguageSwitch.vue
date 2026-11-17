<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IconLanguage } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import GlassIconButton from '@/components/ui/GlassIconButton.vue'

/** `glass`: the round frosted look of the neon design */
defineProps<{ glass?: boolean }>()

const { locale } = useI18n()

function toggleLanguage() {
  locale.value = locale.value === 'th' ? 'en' : 'th'
}
</script>

<template>
  <GlassIconButton
    v-if="glass"
    :icon="IconLanguage"
    :aria-label="$t('a11y.toggleLanguage')"
    @click="toggleLanguage"
  />
  <BaseButton
    v-else
    variant="text"
    size="sm"
    :icon="IconLanguage"
    :aria-label="$t('a11y.toggleLanguage')"
    @click="toggleLanguage"
  />
</template>
