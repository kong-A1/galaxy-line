<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IconRefresh } from '@tabler/icons-vue'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import BaseSegmented from '@/components/common/BaseSegmented.vue'
import { useCountdown } from '@/composables/useCountdown'
import { useHomeSummary } from '@/composables/member/logic/useHomeSummary'
import { drawBarcode, qrDataUrl } from '@/utils/memberCode'

import TierStatusCard from './TierStatusCard.vue'

const emit = defineEmits<{ close: [] }>()

// How long a code is shown before it has to be made again
const VALID_SECONDS = 5 * 60

const { t } = useI18n()
const router = useRouter()
const { member, fullName, tier } = useHomeSummary()

type CodeMode = 'qr' | 'barcode'
const mode = ref<CodeMode>('qr')
const modes = computed(() => [
  { value: 'qr' as const, label: t('app.qr.modeQr') },
  { value: 'barcode' as const, label: t('app.qr.modeBarcode') },
])
const tabsId = useId()

const code = computed(() => member.value?.member_profile.member_code ?? '')

// The two pictures of the member code. They sit on white whatever the theme, so a scanner can always read them.
const qrSrc = ref('')
watch(
  code,
  async (value) => {
    qrSrc.value = value ? await qrDataUrl(value) : ''
  },
  { immediate: true },
)

const barcode = useTemplateRef<SVGSVGElement>('barcode')
watch(
  code,
  async () => {
    await nextTick()
    if (barcode.value && code.value) drawBarcode(barcode.value, code.value)
  },
  { immediate: true, flush: 'post' },
)

// The white tile holds the picture of the code with the member code written under it. It changes size between the two pictures
// (nearly square for the QR, a wide strip for the barcode). Both sizes are fixed numbers, so the change can be animated, and the
// pictures fade over each other instead of one being swapped for the other.
const tileSize = computed(() =>
  mode.value === 'qr' ? { width: '196px', height: '220px' } : { width: '100%', height: '132px' },
)

const { remaining, isRunning, start } = useCountdown(VALID_SECONDS)
onMounted(start)
const clock = computed(
  () => `${Math.floor(remaining.value / 60)}:${String(remaining.value % 60).padStart(2, '0')}`,
)

// Goes to the history after the popup has faded out
async function openHistory(close: () => Promise<void>) {
  await close()
  void router.push('/app/membership-history')
}
</script>

<template>
  <BaseDialog @close="emit('close')">
    <template #title>{{ $t('app.qr.greeting', { name: fullName }) }}</template>

    <template #default="{ close }">
      <BaseSegmented v-model="mode" :options="modes" :id-prefix="tabsId" />

      <div :id="`${tabsId}-panel`" role="tabpanel" :aria-labelledby="`${tabsId}-tab-${mode}`">
        <div
          class="relative mx-auto max-w-full rounded-2xl bg-white transition-[width,height] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
          :style="tileSize"
        >
          <div class="absolute inset-0 transition-opacity" :class="isRunning ? '' : 'opacity-10'">
            <img
              v-if="qrSrc"
              :src="qrSrc"
              :alt="$t('app.qr.modeQr')"
              class="absolute top-2 left-1/2 size-[180px] -translate-x-1/2 object-contain transition-opacity duration-300"
              :class="mode === 'qr' ? 'opacity-100' : 'pointer-events-none opacity-0'"
            />
            <svg
              ref="barcode"
              role="img"
              :aria-label="$t('app.qr.modeBarcode')"
              class="absolute inset-x-4 top-4 h-20 w-[calc(100%-2rem)] transition-opacity duration-300"
              :class="mode === 'barcode' ? 'opacity-100' : 'pointer-events-none opacity-0'"
              :aria-hidden="mode !== 'barcode'"
            ></svg>

            <p
              class="absolute inset-x-2 bottom-2 text-center text-base leading-6 font-semibold tracking-[0.06em] break-all text-[#1a1033]"
            >
              {{ code }}
            </p>
          </div>

          <!-- After the time is up the code is faded and cannot be shown to staff until it is made again -->
          <div
            v-if="!isRunning"
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
          >
            <p class="text-base font-semibold text-[#3b0764]">{{ $t('app.qr.expired') }}</p>
            <BaseButton
              size="sm"
              rounded="full"
              color="neon-violet"
              :icon="IconRefresh"
              class="rounded-full!"
              @click="start"
            >
              {{ $t('app.qr.refresh') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="text-center space-y-1">
        <i18n-t
          v-if="isRunning"
          keypath="app.qr.expiresIn"
          tag="p"
          scope="global"
          class="text-sm text-neon-soft"
        >
          <template #time>
            <strong class="font-semibold text-neon-ink tabular-nums">{{ clock }}</strong>
          </template>
        </i18n-t>
        <p
          :key="mode"
          class="anim-fade text-center text-sm leading-relaxed whitespace-pre-line text-neon-soft"
        >
          {{ $t(mode === 'qr' ? 'app.qr.hintQr' : 'app.qr.hintBarcode') }}
        </p>
      </div>

      <TierStatusCard
        v-if="tier"
        :current-tier="tier.current"
        :next-tier="tier.next ? { name: tier.next, threshold: tier.threshold } : null"
        :spend="tier.spend"
        :tier-expiry-date="tier.expiryDate"
        :spend-this-period="tier.spendThisPeriod"
        :maintain-threshold="tier.maintainThreshold"
      />

      <div class="flex flex-col gap-3">
        <BaseButton
          block
          size="lg"
          rounded="full"
          color="neon-violet"
          class="rounded-full! font-semibold"
          @click="openHistory(close)"
        >
          {{ $t('app.qr.history') }}
        </BaseButton>
        <BaseButton
          block
          size="lg"
          rounded="full"
          color="neon-ghost"
          class="rounded-full!"
          @click="close"
        >
          {{ $t('app.qr.close') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
