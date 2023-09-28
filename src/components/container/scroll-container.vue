<template>
  <div
    :class="['h-full', useDefaultScroll ? '__SCROLL_EL__ overflow-y-scroll' : ' overflow-y-hidden']"
  >
    <slot v-if="useDefaultScroll"></slot>
    <n-scrollbar v-else class="h-full">
      <slot></slot>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ScrollContainer',
});

import { ref } from 'vue';

const useDefaultScroll = ref(false);
</script>

<style lang="scss" scoped>
.__SCROLL_EL__ {
  @include scrollbar(8px, #e1e1e1);
}
</style>
