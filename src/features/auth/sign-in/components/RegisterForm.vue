<script setup lang="ts">
import { computed, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import {
  IconGenderBigender,
  IconId,
  IconIdBadge2,
  IconUserPlus,
  IconWorld,
} from '@tabler/icons-vue'

import { useGenderOptions } from '@/composables/useGenderOptions'
import { useNationalityOptions } from '@/composables/auth/logic/useNationalityOptions'

import { useRegisterForm } from '@/composables/auth/logic/useRegisterForm'
import { caretPosition } from '@/utils/caret'
import { formatCitizenId, normalizeCitizenId } from '@/utils/citizenId'
import { normalizePassport } from '@/utils/passport'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseDatePicker from '@/components/common/BaseDatePicker.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseAutocomplete from '@/components/common/BaseAutocomplete.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import CollapseTransition from '@/components/ui/CollapseTransition.vue'

const emit = defineEmits<{
  /** The details are valid and ready to send */
  registered: []
}>()

const {
  values,
  isSelectedThai,
  errors,
  isSubmitting,
  submitError,
  firstInvalid,
  markTouched,
  submit: validate,
} = useRegisterForm()

const uid = useId()
const ids = {
  firstName: `${uid}-first-name`,
  lastName: `${uid}-last-name`,
  gender: `${uid}-gender`,
  nationality: `${uid}-nationality`,
  citizenId: `${uid}-citizen-id`,
  passportId: `${uid}-passport-id`,
  birthDate: `${uid}-birth-date`,
}
const form = useTemplateRef<HTMLFormElement>('form')

const { options: nationalities } = useNationalityOptions()

const { options: genders } = useGenderOptions()

const maxDate = computed(() => new Date())

// Which ID field is shown. It only follows a chosen nationality: while the field slides shut after the nationality is
// cleared it keeps its kind, instead of swapping to the other one mid-way
const idKind = ref<'citizen' | 'passport'>(isSelectedThai.value ? 'citizen' : 'passport')
watch(
  () => values.nationality,
  (nationality) => {
    if (nationality) idKind.value = isSelectedThai.value ? 'citizen' : 'passport'
  },
)

// Shown as "1-2345-67890-12-3" while typing. Rewriting the value sends the caret to the end, so it goes back after the same digit.
function onCitizenIdInput(event: Event) {
  const target = event.target as HTMLInputElement
  const digitsBeforeCaret = target.value
    .slice(0, target.selectionStart ?? target.value.length)
    .replace(/\D/g, '').length
  const digits = normalizeCitizenId(target.value)
  const formatted = formatCitizenId(digits)

  values.citizenId = digits
  target.value = formatted

  const caret = caretPosition(formatted, Math.min(digitsBeforeCaret, digits.length))
  target.setSelectionRange(caret, caret)
}

// Upper case, letters and digits only; the caret stays after the same character
function onPassportInput(event: Event) {
  const target = event.target as HTMLInputElement
  const beforeCaret = normalizePassport(
    target.value.slice(0, target.selectionStart ?? target.value.length),
  ).length
  const normalized = normalizePassport(target.value)

  values.passportId = normalized
  target.value = normalized
  target.setSelectionRange(beforeCaret, beforeCaret)
}

async function submit() {
  if (await validate()) {
    emit('registered')
    return
  }

  if (firstInvalid.value)
    form.value?.querySelector<HTMLInputElement>(`#${ids[firstInvalid.value]}`)?.focus()
}

onMounted(() => form.value?.querySelector<HTMLInputElement>(`#${ids.firstName}`)?.focus())
</script>

<template>
  <form ref="form" class="flex flex-col" novalidate @submit.prevent="submit">
    <h2 class="text-center text-2xl leading-8 font-semibold tablet:text-[32px] tablet:leading-10">
      {{ $t('auth.register.title') }}
    </h2>
    <p class="my-3 text-center text-sm leading-5 text-neon-soft tablet:text-base tablet:leading-6">
      {{ $t('auth.register.subtitle') }}
    </p>

    <!-- Side by side where there is room; one under the other on the narrowest screens -->
    <div class="mb-3 grid gap-x-3 gap-y-3 min-[360px]:grid-cols-2">
      <BaseInput
        :id="ids.firstName"
        v-model="values.firstName"
        :label="`${$t('auth.register.firstName')}*`"
        :placeholder="$t('auth.register.firstNamePlaceholder')"
        :error="errors.firstName"
        autocomplete="given-name"
        @blur="markTouched('firstName')"
      />
      <BaseInput
        :id="ids.lastName"
        v-model="values.lastName"
        :label="`${$t('auth.register.lastName')}*`"
        :placeholder="$t('auth.register.lastNamePlaceholder')"
        :error="errors.lastName"
        autocomplete="family-name"
        @blur="markTouched('lastName')"
      />
    </div>

    <BaseSelect
      v-model="values.gender"
      :label="$t('auth.register.gender')"
      :icon="IconGenderBigender"
      :options="genders"
      class="mb-3"
    />

    <BaseAutocomplete
      v-model="values.nationality"
      :label="$t('auth.register.nationality')"
      :placeholder="$t('auth.register.nationality')"
      :icon="IconWorld"
      :options="nationalities"
      clearable
      class="mb-3"
    />

    <!-- The ID field slides open once a nationality is chosen, then swaps between the two kinds -->
    <CollapseTransition>
      <div v-if="values.nationality">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
          enter-from-class="opacity-0"
          leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
          leave-to-class="opacity-0"
        >
          <!-- Examples, not copy: the same in every language -->
          <BaseInput
            v-if="idKind === 'citizen'"
            :id="ids.citizenId"
            key="citizen"
            :model-value="formatCitizenId(values.citizenId)"
            :label="$t('auth.register.citizenId')"
            :icon="IconId"
            :error="errors.citizenId"
            class="mb-3"
            inputmode="numeric"
            autocomplete="off"
            maxlength="17"
            placeholder="0-0000-00000-00-0"
            @input="onCitizenIdInput"
            @blur="markTouched('citizenId')"
          />

          <BaseInput
            v-else
            :id="ids.passportId"
            key="passport"
            :model-value="values.passportId"
            :label="$t('auth.register.passportId')"
            :icon="IconIdBadge2"
            :error="errors.passportId"
            class="mb-3"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            maxlength="9"
            placeholder="AA1234567"
            @input="onPassportInput"
            @blur="markTouched('passportId')"
          />
        </Transition>
      </div>
    </CollapseTransition>

    <BaseDatePicker
      :id="ids.birthDate"
      v-model="values.birthDate"
      :label="`${$t('auth.register.birthDate')}*`"
      :placeholder="$t('auth.register.birthDate')"
      class="mb-3"
      :max-date="maxDate"
      :error="errors.birthDate"
      @blur="markTouched('birthDate')"
    />

    <p
      v-if="submitError"
      role="alert"
      class="anim-fade mb-1 text-center text-sm leading-5 text-neon-error tablet:text-base"
    >
      {{ submitError }}
    </p>

    <BaseButton
      type="submit"
      block
      size="xl"
      rounded="full"
      color="neon-violet"
      :icon="IconUserPlus"
      :loading="isSubmitting"
      class="mt-2 rounded-full! text-lg font-semibold tablet:min-h-16! tablet:text-xl"
      @mousedown.prevent
    >
      {{ $t('auth.register.submit') }}
    </BaseButton>
  </form>
</template>
