<script setup lang="ts">
import { IconDiamond, IconShieldCheck, IconTrendingUp } from '@tabler/icons-vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { hasExpiry, resolveTierStatus } from '@/utils/memberTier'

/**
 * The membership-tier card. One component, three states picked from the props:
 * climbing to the next tier, on the top tier, or on the top tier but still to maintain it.
 */
const props = defineProps<{
  currentTier: string
  /** Null when there is no tier after the current one */
  nextTier: { name: string; threshold: number } | null
  spend: number
  /** Last day the tier is held; null / empty for a tier that never expires */
  tierExpiryDate?: string | null
  spendThisPeriod?: number
  maintainThreshold?: number | null
}>()

const { locale } = useI18n()
const numberFormat = computed(() => new Intl.NumberFormat(locale.value))
const dateFormat = computed(
  () => new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short', year: 'numeric' }),
)
const fmt = (value: number) => numberFormat.value.format(Math.max(Math.round(value), 0))

const status = computed(() =>
  resolveTierStatus({
    nextTier: props.nextTier,
    spend: props.spend,
    tierExpiryDate: props.tierExpiryDate ?? null,
    spendThisPeriod: props.spendThisPeriod ?? 0,
    maintainThreshold: props.maintainThreshold ?? null,
  }),
)

const expiry = computed(() =>
  hasExpiry(props.tierExpiryDate) ? dateFormat.value.format(new Date(props.tierExpiryDate)) : '',
)

const percent = computed(() => {
  const s = status.value
  return s.kind === 'max' ? 0 : Math.round(s.percent)
})

// How far along the member is decides the colour of the amount and the spending figure:
// 0-49% secondary, 50-89% warning, 90% and over success
// (light mode uses darker shades of the same colours so the text stays readable on white)
const tone = computed(() =>
  percent.value >= 90
    ? 'text-[#2f7a00] dark:text-success'
    : percent.value >= 50
      ? 'text-[#8a5a00] dark:text-warning'
      : 'text-[#5c6068] dark:text-secondary',
)

// The bar runs through the same three colours along its whole length and shows as much of it as has been reached
const BAR_COLOURS =
  'linear-gradient(to right, var(--secondary) 0%, var(--warning) 50%, var(--success) 90%)'
const barStyle = computed(() => ({
  width: `${percent.value}%`,
  backgroundImage: BAR_COLOURS,
  // Stretch the gradient over the whole track, not just over the filled part
  backgroundSize: percent.value > 0 ? `${10000 / percent.value}% 100%` : undefined,
}))

// The figure under the bar: spending against what the next tier (or keeping this one) asks for
const progressText = computed(() => {
  const s = status.value
  if (s.kind === 'maintain')
    return `${fmt(props.spendThisPeriod ?? 0)} / ${fmt(props.maintainThreshold ?? 0)}`
  return `${fmt(Math.min(props.spend, props.nextTier?.threshold ?? props.spend))} / ${fmt(props.nextTier?.threshold ?? 0)}`
})
const remainingText = computed(() => {
  const s = status.value
  return s.kind === 'climbing' || s.kind === 'maintain' ? fmt(s.remaining) : ''
})
const isTop = computed(() => status.value.kind === 'max' || status.value.kind === 'maintain')
</script>

<template>
  <!-- Top tier: its own card, not the climbing card with zeros in it -->
  <section
    v-if="isTop"
    class="flex flex-col gap-3 rounded-[22px] border border-[#a5f3fc]/45 bg-linear-to-br from-[#cffafe]/70 to-[#ede9fe]/80 px-[18px] py-4 shadow-[0_0_28px_rgb(94_231_255/0.2)] dark:from-[#5ee7ff]/12 dark:to-[#8b5cf6]/18 dark:shadow-[0_0_30px_rgb(94_231_255/0.12)]"
  >
    <div class="flex items-center gap-3.5">
      <span
        aria-hidden="true"
        class="flex size-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-linear-to-br from-[#e0fbff] via-[#5ee7ff] to-[#8b5cf6] text-[#1a1033] shadow-[0_0_22px_rgb(94_231_255/0.55),inset_0_2px_6px_rgb(255_255_255/0.5)]"
      >
        <IconDiamond :size="26" :stroke-width="2" />
      </span>

      <div class="flex min-w-0 flex-col items-start gap-1">
        <span
          class="rounded-full bg-linear-to-r from-[#5ee7ff] to-[#b794ff] px-2.5 py-0.5 text-[11px] font-bold text-[#1a1033]"
        >
          {{ $t('app.home.maxBadge') }}
        </span>
        <h3 class="text-fl-lg font-semibold break-words text-neon-ink">
          {{ $t('app.home.maxTitle', { tier: currentTier }) }}
        </h3>
      </div>
    </div>

    <!-- Maintaining: still short of the yearly requirement -->
    <template v-if="status.kind === 'maintain'">
      <i18n-t
        keypath="app.home.maintainMore"
        tag="p"
        scope="global"
        class="text-fl-sm break-words text-neon-soft"
      >
        <template #amount>
          <strong class="font-bold" :class="tone">{{ remainingText }}</strong>
        </template>
        <template #date>
          <strong class="font-semibold text-neon-ink">{{ expiry }}</strong>
        </template>
        <template #tier>{{ currentTier }}</template>
      </i18n-t>

      <div
        class="h-2 overflow-hidden rounded-full bg-neon-ink/12"
        role="progressbar"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="$t('app.home.maintainLabel', { tier: currentTier })"
      >
        <div
          class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
          :style="barStyle"
        />
      </div>
      <p class="text-right text-xs font-semibold tabular-nums" :class="tone">
        {{ $t('app.home.amountOfBaht', { value: progressText }) }}
      </p>
    </template>

    <template v-else>
      <p class="text-fl-sm text-neon-soft">{{ $t('app.home.maxDetail') }}</p>

      <p
        v-if="status.kind === 'max' && status.showExpiry"
        class="flex items-start justify-between gap-3 rounded-xl bg-neon-ink/6 px-3 py-2 text-fl-sm"
      >
        <span class="flex min-w-0 items-center gap-2 text-neon-soft">
          <IconShieldCheck
            :size="18"
            :stroke-width="2.2"
            class="shrink-0 text-[#0e7490] dark:text-[#5ee7ff]"
            aria-hidden="true"
          />
          {{ $t('app.home.maintainUntil') }}
        </span>
        <strong class="text-right font-semibold text-neon-ink tabular-nums">{{ expiry }}</strong>
      </p>
    </template>

    <RouterLink
      to="/app/campaigns"
      class="text-fl-sm text-end underline font-medium break-words text-neon-link!"
    >
      {{ $t('app.home.viewTierPrivileges', { tier: currentTier }) }}
    </RouterLink>
  </section>

  <!-- Climbing to the next tier -->
  <section
    v-else-if="nextTier"
    class="flex flex-col gap-3 rounded-[22px] border border-[#a5f3fc]/45 bg-linear-to-br from-[#cffafe]/70 to-[#ede9fe]/80 px-[18px] py-4 shadow-[0_0_28px_rgb(94_231_255/0.2)] dark:from-[#5ee7ff]/12 dark:to-[#8b5cf6]/18 dark:shadow-[0_0_30px_rgb(94_231_255/0.12)]"
  >
    <div class="flex items-center gap-3">
      <span
        aria-hidden="true"
        class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-linear-to-br from-[#e0fbff] via-[#5ee7ff] to-[#8b5cf6] text-[#1a1033] shadow-[0_0_22px_rgb(94_231_255/0.55),inset_0_2px_6px_rgb(255_255_255/0.5)]"
      >
        <IconTrendingUp :size="26" :stroke-width="2.2" />
      </span>
      <!-- The chip, with the sentence under it; the amount is picked out in the text itself, so it works in every language order -->
      <div class="flex min-w-0 flex-col items-start gap-1">
        <span
          class="rounded-full bg-linear-to-r from-[#5ee7ff] to-[#b794ff] px-2.5 py-0.5 text-[11px] font-bold text-[#1a1033]"
        >
          {{ $t('app.home.nextTierBadge') }}
        </span>
        <p v-if="status.kind === 'reached'" class="text-fl-sm break-words text-neon-soft">
          {{ $t('app.home.tierReached', { tier: nextTier.name }) }}
        </p>
        <i18n-t
          v-else
          keypath="app.home.spendMore"
          tag="p"
          scope="global"
          class="text-[13px] break-words text-neon-soft tablet:text-fl-sm"
        >
          <template #amount>
            <strong class="font-bold" :class="tone">{{ remainingText }}</strong>
          </template>
          <template #tier>
            <span
              class="bg-linear-to-r from-[#5b21b6] to-[#0891b2] bg-clip-text font-bold text-transparent capitalize dark:from-[#a5f3fc] dark:to-[#c4b5fd]"
              >{{ nextTier.name }}</span
            >
          </template>
        </i18n-t>
      </div>
    </div>

    <div
      class="h-2 overflow-hidden rounded-full bg-neon-ink/12"
      role="progressbar"
      :aria-valuenow="percent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="$t('app.home.nextTier', { tier: nextTier.name })"
    >
      <div
        class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
        :style="barStyle"
      />
    </div>

    <!-- Names may wrap on a narrow screen, so the three parts share the row and never sit on top of each other -->
    <div
      class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-2 text-xs text-neon-muted"
    >
      <span class="break-words capitalize">{{ currentTier }}</span>
      <span class="text-center font-bold tabular-nums" :class="tone">
        {{ $t('app.home.amountOfBaht', { value: progressText }) }}
      </span>
      <span class="text-right break-words capitalize">{{ nextTier.name }}</span>
    </div>
  </section>
</template>
