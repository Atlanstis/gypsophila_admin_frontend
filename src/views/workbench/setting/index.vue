<template>
  <div class="flex">
    <LeftPane class="w-260px" />
    <RightPane class="flex-1 m-l-10px overflow-hidden" />
  </div>
</template>

<script lang="ts" setup>
import { LeftPane, RightPane } from './components';

defineOptions({
  name: 'WorkBenchSetting',
});
</script>

<style lang="scss" scoped></style>
