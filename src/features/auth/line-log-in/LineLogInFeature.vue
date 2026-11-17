<script setup lang="ts">
import { IconBrandLine } from '@tabler/icons-vue'

import { useLineLogin } from '@/composables/auth/logic/useLineLogin'

import BaseLogo from '@/components/common/BaseLogo.vue'
import BrandWordmark from '@/components/ui/BrandWordmark.vue'
import NeonPage from '@/components/ui/NeonPage.vue'
import LineLoginCard from './components/LineLoginCard.vue'
import LineLoginFooter from './components/LineLoginFooter.vue'

const { isLoading, errorMessage, login: handleLineLogin } = useLineLogin()
</script>

<template>
  <NeonPage>
    <header class="flex flex-col items-center gap-2.5 pb-[18px] text-center">
      <BaseLogo
        glow
        size="none"
        rounded="none"
        class="anim-rise size-[104px] tablet:size-32"
        style="animation-delay: 0.25s"
      />
      <p
        class="anim-rise text-[40px] leading-[1.1] font-bold tracking-[0.06em] tablet:text-5xl"
        style="animation-delay: 0.32s"
      >
        <BrandWordmark />
      </p>
      <p class="anim-rise text-sm text-neon-soft tablet:text-base" style="animation-delay: 0.39s">
        {{ $t('auth.lineLogIn.heroSubtitle') }}
      </p>
    </header>

    <main class="flex flex-1 flex-col gap-5 pt-2">
      <div class="anim-rise mt-2 self-center" style="animation-delay: 0.46s">
        <span
          class="anim-float flex size-16 items-center justify-center rounded-[22px] border-[1.5px] border-white/45 bg-linear-to-br from-[#5cffa0] to-neon-green shadow-[0_0_22px_rgb(6_199_85/0.6),inset_0_3px_8px_rgb(255_255_255/0.45),inset_0_-6px_12px_rgb(0_0_0/0.25)]"
        >
          <IconBrandLine :size="32" stroke-width="2.4" class="text-white" aria-hidden="true" />
        </span>
      </div>

      <LineLoginCard :loading="isLoading" :error-message="errorMessage" @login="handleLineLogin" />

      <LineLoginFooter />
    </main>
  </NeonPage>
</template>
