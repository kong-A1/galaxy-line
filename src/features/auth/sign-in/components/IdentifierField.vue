<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'

import { caretPosition } from '@/utils/caret'
import { formatPhone, normalizePhone } from '@/utils/phone'

import type { SignInMethod } from '@/types/auth/auth.type'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  method: SignInMethod
  label: string
  placeholder: string
  inputId: string
  describedBy: string
  invalid?: boolean
  errorText?: string
  errorId: string
}>()

const emit = defineEmits<{
  blur: []
}>()

const input = useTemplateRef<HTMLInputElement>('input')

// The card stays; what is inside slides the way the tab pill moves (phone is the left tab, email the right)
const direction = ref<'forward' | 'back'>('forward')
watch(
  () => props.method,
  (next) => {
    direction.value = next === 'email' ? 'forward' : 'back'
  },
)

// A phone number is stored as digits only and shown as "81-234-5678"; an email is kept as typed.
// Rewriting the value sends the caret to the end, so it is put back after the same digit (fixing a digit in the middle stays in the middle)
function onInput(event: Event, method: SignInMethod) {
  const target = event.target as HTMLInputElement

  if (method === 'phone') {
    const digitsBeforeCaret = target.value
      .slice(0, target.selectionStart ?? target.value.length)
      .replace(/\D/g, '').length
    const national = normalizePhone(target.value)
    const formatted = formatPhone(national)

    model.value = national
    target.value = formatted

    const caret = caretPosition(formatted, Math.min(digitsBeforeCaret, national.length))
    target.setSelectionRange(caret, caret)
  } else {
    model.value = target.value
  }
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div
    class="neon-glass overflow-x-clip rounded-[18px] px-5 pt-5 pb-5 focus-within:ring-2 focus-within:ring-neon-field/30"
  >
    <Transition :name="`tab-${direction}`" mode="out-in">
      <div :key="method">
        <label :for="inputId" class="block text-sm leading-5 text-neon-soft tablet:text-base">
          {{ label }}
        </label>

        <div
          class="mt-3 flex items-center gap-3 border-b-2 pb-3 transition-colors"
          :class="
            invalid
              ? 'border-neon-error'
              : 'border-neon-ghost-border focus-within:border-neon-field'
          "
        >
          <template v-if="method === 'phone'">
            <span class="text-lg text-neon-cyan tablet:text-xl" aria-hidden="true"> +66 </span>
            <span class="h-6 w-0.5 bg-neon-field" aria-hidden="true" />
          </template>

          <input
            :id="inputId"
            ref="input"
            :value="method === 'phone' ? formatPhone(model) : model"
            :type="method === 'phone' ? 'tel' : 'email'"
            :inputmode="method === 'phone' ? 'tel' : 'email'"
            :autocomplete="method === 'phone' ? 'tel-national' : 'email'"
            :maxlength="method === 'phone' ? 12 : 254"
            :placeholder="placeholder"
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            autocapitalize="off"
            spellcheck="false"
            class="min-w-0 flex-1 bg-transparent text-lg text-neon-ink caret-neon-magenta outline-none placeholder:font-normal placeholder:text-neon-muted tablet:text-xl"
            @input="onInput($event, method)"
            @blur="emit('blur')"
          />
        </div>
      </div>
    </Transition>

    <!-- Outside the sliding part: it belongs to the card, and must vanish at once when the tab changes -->
    <p
      v-if="errorText"
      :id="errorId"
      role="alert"
      class="anim-fade mt-2 text-sm leading-5 text-neon-error tablet:text-base"
    >
      {{ errorText }}
    </p>
  </div>
</template>
