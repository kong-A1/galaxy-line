<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMaintenanceRetry } from '@/composables/system/logic/useMaintenanceRetry'
import { useLoadingStore } from '@/stores/loading.store'
import { formatDateTime } from '@/utils/date'

import BaseButton from '@/components/common/BaseButton.vue'
import FloatingToolbar from '@/components/ui/FloatingToolbar.vue'
import MaintenanceArt from '@/features/status/components/MaintenanceArt.vue'
import StatusScreen from '@/features/status/components/StatusScreen.vue'
import { CONTACT_URL, HOME_ROUTE, MAINTENANCE_END_AT } from '@/features/status/status.constants'

const { locale } = useI18n()
const loadingStore = useLoadingStore()
const { isChecking, stillDown, retry } = useMaintenanceRetry(HOME_ROUTE)

// Hidden entirely (not just emptied) when there is no valid time, so the layout closes up
const expectedBack = computed(() => formatDateTime(MAINTENANCE_END_AT, locale.value))

onMounted(() => {
  loadingStore.hideLoading()
})
</script>

<template>
  <StatusScreen hero-class="max-h-[500px]">
    <template #art><MaintenanceArt /></template>
    <template #header><FloatingToolbar /></template>

    <h1
      class="text-center text-[26px] leading-8 font-bold text-foreground tablet:text-[32px] tablet:leading-10"
    >
      {{ $t('status.maintenance.title') }}
    </h1>
    <p
      class="mt-3 text-center text-base leading-6 whitespace-pre-line text-muted-foreground tablet:text-lg"
    >
      {{ $t('status.maintenance.description') }}
    </p>

    <!-- Same card language as the benefit cards on the welcome page -->
    <div
      v-if="expectedBack"
      class="mt-4 flex items-center gap-3.5 rounded-[14px] bg-surface p-3.5 shadow-[0_2px_12px_rgb(46_38_61/0.08)]"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-background text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 12l3 2" />
          <!-- The minute hand turns round the centre of the face -->
          <path d="M12 12V6" class="anim-minute" />
        </svg>
      </span>
      <div class="min-w-0">
        <p class="text-[13px] leading-5 text-muted-foreground tablet:text-sm">
          {{ $t('status.maintenance.expectedBack') }}
        </p>
        <p class="text-[15px] leading-6 font-bold text-foreground tablet:text-base">
          {{ expectedBack }}
        </p>
      </div>
    </div>

    <div class="mt-auto flex flex-col items-center pt-4">
      <!-- Always rendered so screen readers announce the text when it appears; the line is reserved so nothing jumps -->
      <p role="status" class="min-h-6 pb-2 text-center text-sm leading-6 text-error">
        <span v-if="stillDown" class="anim-fade inline-block">
          {{ $t('status.maintenance.stillDown') }}
        </span>
      </p>

      <BaseButton
        block
        size="lg"
        rounded="xl"
        :loading="isChecking"
        :loading-text="isChecking ? $t('status.maintenance.checking') : undefined"
        class="shadow-md hover:shadow-lg tablet:min-h-14! tablet:text-lg"
        @click="retry"
      >
        {{ $t('status.maintenance.retry') }}
      </BaseButton>

      <a
        v-if="CONTACT_URL"
        :href="CONTACT_URL"
        class="mt-1.5 flex min-h-11 items-center px-2 text-sm font-bold underline tablet:text-base"
      >
        {{ $t('status.contact') }}
      </a>
    </div>
  </StatusScreen>
</template>
