<template>
  <HoverContainer class="h-full w-40px" @click="app.toggleAdminSiderCollapse">
    <icon-line-md-menu-fold-right v-if="app.adminSiderCollapse" class="text-16px" />
    <icon-line-md-menu-fold-left v-else class="text-16px" />
  </HoverContainer>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores';

defineOptions({
  name: 'BtnCollapse',
});

const app = useAppStore();
</script>

<style lang="scss" scoped></style>
