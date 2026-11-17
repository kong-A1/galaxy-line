<script setup lang="ts">
import BaseLogo from '@/components/common/BaseLogo.vue'

defineProps<{ name: string; code: string; tier: string }>()
</script>

<template>
  <section
    class="neon-card-member relative flex aspect-video flex-col justify-between gap-4 overflow-hidden rounded-[26px] p-5 text-white tablet:p-6"
  >
    <!-- Ring behind the corner, as in the design -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute -right-10 -bottom-[60px] size-[200px] rounded-full border-2 border-white/20"
    />

    <div class="relative flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-fl-sm font-semibold tracking-[0.14em] text-white/90 uppercase">
          {{ $t('app.home.memberLabel') }}
        </p>
        <h3 class="mt-1 text-fl-2xl font-semibold break-words">{{ name }}</h3>
      </div>

      <BaseLogo variant="dark" glow size="none" rounded="none" class="size-11" />
    </div>

    <div class="relative flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
      <div class="min-w-0">
        <p class="text-fl-sm text-white/90">{{ $t('app.home.memberCode') }}</p>
        <p class="mt-0.5 text-fl-lg font-semibold tracking-[0.08em] whitespace-nowrap">
          {{ code }}
        </p>
      </div>

      <span
        v-if="tier"
        class="neon-chip-gold shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold tracking-[0.08em] uppercase"
      >
        {{ tier }}
      </span>
    </div>
  </section>
</template>
