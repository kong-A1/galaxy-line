<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconCheck, IconChevronDown, IconSearch, IconX } from '@tabler/icons-vue'

import { useControlAttrs } from '@/composables/useControlAttrs'
import { useDropdown } from '@/composables/useDropdown'

import BaseField from './BaseField.vue'

// `class` and `style` go on the field; everything else goes on the field's button
defineOptions({ inheritAttrs: false })

/** One value (`string`), or with `multiple` a list of values (`string[]`) */
const model = defineModel<string | string[]>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    id?: string
    icon?: Component
    /** Shown (muted) while nothing is picked */
    placeholder?: string
    options: { value: string; label: string }[]
    /** Pick more than one: the value is a list, each pick is a chip */
    multiple?: boolean
    /** A × on each chip (with `multiple`) removes that one pick */
    closable?: boolean
    /** A × at the end of the field clears every pick */
    clearable?: boolean
    error?: string
  }>(),
  { closable: true },
)

const { t } = useI18n()
const { rootAttrs, controlAttrs } = useControlAttrs()

const generatedId = useId()
const id = computed(() => props.id ?? generatedId)
const listId = computed(() => `${id.value}-list`)
const errorId = computed(() => `${id.value}-error`)
const optionId = (index: number) => `${id.value}-option-${index}`

const box = useTemplateRef<HTMLDivElement>('box')
const search = useTemplateRef<HTMLInputElement>('search')
const panel = useTemplateRef<HTMLDivElement>('panel')

const { open, dropUp, show, hide } = useDropdown(box, panel)
const query = ref('')
const activeIndex = ref(0)

const picked = computed<string[]>(() => {
  if (props.multiple) return Array.isArray(model.value) ? model.value : []
  return typeof model.value === 'string' && model.value ? [model.value] : []
})
const labelOf = (value: string) => props.options.find((o) => o.value === value)?.label ?? value

// Typing in the search box narrows the list; matching ignores case
const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return needle
    ? props.options.filter((o) => o.label.toLowerCase().includes(needle))
    : props.options
})

async function openList() {
  if (open.value) return

  activeIndex.value = 0
  query.value = ''
  await show()
  search.value?.focus()
}

function close(returnFocus = false) {
  hide()
  query.value = ''
  if (returnFocus) box.value?.focus()
}

function isPicked(value: string) {
  return picked.value.includes(value)
}

function choose(index: number) {
  const option = filtered.value[index]
  if (!option) return

  if (props.multiple) {
    model.value = isPicked(option.value)
      ? picked.value.filter((v) => v !== option.value)
      : [...picked.value, option.value]
    query.value = ''
    search.value?.focus()
  } else {
    model.value = option.value
    close(true)
  }
}

function remove(value: string) {
  model.value = picked.value.filter((v) => v !== value)
}

function clearAll() {
  model.value = props.multiple ? [] : ''
}

// The field itself only opens the list; typing happens in the search box inside it
function onBoxKeydown(event: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    void openList()
  } else if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close()
  }
}

function onSearchKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      event.preventDefault()
      const last = filtered.value.length - 1
      activeIndex.value = Math.min(
        Math.max(activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1), 0),
        last,
      )
      break
    }
    case 'Enter': {
      // Never submits the form from here
      event.preventDefault()
      choose(activeIndex.value)
      break
    }
    case 'Escape': {
      event.preventDefault()
      close(true)
      break
    }
    case 'Backspace': {
      // An empty box takes the last chip with it
      if (props.multiple && !query.value && picked.value.length) {
        remove(picked.value[picked.value.length - 1]!)
      }
      break
    }
    case 'Tab': {
      close()
      break
    }
  }
}

// Focus leaving the field and its list (a press elsewhere) closes the list; focus moving between them does not
function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && (box.value?.contains(next) || panel.value?.contains(next))) return
  close()
}

watch(query, () => {
  activeIndex.value = 0
})

// Keep the highlighted option in view in a long list
watch(activeIndex, async (index) => {
  if (!open.value) return
  await nextTick()
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' })
})

const showClear = computed(() => props.clearable && picked.value.length > 0)
</script>

<template>
  <BaseField
    v-bind="rootAttrs"
    :label="label"
    :control-id="id"
    :icon="icon"
    :icon-right="IconChevronDown"
    :flip-icon-right="open"
    :invalid="!!error"
    :error="error"
    :error-id="errorId"
    :filled="picked.length > 0"
  >
    <template #default="{ controlClass, floated }">
      <div
        :id="id"
        ref="box"
        v-bind="controlAttrs"
        tabindex="0"
        role="combobox"
        aria-haspopup="listbox"
        :aria-label="label"
        :aria-expanded="open"
        :aria-controls="open ? listId : undefined"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        :class="controlClass"
        class="cursor-pointer outline-none"
        @click="open ? close() : openList()"
        @keydown="onBoxKeydown"
        @focusout="onFocusout"
      >
        <div
          class="flex min-h-14 flex-wrap items-center gap-2 py-2 tablet:min-h-16"
          :class="showClear ? 'pr-8' : ''"
        >
          <template v-if="multiple && picked.length">
            <span
              v-for="value in picked"
              :key="value"
              class="inline-flex max-w-full items-center gap-1 rounded-full bg-neon-accent/20 py-1 pl-3 text-sm font-medium text-neon-ink tablet:text-base"
              :class="closable ? 'pr-1' : 'pr-3'"
            >
              <span class="min-w-0 break-words">{{ labelOf(value) }}</span>
              <button
                v-if="closable"
                type="button"
                tabindex="-1"
                :aria-label="t('common.remove', { name: labelOf(value) })"
                class="flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-neon-ghost-bg"
                @click.stop="remove(value)"
              >
                <IconX :size="14" aria-hidden="true" />
              </button>
            </span>
          </template>
          <span v-else-if="!multiple && picked.length" class="min-w-0 py-1 break-words">
            {{ labelOf(picked[0]!) }}
          </span>
          <span
            v-else
            class="py-1 text-neon-muted transition-opacity"
            :class="floated ? '' : 'opacity-0'"
            >{{ placeholder }}</span
          >
        </div>
      </div>

      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        :aria-label="t('common.clear')"
        class="absolute top-1/2 right-11 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-neon-muted transition-colors hover:text-neon-ink"
        @click="clearAll"
      >
        <IconX :size="18" aria-hidden="true" />
      </button>

      <div
        v-if="open"
        ref="panel"
        class="anim-fade absolute right-0 left-0 z-30 flex max-h-80 flex-col overflow-hidden rounded-2xl border border-neon-glass-border bg-neon text-neon-ink shadow-lg"
        :class="dropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
        @focusout="onFocusout"
      >
        <!-- The search lives in the list, not in the field -->
        <div class="relative shrink-0 border-b border-neon-glass-border p-2">
          <IconSearch
            :size="20"
            aria-hidden="true"
            class="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-neon-muted"
          />
          <input
            ref="search"
            v-model="query"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            autocomplete="off"
            spellcheck="false"
            :aria-controls="listId"
            :aria-activedescendant="filtered.length ? optionId(activeIndex) : undefined"
            :aria-label="t('common.search')"
            :placeholder="t('common.search')"
            class="h-11 w-full rounded-lg border border-neon-ghost-border bg-neon-ghost-bg pr-3 pl-10 text-base text-neon-ink caret-neon-magenta outline-none placeholder:text-neon-muted focus:border-neon-field tablet:h-12 tablet:text-lg"
            @keydown="onSearchKeydown"
          />
        </div>

        <ul
          v-if="filtered.length"
          :id="listId"
          role="listbox"
          :aria-label="label"
          :aria-multiselectable="multiple"
          class="min-h-0 flex-1 overflow-y-auto py-1"
          @mousedown.prevent
        >
          <li
            v-for="(option, index) in filtered"
            :id="optionId(index)"
            :key="option.value"
            role="option"
            :aria-selected="isPicked(option.value)"
            class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-base tablet:min-h-14 tablet:text-lg"
            :class="
              isPicked(option.value)
                ? 'bg-neon-accent/20 font-bold text-neon-ink dark:bg-neon-accent/55'
                : index === activeIndex
                  ? 'bg-neon-ghost-bg text-neon-ink dark:bg-white/12'
                  : 'text-neon-ink'
            "
            @click="choose(index)"
            @pointermove="activeIndex = index"
          >
            <span class="min-w-0 break-words">{{ option.label }}</span>
            <IconCheck
              v-if="isPicked(option.value)"
              :size="22"
              aria-hidden="true"
              class="shrink-0"
            />
          </li>
        </ul>
        <p v-else role="status" class="px-4 py-3 text-base text-neon-soft tablet:text-lg">
          {{ t('common.noResults') }}
        </p>
      </div>
    </template>
  </BaseField>
</template>
