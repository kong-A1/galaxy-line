<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IconHistory, IconLanguage, IconMoon, IconUser, IconUserCircle } from '@tabler/icons-vue'

import { usePopoverMenu } from '@/composables/usePopoverMenu'
import { vRipple } from '@/directives/ripple'
import { useThemeStore } from '@/stores/theme'

defineProps<{ imageUrl?: string | null }>()

const { locale } = useI18n()
const themeStore = useThemeStore()

const { open, dropUp, toggle } = usePopoverMenu('trigger', 'panel')

const languages = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'EN' },
]

function toggleLanguage() {
  locale.value = locale.value === 'th' ? 'en' : 'th'
}

const itemClass =
  'relative flex w-full min-h-11 cursor-pointer overflow-hidden items-center gap-3 rounded-xl px-3 text-left text-fl-sm font-medium text-neon-ink! no-underline outline-none hover:bg-neon-ghost-bg focus-visible:ring-2 focus-visible:ring-neon-link'
</script>

<template>
  <div class="relative">
    <button
      ref="trigger"
      v-ripple
      type="button"
      class="relative flex size-10 tablet:size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-neon-ghost-bg text-neon-ink outline-none focus-visible:ring-2 focus-visible:ring-neon-link"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-label="$t('app.menu.label')"
      @click="toggle"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="..." class="size-full object-cover" />
      <IconUser v-else :size="22" aria-hidden="true" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
      leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
      enter-from-class="scale-95 opacity-0"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="open"
        ref="panel"
        role="menu"
        :aria-label="$t('app.menu.label')"
        class="absolute right-0 z-30 w-64 origin-top-right rounded-2xl border border-neon-glass-border bg-neon p-1.5 shadow-2xl"
        :class="dropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
      >
        <!-- The point toward the button: a turned square in the panel's own solid colour that shows only its two outer edges, so it
             covers the panel's border where they meet -->
        <span
          aria-hidden="true"
          class="absolute right-3.5 size-3 rotate-45 border-neon-glass-border bg-neon tablet:right-4"
          :class="dropUp ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-t border-l'"
        />
        <RouterLink v-ripple to="/app/profile" role="menuitem" :class="itemClass">
          <IconUserCircle :size="20" aria-hidden="true" />
          {{ $t('app.menu.profile') }}
        </RouterLink>
        <RouterLink v-ripple to="/app/membership-history" role="menuitem" :class="itemClass">
          <IconHistory :size="20" aria-hidden="true" />
          {{ $t('app.menu.history') }}
        </RouterLink>

        <hr class="mx-2 my-1.5 border-neon-glass-border" />

        <!-- The two switches have no motion: the change shows at once, and the menu stays open to see it -->
        <button
          type="button"
          role="menuitemcheckbox"
          :aria-checked="themeStore.isDark"
          :class="itemClass"
          @click="themeStore.toggleTheme"
        >
          <IconMoon :size="20" aria-hidden="true" />
          <span class="flex-1">{{ $t('app.menu.darkMode') }}</span>
          <span
            aria-hidden="true"
            class="relative h-6 w-11 shrink-0 rounded-full"
            :class="themeStore.isDark ? 'bg-neon-accent' : 'bg-neon-ink/25'"
          >
            <span
              class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow"
              :class="themeStore.isDark ? 'translate-x-5' : ''"
            />
          </span>
        </button>
        <button
          type="button"
          role="menuitem"
          :aria-label="`${$t('app.menu.language')}: ${locale === 'th' ? 'ไทย' : 'English'}`"
          :class="itemClass"
          @click="toggleLanguage"
        >
          <IconLanguage :size="20" aria-hidden="true" />
          <span class="flex-1">{{ $t('app.menu.language') }}</span>
          <!-- Two choices side by side, the current one filled: reads as something to press, like the switch above -->
          <span
            aria-hidden="true"
            class="flex shrink-0 rounded-full bg-neon-ink/12 p-0.5 text-xs font-bold"
          >
            <span
              v-for="option in languages"
              :key="option.code"
              class="w-11 rounded-full py-1 text-center"
              :class="
                locale === option.code ? 'bg-neon-accent text-white shadow' : 'text-neon-soft'
              "
            >
              {{ option.label }}
            </span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>
