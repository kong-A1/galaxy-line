<script setup lang="ts">
export interface Dot {
  x: number
  y: number
  r: number
  delay: number
}

export interface Sparkle {
  x: number
  y: number
  size: number
  delay: number
}

defineProps<{
  dots: Dot[]
  sparkles: Sparkle[]
}>()
</script>

<template>
  <g>
    <circle
      v-for="(dot, idx) in dots"
      :key="`dot-${idx}`"
      :cx="dot.x"
      :cy="dot.y"
      :r="dot.r"
      fill="var(--scene-soft)"
      class="anim-tw"
      :style="{ animationDelay: `${dot.delay}s` }"
    />

    <!-- 4-point star outline; scaled around its own centre so the animated opacity never moves it -->
    <g
      v-for="(sparkle, idx) in sparkles"
      :key="`sparkle-${idx}`"
      :transform="`translate(${sparkle.x} ${sparkle.y}) scale(${sparkle.size / 24}) translate(-12 -12)`"
    >
      <path
        d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z"
        fill="none"
        stroke="var(--scene-line)"
        stroke-width="1.4"
        stroke-linejoin="round"
        class="anim-tw"
        :style="{ animationDelay: `${sparkle.delay}s` }"
      />
    </g>
  </g>
</template>
