<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'

import { useDialogMotion } from '@/composables/useDialogMotion'

/**
 * The frame of a popup (native <dialog>, so focus stays inside it and goes back to where it came from when it closes).
 * Show it with `v-if`; it opens when it appears and says `close` when Esc is pressed or the dim area outside is clicked,
 * and the parent removes it. The heading goes in the `title` slot, the content in the default slot.
 */
const emit = defineEmits<{ close: [] }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const titleId = `${useId()}-title`
const motion = useDialogMotion(dialog)

async function close() {
  // Closing the dialog (not only removing it) is what hands the focus back to the button that opened it.
  // `close` is said after the closing animation, so the parent does not remove it while it is still fading.
  if (await motion.close()) emit('close')
}

function onCancel(event: Event) {
  event.preventDefault()
  close()
}

// The dialog fills its own box, so a click that lands on the dialog element itself is a click on the dim area
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

defineExpose({ close })
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    class="anim-pop m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[22px] border border-neon-glass-border bg-neon-glass p-0 text-neon-ink shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    @cancel="onCancel"
    @click="onClick"
  >
    <div class="flex max-h-[min(92dvh,760px)] flex-col gap-4 overflow-y-auto px-5 pt-6 pb-5">
      <h2
        :id="titleId"
        class="text-center text-xl leading-7 font-semibold outline-none tablet:text-2xl tablet:leading-8"
      >
        <slot name="title" />
      </h2>

      <!-- `close` is given to the content, so its own buttons close the popup with the same animation as Esc -->
      <slot :close="close" />
    </div>
  </dialog>
</template>
