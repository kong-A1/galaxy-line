<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useGoBack } from '@/composables/useGoBack'
import { useLoadingStore } from '@/stores/loading.store'

import BaseButton from '@/components/common/BaseButton.vue'
import FloatingToolbar from '@/components/ui/FloatingToolbar.vue'
import NotFoundArt from '@/features/status/components/NotFoundArt.vue'
import StatusScreen from '@/features/status/components/StatusScreen.vue'
import { CONTACT_URL, HOME_ROUTE } from '@/features/status/status.constants'

const router = useRouter()
const loadingStore = useLoadingStore()
const goBack = useGoBack(HOME_ROUTE)

onMounted(() => {
  loadingStore.hideLoading()
})
</script>

<template>
  <StatusScreen hero-class="max-h-[560px]">
    <template #art><NotFoundArt /></template>
    <template #header><FloatingToolbar back @back="goBack" /></template>

    <h1
      class="text-center text-[26px] leading-8 font-bold text-foreground tablet:text-[32px] tablet:leading-10"
    >
      {{ $t('status.notFound.title') }}
    </h1>
    <p
      class="mt-3 text-center text-base leading-6 whitespace-pre-line text-muted-foreground tablet:text-lg"
    >
      {{ $t('status.notFound.description') }}
    </p>

    <div class="mt-auto flex flex-col items-center pt-8">
      <BaseButton
        block
        size="lg"
        rounded="xl"
        class="shadow-md hover:shadow-lg tablet:min-h-14! tablet:text-lg"
        @click="router.push(HOME_ROUTE)"
      >
        {{ $t('status.notFound.home') }}
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
