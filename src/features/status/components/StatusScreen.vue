<script setup lang="ts">
defineProps<{
  /** Tallest the hero may be (e.g. `max-h-[560px]`); it shrinks with the screen so the page fits without scrolling */
  heroClass: string
}>()
</script>

<template>
  <!-- Fixed to the viewport so the body never scrolls; this container only scrolls when even the smallest hero cannot fit -->
  <div class="h-dvh overflow-y-auto overscroll-contain bg-background text-foreground">
    <div class="mx-auto flex h-full w-full flex-col lg:max-w-md">
      <!-- Takes whatever height the card leaves, between 200px and its max; the artwork scales to fit -->
      <div
        class="bg-galaxy relative min-h-[200px] grow-[1000] basis-0 overflow-hidden"
        :class="heroClass"
      >
        <!-- Artwork is at most 390px wide and centred; the gradient behind it spans the screen -->
        <div class="absolute inset-0 mx-auto w-full max-w-[390px]">
          <slot name="art" />
        </div>

        <slot name="header" />
      </div>

      <!-- Keeps its natural height; spare room on tall screens goes here (after the hero hits its max) so the buttons sit at the bottom -->
      <main
        class="anim-rise relative -mt-8 flex shrink-0 grow flex-col rounded-t-sheet bg-background px-6 pt-6 pb-6 shadow-[0_-8px_24px_rgb(0_0_0/0.12)]"
      >
        <div class="mx-auto flex w-full max-w-md flex-1 flex-col md:max-w-xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
