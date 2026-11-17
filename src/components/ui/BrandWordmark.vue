<template>
  <!-- The brand name in the neon gradient. Size, weight and spacing come from the surrounding text. -->
  <span
    class="bg-linear-to-r from-neon-pink via-neon-violet to-neon-cyan bg-clip-text text-transparent"
  >
    {{ $t('common.brand').toUpperCase() }}
  </span>
</template>
