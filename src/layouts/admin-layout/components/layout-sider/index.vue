<template>
  <div :class="['layout-sider', 'h-full bg-white']">侧边栏</div>
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
