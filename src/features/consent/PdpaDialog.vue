<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue'
import { IconShieldCheck } from '@tabler/icons-vue'

import { PRIVACY_URL, TERMS_URL, MARKETING_URL } from './consent.constants'

import BaseButton from '@/components/common/BaseButton.vue'
import { useDialogMotion } from '@/composables/useDialogMotion'

const emit = defineEmits<{
  accept: [consent: { terms: boolean; privacy: boolean; marketing: boolean }]
  decline: []
}>()

const uid = useId()
const titleId = `${uid}-title`
const introId = `${uid}-intro`

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const terms = ref(false)
const privacy = ref(false)
const marketing = ref(false)

const canAccept = computed(() => terms.value && privacy.value)
const motion = useDialogMotion(dialog)

function onCancel(event: Event) {
  event.preventDefault()
}

function onDocumentPress(event: MouseEvent, url: string | null) {
  event.stopPropagation()

  if (!url) {
    event.preventDefault()
    return
  }

  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  event.preventDefault()
  window.open(url, '_blank', 'noopener')
}

// The answer is given after the closing animation, so the popup is not removed while it is still fading
async function accept() {
  if (!canAccept.value) return

  if (await motion.close())
    emit('accept', { terms: terms.value, privacy: privacy.value, marketing: marketing.value })
}

// Declining leaves the page, which takes the popup with it, so it closes at once. Fading it first would show the page behind for a moment.
function decline() {
  dialog.value?.close()
  emit('decline')
}
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    :aria-describedby="introId"
    class="anim-pop m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[22px] border border-neon-glass-border bg-neon-glass p-0 text-neon-ink shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    @cancel="onCancel"
  >
    <div
      class="flex max-h-[min(92dvh,680px)] flex-col overflow-y-auto px-6 pt-6 pb-5 short:pt-5 short:pb-4"
    >
      <div class="text-center">
        <span
          class="neon-tone-pink mx-auto flex size-12 items-center justify-center rounded-2xl text-white short:hidden"
        >
          <IconShieldCheck :size="24" :stroke-width="2.4" aria-hidden="true" />
        </span>
        <h2
          :id="titleId"
          tabindex="-1"
          autofocus
          class="mt-4 text-xl leading-7 font-semibold text-neon-ink outline-none short:mt-0 tablet:text-2xl tablet:leading-8"
        >
          {{ $t('pdpa.title') }}
        </h2>
        <p
          :id="introId"
          class="mt-2 text-sm leading-5 text-neon-soft short:hidden tablet:text-base tablet:leading-6"
        >
          {{ $t('pdpa.intro') }}
        </p>
      </div>

      <div class="mt-5 space-y-3 short:mt-4 short:space-y-2">
        <label
          class="neon-glass flex cursor-pointer items-start gap-3 rounded-[14px] p-3.5 text-left short:p-3"
        >
          <input
            v-model="terms"
            type="checkbox"
            required
            class="mt-0.5 size-5 shrink-0 cursor-pointer accent-neon-accent"
          />
          <span class="text-sm leading-5 text-neon-ink tablet:text-base tablet:leading-6">
            {{ $t('pdpa.terms.before') }}
            <a
              v-if="TERMS_URL"
              :href="TERMS_URL"
              @click="onDocumentPress($event, TERMS_URL)"
              target="_blank"
              rel="noopener"
              class="font-bold text-neon-link underline"
            >
              {{ $t('pdpa.terms.link') }}
            </a>
            <strong
              v-else
              class="font-bold text-neon-link underline"
              @click="onDocumentPress($event, null)"
            >
              {{ $t('pdpa.terms.link') }}
            </strong>
            <span class="ml-1 text-neon-muted">
              {{ $t('pdpa.required') }}
            </span>
          </span>
        </label>

        <label
          class="neon-glass flex cursor-pointer items-start gap-3 rounded-[14px] p-3.5 text-left short:p-3"
        >
          <input
            v-model="privacy"
            type="checkbox"
            required
            class="mt-0.5 size-5 shrink-0 cursor-pointer accent-neon-accent"
          />
          <span class="text-sm leading-5 text-neon-ink tablet:text-base tablet:leading-6">
            {{ $t('pdpa.privacy.before') }}
            <a
              v-if="PRIVACY_URL"
              :href="PRIVACY_URL"
              @click="onDocumentPress($event, PRIVACY_URL)"
              target="_blank"
              rel="noopener"
              class="font-bold text-neon-link underline"
            >
              {{ $t('pdpa.privacy.link') }}
            </a>
            <strong
              v-else
              class="font-bold text-neon-link underline"
              @click="onDocumentPress($event, null)"
            >
              {{ $t('pdpa.privacy.link') }}
            </strong>
            <span class="ml-1 text-neon-muted">
              {{ $t('pdpa.required') }}
            </span>
          </span>
        </label>

        <label
          class="neon-glass flex cursor-pointer items-start gap-3 rounded-[14px] p-3.5 text-left short:p-3"
        >
          <input
            v-model="marketing"
            type="checkbox"
            class="mt-0.5 size-5 shrink-0 cursor-pointer accent-neon-accent"
          />
          <span class="text-sm leading-5 text-neon-ink tablet:text-base tablet:leading-6">
            {{ $t('pdpa.marketing.before') }}
            <a
              v-if="MARKETING_URL"
              :href="MARKETING_URL"
              @click="onDocumentPress($event, MARKETING_URL)"
              target="_blank"
              rel="noopener"
              class="font-bold text-neon-link underline"
            >
              {{ $t('pdpa.marketing.link') }}
            </a>
            <strong
              v-else
              class="font-bold text-neon-link underline"
              @click="onDocumentPress($event, null)"
            >
              {{ $t('pdpa.marketing.link') }}
            </strong>
            <span class="ml-1 text-neon-muted">{{ $t('pdpa.optional') }}</span>
          </span>
        </label>
      </div>
      <div class="space-y-4">
        <BaseButton
          block
          size="lg"
          rounded="full"
          color="neon-violet"
          :disabled="!canAccept"
          class="mt-5 rounded-full! font-semibold short:mt-3 tablet:min-h-14! tablet:text-lg"
          @click="accept"
        >
          {{ $t('pdpa.accept') }}
        </BaseButton>
        <BaseButton
          block
          size="lg"
          rounded="full"
          variant="text"
          color="neon-ghost"
          class="mt-1 rounded-full! short:min-h-10! tablet:min-h-14! tablet:text-lg"
          @click="decline"
        >
          {{ $t('pdpa.decline') }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>
