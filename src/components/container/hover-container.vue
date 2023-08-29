<template>
  <div class="flex-center cursor-pointer hover:bg-#f6f6f6">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HoverContainer',
});
</script>

<style lang="scss" scoped></style>
