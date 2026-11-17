<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

/**
 * One column of a wheel picker: scroll (or tap, or use the arrow keys) and the row in the middle is the value.
 * A `disabled` row is shown faded and cannot be picked: the wheel stops at the last row that can.
 */

// Keep in step with `h-10` below; the list is padded by two rows each side so the first and last rows can reach the middle
const ROW = 40

const model = defineModel<number>({ required: true })

const props = defineProps<{
  items: { value: number; label: string; disabled?: boolean }[]
  /** What the column picks, for screen readers ("Day") */
  label: string
}>()

const scroller = useTemplateRef<HTMLDivElement>('scroller')
const index = computed(() =>
  Math.max(
    0,
    props.items.findIndex((item) => item.value === model.value),
  ),
)
// Follows the finger while scrolling; `model` only changes once the wheel has settled
const liveIndex = ref(index.value)
let settleTimer: ReturnType<typeof setTimeout> | undefined

const firstEnabled = computed(() => props.items.findIndex((item) => !item.disabled))
const lastEnabled = computed(() => {
  const fromEnd = [...props.items].reverse().findIndex((item) => !item.disabled)
  return fromEnd < 0 ? -1 : props.items.length - 1 - fromEnd
})

function scrollToIndex(target: number, smooth: boolean) {
  scroller.value?.scrollTo({ top: target * ROW, behavior: smooth ? 'smooth' : 'auto' })
}

/** The closest row that can be picked, looking both ways from `from` */
function nearestEnabled(from: number) {
  for (let distance = 0; distance < props.items.length; distance++) {
    if (props.items[from - distance] && !props.items[from - distance]!.disabled)
      return from - distance
    if (props.items[from + distance] && !props.items[from + distance]!.disabled)
      return from + distance
  }
  return from
}

/** The next row that can be picked in one direction; stays put at the end */
function stepFrom(from: number, direction: 1 | -1) {
  let next = from + direction
  while (props.items[next]?.disabled) next += direction
  return props.items[next] ? next : from
}

function onScroll() {
  const el = scroller.value
  if (!el) return

  // Cannot be scrolled past the last row that can be picked
  if (firstEnabled.value >= 0) {
    const lowest = firstEnabled.value * ROW
    const highest = lastEnabled.value * ROW
    if (el.scrollTop > highest + 1) el.scrollTop = highest
    else if (el.scrollTop < lowest - 1) el.scrollTop = lowest
  }

  liveIndex.value = Math.min(Math.max(Math.round(el.scrollTop / ROW), 0), props.items.length - 1)

  clearTimeout(settleTimer)
  settleTimer = setTimeout(settle, 120)
}

async function settle() {
  const target = nearestEnabled(liveIndex.value)
  const item = props.items[target]
  if (item && item.value !== model.value) model.value = item.value

  // Wait for the parent's answer: the wheel has to end up on the value it holds
  await nextTick()
  liveIndex.value = index.value
  if (Math.abs((scroller.value?.scrollTop ?? 0) - index.value * ROW) > 1) {
    scrollToIndex(index.value, true)
  }
}

function select(target: number) {
  const item = props.items[target]
  if (item && !item.disabled) model.value = item.value
}

function onKeydown(event: KeyboardEvent) {
  const moves: Record<string, number> = {
    ArrowUp: stepFrom(index.value, -1),
    ArrowDown: stepFrom(index.value, 1),
    Home: firstEnabled.value,
    End: lastEnabled.value,
  }
  const target = moves[event.key]
  if (target === undefined || target < 0) return

  event.preventDefault()
  select(target)
}

// The value changed from outside (a day that no longer exists, a date clamped): the wheel follows
watch(index, (next) => {
  liveIndex.value = next
  if (Math.abs((scroller.value?.scrollTop ?? 0) - next * ROW) > 1) scrollToIndex(next, true)
})

onMounted(() => scrollToIndex(index.value, false))

// A wheel inside a dialog is mounted before the dialog is shown, when it cannot scroll yet: the parent calls this once it is
defineExpose({ sync: () => scrollToIndex(index.value, false) })
onBeforeUnmount(() => clearTimeout(settleTimer))
</script>

<template>
  <div
    ref="scroller"
    role="spinbutton"
    tabindex="0"
    :aria-label="label"
    :aria-valuenow="model"
    :aria-valuetext="items[index]?.label"
    class="h-[200px] snap-y snap-mandatory overflow-y-auto overscroll-contain py-20 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)] [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
    @scroll.passive="onScroll"
    @keydown="onKeydown"
  >
    <div
      v-for="(item, idx) in items"
      :key="item.value"
      :aria-disabled="item.disabled || undefined"
      class="flex h-10 items-center justify-center px-1 text-lg transition-colors tablet:text-xl"
      :class="[
        // A row that cannot be picked is not somewhere the wheel can come to rest
        item.disabled ? 'cursor-not-allowed snap-align-none' : 'cursor-pointer snap-center',
        item.disabled
          ? 'text-neon-ink/30'
          : idx === liveIndex
            ? 'font-semibold text-neon-ink'
            : 'text-neon-soft',
      ]"
      @click="select(idx)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
