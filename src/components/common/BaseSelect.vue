<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef, watch, type Component } from 'vue'
import { IconCheck, IconChevronDown } from '@tabler/icons-vue'

import { useControlAttrs } from '@/composables/useControlAttrs'
import { useDropdown } from '@/composables/useDropdown'

import BaseField from './BaseField.vue'

// `class` and `style` go on the field; everything else goes on the button
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })

const props = defineProps<{
  label: string
  id?: string
  icon?: Component
  /** Shown (muted) while no option is selected, i.e. the value matches none of `options` */
  placeholder?: string
  options: { value: string; label: string }[]
}>()

const { rootAttrs, controlAttrs } = useControlAttrs()

const generatedId = useId()
const id = computed(() => props.id ?? generatedId)
const listId = computed(() => `${id.value}-list`)
const optionId = (index: number) => `${id.value}-option-${index}`

const button = useTemplateRef<HTMLButtonElement>('button')
const list = useTemplateRef<HTMLUListElement>('list')

const { open, dropUp, show, hide: close } = useDropdown(button, list)
const activeIndex = ref(-1)

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === model.value))
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label ?? '')

function openList() {
  activeIndex.value = Math.max(selectedIndex.value, 0)
  return show()
}

function choose(index: number) {
  const option = props.options[index]
  if (option) model.value = option.value
  close()
}

function move(step: number) {
  const last = props.options.length - 1
  activeIndex.value = Math.min(Math.max(activeIndex.value + step, 0), last)
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      event.preventDefault()
      if (!open.value) void openList()
      else move(event.key === 'ArrowDown' ? 1 : -1)
      break
    }
    case 'Home':
    case 'End': {
      if (!open.value) return
      event.preventDefault()
      activeIndex.value = event.key === 'Home' ? 0 : props.options.length - 1
      break
    }
    case 'Enter':
    case ' ': {
      event.preventDefault()
      if (open.value) choose(activeIndex.value)
      else void openList()
      break
    }
    case 'Escape': {
      if (!open.value) return
      event.preventDefault()
      close()
      break
    }
    case 'Tab': {
      close()
      break
    }
  }
}

// Keep the highlighted option in view in a long list
watch(activeIndex, async (index) => {
  if (!open.value) return
  await nextTick()
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <BaseField
    v-bind="rootAttrs"
    :label="label"
    :control-id="id"
    :icon="icon"
    :icon-right="IconChevronDown"
    :flip-icon-right="open"
    :filled="selectedIndex >= 0"
  >
    <template #default="{ controlClass, floated }">
      <button
        :id="id"
        ref="button"
        v-bind="controlAttrs"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :class="[controlClass, 'cursor-pointer truncate text-left']"
        @click="open ? close() : openList()"
        @keydown="onKeydown"
      >
        <template v-if="selectedIndex >= 0">{{ selectedLabel }}</template>
        <span
          v-else
          class="text-neon-muted transition-opacity"
          :class="floated ? '' : 'opacity-0'"
          >{{ placeholder }}</span
        >
      </button>

      <ul
        v-if="open"
        :id="listId"
        ref="list"
        role="listbox"
        :aria-label="label"
        class="anim-fade absolute right-0 left-0 z-30 max-h-64 overflow-y-auto rounded-2xl border border-neon-glass-border bg-neon py-1 text-neon-ink shadow-lg"
        :class="dropUp ? 'bottom-full mb-0.5' : 'top-full mt-0.5'"
      >
        <li
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="option.value === model"
          class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 text-base tablet:min-h-14 tablet:text-lg"
          :class="
            option.value === model
              ? 'bg-neon-accent/20 font-bold text-neon-ink dark:bg-neon-accent/55'
              : index === activeIndex
                ? 'bg-neon-ghost-bg text-neon-ink dark:bg-white/12'
                : 'text-neon-ink'
          "
          @click="choose(index)"
          @pointermove="activeIndex = index"
        >
          <span class="min-w-0 truncate">{{ option.label }}</span>
          <IconCheck v-if="option.value === model" :size="22" aria-hidden="true" class="shrink-0" />
        </li>
      </ul>
    </template>
  </BaseField>
</template>
