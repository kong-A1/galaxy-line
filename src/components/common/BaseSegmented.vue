<script setup lang="ts" generic="T extends string">
import { computed, nextTick, useTemplateRef } from 'vue'

const model = defineModel<T>({ required: true })

const props = defineProps<{
  options: { value: T; label: string }[]
  /** Prefix for the tab ids, so a view can link its tabpanel back with aria-labelledby (`<prefix>-tab-<value>`, panel id `<prefix>-panel`) */
  idPrefix: string
}>()

const tabs = useTemplateRef<HTMLButtonElement[]>('tabs')
const index = computed(() =>
  Math.max(
    props.options.findIndex((option) => option.value === model.value),
    0,
  ),
)
const count = computed(() => props.options.length)

// Roving tabindex: arrows move between tabs, Tab leaves the group
async function onKeydown(event: KeyboardEvent) {
  const last = count.value - 1
  let next = index.value

  if (event.key === 'ArrowRight') next = (index.value + 1) % count.value
  else if (event.key === 'ArrowLeft') next = (index.value - 1 + count.value) % count.value
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  else return

  event.preventDefault()
  model.value = props.options[next]!.value
  await nextTick()
  tabs.value?.[next]?.focus()
}
</script>

<template>
  <div
    role="tablist"
    class="relative grid gap-1 rounded-full border border-neon-glass-border bg-neon-ghost-bg p-[5px]"
    :style="{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }"
    @keydown="onKeydown"
  >
    <!-- One pill that slides under the active tab, like a switch. Width = one tab ((100% - 2 x 5px padding - the gaps) / count);
         every position moves it by its own width plus the 4px gap. -->
    <span
      aria-hidden="true"
      class="absolute inset-y-[5px] left-[5px] rounded-full bg-linear-to-r from-neon-accent to-neon-green-deep transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
      :style="{
        width: `calc((100% - 10px - ${(count - 1) * 4}px) / ${count})`,
        transform: `translateX(calc(${index} * (100% + 4px)))`,
      }"
    />

    <button
      v-for="option in options"
      :id="`${idPrefix}-tab-${option.value}`"
      ref="tabs"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="model === option.value"
      :aria-controls="`${idPrefix}-panel`"
      :tabindex="model === option.value ? 0 : -1"
      class="relative z-10 min-h-[42px] cursor-pointer rounded-full text-[15px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-link motion-reduce:transition-none tablet:text-lg"
      :class="model === option.value ? 'font-semibold text-white' : 'text-neon-soft'"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
