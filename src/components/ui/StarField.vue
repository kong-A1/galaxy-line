<script lang="ts">
export interface Star {
  /** Position from the left, in % of the box */
  x: number
  /** Position from the top, in `yUnit` of the box */
  y: number
  size: number
  /** Seconds before it starts twinkling, so the stars blink out of step */
  delay: number
  /** Seconds one twinkle takes; omitted = the default of `anim-tw` */
  duration?: number
  /** `solid` stars only */
  color?: string
}

// The four stars of the neon design, placed around the logo
const DEFAULT_STARS: Star[] = [
  { x: 11, y: 115, size: 17, delay: 0, color: '#e9d5ff' },
  { x: 85, y: 100, size: 12, delay: 0.8, color: '#a5f3fc' },
  { x: 83, y: 250, size: 19, delay: 1.5, color: '#f5d0fe' },
  { x: 15, y: 262, size: 10, delay: 0.4, color: '#ffffff' },
]
</script>

<script setup lang="ts">
/**
 * Twinkling four-point stars. The caller's class places the box (`absolute` is built in), e.g. `inset-0`.
 * `solid`: filled with a glow, takes the template's star colour in light mode (--neon-star). `outline`: thin white line (the purple hero).
 */
withDefaults(
  defineProps<{
    stars?: Star[]
    variant?: 'solid' | 'outline'
    yUnit?: 'px' | '%'
  }>(),
  { stars: () => DEFAULT_STARS, variant: 'solid', yUnit: 'px' },
)
</script>

<template>
  <div class="pointer-events-none absolute" aria-hidden="true">
    <svg
      v-for="(star, idx) in stars"
      :key="idx"
      viewBox="0 0 24 24"
      class="anim-tw absolute"
      :class="variant === 'outline' && 'text-neon-ink/40'"
      :fill="variant === 'outline' ? 'none' : undefined"
      :stroke="variant === 'outline' ? 'currentColor' : undefined"
      :stroke-width="variant === 'outline' ? 1.5 : undefined"
      :stroke-linejoin="variant === 'outline' ? 'round' : undefined"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}${yUnit}`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        animationDelay: `${star.delay}s`,
        animationDuration: star.duration ? `${star.duration}s` : undefined,
        filter: variant === 'solid' ? `drop-shadow(0 0 6px ${star.color})` : undefined,
        '--star': star.color,
      }"
    >
      <path
        v-if="variant === 'outline'"
        d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z"
      />
      <path
        v-else
        d="M12 2c.6 4.7 2.6 7.4 10 10-7.4 2.6-9.4 5.3-10 10-.6-4.7-2.6-7.4-10-10 7.4-2.6 9.4-5.3 10-10z"
        class="fill-[var(--neon-star,var(--star))]"
      />
    </svg>
  </div>
</template>
