<template>
  <div :class="['layout-header', 'h-full flex-y-center bg-white']">
    <HoverContainer class="h-full w-40px" @click="app.toggleAdminSiderCollapse">
      <icon-line-md-menu-fold-right v-if="app.adminSiderCollapse" class="text-16px" />
      <icon-line-md-menu-fold-left v-else class="text-16px" />
    </HoverContainer>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayoutHeader',
});

import { useAppStore } from '@/stores';

const app = useAppStore();
</script>

<style lang="scss" scoped>
.layout-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
