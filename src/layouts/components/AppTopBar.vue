<script setup lang="ts">
import BaseLogo from '@/components/common/BaseLogo.vue'
import BrandWordmark from '@/components/ui/BrandWordmark.vue'
import { useMember } from '@/composables/member/useMember'

import NotificationMenu from './NotificationMenu.vue'
import ProfileMenu from './ProfileMenu.vue'

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
        <div class="flex min-w-0 items-center gap-3">
          <BaseLogo size="none" rounded="lg" class="size-9" />

          <p class="truncate text-fl-2xl font-bold tracking-wide">
            <BrandWordmark />
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <NotificationMenu />
          <ProfileMenu :image-url="member?.member_line.line_image_url" />
        </div>
      </header>
    </div>
  </div>
</template>
