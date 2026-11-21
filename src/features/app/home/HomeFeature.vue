<script setup lang="ts">
import { ref } from 'vue'
import { IconClock, IconQrcode, IconStarFilled } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseError from '@/components/common/BaseError.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import { useHomeSummary } from '@/composables/member/logic/useHomeSummary'

import MemberCard from './components/MemberCard.vue'
import MemberQrDialog from './components/MemberQrDialog.vue'
import TierStatusCard from './components/TierStatusCard.vue'
import PrivilegeCard from './components/PrivilegeCard.vue'

const { member, isPending, isError, error, refetch, fullName, points, expiring, tier } =
  useHomeSummary()

const qrOpen = ref(false)

// Placeholders until there is an API for privileges; the text lives in the locale files
const privileges = [
  { title: 'app.home.privilege1Title', detail: 'app.home.privilege1Detail' },
  { title: 'app.home.privilege2Title', detail: 'app.home.privilege2Detail' },
]
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col gap-3.5 px-5 pt-2 pb-8 md:max-w-xl lg:max-w-md">
    <MemberCard
      v-if="member"
      class="anim-rise"
      :name="fullName"
      :code="member.member_profile.member_code"
      :tier="member.member_tier.tier_code"
    />
    <div v-else class="neon-glass aspect-video rounded-[26px]" aria-hidden="true" />

    <BaseLoading v-if="isPending" />
    <BaseError v-else-if="isError && error" :message="error.message" @retry="refetch" />

    <template v-else-if="member">
      <section
        class="neon-glass anim-rise flex flex-col gap-3.5 rounded-[22px] px-[18px] py-4"
        style="animation-delay: 0.07s"
      >
        <div class="flex items-center gap-3.5">
          <!-- The gold icon tile of the welcome page -->
          <span
            class="neon-tone-gold flex size-12 shrink-0 items-center justify-center rounded-2xl text-white"
          >
            <IconStarFilled :size="24" aria-hidden="true" />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p class="text-fl-sm text-neon-soft">{{ $t('app.home.availablePoints') }}</p>
            <p class="flex items-baseline gap-2">
              <span class="neon-text-points text-[34px] leading-[1.1] font-bold">{{ points }}</span>
              <span class="text-fl-base text-neon-soft">{{ $t('app.home.pointsUnit') }}</span>
            </p>
          </div>
        </div>

        <div
          v-if="expiring"
          class="flex items-center gap-3 rounded-2xl border border-[#ffbe78]/35 bg-[#ffb020]/10 px-3.5 py-3"
        >
          <span
            class="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#ffb020]/18 text-[#b45309] dark:text-[#ffb020]"
          >
            <IconClock :size="18" :stroke-width="2.4" aria-hidden="true" />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p class="flex items-baseline justify-between gap-2">
              <span class="text-fl-sm font-medium text-neon-ink">{{
                $t('app.home.expiringPoints')
              }}</span>
              <span class="text-fl-base font-bold whitespace-nowrap text-neon-ink">
                {{ expiring.points }}
                <span class="text-fl-sm font-normal text-neon-soft">{{
                  $t('app.home.pointsUnit')
                }}</span>
              </span>
            </p>
            <p v-if="expiring.date" class="text-xs text-neon-muted">
              {{ $t('app.home.expiresOn', { date: expiring.date }) }}
            </p>
          </div>
        </div>

        <BaseButton
          block
          size="lg"
          rounded="full"
          color="neon-violet"
          :icon="IconQrcode"
          class="min-h-[50px]! rounded-full! text-base font-semibold"
          @click="qrOpen = true"
        >
          {{ $t('app.home.scanForPoints') }}
        </BaseButton>
      </section>

      <TierStatusCard
        v-if="tier"
        class="anim-rise"
        style="animation-delay: 0.14s"
        :current-tier="tier.current"
        :next-tier="tier.next ? { name: tier.next, threshold: tier.threshold } : null"
        :spend="tier.spend"
        :tier-expiry-date="tier.expiryDate"
        :spend-this-period="tier.spendThisPeriod"
        :maintain-threshold="tier.maintainThreshold"
      />

      <section
        aria-labelledby="top-privileges"
        class="anim-rise mt-1"
        style="animation-delay: 0.21s"
      >
        <div class="mb-3.5 flex items-center justify-between gap-3">
          <h3 id="top-privileges" class="text-fl-lg font-semibold text-neon-ink">
            {{ $t('app.home.topPrivileges') }}
          </h3>
          <RouterLink to="/app/campaigns" class="text-fl-sm font-medium text-neon-link! underline">
            {{ $t('app.home.seeAll') }}
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <PrivilegeCard
            v-for="(item, index) in privileges"
            :key="item.title"
            :title="$t(item.title)"
            :detail="$t(item.detail)"
            :accent="index % 2 === 1"
          />
        </div>
      </section>
    </template>
  </div>

  <MemberQrDialog v-if="qrOpen" @close="qrOpen = false" />
</template>
