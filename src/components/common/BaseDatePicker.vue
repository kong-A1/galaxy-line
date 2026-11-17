<script setup lang="ts">
import { computed, nextTick, reactive, ref, useId, useTemplateRef, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconCalendar } from '@tabler/icons-vue'

import { useControlAttrs } from '@/composables/useControlAttrs'

import BaseButton from './BaseButton.vue'
import BaseField from './BaseField.vue'
import WheelColumn from './WheelColumn.vue'

// `class` and `style` go on the field; everything else goes on the button
defineOptions({ inheritAttrs: false })

/** "dd/mm/yyyy", or empty while nothing is picked */
const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    id?: string
    icon?: Component
    placeholder?: string
    error?: string
    /** Earliest pick (default 1 Jan 1900); the time of day is ignored */
    minDate?: Date
    /** Latest pick (default today); the time of day is ignored */
    maxDate?: Date
  }>(),
  // A component default has to be a factory: Vue would otherwise call the icon itself as one
  { icon: () => IconCalendar, minDate: () => new Date(1900, 0, 1), maxDate: () => new Date() },
)

const { rootAttrs, controlAttrs } = useControlAttrs()
const { t, locale } = useI18n()

const generatedId = useId()
const id = computed(() => props.id ?? generatedId)
const errorId = computed(() => `${id.value}-error`)
const titleId = computed(() => `${id.value}-title`)

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const wheels = useTemplateRef<InstanceType<typeof WheelColumn>[]>('wheels')
const open = ref(false)

const pad = (n: number) => String(n).padStart(2, '0')
const daysIn = (month: number, year: number) => new Date(year, month, 0).getDate()
const dayOf = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

// What the wheels show. It only becomes the value on "Done"; closing any other way leaves the field as it was.
const draft = reactive({ day: 1, month: 1, year: 2000 })

// The year leads: any year in [minDate, maxDate] can be picked. The months of that year, then the days of that month, are
// whatever the range leaves; a month or day that falls outside is not on the wheel.
const minDay = computed(() => dayOf(props.minDate))
const maxDay = computed(() => dayOf(props.maxDate))

/** The first and last month (1-12) that can be picked in a year */
function monthBounds(year: number) {
  return {
    first: year === minDay.value.getFullYear() ? minDay.value.getMonth() + 1 : 1,
    last: year === maxDay.value.getFullYear() ? maxDay.value.getMonth() + 1 : 12,
  }
}

/** The first and last day that can be picked in a month */
function dayBounds(year: number, month: number) {
  const inMinMonth = year === minDay.value.getFullYear() && month === minDay.value.getMonth() + 1
  const inMaxMonth = year === maxDay.value.getFullYear() && month === maxDay.value.getMonth() + 1
  return {
    first: inMinMonth ? minDay.value.getDate() : 1,
    last: inMaxMonth ? Math.min(maxDay.value.getDate(), daysIn(month, year)) : daysIn(month, year),
  }
}

const between = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

/**
 * Settles the draft after a wheel moved, from the top down: a new year moves the month to the nearest one the year
 * allows, and a new month moves the day likewise (31 -> 28 in February is the same rule). The wheel being scrolled can
 * never be sent back: it can only reach rows that are allowed.
 */
function settleDraft() {
  draft.year = between(draft.year, props.minDate.getFullYear(), props.maxDate.getFullYear())

  const months = monthBounds(draft.year)
  draft.month = between(draft.month, months.first, months.last)

  const days = dayBounds(draft.year, draft.month)
  draft.day = between(draft.day, days.first, days.last)
}

function readModel() {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(model.value)
  if (match) {
    Object.assign(draft, { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]) })
  } else {
    // Empty: today's day and month, 25 years back
    const today = new Date()
    Object.assign(draft, {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear() - 25,
    })
  }

  settleDraft()
}

function setPart(part: 'day' | 'month' | 'year', value: number) {
  draft[part] = value
  settleDraft()
}

// showModal() makes the page behind inert, traps Tab and gives focus back to the field when it closes
async function openPicker() {
  readModel()
  open.value = true

  await nextTick()
  dialog.value?.showModal()
  await nextTick()
  wheels.value?.forEach((wheel) => wheel.sync())
}

function closePicker() {
  if (dialog.value?.open) dialog.value.close()
  open.value = false
}

function done() {
  model.value = `${pad(draft.day)}/${pad(draft.month)}/${draft.year}`
  closePicker()
}

// A press on the dimmed area (the dialog element itself, not its content) is a way out too
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) closePicker()
}

// Rows outside the range are left out, not shown faded
const days = computed(() => {
  const { first, last } = dayBounds(draft.year, draft.month)
  return Array.from({ length: last - first + 1 }, (_, i) => ({
    value: first + i,
    label: String(first + i),
  }))
})
const months = computed(() => {
  // Gregorian names in the chosen language ("มกราคม", "January")
  const format = new Intl.DateTimeFormat(`${locale.value}-u-ca-gregory`, { month: 'long' })
  const { first, last } = monthBounds(draft.year)
  return Array.from({ length: last - first + 1 }, (_, i) => ({
    value: first + i,
    label: format.format(new Date(2000, first - 1 + i, 1)),
  }))
})
const years = computed(() => {
  const first = props.minDate.getFullYear()
  const last = props.maxDate.getFullYear()
  return Array.from({ length: Math.max(last - first + 1, 1) }, (_, i) => ({
    value: first + i,
    label: String(first + i),
  }))
})

const columns = computed(() => [
  { part: 'day' as const, items: days.value, label: t('common.datePicker.day') },
  { part: 'month' as const, items: months.value, label: t('common.datePicker.month') },
  { part: 'year' as const, items: years.value, label: t('common.datePicker.year') },
])
</script>

<template>
  <BaseField
    v-bind="rootAttrs"
    :label="label"
    :control-id="id"
    :icon="icon"
    :invalid="!!error"
    :error="error"
    :error-id="errorId"
    :filled="!!model"
  >
    <template #default="{ controlClass, floated }">
      <button
        :id="id"
        v-bind="controlAttrs"
        type="button"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        :class="[controlClass, 'cursor-pointer truncate text-left']"
        @click="openPicker"
      >
        <template v-if="model">{{ model }}</template>
        <span
          v-else
          class="text-neon-muted transition-opacity"
          :class="floated ? '' : 'opacity-0'"
          >{{ placeholder }}</span
        >
      </button>

      <dialog
        v-if="open"
        ref="dialog"
        :aria-labelledby="titleId"
        class="anim-pop m-auto w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-[22px] border border-neon-glass-border bg-neon-glass p-0 text-neon-ink shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
        @click="onDialogClick"
        @close="open = false"
      >
        <div class="p-5">
          <h2
            :id="titleId"
            class="text-center text-xl leading-7 font-semibold text-neon-ink tablet:text-2xl"
          >
            {{ label }}
          </h2>

          <div class="relative mt-3">
            <!-- The row in the middle is the one that counts -->
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-x-0 top-20 h-10 rounded-lg bg-neon-accent/20"
            />
            <div class="relative grid grid-cols-[1fr_1.7fr_1.2fr]">
              <WheelColumn
                v-for="column in columns"
                :key="column.part"
                ref="wheels"
                :items="column.items"
                :model-value="draft[column.part]"
                :label="column.label"
                @update:model-value="setPart(column.part, $event)"
              />
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <BaseButton
              block
              color="neon-ghost"
              rounded="full"
              class="rounded-full! tablet:min-h-12! tablet:text-lg"
              @click="closePicker"
            >
              {{ t('common.cancel') }}
            </BaseButton>
            <BaseButton
              block
              color="neon-violet"
              rounded="full"
              class="rounded-full! font-semibold tablet:min-h-12! tablet:text-lg"
              @click="done"
            >
              {{ t('common.done') }}
            </BaseButton>
          </div>
        </div>
      </dialog>
    </template>
  </BaseField>
</template>
