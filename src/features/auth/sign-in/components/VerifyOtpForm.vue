<script setup lang="ts">
import { nextTick, onMounted, useId, useTemplateRef } from 'vue'

import { useOtpVerification } from '@/composables/auth/logic/useOtpVerification'

import BaseButton from '@/components/common/BaseButton.vue'
import OtpInput from './OtpInput.vue'

const emit = defineEmits<{
  /** The code was accepted */
  verified: []
}>()

const verification = useOtpVerification()
const {
  code,
  error,
  notice,
  isVerifying,
  isBusy,
  isLocked,
  shownDestination,
  refCode,
  secondsLeft,
  isWaiting,
} = verification

const errorId = `${useId()}-error`
const otp = useTemplateRef<InstanceType<typeof OtpInput>>('otp')

// The boxes are disabled while a request runs and are cleared when a code is rejected or resent, so focus has to
// wait until both are applied to the DOM, or it lands on a stale "first empty" box or on a disabled one
async function refocus() {
  await nextTick()
  otp.value?.focusFirstEmpty()
}

async function submit() {
  if (await verification.verify()) {
    emit('verified')
    return
  }

  await refocus()
}

async function resend() {
  await verification.resend()
  await refocus()
}

onMounted(() => {
  verification.startCountdown()
  otp.value?.focusFirstEmpty()
})
</script>

<template>
  <form class="flex flex-col gap-[18px] text-center" novalidate @submit.prevent="submit">
    <div class="flex flex-col items-center gap-2">
      <h2 class="text-[26px] leading-8 font-semibold tablet:text-[32px] tablet:leading-10">
        {{ $t('auth.verify.title') }}
      </h2>
      <p class="text-sm text-neon-soft tablet:text-base">
        {{ $t('auth.verify.sentTo') }}
      </p>
      <p class="text-[22px] leading-7 font-semibold break-all text-neon-cyan tablet:text-2xl">
        {{ shownDestination }}
      </p>
      <p class="text-[13px] text-neon-muted tablet:text-sm">
        {{ $t('auth.verify.refCode', { code: refCode }) }}
      </p>
    </div>

    <OtpInput
      ref="otp"
      v-model="code"
      :invalid="!!error"
      :disabled="isBusy"
      :described-by="error ? errorId : undefined"
    />

    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="anim-fade text-sm leading-5 text-neon-error tablet:text-base"
    >
      {{ error }}
    </p>

    <BaseButton
      type="submit"
      block
      size="xl"
      rounded="full"
      color="neon-violet"
      :loading="isVerifying"
      :loading-text="isVerifying ? $t('auth.verify.checking') : undefined"
      class="rounded-full! text-lg font-semibold tablet:min-h-16! tablet:text-xl"
      :disabled="isLocked"
    >
      {{ $t('auth.verify.submit') }}
    </BaseButton>

    <div class="flex min-h-11 items-center justify-center">
      <!-- The ticking number is left out of the live region on purpose: announcing every second would be noise -->
      <i18n-t
        v-if="isWaiting"
        keypath="auth.verify.resendIn"
        tag="p"
        scope="global"
        class="text-sm text-neon-soft tablet:text-base"
      >
        <template #seconds>
          <strong class="font-semibold text-neon-ink">{{ secondsLeft }}</strong>
        </template>
      </i18n-t>
      <button
        v-else
        type="button"
        :disabled="isBusy"
        class="min-h-11 cursor-pointer px-2 text-sm font-bold text-neon-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-link disabled:opacity-60 tablet:text-base"
        @click="resend"
      >
        {{ $t('auth.verify.resend') }}
      </button>
    </div>

    <p role="status" class="sr-only">{{ notice }}</p>
  </form>
</template>
