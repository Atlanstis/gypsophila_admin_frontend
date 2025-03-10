<template>
  <HoverContainer class="h-full w-40px" @click="onClick">
    <icon-line-md-menu-fold-right v-if="adminLayoutStore.siderCollapse" class="text-16px" />
    <icon-line-md-menu-fold-left v-else class="text-16px" />
  </HoverContainer>
</template>

<script lang="ts" setup>
import { useAdminLayoutStore } from '@/stores';

defineOptions({
  name: 'BtnCollapse',
});

const adminLayoutStore = useAdminLayoutStore();

function onClick() {
  adminLayoutStore.toggleSiderCollapse();
}
</script>

<style lang="scss" scoped></style>
