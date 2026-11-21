<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IconTagStarred,
  IconRosetteDiscountCheck,
  IconGift,
  IconLogin2,
  IconUserPlus,
} from '@tabler/icons-vue'
import { useLineSession } from '@/composables/auth/logic/useLineSession'
import { useLoadingStore } from '@/stores/loading.store'
import { useSignInStore } from '@/stores/sign-in.store'
import type { SignInAction } from '@/types/auth/auth.type'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseLogo from '@/components/common/BaseLogo.vue'
import BrandWordmark from '@/components/ui/BrandWordmark.vue'
import CampaignCard from '@/components/ui/CampaignCard.vue'
import NeonPage from '@/components/ui/NeonPage.vue'

const { t } = useI18n()
const router = useRouter()
const loadingStore = useLoadingStore()
const { signIn } = useLineSession()

// LINE has already signed the person in by the time this page opens, so trade its token for ours right away.
// Getting one means this LINE account is already a member: straight to the app. Otherwise they stay to sign in or register.
// The loading cover stays up until that is known, so a member never sees this page flash by.
onMounted(async () => {
  if (await signIn()) await router.replace('/app')
  else loadingStore.hideLoading()
})

const benefits = computed(() => [
  {
    icon: IconTagStarred,
    tone: 'pink' as const,
    title: t('message.privileges.earnPoints.title'),
    detail: t('message.privileges.earnPoints.detail'),
    condition: t('message.privileges.earnPoints.condition', { baht: 25, point: 1 }),
  },
  {
    icon: IconRosetteDiscountCheck,
    tone: 'blue' as const,
    title: t('message.privileges.earnStamp.title'),
    detail: t('message.privileges.earnStamp.detail'),
    condition: t('message.privileges.earnStamp.condition', { stamp: 10, reward: 1 }),
  },
  {
    icon: IconGift,
    tone: 'gold' as const,
    title: t('message.privileges.exclusivePrivileges.title'),
    detail: t('message.privileges.exclusivePrivileges.detail'),
    condition: t('message.privileges.exclusivePrivileges.condition', { brand: t('common.brand') }),
  },
])

const signInStore = useSignInStore()

// Both buttons lead to sign-in. The button pressed is remembered first; the terms popup is asked there.
function onStart(action: SignInAction) {
  signInStore.setAction(action)
  loadingStore.showLoading()
  void router.push('/auth/sign-in')
}
</script>

<template>
  <NeonPage>
    <header class="flex flex-col items-center gap-3 pb-[22px] text-center">
      <BaseLogo
        glow
        size="none"
        rounded="none"
        class="anim-rise size-[104px] tablet:size-32"
        style="animation-delay: 0.25s"
      />
      <p class="anim-rise text-lg text-neon-soft tablet:text-xl" style="animation-delay: 0.32s">
        {{ $t('message.joinAs') }}
      </p>
      <i18n-t
        keypath="message.friendsOf"
        tag="h1"
        scope="global"
        class="anim-rise text-[30px] leading-[1.2] font-bold tablet:text-4xl"
        style="animation-delay: 0.39s"
      >
        <template #brand><BrandWordmark /></template>
      </i18n-t>
    </header>

    <main class="flex flex-1 flex-col gap-3.5 pt-2">
      <CampaignCard
        v-for="(benefit, idx) in benefits"
        :key="benefit.title"
        v-bind="benefit"
        variant="neon"
        chip
        class="anim-rise"
        :style="{ animationDelay: `${0.46 + idx * 0.07}s` }"
      />

      <div class="mt-1 flex flex-col gap-3.5">
        <BaseButton
          block
          size="xl"
          rounded="full"
          color="neon-violet"
          :icon="IconUserPlus"
          class="anim-rise rounded-full! text-lg font-semibold tablet:min-h-16! tablet:text-xl"
          style="animation-delay: 0.67s"
          @click="onStart('register')"
        >
          {{ $t('common.signUp') }}
        </BaseButton>
        <BaseButton
          block
          size="xl"
          rounded="full"
          color="neon-ghost"
          :icon="IconLogin2"
          class="anim-rise rounded-full! text-lg tablet:min-h-16! tablet:text-xl"
          style="animation-delay: 0.74s"
          @click="onStart('sign-in')"
        >
          {{ $t('common.signIn') }}
        </BaseButton>
      </div>
    </main>
  </NeonPage>
</template>
