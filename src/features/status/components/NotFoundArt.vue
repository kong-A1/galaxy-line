<script setup lang="ts">
import SpaceStars, { type Dot, type Sparkle } from './SpaceStars.vue'

// Twinkle delays cycle through 0, .6, 1.3 and 2.1s so the stars never blink together
const dots: Dot[] = [
  { x: 45, y: 117, r: 2, delay: 0 },
  { x: 266, y: 96, r: 2.5, delay: 0.6 },
  { x: 324, y: 131, r: 2, delay: 1.3 },
  { x: 102, y: 163, r: 1.5, delay: 2.1 },
  { x: 29, y: 391, r: 2.5, delay: 0.6 },
  { x: 354, y: 410, r: 2, delay: 0 },
  { x: 118, y: 438, r: 1.5, delay: 1.3 },
  { x: 285, y: 466, r: 2, delay: 2.1 },
]

const sparkles: Sparkle[] = [
  { x: 75, y: 207, size: 22, delay: 0 },
  { x: 314, y: 373, size: 18, delay: 1.3 },
]
</script>

<template>
  <!-- Backdrop: orbit, stars and the moon. Decorative, so hidden from assistive tech. -->
  <svg
    class="status-scene absolute inset-0 h-full w-full overflow-visible"
    viewBox="0 0 390 560"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <ellipse
      cx="195"
      cy="285"
      rx="255"
      ry="92"
      transform="rotate(-16 195 285)"
      fill="none"
      stroke="var(--scene-line)"
      stroke-opacity="0.55"
      stroke-width="1.5"
      stroke-dasharray="6 6"
      class="anim-dash"
    />

    <SpaceStars :dots="dots" :sparkles="sparkles" />

    <!-- Starts upper right (~32% round the orbit) so it is already in view on first paint -->
    <circle r="7" fill="var(--scene-soft)" class="anim-moon" style="animation-delay: -5.2s" />
  </svg>

  <!-- The number 404 is one image for screen readers; the planet stands in for the 0 -->
  <svg
    class="status-scene absolute inset-0 h-full w-full overflow-visible"
    viewBox="0 0 390 560"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="$t('status.notFound.errorLabel')"
    focusable="false"
  >
    <defs>
      <linearGradient id="nf-planet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color: var(--scene-soft)" />
        <stop offset="1" style="stop-color: var(--galaxy)" />
      </linearGradient>
    </defs>

    <g class="anim-float" style="animation-delay: -1.2s">
      <text x="84" y="320" text-anchor="middle" font-size="116" font-weight="700" fill="#fff">
        4
      </text>
    </g>

    <!-- Position, tilt and the two animations each live on their own <g> so the CSS transforms never replace one another -->
    <g transform="translate(195 277)">
      <g class="anim-float">
        <g transform="rotate(-18)">
          <g class="anim-wobble">
            <!-- Back half of the ring first, then the planet, then the front half, for depth -->
            <path
              d="M -62 0 A 62 15 0 0 1 62 0"
              fill="none"
              stroke="var(--scene-line)"
              stroke-width="5"
              stroke-linecap="round"
            />
            <circle r="42" fill="url(#nf-planet)" />
            <path
              d="M -30 -22 A 36 36 0 0 1 6 -37"
              fill="none"
              stroke="#fff"
              stroke-opacity="0.65"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M -62 0 A 62 15 0 0 0 62 0"
              fill="none"
              stroke="#fff"
              stroke-width="5"
              stroke-linecap="round"
            />
          </g>
        </g>
      </g>
    </g>

    <g class="anim-float" style="animation-delay: -2.4s">
      <text x="306" y="320" text-anchor="middle" font-size="116" font-weight="700" fill="#fff">
        4
      </text>
    </g>
  </svg>
</template>
