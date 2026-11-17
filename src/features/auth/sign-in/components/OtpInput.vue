<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { applyOtpInput, digitsOnly, OTP_LENGTH } from '@/utils/otp'

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    length?: number
    invalid?: boolean
    disabled?: boolean
    describedBy?: string
  }>(),
  { length: OTP_LENGTH },
)

const { t } = useI18n()
const boxes = useTemplateRef<HTMLInputElement[]>('boxes')

const toDigits = (value: string) => Array.from({ length: props.length }, (_, i) => value[i] ?? '')
// A box can be empty while the next one is filled, so the boxes are kept as an array and joined for the model
const digits = ref<string[]>(toDigits(model.value))

// The parent clears the code after a wrong answer or a resend
watch(model, (value) => {
  if (value !== digits.value.join('')) digits.value = toDigits(value)
})

function commit(next: string[]) {
  digits.value = next
  model.value = next.join('')
}

async function focusAt(index: number) {
  await nextTick()
  boxes.value?.[index]?.focus()
}

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const { digits: next, focusIndex } = applyOtpInput(digits.value, index, input.value, props.length)

  commit(next)
  // Bring the box back to a single digit (or empty): a letter never reaches `digits`, so Vue would not repaint it
  input.value = next[index] ?? ''

  if (next[index]) void focusAt(focusIndex)
}

function onKeydown(index: number, event: KeyboardEvent) {
  const last = props.length - 1

  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    event.preventDefault()
    commit(digits.value.map((digit, i) => (i === index - 1 ? '' : digit)))
    void focusAt(index - 1)
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    void focusAt(index - 1)
  } else if (event.key === 'ArrowRight' && index < last) {
    event.preventDefault()
    void focusAt(index + 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    void focusAt(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    void focusAt(last)
  }
}

function onPaste(index: number, event: ClipboardEvent) {
  event.preventDefault()
  const pasted = digitsOnly(event.clipboardData?.getData('text') ?? '')
  if (!pasted) return

  // A whole code pasted while a later box has focus still means "this is the code"
  const start = pasted.length >= props.length ? 0 : index
  const { digits: next, focusIndex } = applyOtpInput(digits.value, start, pasted, props.length)

  commit(next)
  void focusAt(focusIndex)
}

function focusFirstEmpty() {
  const index = digits.value.findIndex((digit) => !digit)
  void focusAt(index === -1 ? props.length - 1 : index)
}

defineExpose({ focusFirstEmpty })
</script>

<template>
  <div
    role="group"
    :aria-label="t('auth.verify.groupLabel')"
    class="flex items-center justify-center gap-2"
  >
    <input
      v-for="(_, index) in digits"
      :key="index"
      ref="boxes"
      :value="digits[index]"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      enterkeyhint="done"
      :autocomplete="index === 0 ? 'one-time-code' : 'off'"
      :aria-label="t('auth.verify.digit', { n: index + 1, total: length })"
      :aria-invalid="invalid"
      :aria-describedby="describedBy"
      :disabled="disabled"
      class="h-[58px] min-w-0 max-w-14 rounded-2xl border-[1.5px] bg-neon-ghost-bg text-center text-2xl font-semibold text-neon-ink caret-neon-magenta transition-[border-color,box-shadow] outline-none disabled:opacity-60 tablet:h-16 tablet:text-3xl"
      :class="
        invalid
          ? 'border-neon-error'
          : 'border-neon-ghost-border focus:border-neon-field focus:shadow-[0_0_18px_rgb(224_64_251/0.6)]'
      "
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste(index, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>
