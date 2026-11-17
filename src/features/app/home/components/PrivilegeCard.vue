<script setup lang="ts">
import { IconStar } from '@tabler/icons-vue'

defineProps<{ title: string; detail: string; accent?: boolean }>()
</script>

<template>
  <article class="neon-glass flex flex-col overflow-hidden rounded-[22px]">
    <div
      class="flex h-[70px] items-center justify-center bg-linear-to-br"
      :class="accent ? 'from-[#22d3ee] to-neon-accent' : 'from-neon-magenta to-neon-accent'"
    >
      <!-- A soft white orb with the star on it -->
      <span
        class="flex size-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,rgb(255_255_255/0.35)_70%)] text-neon-accent shadow-[0_0_20px_rgb(255_255_255/0.8)]"
      >
        <IconStar :size="22" :stroke-width="2.2" aria-hidden="true" />
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-1.5 p-3">
      <h4 class="text-fl-base leading-[1.3] font-semibold text-neon-ink">{{ title }}</h4>
      <p class="text-fl-sm leading-normal text-neon-soft">{{ detail }}</p>
    </div>
  </article>
</template>
