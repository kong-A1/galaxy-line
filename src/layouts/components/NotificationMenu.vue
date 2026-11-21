<script setup lang="ts">
import type { Component } from 'vue'
import { IconBell, IconClock, IconStar, IconTrendingUp } from '@tabler/icons-vue'

import {
  useNotifications,
  type NotificationKind,
} from '@/composables/notification/useNotifications'
import { usePopoverMenu } from '@/composables/usePopoverMenu'
import { vRipple } from '@/directives/ripple'

const { open, dropUp, toggle } = usePopoverMenu('trigger', 'panel')
const { items, unreadCount, markRead, markAllRead } = useNotifications()

const kinds: Record<NotificationKind, { icon: Component; tone: string }> = {
  points: { icon: IconStar, tone: 'neon-tone-gold' },
  expiring: { icon: IconClock, tone: 'neon-tone-pink' },
  tier: { icon: IconTrendingUp, tone: 'neon-tone-blue' },
}
</script>

<template>
  <div class="relative">
    <button
      ref="trigger"
      v-ripple
      type="button"
      class="relative flex size-10 tablet:size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full outline-none hover:bg-neon-ghost-bg focus-visible:ring-2 focus-visible:ring-neon-link"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-label="
        unreadCount
          ? `${$t('app.notifications.label')} (${$t('app.notifications.unread', { count: unreadCount })})`
          : $t('app.notifications.label')
      "
      @click="toggle"
    >
      <IconBell :size="24" aria-hidden="true" />
      <!-- The dot sends out a ring now and then so it catches the eye; still when the person asked for less motion -->
      <span v-if="unreadCount" aria-hidden="true" class="absolute top-2 right-2.5 size-2.5">
        <span
          class="absolute inset-0 animate-ping rounded-full bg-neon-error opacity-70 motion-reduce:hidden"
        />
        <span class="relative block size-full rounded-full bg-neon-error" />
      </span>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
      leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
      enter-from-class="scale-95 opacity-0"
      leave-to-class="scale-95 opacity-0"
    >
      <!-- The bell sits left of the profile button, so the panel reaches past it to the right to stay on screen on a phone;
           the pointer is kept over the bell (offsets = the profile button and the gap beside it) -->
      <div
        v-if="open"
        ref="panel"
        role="dialog"
        :aria-label="$t('app.notifications.label')"
        class="absolute -right-[60px] z-30 w-[calc(100vw-2rem)] max-w-80 origin-top-right rounded-2xl border border-neon-glass-border bg-neon text-neon-ink shadow-2xl tablet:-right-16"
        :class="dropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
      >
        <span
          aria-hidden="true"
          class="absolute right-[74px] size-3 rotate-45 border-neon-glass-border bg-neon tablet:right-20"
          :class="dropUp ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-t border-l'"
        />

        <div
          class="flex items-center justify-between gap-3 border-b border-neon-ink/8 px-4 pt-3 pb-2.5"
        >
          <h2 class="text-fl-base font-semibold">{{ $t('app.notifications.label') }}</h2>
          <button
            v-if="unreadCount"
            type="button"
            class="cursor-pointer rounded-lg px-2 py-1 text-fl-sm font-medium text-neon-link outline-none hover:underline focus-visible:ring-2 focus-visible:ring-neon-link"
            @click="markAllRead"
          >
            {{ $t('app.notifications.markAllRead') }}
          </button>
        </div>

        <ul v-if="items.length" class="max-h-[60vh] overflow-y-auto p-1.5">
          <li
            v-for="item in items"
            :key="item.id"
            class="mx-2 not-last:border-b not-last:border-neon-ink/8"
          >
            <button
              v-ripple
              type="button"
              class="relative flex w-full cursor-pointer items-start gap-3 overflow-hidden rounded-xl px-2.5 py-2.5 text-left outline-none hover:bg-neon-ghost-bg focus-visible:ring-2 focus-visible:ring-neon-link"
              @click="markRead(item.id)"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-[inset_0_3px_8px_rgb(255_255_255/0.45),inset_0_-6px_12px_rgb(0_0_0/0.25)]!"
                :class="kinds[item.kind].tone"
              >
                <component
                  :is="kinds[item.kind].icon"
                  :size="20"
                  :stroke-width="2.4"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span
                  class="block text-fl-sm leading-snug"
                  :class="item.read ? 'font-medium' : 'font-bold'"
                >
                  {{ item.title }}
                </span>
                <span class="mt-0.5 block text-fl-sm leading-snug text-neon-soft">{{
                  item.detail
                }}</span>
              </span>
              <span
                v-if="!item.read"
                class="mt-1.5 size-2.5 shrink-0 rounded-full bg-neon-accent"
                :aria-label="$t('app.notifications.unreadItem')"
              />
            </button>
          </li>
        </ul>
        <p v-else class="px-4 pb-5 text-center text-fl-sm text-neon-soft">
          {{ $t('app.notifications.empty') }}
        </p>
      </div>
    </Transition>
  </div>
</template>
