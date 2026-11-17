<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import BaseError from '@/components/common/BaseError.vue'

import { useMember } from '@/composables/member/useMember'

const { data: member, isPending, isError, error, refetch } = useMember()
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-2xl font-semibold">Profile</h2>

    <BaseLoading v-if="isPending" />

    <BaseError v-else-if="isError && error" :message="error.message" @retry="refetch" />

    <BaseCard v-else-if="member" class="space-y-2">
      <p class="text-sm">
        <span class="text-muted">Member ID:</span>
        <span class="ml-2 font-medium">{{ member.member_profile.member_code }}</span>
      </p>
      <p class="text-sm">
        <span class="text-muted">Name:</span>
        <span class="ml-2 font-medium"
          >{{ member.member_profile.first_name }} {{ member.member_profile.last_name }}</span
        >
      </p>
    </BaseCard>
  </section>
</template>
