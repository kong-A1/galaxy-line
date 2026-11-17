<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import { IconShieldLock } from '@tabler/icons-vue'

import { useDialogMotion } from '@/composables/useDialogMotion'

import BaseButton from '@/components/common/BaseButton.vue'

const uid = useId()
const titleId = `${uid}-title`
const bodyId = `${uid}-body`

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const motion = useDialogMotion(dialog)

// The only way out is asking for a new code, so Esc must not dismiss it
function onCancel(event: Event) {
  event.preventDefault()
}

async function close() {
  await motion.close()
}
</script>

<template>
  <dialog
    ref="dialog"
    role="alertdialog"
    :aria-labelledby="titleId"
    :aria-describedby="bodyId"
    class="anim-pop m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[22px] border border-neon-glass-border bg-neon-glass p-0 text-neon-ink shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    @cancel="onCancel"
  >
    <div class="flex flex-col px-6 pt-6 pb-5 text-center short:pt-5 short:pb-4">
      <span
        class="neon-tone-blue mx-auto flex size-12 items-center justify-center rounded-2xl text-white short:hidden"
      >
        <IconShieldLock :size="24" :stroke-width="2.4" aria-hidden="true" />
      </span>
      <h2
        :id="titleId"
        tabindex="-1"
        autofocus
        class="mt-4 mb-2 text-xl leading-7 font-semibold text-neon-ink outline-none short:mt-0 tablet:text-2xl tablet:leading-8"
      >
        {{ $t('auth.verify.lockedTitle') }}
      </h2>

      <i18n-t
        :id="bodyId"
        keypath="auth.verify.locked"
        tag="p"
        scope="global"
        class="text-base whitespace-pre-line text-neon-soft tablet:text-base"
      >
        <template #action>
          <strong class="font-semibold text-neon-ink">"{{ $t('auth.verify.resend') }}"</strong>
        </template>
      </i18n-t>

      <BaseButton
        block
        size="lg"
        rounded="full"
        color="neon-violet"
        class="mt-5 rounded-full! font-semibold short:mt-3 tablet:min-h-14! tablet:text-lg"
        @click="close"
      >
        {{ $t('common.understand') }}
      </BaseButton>
    </div>
  </dialog>
</template>
