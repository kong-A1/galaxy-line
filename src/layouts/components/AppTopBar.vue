<script setup lang="ts">
import { IconBell, IconUser } from '@tabler/icons-vue'

import BaseLogo from '@/components/common/BaseLogo.vue'
import BrandWordmark from '@/components/ui/BrandWordmark.vue'
import { useMember } from '@/composables/member/useMember'

defineProps<{ scrolled: boolean }>()

const { data: member } = useMember()
</script>

<template>
  <!-- Floats over the page: clear at the top, frosted once content scrolls under it. Height comes from --app-top, set by the layout -->
  <div
    class="absolute inset-x-0 top-0 z-20 text-neon-ink transition-[backdrop-filter,background-color] duration-200"
    :class="scrolled ? 'bg-neon/85 backdrop-blur-md' : ''"
  >
    <div class="h-(--app-top) w-full px-6">
      <header class="flex h-full items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-4">
          <BaseLogo size="none" rounded="lg" class="size-9" />

          <p class="truncate text-fl-xl font-bold tracking-wide">
            <BrandWordmark />
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <button
            type="button"
            class="flex size-10 tablet:size-11 cursor-pointer items-center justify-center rounded-full outline-none transition-colors hover:bg-neon-ghost-bg focus-visible:ring-2 focus-visible:ring-neon-link"
            :aria-label="$t('app.home.notifications')"
          >
            <IconBell :size="24" aria-hidden="true" />
          </button>
          <RouterLink
            to="/app/profile"
            class="flex size-10 tablet:size-11 items-center justify-center overflow-hidden rounded-full bg-neon-ghost-bg text-neon-ink! outline-none focus-visible:ring-2 focus-visible:ring-neon-link"
            :aria-label="$t('app.nav.profile')"
          >
            <img
              v-if="member?.member_line.line_image_url"
              :src="member.member_line.line_image_url"
              alt=""
              class="size-full object-cover"
            />
            <IconUser v-else :size="22" aria-hidden="true" />
          </RouterLink>
        </div>
      </header>
    </div>
  </div>
</template>
