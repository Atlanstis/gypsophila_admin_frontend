<template>
  <div>
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

<style lang="scss" scoped></style>
