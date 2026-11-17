<script setup lang="ts">
import { computed, useId, useTemplateRef, type Component } from 'vue'

import { useControlAttrs } from '@/composables/useControlAttrs'

import BaseField from './BaseField.vue'

// `class` and `style` go on the field; everything else (type, placeholder, autocomplete, maxlength, @blur, @input ...) goes straight to the <input>
defineOptions({ inheritAttrs: false })

const { rootAttrs, controlAttrs } = useControlAttrs()
const model = defineModel<string>({ default: '' })

const props = defineProps<{
  label: string
  /** Optional: lets the parent find the input (for focus); a unique one is made when left out */
  id?: string
  icon?: Component
  iconRight?: Component
  /** Shown under the field; also turns it red */
  error?: string
}>()

const generatedId = useId()
const id = computed(() => props.id ?? generatedId)
const errorId = computed(() => `${id.value}-error`)
const input = useTemplateRef<HTMLInputElement>('input')

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <BaseField
    v-bind="rootAttrs"
    :label="label"
    :control-id="id"
    :icon="icon"
    :icon-right="iconRight"
    :invalid="!!props.error"
    :error="error"
    :error-id="errorId"
    :filled="model !== ''"
  >
    <template #default="{ controlClass }">
      <input
        :id="id"
        ref="input"
        v-bind="controlAttrs"
        v-model="model"
        :class="controlClass"
        :aria-invalid="!!props.error"
        :aria-describedby="props.error ? errorId : undefined"
      />
    </template>
  </BaseField>
</template>
