<template>
  <div :class="['layout-header', 'h-full flex-y-center bg-white']">
    <NButton @click="btnClick">{{ btnText }}</NButton>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayoutHeader',
});

import { computed } from 'vue';
import { useAppStore } from '@/stores';

const appStore = useAppStore();

const btnText = computed(() => {
  return appStore.adminSiderCollapse ? '展开' : '折叠';
});

const btnClick = () => {
  appStore.toggleAdminSiderCollapse();
};
</script>

<style lang="scss" scoped>
.layout-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
