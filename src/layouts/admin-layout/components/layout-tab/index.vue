<template>
  <div :class="['layout-tab', 'h-full bg-white']">页签</div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayoutTab',
});
</script>

<style lang="scss" scoped>
.layout-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
