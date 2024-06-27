<template>
  <NCard class="h-full" content-style="height: 100%">
    <ScrollContainer>
      <DragItem />
    </ScrollContainer>
  </NCard>
</template>

<script lang="ts" setup>
import { DragItem } from './drop-content/components';
defineOptions({
  name: 'LeftPane',
});
</script>

<style lang="scss" scoped></style>
