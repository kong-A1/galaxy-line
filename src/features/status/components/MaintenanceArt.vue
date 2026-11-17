<script setup lang="ts">
import SpaceStars, { type Dot, type Sparkle } from './SpaceStars.vue'

const dots: Dot[] = [
  { x: 52, y: 150, r: 2, delay: 0 },
  { x: 318, y: 92, r: 2.5, delay: 0.6 },
  { x: 362, y: 238, r: 2, delay: 1.3 },
  { x: 40, y: 332, r: 2.5, delay: 2.1 },
  { x: 330, y: 396, r: 1.5, delay: 0.6 },
  { x: 76, y: 436, r: 2, delay: 0 },
  { x: 244, y: 440, r: 1.5, delay: 1.3 },
]

const sparkles: Sparkle[] = [
  { x: 66, y: 112, size: 24, delay: 0 },
  { x: 345, y: 436, size: 20, delay: 1.3 },
]
</script>

<template>
  <svg
    class="status-scene absolute inset-0 h-full w-full overflow-visible"
    viewBox="0 0 390 500"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="mt-planet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color: var(--scene-soft)" />
        <stop offset="1" style="stop-color: var(--galaxy)" />
      </linearGradient>
    </defs>

    <SpaceStars :dots="dots" :sparkles="sparkles" />

    <circle
      cx="195"
      cy="262"
      r="136"
      fill="none"
      stroke="var(--scene-line)"
      stroke-opacity="0.55"
      stroke-width="1.5"
      stroke-dasharray="6 6"
      class="anim-dash"
    />
    <circle cx="195" cy="262" r="96" fill="none" stroke="var(--scene-deep)" stroke-width="2" />

    <!-- Two waves leaving the planet, half a cycle apart -->
    <circle
      cx="195"
      cy="262"
      r="66"
      fill="none"
      stroke="var(--scene-line)"
      stroke-width="2"
      class="anim-pulse"
    />
    <circle
      cx="195"
      cy="262"
      r="66"
      fill="none"
      stroke="var(--scene-line)"
      stroke-width="2"
      class="anim-pulse"
      style="animation-delay: 1.5s"
    />

    <circle cx="195" cy="262" r="66" fill="url(#mt-planet)" />
    <circle
      cx="195"
      cy="262"
      r="78"
      fill="none"
      stroke="#fff"
      stroke-opacity="0.25"
      stroke-width="1.5"
    />

    <!-- Lucide "wrench", 24x24 scaled to 72px. The wobble pivots at (12, 12) inside the scaled group. -->
    <g transform="translate(159 226) scale(3)">
      <g class="anim-wrench">
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
          fill="none"
          stroke="var(--scene-ink)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>

    <!-- Satellite turns clockwise round the planet; its tilt sits on an inner <g> so the spin cannot override it -->
    <g class="anim-orbit-cw">
      <g transform="translate(291 166) rotate(45)">
        <rect
          v-for="offset in [-22, 0, 22]"
          :key="offset"
          :x="offset - 8"
          y="-8"
          width="16"
          height="16"
          rx="2.5"
          fill="var(--scene-deep)"
          stroke="#fff"
          stroke-width="2"
        />
      </g>
    </g>

    <g class="anim-orbit-ccw">
      <circle cx="127" cy="330" r="7" fill="var(--scene-soft)" />
    </g>
  </svg>
</template>
