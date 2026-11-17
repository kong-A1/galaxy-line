<script setup lang="ts">
import { computed, onMounted, useId, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSignInForm } from '@/composables/auth/logic/useSignInForm'

import type { SignInMethod } from '@/types/auth/auth.type'

import BaseButton from '@/components/common/BaseButton.vue'
import IdentifierField from './IdentifierField.vue'
import SignInTabs from './SignInTabs.vue'

const emit = defineEmits<{ sent: [] }>()

const { t } = useI18n()
const {
  method,
  value,
  error,
  isSubmitting,
  isReturning,
  isValid,
  markTouched,
  submit: send,
} = useSignInForm()

// Examples, not copy: the same in every language (and `@` would be read as vue-i18n link syntax)
const PLACEHOLDERS: Record<SignInMethod, string> = {
  phone: '81-234-5678',
  email: 'email@example.com',
}

const uid = useId()
const hintId = `${uid}-hint`
const errorId = `${uid}-error`
const inputId = `${uid}-input`
const field = useTemplateRef<InstanceType<typeof IdentifierField>>('field')

const methodLabels = computed(() => ({
  phone: t('auth.signIn.tabPhone'),
  email: t('auth.signIn.tabEmail'),
}))

async function submit() {
  if (await send()) {
    emit('sent')
  } else if (!isValid.value) {
    field.value?.focus()
  }
}

onMounted(() => {
  if (isReturning) field.value?.focus()
})
</script>

<template>
  <form class="flex flex-col gap-[18px]" novalidate @submit.prevent="submit">
    <SignInTabs v-model="method" :labels="methodLabels" :id-prefix="uid" />

    <div :id="`${uid}-panel`" role="tabpanel" :aria-labelledby="`${uid}-tab-${method}`">
      <IdentifierField
        ref="field"
        v-model="value"
        :method="method"
        :label="$t(method === 'phone' ? 'auth.signIn.phoneLabel' : 'auth.signIn.emailLabel')"
        :placeholder="PLACEHOLDERS[method]"
        :input-id="inputId"
        :described-by="error ? `${errorId} ${hintId}` : hintId"
        :invalid="!!error"
        :error-text="error"
        :error-id="errorId"
        @blur="markTouched()"
      />
    </div>

    <p
      :id="hintId"
      class="text-center text-[13px] leading-[1.6] whitespace-pre-line text-neon-soft tablet:text-sm"
    >
      {{ $t('auth.signIn.hint') }}
    </p>

    <BaseButton
      type="submit"
      block
      size="xl"
      rounded="full"
      color="neon-violet"
      :loading="isSubmitting"
      :loading-text="isSubmitting ? $t('auth.verify.sending') : undefined"
      class="rounded-full! text-lg font-semibold tablet:min-h-16! tablet:text-xl"
      @mousedown.prevent
    >
      {{ $t('auth.signIn.submit') }}
    </BaseButton>
  </form>
</template>
