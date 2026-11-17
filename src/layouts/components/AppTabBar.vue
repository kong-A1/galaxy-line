<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type Component,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  IconCameraFilled,
  IconGiftFilled,
  IconHomeFilled,
  IconTicketFilled,
  IconUserFilled,
} from '@tabler/icons-vue'

const { t } = useI18n()

interface Tab {
  to: string
  label: string
  icon: Component
  /** Only `/app` itself counts as home; the others also match their sub-routes */
  exact?: boolean
  /** The raised round button in the middle */
  raised?: boolean
}

const tabs = (): Tab[] => [
  { to: '/app', label: t('app.nav.home'), icon: IconHomeFilled, exact: true },
  { to: '/app/campaigns', label: t('app.nav.privileges'), icon: IconTicketFilled },
  { to: '/app/scan', label: t('app.nav.scan'), icon: IconCameraFilled, raised: true },
  { to: '/app/coupons', label: t('app.nav.rewards'), icon: IconGiftFilled },
  { to: '/app/profile', label: t('app.nav.profile'), icon: IconUserFilled },
]

// The line at the bottom edge: one short line that slides under whichever tab is active (the scan button's column included).
// It is measured from the active link, so it follows the layout at every width.
const route = useRoute()
const list = useTemplateRef<HTMLElement>('list')
const LINE_WIDTH = 24
const lineX = ref(0)
const hasActive = ref(false)
// No slide on the first placement: it would run in from the left edge
const settled = ref(false)

function placeLine() {
  const active = list.value?.querySelector<HTMLElement>('a.is-active')
  hasActive.value = Boolean(active)
  if (!active || !list.value) return

  const link = active.getBoundingClientRect()
  const bar = list.value.getBoundingClientRect()
  lineX.value = link.left - bar.left + link.width / 2 - LINE_WIDTH / 2
}

let observer: ResizeObserver | null = null

onMounted(() => {
  placeLine()
  requestAnimationFrame(() => (settled.value = true))
  if (list.value) {
    observer = new ResizeObserver(placeLine)
    observer.observe(list.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())

// The router marks the new tab active after the route changes
watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    placeLine()
  },
)
</script>

<template>
  <!-- Full width below lg; from lg up the layout is a centered column and the bar stays inside it -->
  <nav
    :aria-label="$t('app.nav.label')"
    class="relative z-30 shrink-0 rounded-t-[14px] bg-neon shadow-[0_-4px_16px_rgb(0_0_0/0.08)] pb-[env(safe-area-inset-bottom)] transition-colors"
  >
    <!-- Five equal columns at a fixed height: a label that wraps stays inside its column and never moves the others.
         Wider than a phone, the row spreads over the whole bar instead of huddling in the middle; from lg up it is the 448px column again -->
    <ul
      ref="list"
      class="relative mx-auto grid min-h-[4.5rem] grid-cols-[1fr_1fr_2.5rem_1fr_1fr] min-[480px]:px-8 lg:max-w-md lg:px-0 tablet:min-h-20"
    >
      <li v-for="tab in tabs()" :key="tab.to" class="flex min-w-0 justify-center">
        <RouterLink
          :to="tab.to"
          :exact-active-class="tab.exact ? 'is-active' : ''"
          :active-class="tab.exact ? '' : 'is-active'"
          class="group relative flex w-full min-w-0 flex-col items-center gap-0.5 px-0 py-3 text-center text-fl-sm font-semibold text-neon-muted! no-underline transition-colors outline-none hover:text-neon-ink! focus-visible:text-neon-ink! tablet:py-3.5 [&.is-active]:text-neon-tab!"
        >
          <!-- Scan: a round button, half above the bar, with its label under the camera icon -->
          <span
            v-if="tab.raised"
            class="absolute -top-8 flex size-16 flex-col items-center justify-center gap-0.5 rounded-full bg-linear-to-br from-neon-accent to-neon-green-deep text-white shadow-[0_6px_16px_rgb(0_0_0/0.25)] transition-transform group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-neon-link tablet:size-[4.5rem]"
          >
            <component :is="tab.icon" :size="26" aria-hidden="true" />
            <span class="text-xs leading-4 font-semibold text-white tablet:text-sm">{{
              tab.label
            }}</span>
          </span>
          <template v-else>
            <component :is="tab.icon" :size="26" class="tablet:size-7" aria-hidden="true" />
            <span class="max-w-full break-words">{{ tab.label }}</span>
          </template>
        </RouterLink>
      </li>

      <span
        aria-hidden="true"
        class="absolute bottom-0 left-0 h-[3px] rounded-t-full bg-neon-tab motion-reduce:transition-none"
        :class="[
          settled
            ? 'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]'
            : '',
          hasActive ? 'opacity-100' : 'opacity-0',
        ]"
        :style="{ width: `${LINE_WIDTH}px`, transform: `translateX(${lineX}px)` }"
      />
    </ul>
  </nav>
</template>
