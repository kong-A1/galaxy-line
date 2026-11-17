<script setup lang="ts">
import { ref } from 'vue'
import { IconQrcode } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseError from '@/components/common/BaseError.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import { useHomeSummary } from '@/composables/member/logic/useHomeSummary'

import MemberCard from './components/MemberCard.vue'
import MemberQrDialog from './components/MemberQrDialog.vue'
import NextTierCard from './components/NextTierCard.vue'
import PrivilegeCard from './components/PrivilegeCard.vue'

const { member, isPending, isError, error, refetch, fullName, points, expiringPoints, tier } =
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
        <div class="flex items-center justify-between gap-3">
          <p class="text-fl-sm text-neon-soft">{{ $t('app.home.availablePoints') }}</p>
          <p class="neon-text-points shrink-0 text-fl-3xl font-bold">{{ points }}</p>
        </div>

        <div v-if="expiringPoints" class="flex items-center justify-between gap-3">
          <p class="min-w-0 text-fl-sm text-neon-soft">{{ $t('app.home.expiringPoints') }}</p>
          <p class="neon-text-points shrink-0 text-fl-xl font-bold">{{ expiringPoints }}</p>
        </div>

        <BaseButton
          block
          size="lg"
          rounded="full"
          color="neon-violet"
          :icon="IconQrcode"
          class="rounded-full! font-semibold"
          @click="qrOpen = true"
        >
          {{ $t('app.home.scanForPoints') }}
        </BaseButton>
      </section>

      <NextTierCard
        v-if="tier?.next"
        class="anim-rise"
        style="animation-delay: 0.14s"
        :current="tier.current"
        :next="tier.next"
        :remaining="tier.remaining"
        :spent="tier.spent"
        :target="tier.target"
        :percent="tier.percent"
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
          <RouterLink
            to="/app/campaigns"
            class="text-fl-sm font-medium text-neon-link! no-underline hover:underline"
          >
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
