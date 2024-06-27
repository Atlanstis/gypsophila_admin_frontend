<template>
  <NCard class="h-full" content-style="height: 100%">
    <ScrollContainer>
      <DropContent v-model:list="list" />
    </ScrollContainer>
  </NCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DropContent } from '.';
import type { IDragItem } from './drop-content/types';

defineOptions({
  name: 'RightPane',
});

const list = ref<IDragItem[]>([]);
</script>

<style lang="scss" scoped></style>
