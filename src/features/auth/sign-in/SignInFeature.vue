<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useSignInStep } from '@/composables/auth/logic/useSignInStep'
import { usePdpaStore } from '@/stores/pdpa.store'
import { useSignInStore } from '@/stores/sign-in.store'

import PdpaDialog from '@/features/consent/PdpaDialog.vue'
import BaseLogo from '@/components/common/BaseLogo.vue'
import BrandWordmark from '@/components/ui/BrandWordmark.vue'
import NeonPage from '@/components/ui/NeonPage.vue'
import AuthSteps from '@/features/auth/components/AuthSteps.vue'
import RegisterForm from './components/RegisterForm.vue'
import RequestOtpForm from './components/RequestOtpForm.vue'
import VerifyOtpForm from './components/VerifyOtpForm.vue'

const router = useRouter()
const { t } = useI18n()
const signInStore = useSignInStore()
const pdpa = usePdpaStore()
const { step, direction, goToVerify, goToRegister, goBack } = useSignInStep()

// The terms popup opens over this page until they are agreed to (asked once per version of the terms).
// Declining goes back to welcome, so the form is never used without consent.
function onAccept(consent: { terms: boolean; privacy: boolean; marketing: boolean }) {
  pdpa.accept(consent.terms, consent.privacy, consent.marketing)
}

// The register step only exists for someone who pressed the register button on the welcome page
const stepLabels = computed(() => [
  t('auth.steps.request'),
  t('auth.steps.verify'),
  ...(signInStore.action === 'register' ? [t('auth.steps.register')] : []),
])

// Clear the destination only after leaving: emptying it first would read as "no code on its way" and send the page back to step 1
async function leave() {
  await router.replace('/app')
  signInStore.clear()
}

// Someone who pressed register fills in their details next; everyone else is done
function onVerified() {
  signInStore.markVerified()
  if (signInStore.action === 'register') goToRegister()
  else void leave()
}

const steps = {
  request: 1,
  verify: 2,
  register: 3,
}
const stepActive = computed(() => steps[step.value])
</script>

<template>
  <NeonPage back @back="goBack">
    <!-- Stays put; only the section below changes between steps -->
    <header class="flex flex-col items-center gap-2.5 pb-[18px] text-center">
      <BaseLogo
        glow
        size="none"
        rounded="none"
        class="anim-rise size-[84px] tablet:size-28"
        style="animation-delay: 0.25s"
      />
      <p
        class="anim-rise text-[40px] leading-[1.1] font-bold tracking-[0.06em] tablet:text-5xl"
        style="animation-delay: 0.32s"
      >
        <BrandWordmark />
      </p>
      <AuthSteps
        class="anim-rise"
        style="animation-delay: 0.39s"
        :current="stepActive"
        :labels="stepLabels"
      />
    </header>

    <main class="flex flex-1 flex-col gap-[18px] pt-2">
      <Transition :name="`step-${direction}`" mode="out-in">
        <RequestOtpForm v-if="step === 'request'" key="request" @sent="goToVerify" />
        <VerifyOtpForm v-else-if="step === 'verify'" key="verify" @verified="onVerified" />
        <RegisterForm v-else key="register" @registered="leave" />
      </Transition>
    </main>

    <PdpaDialog
      v-if="pdpa.needsConsent"
      @accept="onAccept"
      @decline="router.replace('/auth/welcome')"
    />
  </NeonPage>
</template>
