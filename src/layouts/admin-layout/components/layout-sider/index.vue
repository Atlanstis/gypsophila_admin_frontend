<template>
  <div :class="['layout-sider', 'h-full bg-white']">
    <ScrollContainer>
      <div class="flex-col">
        <div class="h-56px flex-center">
          <icon-local-logo class="text-32px color-primary" />
        </div>
        <div class="flex-shrink-0"></div>
      </div>
    </ScrollContainer>
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
