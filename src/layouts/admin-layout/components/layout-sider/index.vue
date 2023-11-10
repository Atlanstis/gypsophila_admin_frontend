<template>
  <div :class="['layout-sider', 'flex-col h-full bg-white']">
    <div class="h-56px flex-center flex-shrink-0">
      <icon-local-logo class="text-32px color-primary" />
    </div>
    <div class="flex-grow-1 overflow-hidden">
      <ScrollContainer> 菜单 </ScrollContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayoutSider',
});
</script>

<style lang="scss" scoped>
.layout-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
