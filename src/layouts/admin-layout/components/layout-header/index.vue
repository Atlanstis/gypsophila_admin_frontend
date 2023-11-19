<template>
  <div :class="['layout-header', 'h-full flex-y-center bg-white']">
    <div class="flex-1-hidden h-full">
      <BtnCollapse />
    </div>
    <div class="flex justify-end h-full">
      <UserAvatar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BtnCollapse, UserAvatar } from './components';

defineOptions({
  name: 'AdminLayoutHeader',
});
</script>

<style lang="scss" scoped>
.layout-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
