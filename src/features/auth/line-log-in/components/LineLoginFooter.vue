<script setup lang="ts">
import { IconLock } from '@tabler/icons-vue'

withDefaults(
  defineProps<{
    termsUrl?: string
  }>(),
  {
    termsUrl: '#',
  },
)
</script>

<template>
  <footer
    class="anim-rise flex flex-col items-center gap-2 text-center text-[13px] text-neon-muted tablet:text-sm"
    style="animation-delay: 0.67s"
  >
    <p>
      {{ $t('auth.lineLogIn.consent') }}
      <a
        :href="termsUrl"
        target="_blank"
        rel="noopener"
        class="font-medium text-neon-link! underline hover:text-neon-ink!"
      >
        {{ $t('auth.lineLogIn.terms') }}
      </a>
    </p>

    <p class="flex items-center justify-center gap-1.5">
      <IconLock :size="16" class="text-neon-lock" aria-hidden="true" />
      {{ $t('auth.lineLogIn.secure') }}
    </p>

    <p class="mt-1.5">
      {{ $t('auth.lineLogIn.poweredBy', { brand: $t('common.brand').toUpperCase() }) }}
    </p>
  </footer>
</template>
