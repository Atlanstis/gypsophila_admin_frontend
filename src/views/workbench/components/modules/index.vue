<template>
  <component :is="RenderMap[type]"></component>
</template>

<script lang="ts" setup>
import { RenderMap } from './index';
import { type EnumWorkbenchCard } from '@/typings';
defineOptions({
  name: 'ModuleRender',
});

defineProps<{ type: EnumWorkbenchCard }>();
</script>

<style lang="scss" scoped></style>
