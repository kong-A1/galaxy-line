<template>
  <section
    class="relative -mt-8 flex-1 overflow-x-clip rounded-t-sheet border-t border-neon-glass-border bg-neon px-5 pb-8 text-neon-ink shadow-[0_-8px_24px_rgb(0_0_0/0.12)]"
    :class="$slots.badge ? 'pt-[54px]' : 'pt-7'"
  >
    <div v-if="$slots.badge" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <slot name="badge" />
    </div>

    <div class="mx-auto w-full max-w-md md:max-w-xl">
      <slot />
    </div>
  </section>
</template>
