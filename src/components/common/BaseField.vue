<script setup lang="ts">
import { computed, ref, useTemplateRef, type Component } from 'vue'

/**
 * Glass field shell of the neon design: the label sits on the border (the border is cut around it, so it works on any background),
 * the border glows magenta on focus and turns red when `invalid`. The control (input, select) comes in the default slot and gets
 * `controlClass`, which leaves room for the icons.
 * Floating label: while the field is idle and empty the label sits inside it like a hint; it moves up onto the border once the field has
 * focus or a value (`filled`, which only the control knows). The default slot also gets `floated`, so a control can hide its own placeholder
 * until the label has moved out of the way.
 */
const props = withDefaults(
  defineProps<{
    label: string
    /** The `id` of the control, so the label is its label */
    controlId: string
    icon?: Component
    iconRight?: Component
    /** Turns the right icon upside down (a chevron on an open list) */
    flipIconRight?: boolean
    invalid?: boolean
    error?: string
    errorId?: string
    /** The control holds a value, so the label stays up on the border even without focus */
    filled?: boolean
  }>(),
  { filled: false },
)

// Focus anywhere inside counts (the control, a list it opens, a dialog it opens: they are all inside this box)
const group = useTemplateRef<HTMLElement>('group')
const focused = ref(false)
function onFocusOut(event: FocusEvent) {
  if (!group.value?.contains(event.relatedTarget as Node | null)) focused.value = false
}

const floated = computed(() => props.filled || focused.value)
</script>

<template>
  <!-- The label rises 10px above the box; the padding keeps it clear of whatever is above -->
  <div class="pt-2.5">
    <div ref="group" class="group relative" @focusin="focused = true" @focusout="onFocusOut">
      <!-- The glass fill and the glow on focus: a separate box, so the fill does not show above the border line -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-2xl bg-neon-ghost-bg transition-shadow group-focus-within:shadow-[0_0_18px_rgb(224_64_251/0.6)]"
      />

      <fieldset
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 -top-2.5 bottom-0 m-0 min-w-0 rounded-2xl border px-3 py-0 transition-colors group-focus-within:border-[1.5px]"
        :class="
          invalid
            ? 'border-neon-error'
            : 'border-neon-ghost-border group-focus-within:border-neon-field'
        "
      >
        <!-- Same text as the label, hidden: it only reserves the gap in the border -->
        <legend
          class="invisible overflow-hidden text-sm leading-5 whitespace-nowrap transition-[max-width,padding] duration-200 motion-reduce:transition-none tablet:text-base"
          :class="floated ? 'max-w-full px-1' : 'max-w-0 px-0'"
        >
          {{ label }}
        </legend>
      </fieldset>

      <label
        :for="controlId"
        class="pointer-events-none absolute z-10 max-w-[calc(100%-1.5rem)] truncate px-1 leading-5 transition-[top,left,font-size,color] duration-200 motion-reduce:transition-none"
        :class="[
          floated
            ? '-top-2.5 left-3 text-sm tablet:text-base'
            : [icon ? 'left-11' : 'left-3', 'top-[18px] text-base tablet:top-5 tablet:text-lg'],
          invalid
            ? 'text-neon-error'
            : floated
              ? 'text-neon-soft group-focus-within:text-neon-label'
              : 'text-neon-muted',
        ]"
      >
        {{ label }}
      </label>

      <component
        :is="icon"
        v-if="icon"
        :size="22"
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
        :class="invalid ? 'text-neon-error' : 'text-neon-muted'"
      />

      <slot
        :floated="floated"
        :control-class="[
          'relative block min-h-14 w-full min-w-0 bg-transparent text-base text-neon-ink caret-neon-magenta outline-none tablet:min-h-16 tablet:text-lg',
          floated ? 'placeholder:text-neon-muted' : 'placeholder:text-transparent',
          icon ? 'pl-12' : 'pl-4',
          iconRight ? 'pr-12' : 'pr-4',
        ]"
      />

      <component
        :is="iconRight"
        v-if="iconRight"
        :size="22"
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transition-[color,rotate]"
        :class="[
          invalid ? 'text-neon-error' : 'text-neon-muted',
          flipIconRight ? 'rotate-180' : '',
        ]"
      />
    </div>

    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="anim-fade mt-0.5 text-sm leading-5 text-neon-error tablet:text-base"
    >
      {{ error }}
    </p>
  </div>
</template>
