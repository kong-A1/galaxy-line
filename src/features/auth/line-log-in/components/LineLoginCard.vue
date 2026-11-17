<script setup lang="ts">
import { IconBrandLine } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'

defineProps<{
  loading?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  login: []
}>()
</script>

<template>
  <div class="flex flex-col gap-5 text-center">
    <div class="anim-rise flex flex-col gap-2" style="animation-delay: 0.53s">
      <h1 class="text-[26px] leading-8 font-semibold tablet:text-[32px] tablet:leading-10">
        {{ $t('auth.lineLogIn.cardTitle') }}
      </h1>
      <p
        class="mx-auto max-w-[19rem] text-sm leading-[1.6] text-neon-soft tablet:max-w-[22rem] tablet:text-base"
      >
        {{ $t('auth.lineLogIn.cardDescription') }}
      </p>
    </div>

    <BaseButton
      block
      size="xl"
      rounded="full"
      color="neon"
      :icon="IconBrandLine"
      :loading="loading"
      :loading-text="loading ? $t('common.loading') : undefined"
      class="anim-rise rounded-full! text-lg tablet:min-h-16! tablet:text-xl"
      style="animation-delay: 0.6s"
      @click="emit('login')"
    >
      {{ $t('auth.lineLogIn.button') }}
    </BaseButton>

    <p v-if="errorMessage" role="alert" class="text-sm text-neon-error">{{ errorMessage }}</p>
  </div>
</template>
